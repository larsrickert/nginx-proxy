#!/usr/bin/env node

import { Command, OptionValues } from 'commander';
import shell from 'shelljs';
import { cloneOrPullRepo } from './utils/git';
const { version } = require('../package.json');

export const program = new Command();
program.version(version, '-v, --version');

program
	.command('deploy')
	.description('Clone or pull latest git repository and (re)build docker-compose.yml')
	.argument('<url>', 'URL of the git repository')
	.option('-b, --branch <branch>', 'Branch name to checkout before deploying', 'main')
	.option(
		'-d, --dir <dir>',
		'Root directory where the applications should be deployed',
		`${process.cwd()}/applications`
	)
	.option(
		'-f, --folder <folder>',
		'Folder name inside the applications directory that the repo is cloned to. If not provided, repository name will be used'
	)
	.option(
		'-r, --root <root>',
		'Root directory in the git repository where the docker-compose.yml is located that should be deployed. If not provided, repository root (.) will be used'
	)
	.action(async (url: string, options: OptionValues) => {
		if (!shell.which('git') || !shell.which('docker-compose')) {
			program.error('Sorry, this action requires git and docker-compose');
		}

		const branch = (options.branch as string).trim();
		let applicationsDir = options.dir as string;
		const folderName = options.folder as string | undefined;
		const root = options.root as string | undefined;

		if (folderName && (folderName.startsWith('.') || folderName.includes('/'))) {
			return program.error(`Folder name "${folderName}" is invalid`);
		}

		if (root && root.startsWith('..')) {
			return program.error(`Root parameter must not start with ".."`);
		}

		if (options.dir === '.') {
			return program.error('Applications directory must not be "."');
		}

		if (!branch) {
			return program.error('Branch must not be empty');
		}

		if (!url.startsWith('https://')) {
			return program.error('URL must start with https://');
		}

		shell.echo(`Deploying git repository "${url}" with branch "${branch}"...\n`);

		try {
			const repoPath = await cloneOrPullRepo(url, applicationsDir, folderName);
			shell.cd(repoPath);

			shell.echo(`Checking out branch ${branch}...`);
			if (shell.exec(`git checkout ${branch}`).code !== 0) {
				program.error(`Error: Git checking out branch ${branch} failed`);
			}

			shell.echo(`Rebuilding docker-compose.yml...`);
			if (shell.exec(`${root ? `cd ${root} &&` : ''} docker-compose up -d --build`).code !== 0) {
				program.error(`Error: docker-compose rebuild failed`);
			}

			shell.echo(`\n Successfully deployed application "${url}"`);
		} catch (e) {
			let message = (e as Error).message.replace(applicationsDir, '***');
			program.error(message);
		}
	});

program.parse();
