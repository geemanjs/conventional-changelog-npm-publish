import * as github from '@actions/github';
import * as parser from 'conventional-commits-parser';

export function getCommitMessages() {
  const raw = getRawCommitMessages();
  return raw.map((rawCommitMessage) => parser.sync(rawCommitMessage))
}

// Based upon: https://github.com/GsActions/commit-message-checker/
export function getRawCommitMessages(): string[] {
  const messages: string[] = []

  switch (github.context.eventName) {
    case 'push': {
      if (
        github.context.payload &&
        github.context.payload.commits &&
        github.context.payload.commits.length
      ) {
        for (const i in github.context.payload.commits) {
          if (github.context.payload.commits[i].message) {
            messages.push(github.context.payload.commits[i].message)
          }
        }
      }
      if (messages.length === 0) {
        throw new Error(`No commits found in the payload.`)
      }
      break
    }
    default: {
      throw new Error(`Event "${github.context.eventName}" is not supported.`)
    }
  }

  return messages
}