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
    if (skipCi()) {
      core.setOutput("skip", true);
      console.log("Commit contains [skip ci] so skipping this release")
      return;
    }
    const {releaseType} = await getRecommendation()
    await sh.exec("git", ["config", "--global", "user.email", `"${core.getInput("author_email")}"`])
    await sh.exec("git", ["config", "--global", "user.name", `"${core.getInput("author_name")}"`])
    await sh.exec("git", ["status"])
    await sh.exec("npm", ["version", releaseType, "-m", `"[skip ci] ${core.getInput("commit_message").replace("[VERSION_TYPE]", releaseType)}"`]);
    await sh.exec("npm", ["publish"]);
    await sh.exec("git", ["push"]);
    await sh.exec("git", ["push", "--tags"]);
  } catch (err) {
    console.log(err);
    core.setFailed(err.message);
  }
}

run();
