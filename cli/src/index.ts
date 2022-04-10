#!/usr/bin/env node

import { Command, OptionValues } from "commander";
import { exec } from "./utils/fs";
import { cloneOrPullRepo } from "./utils/git";

const program = new Command("deploy");

program
  .command("deploy")
  .description(
    "Clone or pull latest git repository and (re)build docker-compose.yml"
  )
  .argument("<url>", "URL of the git repository")
  .option(
    "-b, --branch <branch>",
    "Branch name to checkout before deploying",
    "main"
  )
  .option(
    "-d, --dir <dir>",
    "Root directory where the applications should be deployed",
    `${process.cwd()}/applications`
  )
  .action(async (url: string, options: OptionValues) => {
    const branch = (options.branch as string).trim();
    let applicationsDir = options.dir as string;

    if (options.dir === ".") {
      return program.error('Applications directory must not be "."');
    }

    if (!branch) {
      return program.error("Branch must not be empty");
    }

    if (!url.startsWith("https://")) {
      return program.error("URL must start with https://");
    }

    console.log(
      `Deploying git repository "${url}" with branch "${branch}"...\n`
    );

    try {
      const repoPath = await cloneOrPullRepo(url, applicationsDir);

      console.log(`Check out branch "${branch}".`);
      await exec(`cd ${repoPath} && git checkout ${branch}`);

      console.log(`Rebuild docker-compose.yml.`);
      await exec(`cd ${repoPath} && docker-compose up -d --build`, true);

      console.log(`\n Successfully deployed application "${url}"`);
    } catch (e) {
      let message = (e as Error).message.replace(applicationsDir, "***");
      program.error(message);
    }
  });

program.parse();
