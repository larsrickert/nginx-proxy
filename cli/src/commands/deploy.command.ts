import { Command, OptionValues } from "commander";
import shell from "shelljs";
import { cli } from "..";
import { cloneOrPullRepo } from "../utils/git";

export const deployCommand = new Command("deploy")
  .description("Clone or pull latest git repository and (re)build docker-compose.yml")
  .argument("<url>", "URL of the git repository")
  .option("-b, --branch <branch>", "Branch name to checkout before deploying", "main")
  .option(
    "-d, --dir <dir>",
    "Directory where the git repository should be cloned in. Will create a subfolder inside this directory (see option --folder)",
    "./applications",
  )
  .option(
    "-f, --folder <folder>",
    "Folder name inside the applications directory that the repo is cloned to. If not provided, repository name will be used",
  )
  .option(
    "-r, --root <root>",
    "Root directory inside the git repository where the docker-compose.yml is located that should be deployed. If not provided, repository root (.) will be used",
  )
  .action(async (url: string, options: OptionValues) => {
    if (!shell.which("git") || !shell.which("docker-compose")) {
      cli.error("Sorry, this action requires git and docker-compose");
    }

    const branch = options.branch as string;
    let applicationsDir = options.dir as string;
    const folderName = options.folder as string | undefined;
    const root = options.root as string | undefined;

    if (folderName && (folderName.startsWith(".") || folderName.includes("/"))) {
      return cli.error(`Folder name "${folderName}" is invalid`);
    }

    if (root && (root.startsWith("..") || root.startsWith("/"))) {
      return cli.error(`Root parameter must not start with ".."`);
    }

    if (!branch) {
      return cli.error("Branch must not be empty");
    }

    if (!url.startsWith("https://")) {
      return cli.error("URL must start with https://");
    }

    shell.echo(`Deploying git repository "${url}" with branch "${branch}"...\n`);

    try {
      const repoPath = await cloneOrPullRepo(url, applicationsDir, folderName);
      shell.cd(repoPath);

      shell.echo(`Checking out branch ${branch}...`);
      if (shell.exec(`git checkout ${branch}`).code !== 0) {
        cli.error(`Error: Git checking out branch ${branch} failed`);
      }

      shell.echo(`Rebuilding docker-compose.yml...`);
      if (
        shell.exec(
          `${root ? `cd ${root} &&` : ""} docker-compose -f ./docker-compose.yml up -d --build`,
        ).code !== 0
      ) {
        cli.error(`Error: docker-compose rebuild failed`);
      }

      shell.echo(`\n Successfully deployed application "${url}"`);
    } catch (e) {
      let message = (e as Error).message.replace(applicationsDir, "***");
      cli.error(message);
    }
  });
