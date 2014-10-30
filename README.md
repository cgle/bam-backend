bam-backend
===========

##Installation:
1. clone origin/develop branch
2. npm install
3. node server.js
4. go to http://localhost:8080

Make sure you have node, mongodb

##Branches Info:
* origin/master: master branch, to be deployed on AWS
* origin/develop: develop branch, pull this to get latest dev repo, to run local
* feature/*: create your own feature branches by "git checkout develop, git pull origin develop, git checkout -b feature/your-branch-name" to develop feature. When done, add/commit/push to corresponding feature/ branch and pull request for peer code review
* hotfix/*: create your own hotfix branch by "git checkout master, git pull origin master, git checkout out -b hotfix/your-branch-name". When done, merge master and develop, then push develop and master

##API Endpoints:
1. Authenticate
2. Event
3. User
4. Vote
