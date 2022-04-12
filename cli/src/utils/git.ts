import { mkdir } from 'fs/promises';
import { basename, join } from 'path';
import shell from 'shelljs';
import { program } from '..';
import { exists } from './fs';

export async function cloneOrPullRepo(
	url: string,
	path: string,
	folderName?: string
): Promise<string> {
	folderName ||= basename(url);
	const repoPath = join(path, folderName);

	await mkdir(path, { recursive: true });

	if (!(await exists(repoPath))) {
		shell.echo(`Application "${folderName}" is deployed for the first time. Cloning repository.`);
		if (shell.exec(`cd ${path} && git clone ${url} ${folderName}`).code !== 0) {
			program.error(`Error: Git clone repository failed`);
		}
	} else {
		const { stdout: gitUrl } = shell.exec(`cd ${repoPath} && git config --get remote.origin.url`);

		if (gitUrl.replace('\n', '') !== url) {
			program.error(`A different application with name "${folderName}" does already exist`);
		}

		shell.echo('Pulling latest git changes.');
		if (shell.exec(`cd ${repoPath} && git pull`).code !== 0) {
			program.error(`Error: Cannot pull latest git changes`);
		}
	}

	return repoPath;
}
