require('colors');
require('dotenv').config();
const axios = require('axios');
const logResult = require('./result-message');
const { getFilteredBranches } = require('./filter-export-task');

const username = process.env.BITBUCKET_USERNAME;
const password = process.env.BITBUCKET_PASS; //? Or access token if using OAuth
const auth = Buffer.from(`${username}:${password}`).toString('base64');

const bitbucketApiUrl = 'https://api.bitbucket.org/2.0/repositories';
const repoOwner = process.env.BITBUCKET_REPO_OWNER; //? Repository Owner
const repoSlug = process.env.BITBUCKET_REPO_SLUG; //? Repository Slug or Project Name
const branches = []; //? Replace with your branch names
const reviewerUuid = process.env.BITBUCKET_REVIEWER_UID; //? reviewer's UUID
const reviewerName = process.env.BITBUCKET_REVIEWER_NAME; //? Reviewer Name

//!  Do not edit below
let list_branch_pulled = []

async function branchExists(branch) {
  try {
    const response = await axios.get(
      `${bitbucketApiUrl}/${repoOwner}/${repoSlug}/refs/branches/${branch}`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.status === 200;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      list_branch_pulled.push(`${branch} (Skipped)`)

      console.warn(`Branch '${branch}' does not exist.`.yellow);
    } else {
      console.error(`Error checking branch '${branch}':`, error.message);
    }
    return false;
  }
}

async function getCommitMessages(branch) {
  try {
    const response = await axios.get(
      `${bitbucketApiUrl}/${repoOwner}/${repoSlug}/commits/${branch}`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const commits = response.data.values;
    const commitMessages = commits.map(commit => `- ${commit.message}`).join('\n');
    return commitMessages;
  } catch (error) {
    console.error(`Error fetching commits for branch '${branch}':`, error.message);
    return '';
  }
}

async function createPullRequest(branch) {
  const description = await getCommitMessages(branch);

  try {
    const response = await axios.post(
      `${bitbucketApiUrl}/${repoOwner}/${repoSlug}/pullrequests`,
      {
        title: `${branch}`,
        source: {
          branch: {
            name: branch,
          },
        },
        destination: {
          branch: {
            name: 'passed',
          },
        },
        close_source_branch: true, // Automatically deletes the source branch after the pull request is merged
        reviewers: reviewerUuid ? [{ uuid: reviewerUuid }] : [],
        description: description || `No commit messages found for ${branch}`,
      },
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const { source, title } = response.data
    list_branch_pulled.push(source.branch.name || title)

    console.log(`Pull request created for branch: ${branch}`.green);
  } catch (error) {
    console.error(`Error creating pull request for branch: ${branch}`, error.response ? error.response.data : error.message);
  }
}

async function bulkCreatePullRequests() {
  const USE_EXCEL = process.env.USE_EXCEL

  let filteredBranches =  []
  if (USE_EXCEL == 'Y') {
    filteredBranches = await getFilteredBranches()
  }else{
    filteredBranches = branches

    if(filteredBranches.length == 0){
      console.log('⚠️  No branches found. Exiting...')
      process.exit(1)
    }
  }

  for (const branch of filteredBranches) {
    if (branch.code && await branchExists(branch.code)) {
      await createPullRequest(branch.code);
    }
  }
      
  logResult(username, repoOwner, repoSlug, reviewerName, list_branch_pulled);
}

bulkCreatePullRequests();
