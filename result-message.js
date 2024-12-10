require('colors');
require('dotenv').config();

function logResult(username, repoName, projectName, reviewerName, branches) {
  console.log(``)
  console.log(`------------------------------------\n`)
  console.log(`🎉 Congratulations!`.green)
  console.log(`🥳 Your Pull Request Succeed\n`.green)
  console.log(`🧌  Username     : ${username}`.yellow)
  console.log(`⚙️  Repository   : ${repoName}`.yellow)
  console.log(`📁 Project      : ${projectName}`.yellow)
  console.log(`🤴 Reviewer     : ${reviewerName}`.yellow)
  console.log(`🏠 Dest Branch  : Passed\n`.yellow) //Destination Branch

  console.log(`🌿 List Branch Pull Requested:`.blue)
  branches.forEach((branch, index) => {
    console.log(`${index + 1}. ${branch}`);
  });

  console.log(``)
  console.log(`Thank you for using this BOT`.magenta)
  console.log(`Created by: ${process.env.CREATOR_NAME}\n`.magenta)
  
  console.log(`------------------------------------\n`)
}

module.exports = logResult;