import { exec as execCp } from 'child_process';
import { stat } from 'fs/promises';

// export const exec = promisify<(command: string) => Promise<{ stdout: string; stderr: string }>>(
// 	require('child_process').exec
// );

export function exec(
	command: string,
	logOutput = false
): Promise<{ stdout: string; stderr: string }> {
	return new Promise((resolve, reject) => {
		const childProcess = execCp(command, (error, stdout, stderr) => {
			error ? reject(error) : resolve({ stdout, stderr });
		});

		if (logOutput) {
			childProcess.stdout?.on('data', (data) => {
				console.log(data);
			});
			childProcess.stderr?.on('data', (data) => {
				console.error(data);
			});
		}
	});
}

export async function exists(path: string): Promise<boolean> {
	try {
		await stat(path);
		return true;
	} catch (e) {
		return false;
	}
}
