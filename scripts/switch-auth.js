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

// Git status checker
async function checkGitStatus() {
  try {
    const status = execSync("git status --porcelain").toString();
    if (status) {
      logger.warning("Uncommitted changes detected");

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

// Main auth switching function
async function switchAuth(provider) {
  const targetBranch = provider === "clerk" ? "main" : "feature/supabase-auth";
  const currentBranch = await getCurrentBranch();

  try {
    // Initial check
    logger.info("Starting auth provider switch...");

    // Check if already on correct branch
    if (currentBranch === targetBranch) {
      logger.warning(`Already on ${provider} authentication branch`);
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      return new Promise((resolve) => {
        rl.question("Do you want to clean and reinstall? (y/n): ", (answer) => {
          rl.close();
          if (answer.toLowerCase() !== "y") {
            logger.info("No changes made");
            process.exit(0);
          }
          resolve();
        });
      });
    }

    // Check git status if switching branches
    await checkGitStatus();

    // Cleanup
    logger.step("Cleaning up build files...");
    execSync("rm -rf .next node_modules pnpm-lock.yaml");
    logger.success("Cleanup complete");

    // Branch switch
    logger.step(`Switching to ${provider} authentication...`);
    execSync(`git checkout ${branch}`);
    logger.success(`Switched to ${branch} branch`);

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

// Command validation
const provider = process.argv[2];
if (!provider || !["clerk", "supabase"].includes(provider)) {
  logger.error("Please specify an auth provider: clerk or supabase");
  process.exit(1);
}

// Execute
switchAuth(provider);
