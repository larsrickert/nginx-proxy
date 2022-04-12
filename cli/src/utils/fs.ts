import { stat } from 'fs/promises';

export async function exists(path: string): Promise<boolean> {
	try {
		await stat(path);
		return true;
	} catch (e) {
		return false;
	}
}
