const github = require('@actions/github');
const core = require('@actions/core');

async function run() {
  const token = core.getInput('token');
  const octokit = new github.GitHub(token);

  const owner = core.getInput('owner');
  const repo = core.getInput('repo');
  const title = core.getInput('title');
  const head = core.getInput('head');
  const base = core.getInput('base');

  const pull = octokit.pulls.create({
    owner,
    repo,
    title,
    head,
    base,
  });

  core.setOutput("pull_id", pull.id)
}

run();
