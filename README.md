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
     - **`https://bitbucket.org/{BITBUCKET_REPO_OWNER}/{BITBUCKET_REPO_SLUG}/`**
   - Copy and Paste the value **BITBUCKET_REPO_OWNER** and **BITBUCKET_REPO_SLUG** to your **.env**
  
3. How to get **Bitbucket Reviewer UID and name**
   - Go to **`https://bitbucket.org/{BITBUCKET_REPO_OWNER}/{BITBUCKET_REPO_SLUG}/pull-requests/new`**
   - Then  **F12** or **Right Click and Inspect Element**
   - After that go to **Network** and search request call **/recommended-reviewers** and go to tab **Response**
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
    - Copy and Paste the value **full_name** and **uuid** to your **.env**

4. Finished filling in the remaining files **.env** value

### Choose Category

1. Use Manual set branches
   - Open file **index.js**
   - Search code **`const branches = []; //? Replace with your branch names`**
     - Then fill your branch names
     - Example: **`const branches = ['branch-1', 'branch-2'];`**
2. Use Excel export set branches
  - Open file **filter-export-task.js**
  - Prepare yout excel file export
  - Rename into **LIST_TASK.xlsx**

### Running the Bot

To start the bot, run:

```bash 
node index.js
```

## Donations

If you like this project, you can make a donation using the following payments

[Saweria ku](https://saweria.co/rogersovich) (Support me 💙)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
