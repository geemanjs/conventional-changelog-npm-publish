# Conventional changelog npm publish action
This action does a few things:
1. Uses [conventional-recommended-bump](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-recommended-bump) to identify required `patch`, `minor` or `major` version change
2. Runs `npm version` with the output of the above
3. Performs an `npm publish` to the already setup repository (`setup-node`)

## Inputs

### `author_email`
**Optional** The email address used when committing the new version back to your repository. Default `"conventional-changelog-npm-publish@noreply.github.com"`.

### `author_name`
**Optional** The name used when committing the new version details back to your repository. Default `"conventional-changelog-npm-publish"`.

### `commit_message`
**Optional** The message used when committing the new version details back to your repository. Default `"Bumping [VERSION_TYPE] version"`.
Replaces `[VERSION_TYPE]` with one of `patch`, `minor` or `major`. So the default becomes `Bumping patch version`


## Outputs

## Example usage
```yaml
name: npm-build-publish
on:
  push:
    branches:
      - master

jobs:
  npm-build-publish:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@master
      # required - sets up auth in the node env
      - name: Set up Node.js
        uses: actions/setup-node@master
        with:
          node-version: 12.x
          registry-url: 'https://npm.pkg.github.com'
      # optional
      - run: npm install
      # optional
      - run: npm run build
        env:
          CI: true
      # required
      - name: version & publish
        uses: geeman201/conventional-changelog-npm-publish/@v14
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
