import { mkdir } from 'fs/promises';
import { basename, join } from 'path';
import { exec, exists } from './fs';

export async function cloneOrPullRepo(url: string, path: string): Promise<string> {
	const repoName = basename(url);
	const repoPath = join(path, repoName);

	await mkdir(path, { recursive: true });

	if (!(await exists(repoPath))) {
		console.log(`Repository "${repoName}" is deployed for the first time. Cloning repository.`);
		await exec(`cd ${path} && git clone ${url}`);
	} else {
		const { stdout: gitUrl } = await exec(`cd ${repoPath} && git config --get remote.origin.url`);

		if (gitUrl.replace('\n', '') !== url) {
			throw new Error(`A different repository with name "${repoName}" does already exist`);
		}

		console.log('Pulling latest git changes.');
		await exec(`cd ${repoPath} && git pull`, true);
	}

	return repoPath;
}
