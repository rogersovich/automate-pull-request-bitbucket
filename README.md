## Automate Pull Request 

this project i create bcz im lazy for pull request 🤯

## Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or later)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installations

1. **Clone the repository:**

```bash 
git clone https://github.com/rogersovich/automate-pull-request-bitbucket.git
```

2. **Navigate to the project directory:**

```bash
cd automate-pull-request-bitbucket
```

3. **Install dependencies**

```bash 
npm install colors dotenv axios
```

```bash 
npm install
```

### Configuration

1. **Rename a `.env.example` file** to **`.env`** in the root directory of the project.
   
2. How to get **Bitbucket repository slug and owner**
   - Go to your project repository in bitbucket then find the url
   - The url look like this:
   - `https://bitbucket.org/{BITBUCKET_REPO_OWNER}/{BITBUCKET_REPO_SLUG}/`
  
3. How to get **Bitbucket Reviewer UID and name**
   - Go to `https://bitbucket.org/{BITBUCKET_REPO_OWNER}/{BITBUCKET_REPO_SLUG}/pull-requests/new`
   - Then  *F12* or *Right Click and Inspect Element*
   - After that go to *Network* and search request call **/recommended-reviewers** and go to tab **Response**
   - The **Response** object will be like this:
   - ```bash
       {
         "suggested_reviewers": [
             {
                 "full_name": "example_reviewer_name",
                 "aid": "xxxx-xxx-xxx-xxxx",
                 "avatar_url": "xxxxxxxxxx",
                 "uuid": "example_reviewer_uuid"
             }
         ]
       }

4. After that just fill the env value
   
5. After that open file **automate-pull-request.js**
   
6. Search code `const branches = []; //? Replace with your branch names`
   - Then fill your branch names
   - Example: `const branches = ['branch-1', 'branch-2'];`

### Running the Bot

To start the bot, run:

```bash 
node automate-pull-request.js
```