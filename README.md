# WEIT Vollie Management

## Overview
insert overview here :]

## Technologies
* Node.js (version 16.14.2)
* TypeScript (version 4.6.3)
* React (version 17.0.2) (frontend)
* Express (version 4.17.3) (backend)

## Getting Started

### Basic Installation Requirements
* [node.js (v16.14.2)](https://nodejs.org/en/)
* [VS Code](https://code.visualstudio.com/) (VSC)
* VSC extensions (Ctrl+Shift+X in VSC):
    * [Prettier](https://prettier.io/) is a code formatter that takes away all the effort in trying to make everyone's code look the same and stops pointless arguments about what looks the best / most readable because the tool does it for us.
    * [ESLint](https://eslint.org/) is a tool that helps find analyse and problems in JavaScript (and TypeScript, with the right dependencies). It does an amazing job at making code more consistent and avoiding bugs.

Once you have the above installed, run `npm install` from inside the `backend/` and `frontend/` foldera to install all the dependencies that are needed. (Note: you may need to restart VSC for it to stop yelling about any errors.)

### Pre-flight Checks
* Make sure you installed the ESLint and Prettier VSC extensions
* Code may not be properly formatted on save because VSC might be a bit confused due to there being multiple code formatters. To fix this, press `Ctrl+Shift+P` -> `Format Document` -> `Configure` and choose Prettier, and it should now auto-format on save (note: may need to do this on every file type)
* VSC may use the wrong version of TypeScript, so to fix this, press `Ctrl+Shift+P` -> `TypeScript: Select TypeScript Version` and select `Use Workspace Version`

## Running Frontend

In the `frontend/` directory, you can run:

### `npm start`

Runs the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser. The page will reload if you make edits. You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode. See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance. The build is minified and the filenames include the hashes. Your app is ready to be deployed! See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project. Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own. You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Running Backend

In the `backend/` directory, you can run:

### `npm run dev`

Runs the app in the development mode. The server will reload if you make edits.

## Development Rules
* **Linting and formatting:** Ensure that your code has no errors and has been formatted properly (using Prettier) before committing/merging (run `npm run format` and `npm run lint` in `frontend/` and `backend/` to blanket-check everything)
* **Git commit messages:** Choose a meaningful message when committing code e.g., “fixed an issue where x, y, z” instead of “fix bug” as the first offers more information regarding the commit without looking at the code, but also don't need to include things that are already stored as part of the commit (e.g., what time it is, your name, etc)
* **Adding npm dependences**: Don't add in external dependencies on your own accord, such things should be approved by team/technical leads and only in cases where dependencies are absolutely necessary. Ideally, we want to minimise the number of dependencies your project has for several reasons, such as security (these packages could introduce security issues and you may not even know until it’s too late) and maintenance (if you update the packages, do they suddenly break all the logic within the project? What happens if the owner of the package decides to remove it from existence?). Something that everyone should know is that a package can also have dependencies of its own, which creates even more headache when it comes to security and maintenance.
* **Check what you’re committing before you commit:** It’s good practice to check what files you’re about to commit to ensure you didn’t accidentally change something you weren’t supposed to, to not commit files that shouldn’t be committed (e.g., the node_modules folder), or to not commit `console.log` statements etc. The .gitignore usually covers these things so that git ignores said files (as the file implies), but it’s not bulletproof.
* **Warning about coding tutorials:** While guides and tutorials are good to show how something can be done, take a lot of care to avoid appropriating someone else’s work, which ends up with random npm dependencies and overengineered code in the project. Another concern is plagiarism as we can’t just take someone else’s intellectual property and include it in our project. There’s nothing wrong with using something as a guide, but they should only be used so that you gain an understanding of how things work and could be implemented (tip: it's a bad sign if you don’t understand what you're going to commit). If assistance is needed, don't forget to consult with other developers as well, as they may have the answers to your questions.

## Build and Deployment Rules
To ensure we follow a clean and efficient development methodology, we will follow the three-tier branch approach when applying changes. This includes the following:

```
master
    ┣━━ feature
           ┗━━ task
```
Features are marked as epics on Jira. Create a feature branch after checking Jira epic. 

### Branch Rules

| Branch  | Naming Convention| Example           |
|:--------|:-----------------|:------------------|
| Master  | master           | master            |
| Feature | feature-*        | feature-login     |    
| Task    | task-*           | task-login_button |

***

#### Master

The Master Branch will be used as the final product.
* <b>IMPORTANT NOTE</b> - No direct changes will be made on this branch**

#### Feature

The Feature Branch will stem off the Master Branch and will act as a topic branch. For example, if a new component such as a login feature is to be implemented, a feature branch must be created.

#### Task

The Task Branch will act as the child branch of the Feature Branch to which content can be added. Different goals MUST be spread across other Task Branches. Once the goal is met, branches will be merged into the feature branch via an approved Pull Request (PR). For example:
* Task 1: Create a Login button - Once completed and the PR is approved, this will be merged into the 'feature-login' branch
* Task 2: Change the font size on the login screen - Once completed and the PR is approved, this will also be merged into the 'feature-login' branch. 