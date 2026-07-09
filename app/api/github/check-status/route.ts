import { NextRequest, NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";
import { auth } from "@/auth";
import { decrypt } from "@/lib/config/encrypt";
import prisma from "@/prisma/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session || !session.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Get the repo parameter from the URL
  const url = new URL(req.url);
  const repo = url.searchParams.get("repo");

  if (!repo) {
    return NextResponse.json({ message: "Repository parameter is required" }, { status: 400 });
  }

  // Split the repo string into owner and repo name
  const [owner, repoName] = repo.split("/");

  if (!owner || !repoName) {
    return NextResponse.json(
      { message: 'Invalid repository format. Expected "owner/repo"' },
      { status: 400 },
    );
  }

  try {
    // Fetch the user's GitHub access token from the database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        accounts: {
          where: { provider: "github" },
          select: { access_token: true },
        },
      },
    });

    if (!user || !user.accounts[0]?.access_token) {
      return NextResponse.json(
        { message: "GitHub account not linked or access token not found" },
        { status: 400 },
      );
    }

    const githubTokenEncrypted = user.accounts[0].access_token;
    const githubToken = decrypt(githubTokenEncrypted);

    // Undecryptable token -> fail clearly instead of an opaque downstream 401/500.
    if (!githubToken) {
      return NextResponse.json(
        {
          message:
            "Could not read your stored GitHub credentials. Please sign out and reconnect GitHub.",
          code: "TOKEN_DECRYPT_FAILED",
        },
        { status: 401 },
      );
    }

    const octokit = new Octokit({ auth: githubToken });

    // A 401 here means the stored OAuth token was revoked/expired -> ask the user to
    // reconnect rather than returning a generic 500.
    let authUser;
    try {
      const { data } = await octokit.users.getAuthenticated();
      authUser = data;
    } catch (error) {
      const status = (error as { status?: number })?.status;
      if (status === 401) {
        return NextResponse.json(
          {
            message: "Your GitHub session has expired. Please sign out and reconnect GitHub.",
            code: "GITHUB_TOKEN_INVALID",
          },
          { status: 401 },
        );
      }
      throw error;
    }

    // Check if fork exists
    let fork;
    try {
      const { data: existingFork } = await octokit.repos.get({
        owner: authUser.login,
        repo: repoName,
      });
      fork = existingFork;
    } catch {
      // Fork doesn't exist -> nothing to compare.
      return NextResponse.json(
        {
          isOutdated: false,
          hasFork: false,
          message: "Fork does not exist",
        },
        { status: 200 },
      );
    }

    // Get the default branch of the original repo
    const { data: parentRepo } = await octokit.repos.get({
      owner,
      repo: repoName,
    });
    const upstreamBranch = parentRepo.default_branch;
    // Use the fork's own default branch: older forks may still be on "master".
    const forkBranch = fork.default_branch || upstreamBranch;

    // Cross-fork compare (BASE=fork ... HEAD=upstream). This is the fragile, per-user
    // step and can fail (404/422/5xx). It must not block PR creation, so on failure we
    // degrade to "status unknown, assume up to date" rather than surfacing a 500.
    const compareString = `${authUser.login}:${forkBranch}...${owner}:${upstreamBranch}`;

    try {
      const { data: comparison } = await octokit.repos.compareCommitsWithBasehead({
        owner,
        repo: repoName,
        basehead: compareString,
      });

      // ahead_by = commits upstream (HEAD) is ahead of the fork (BASE) = how far behind the fork is.
      const behindBy = comparison.ahead_by;
      const isOutdated = behindBy > 0;

      return NextResponse.json(
        {
          forkRepo: fork.full_name,
          isOutdated,
          behindBy,
          hasFork: true,
          defaultBranch: upstreamBranch,
          message: isOutdated
            ? `Fork is ${behindBy} commits behind the original repository`
            : "Fork is up to date",
        },
        { status: 200 },
      );
    } catch (compareError) {
      const status = (compareError as { status?: number })?.status;
      console.error(
        `Fork comparison failed for ${compareString} (status ${status ?? "unknown"}):`,
        compareError,
      );

      // Non-blocking: keep the modal usable; statusUnknown lets the UI note it.
      return NextResponse.json(
        {
          forkRepo: fork.full_name,
          isOutdated: false,
          hasFork: true,
          statusUnknown: true,
          defaultBranch: upstreamBranch,
          message:
            "Could not determine whether your fork is up to date. If your PR fails, sync your fork on GitHub and try again.",
        },
        { status: 200 },
      );
    }
  } catch (error) {
    console.error("Error details:", error);
    const err = error as Error;
    return NextResponse.json(
      { message: "Internal Server Error", error: err.message },
      { status: 500 },
    );
  }
}
