import * as github from '@actions/github';
import * as sh from '@actions/exec';
import * as core from '@actions/core';
import {getCommitMessages, getRawCommitMessages} from "./commits";
import conventional from 'conventional-recommended-bump';
import changelog from 'conventional-changelog-conventionalcommits/conventional-recommended-bump';
import changelog2 from 'conventional-changelog-conventionalcommits';

async function run() {
  try {
    console.log(github.context.sha)
    console.log(github.context)
    console.log(changelog);
    console.log(changelog2)

    const commits = getCommitMessages();
    // const versionBump = commits.reduce((agg, commit) => {
    //   commit.type === ""
    // }, "patch")

    conventional({
      preset: 'conventionalcommits'
      // whatBump: changelog({}).whatBump
    }, (error, recommendation) => {
      console.log(error, recommendation)
    })

    console.log("----------");
    console.log(getRawCommitMessages());
    console.log("----------");
    console.log();
    console.log("-----------");


    await sh.exec("npm", ["--version"]);
    await sh.exec("npm config get registry")
  } catch (err) {
    console.log(err);
    core.setFailed(err.message);
  }
}

run();
