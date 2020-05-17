import * as github from '@actions/github';
import * as sh from '@actions/exec';
import * as core from '@actions/core';
import {getCommitMessages, getRawCommitMessages} from "./commits";
const conventional = require('conventional-recommended-bump');

async function run() {
  try {
    console.log(github.context.sha)
    console.log(github.context)

    console.log("----------");
    console.log(getRawCommitMessages());
    console.log("----------");
    console.log(getCommitMessages());
    console.log("-----------");

    conventional({}, (error, recommendation) => {
      console.log(recommendation.releaseType);
    });

    await sh.exec("npm", ["--version"]);
    await sh.exec("npm config get registry")
  } catch (err) {
    console.log(err);
    core.setFailed(err.message);
  }
}

run();
