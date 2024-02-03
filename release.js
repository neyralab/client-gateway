import { promises as fs } from 'fs';
import { execSync } from 'child_process';
import readline from 'readline';
import semver from 'semver';
import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const Table = require('cli-table3');

async function getDefaultBranch() {
    try {
        const defaultBranch = execSync('gh repo view --json defaultBranchRef --jq .defaultBranchRef.name', { encoding: 'utf8' }).trim();
        return defaultBranch;
    } catch (error) {
        console.error('Failed to fetch the default branch:', error);
        process.exit(1);
    }
}

function checkCurrentBranch(defaultBranch) {
    const currentBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
    if (currentBranch !== defaultBranch) {
        console.error(`You are not on the default branch (${defaultBranch}). Current branch is ${currentBranch}.`);
        process.exit(1);
    }
}


async function checkForUncommittedChanges() {
    const statusOutput = execSync('git status --porcelain', { encoding: 'utf8' });
    const lines = statusOutput.split('\n').filter(line => line);

    if (lines.length > 2 || (lines.length > 0 && !lines.every(line => line.includes('package.json') || line.includes('package-lock.json')))) {
        console.log('There are uncommitted changes or untracked files in the repository:');
        const table = new Table({
            head: ['Status', 'File'],
            colWidths: [10, 50],
        });

        lines.forEach(line => {
            const [status, file] = line.split(' ').filter(Boolean);
            table.push([status, file]);
        });

        console.log(table.toString());

        const confirmation = await askQuestion('Do you want to continue with the release process? (y/N): ');
        if (!confirmation.toLowerCase().startsWith('y')) {
            console.log('Release process aborted.');
            process.exit(1);
        }
    }
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function fetchLatestRelease() {
    try {
        const latestTag = execSync('gh release view --json tagName --jq .tagName', { encoding: 'utf8' }).trim();
        return latestTag;
    } catch (error) {
        console.error('Failed to fetch the latest release:', error);
        process.exit(1);
    }
}

function askQuestion(question) {
    return new Promise(resolve => rl.question(question, resolve));
}

async function updatePackageVersion(newVersion) {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
    packageJson.version = newVersion;
    await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
    console.log(`Updated package.json to version ${newVersion}`);
}

function runBuildScript() {
    try {
        console.log('Running npm i && npm run build...');
        execSync('npm i && npm run build', { stdio: 'inherit' });
    } catch (error) {
        console.error('Failed to run the build script:', error);
        process.exit(1);
    }
}

async function addPackageJson() {
    execSync('git add package.json package-lock.json');
}
async function commitChanges(newVersion) {
    try {
        execSync(`git commit -m "Bump version to ${newVersion} and update lock file"`);
        console.log('Committed package.json and package-lock.json version bump');
    } catch (error) {
        console.log('No changes to commit for package.json or package-lock.json');
    }
}

async function main() {
    const latestRelease = fetchLatestRelease();
    console.log(`Latest Release: ${latestRelease}`);

    const nextPatch = semver.inc(latestRelease, 'patch');
    const nextMinor = semver.inc(latestRelease, 'minor');
    const nextMajor = semver.inc(latestRelease, 'major');

    console.log('Choose the next version:');
    console.log(`1) Patch: ${nextPatch}`);
    console.log(`2) Minor: ${nextMinor}`);
    console.log(`3) Major: ${nextMajor}`);

    const choice = await askQuestion('Enter your choice (1/2/3): ');
    let newVersion;
    switch (choice) {
        case '1':
            newVersion = nextPatch;
            break;
        case '2':
            newVersion = nextMinor;
            break;
        case '3':
            newVersion = nextMajor;
            break;
        default:
            console.error('Invalid choice.');
            rl.close();
            process.exit(1);
    }

    await updatePackageVersion(newVersion);
    runBuildScript(); // This will update package-lock.json if any dependencies are installed/updated
    await addPackageJson();

    const defaultBranch = await getDefaultBranch();
    checkCurrentBranch(defaultBranch); // Ensure we're on the default branch

    await checkForUncommittedChanges(); // Check for uncommitted changes
    await commitChanges(newVersion);

    rl.close();

    try {
        execSync(`git push origin ${defaultBranch}`);
        console.log(`Changes pushed to ${defaultBranch} successfully.`);

        console.log(`Creating new tag: ${newVersion}`);
        execSync(`git tag ${newVersion}`);
        execSync(`git push origin ${newVersion}`);

        console.log(`Creating GitHub release for ${newVersion}`);
        execSync(`gh release create ${newVersion} --generate-notes`);

        console.log('Release created successfully.');
    } catch (error) {
        console.error('Failed to create the release:', error);
        process.exit(1);
    }
}

main();
