import fs from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function updateVersion() {
    try {
        // Read the current package.json
        const packageJson = JSON.parse(await fs.readFile('package.json', 'utf8'));

        // Split the version into major, minor, and patch
        const [major, minor, patch] = packageJson.version.split('.').map(Number);

        // Increment the patch version
        const newVersion = `${major}.${minor}.${patch + 1}`;

        // Update the version in the package.json object
        packageJson.version = newVersion;

        // Write the updated package.json back to the file
        await fs.writeFile('package.json', JSON.stringify(packageJson, null, 2));

        console.log(`Version updated to ${newVersion}`);

        // Optionally, commit the change
        await execAsync('git add package.json');
        await execAsync(`git commit -m "Bump version to ${newVersion}"`);

        console.log('Changes committed to git');
    } catch (error) {
        console.error('Error updating version:', error);
    }
}

