import { execSync } from 'child_process';
import readline from 'readline';
import semver from 'semver';

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
            process.exit(1);
    }

    rl.close();

    try {
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
