import { basename, join } from "path";
import shell from "shelljs";
import { cli } from "..";
import { exists } from "./shell";

export async function cloneOrPullRepo(
  url: string,
  path: string,
  folderName?: string
): Promise<string> {
  folderName ||= basename(url);
  const repoPath = join(path, folderName);

  if (shell.exec(`mkdir -p ${path}`).code !== 0) {
    cli.error(`Error: Unable to create applications root folder`);
  }

  if (!exists(repoPath)) {
    shell.echo(
      `Application "${folderName}" is deployed for the first time. Cloning repository.`
    );
    if (shell.exec(`cd ${path} && git clone ${url} ${folderName}`).code !== 0) {
      cli.error(`Error: Git clone repository failed`);
    }
  } else {
    const { stdout: gitUrl } = shell.exec(
      `cd ${repoPath} && git config --get remote.origin.url`
    );

    if (!gitUrl.includes(url)) {
      cli.error(
        `A different application with name "${folderName}" does already exist`
      );
    }

    shell.echo("Pulling latest git changes.");
    if (shell.exec(`cd ${repoPath} && git pull`).code !== 0) {
      cli.error(`Error: Cannot pull latest git changes`);
    }
  }

  return repoPath;
}
