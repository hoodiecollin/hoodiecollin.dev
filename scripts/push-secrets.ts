/**
 * Push deploy secrets from 1Password → GitHub Actions secrets.
 *
 * Canonical store: 1Password → Private → "hoodiecollin.dev deploy". Fill that
 * item's four fields, then run `bun run secrets` to sync them into the repo's
 * GitHub Actions secrets (consumed by .github/workflows/deploy.yml).
 *
 * Prereqs: `op` signed in (`op signin`) and `gh` authenticated (`gh auth login`).
 */
import { execFileSync } from "node:child_process";

const ITEM = "op://Private/hoodiecollin.dev deploy";

// [GitHub secret name, 1Password field reference]
const SECRETS: ReadonlyArray<readonly [string, string]> = [
  ["NEXT_PUBLIC_POSTHOG_KEY", `${ITEM}/posthog project key`],
  ["VERCEL_TOKEN", `${ITEM}/vercel token`],
  ["VERCEL_ORG_ID", `${ITEM}/vercel org id`],
  ["VERCEL_PROJECT_ID", `${ITEM}/vercel project id`],
];

for (const [name, ref] of SECRETS) {
  // stderr inherited so `op` auth/errors surface; stdout captured (the value).
  const value = execFileSync("op", ["read", ref], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"],
  }).trim();

  if (!value || value.startsWith("REPLACE_ME")) {
    console.error(
      `✗ ${name}: 1Password field is still a placeholder — fill "${ref}" first.`,
    );
    process.exit(1);
  }

  // Value goes on stdin (never argv, so it can't leak via `ps`); gh's own
  // "✓ Set secret …" confirmation streams straight through.
  execFileSync("gh", ["secret", "set", name], {
    input: value,
    stdio: ["pipe", "inherit", "inherit"],
  });
  console.log(`✓ ${name}`);
}

console.log("\nAll deploy secrets synced to GitHub Actions.");
