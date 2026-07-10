import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/prisma/prisma";
import { encrypt } from "@/lib/config/encrypt";

// Upsert the (encrypted) OAuth token onto the account row. Called on both the
// first link and every subsequent sign-in so a returning user's token stays fresh.
// Failures here must never block sign-in, so they are caught and logged.
async function persistGithubToken(account: any) {
  if (!account?.provider || !account?.providerAccountId || !account.access_token) return;

  try {
    await prisma.account.update({
      where: {
        provider_providerAccountId: {
          provider: account.provider,
          providerAccountId: account.providerAccountId,
        },
      },
      data: {
        access_token: encrypt(account.access_token),
        refresh_token: account.refresh_token ? encrypt(account.refresh_token) : undefined,
        expires_at: account.expires_at ?? undefined,
      },
    });
  } catch (error) {
    console.error("Failed to persist refreshed GitHub token:", error);
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID as string,
      clientSecret: process.env.AUTH_GITHUB_SECRET as string,
      authorization: {
        params: {
          scope: "public_repo user:email",
        },
      },
    }),
  ],
  events: {
    // Persist the freshly-issued OAuth token (encrypted) into the account row.
    //
    // IMPORTANT: `linkAccount` fires ONLY on the first time an account is linked.
    // For every subsequent sign-in of a returning user, Auth.js creates a session
    // WITHOUT updating the account, so the stored token would otherwise be frozen at
    // its first-login value forever. Once GitHub revokes/expires that token, the user
    // is permanently stuck (fork checks and PR creation 401), and neither re-login,
    // cache clears, nor fork syncs recover it. We therefore ALSO refresh the token on
    // every `signIn` (which does fire for returning users) so a re-login heals a stale
    // or revoked token.
    async linkAccount({ account }: any) {
      await persistGithubToken(account);
    },
    async signIn({ account }: any) {
      await persistGithubToken(account);
    },
  },
});
