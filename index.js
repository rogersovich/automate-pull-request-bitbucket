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
let temp_list_branch_pulled = []

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
      const findBranch = temp_list_branch_pulled.find((item) => item.code == branch)
      const branchResult = `${branch} - ${findBranch.title}` || title
      //* Branch does not exist
      list_branch_pulled.push(`${branchResult} (Skipped)`)

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
  const USE_EXCEL = process.env.USE_EXCEL
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

    const response_data = response.data
    const branchCode = response_data?.source.branch.name || null
    const findBranch = USE_EXCEL == 'Y' ? temp_list_branch_pulled.find((item) => item.code == branchCode) : branches.find((item) => item == branchCode)
    const branchResult = USE_EXCEL == 'Y' ? `${branchCode} - ${findBranch?.title || response_data?.title}` : `${branchCode}`

    list_branch_pulled.push(branchResult)

    console.log(`Pull request created for branch: ${branch}`.green);
  } catch (error) {
    const branchResult = `${branch}`
    list_branch_pulled.push(branchResult)
    console.error(`Error creating pull request for branch: ${branch}`, error.response ? error.response.data : error.message);
  }
}

async function bulkCreatePullRequests() {
  const USE_EXCEL = process.env.USE_EXCEL
  
  let filteredBranches =  []
  if (USE_EXCEL == 'Y') {
    filteredBranches = await getFilteredBranches()
    temp_list_branch_pulled = filteredBranches
  }else{
    filteredBranches = branches

    if(filteredBranches.length == 0){
      console.log('⚠️  No branches found. Exiting...')
      process.exit(1)
    }
  }

  for (const branch of filteredBranches) {
    const branch_code = USE_EXCEL == 'Y' ? branch.code : branch
    if (branch_code && await branchExists(branch_code)) {
      await createPullRequest(branch_code);
    }
  }
      
  logResult(username, repoOwner, repoSlug, reviewerName, list_branch_pulled);
}

bulkCreatePullRequests();
