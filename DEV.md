## 📑 Table of Contents
**[🖥️ Github Work Flow](#%EF%B8%8F-github-work-flow)**<br>
&nbsp;&nbsp;&nbsp;*[Branch Conventions](#Branch-Conventions)*<br>
&nbsp;&nbsp;&nbsp;*[Creating a new branch](#Creating-a-new-branch)*<br>
&nbsp;&nbsp;&nbsp;*[Rebasing a branch to get latest main updates](#Rebasing-a-branch-to-get-latest-main-updates)*<br>

## 🖥️ Github Work Flow
When working on a feature (such as login for instance), you should not be working directly in main. You should make a new branch and work on it there. Once it is completed and you are happy with it, you then open a merge request and merge it to main. If you are not completely confident, you can get another team member to review it. 

### Branch Conventions
When working on a **feature** you should create a new branch with the following convention:
- feature/branch-name<br>

When working on a **fix** you should create a new branch with the following convention:
- fix/branch-name

> __Unless you are making a core change, you should never directly commit to main!!__

### Creating a new branch
- Open a bash terminal in the code base and run `git fetch --all`
- If you are not in main run `git checkout main`. If you are, ignore this step. 
- Run `git reset --hard origin/main` to get the latest version of main locally
- Run `git checkout -b "feature/BRANCH-NAME"` to create and go to your new branch. 
- Done! Do all your feature in this branch

### Rebasing a branch to get latest main updates
In the event you have been working on a feature and main has had changes since, you should rebase your branch to incorportate the changes of main in your branch.
- Open a bash terminal in the code base and run `git fetch --all`
- If you are not in main run `git checkout main`. If you are, ignore this step. 
- Run `git reset --hard origin/main` to get the latest version of main locally
- Run `git checkout "feature/BRANCH-NAME"` and go to the branch you want to rebase
- Run `git rebase origin/main` and follow the steps accepting incoming or current changes based on what you need
- Once done, run `git push --force` to complete the rebase!