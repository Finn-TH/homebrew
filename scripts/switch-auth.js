#!/usr/bin/env node

const { execSync } = require("child_process");
const readline = require("readline");

// Console styling utilities
const logger = {
  info: (msg) => console.log(`\n💡 ${msg}`),
  success: (msg) => console.log(`\n✨ ${msg}`),
  warning: (msg) => console.log(`\n⚠️  ${msg}`),
  error: (msg) => console.log(`\n❌ ${msg}`),
  step: (msg) => console.log(`\n📍 ${msg}`),
  done: (msg) => console.log(`\n🎉 ${msg}\n`),
};

// Get current branch
async function getCurrentBranch() {
  try {
    return execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
  } catch (error) {
    logger.error("Failed to get current branch");
    process.exit(1);
  }
}

// Git status checker with force option
async function checkGitStatus(force = false) {
  try {
    const status = execSync("git status --porcelain").toString();
    if (status) {
      logger.warning("Uncommitted changes detected");

      if (force) {
        logger.warning("Force flag detected - Changes will be discarded! ⚠️");
        return;
      }

      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      return new Promise((resolve) => {
        rl.question("Continue anyway? (y/n): ", (answer) => {
          rl.close();
          if (answer.toLowerCase() !== "y") {
            logger.error(
              "Operation cancelled - Please commit or stash your changes"
            );
            process.exit(1);
          }
          resolve();
        });
      });
    }
  } catch (error) {
    logger.error("Failed to check git status");
    process.exit(1);
  }
}

// Add this helper function at the top with other utilities
async function showForceWarning() {
  console.log("\n🚨 FORCE MODE ACTIVATED 🚨");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("⚠️  All local changes will be discarded");
  console.log("⚠️  Branch will be forcefully switched");
  console.log("⚠️  This action cannot be undone");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question("Are you sure you want to force switch? (y/n): ", (answer) => {
      rl.close();
      if (answer.toLowerCase() !== "y") {
        logger.error("Force switch cancelled");
        process.exit(1);
      }
      resolve();
    });
  });
}

// Main auth switching function
async function switchAuth(provider, force = false) {
  const targetBranch =
    provider === "clerk" ? "feature/clerk-auth" : "feature/supabase-auth";

  const currentBranch = await getCurrentBranch();

  try {
    logger.info("Starting auth provider switch...");

    // Show force warning if force flag is used
    if (force) {
      await showForceWarning();
    }

    // Check git status if switching branches
    await checkGitStatus(force);

    // Cleanup
    logger.step("Cleaning up build files...");
    execSync("rm -rf .next node_modules pnpm-lock.yaml");
    logger.success("Cleanup complete");

    // Branch switch
    logger.step(`Switching to ${provider} authentication...`);
    const checkoutCommand = force
      ? `git checkout -f ${targetBranch}`
      : `git checkout ${targetBranch}`;
    execSync(checkoutCommand);
    logger.success(`Switched to ${targetBranch} branch`);

    // Dependencies
    logger.step("Installing dependencies...");
    execSync("pnpm install");
    logger.success("Dependencies installed");

    // Final success message
    logger.done(`Successfully switched to ${provider} authentication!`);
    logger.info("Run pnpm dev to start the development server 🚀");
  } catch (error) {
    logger.error(`Failed to switch auth: ${error.message}`);
    process.exit(1);
  }
}

// Command validation with force option
const args = process.argv.slice(2);
const provider = args[0];
const force = args.includes("--force");

if (!provider || !["clerk", "supabase"].includes(provider)) {
  logger.error("Please specify an auth provider: clerk or supabase");
  logger.info("Usage: pnpm auth:<provider> [--force]");
  process.exit(1);
}

// Execute with force option
switchAuth(provider, force);
