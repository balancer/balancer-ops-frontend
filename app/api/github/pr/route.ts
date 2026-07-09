import { NextRequest, NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";
import { auth } from "@/auth";
import { decrypt } from "@/lib/config/encrypt";
import { RateLimiter } from "@/lib/services/rateLimiter";
import prisma from "@/prisma/prisma";

const rateLimiter = new RateLimiter({
  windowSize: 3600 * 1000, // 1 hour
  maxRequests: 2,
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-real-ip") ?? req.headers.get("X-Forwarded-For") ?? "unknown";
  const isRateLimited = rateLimiter.limit(ip);

  if (isRateLimited) {
    return NextResponse.json({ error: "rate limited" }, { status: 429 });
  }

  const session = await auth();
  if (!session || !session.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { payload, filePath, branchName, title, description, base, repo } = body;

  if (!payload || !filePath || !branchName || !title || !base || !repo) {
    return NextResponse.json(
      {
        message: "Payload, file path, branch name, title, base, and repo are required",
      },
      { status: 400 },
    );
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

    const octokit = new Octokit({ auth: githubToken });

    const { data: authUser } = await octokit.users.getAuthenticated();

    // Step 1: Fork the repository
    let fork;
    try {
      const { data: existingFork } = await octokit.repos.get({
        owner: authUser.login,
        repo: repoName,
      });
      fork = existingFork;
      console.log("Using existing fork");
    } catch (error) {
      // If the fork doesn't exist, create a new one
      const { data: newFork } = await octokit.repos.createFork({
        owner,
        repo: repoName,
      });
      fork = newFork;
      console.log("Created new fork");

      // Wait for the fork to be created
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    // Step 2: Get the default branch of the forked repo
    const { data: repoData } = await octokit.repos.get({
      owner: fork.owner.login,
      repo: fork.name,
    });
    const defaultBranch = repoData.default_branch;

    // Step 3: Get the latest commit SHA of the default branch in the fork
    const { data: defaultBranchData } = await octokit.repos.getBranch({
      owner: fork.owner.login,
      repo: fork.name,
      branch: defaultBranch,
    });
    const baseSha = defaultBranchData.commit.sha;

    // Step 4: Create a new branch in the fork
    await octokit.git.createRef({
      owner: fork.owner.login,
      repo: fork.name,
      ref: `refs/heads/${branchName}`,
      sha: baseSha,
    });

    // Step 5: Create or update the file in the new branch
    const content = Buffer.from(JSON.stringify(payload)).toString("base64");
    await octokit.repos.createOrUpdateFileContents({
      owner: fork.owner.login,
      repo: fork.name,
      path: filePath,
      message: "chore: add payload file",
      content,
      branch: branchName,
    });

    // Step 6: Create a pull request
    const { data: pr } = await octokit.pulls.create({
      owner,
      repo: repoName,
      title: title,
      body: description,
      head: `${fork.owner.login}:${branchName}`,
      base: base,
    });

    return NextResponse.json({ pr_url: pr.html_url }, { status: 200 });
  } catch (error) {
    console.error(error);
    const err = error as Error;
    return NextResponse.json(
      { message: "Internal Server Error", error: err.message },
      { status: 500 },
    );
  }
}
