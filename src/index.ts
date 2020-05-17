import * as sh from '@actions/exec';
import * as core from '@actions/core';
import conventional from 'conventional-recommended-bump';
import changelog from 'conventional-changelog-conventionalcommits/conventional-recommended-bump';
import skipCi from 'skip-ci';

function getRecommendation(): Promise<{ level: number, reason: string, releaseType: 'patch' | "minor" | "major" }> {
  return new Promise(((resolve, reject) => {
    conventional({
      whatBump: changelog({}).whatBump
    }, (error, recommendation) => {
      if (error) {
        reject(error);
      }
      resolve(recommendation);
    })
  }))
}

async function run() {
  try {
    if (skipCi) {
      core.setOutput("skip", true);
      return;
    }
    const {releaseType} = await getRecommendation();
    await sh.exec("npm", ["version", releaseType, "-m", `"[skip ci] Bumping version by ${releaseType}"`]);
    await sh.exec("npm", ["publish"]);
    await sh.exec("git", ["push"]);
    await sh.exec("git", ["push", "--tags"]);
  } catch (err) {
    console.log(err);
    core.setFailed(err.message);
  }
}

run();
