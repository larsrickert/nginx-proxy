import { copyFile, mkdir, readdir, stat } from 'fs/promises';
import path from 'path';

export async function exists(path: string): Promise<boolean> {
	try {
		await stat(path);
		return true;
	} catch (e) {
		return false;
	}
}

export async function copyFolder(src: string, dest: string) {
	const folderName = path.basename(src);
	const destPath = path.join(dest, folderName);

	try {
		await mkdir(destPath, { recursive: true });

		const files = await readdir(src);
		for (const file of files) {
			await copyFile(path.join(src, file), path.join(destPath, file));
		}
	} catch (e) {
		throw new Error(`Unable to copy folder "${src}"`);
	}
}
