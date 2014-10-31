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
1. Authenticate:
  - POST `/api/authenticate/register`: register new user
  - POST `/api/authenticate/login`: log user in
  - GET `/api/authenticate/loggedin`: test if current user is logged in
  - POST `/api/authenticate/logout: log user out

2. Event:
  - GET `/api/events`: get events, with or without query string. If query includes `lat` and `lng`, return events within `distance`, by default 100 m.
  - GET `/api/events/:event_id`: return event by event_id
  - POST `/api/events`: create new event
  - PUT `/api/events/:event_id`: update event by event_id

3. User
  - GET `/api/users`: return users with query or all users
  - PUT `/api/users/:user_id`: update user profile

4. Vote
  - GET `/api/events/:event_id/votes`: return all votes given event_id, can query by user_id
  - GET `/api/users/:user_id/votes`: return all votes given user_id
  - POST `/api/events/:event_id/votes`: create new vote
  - PUT `/api/events/:event_id/votes/:vote_id`: update vote

5. Comment
  - GET `/api/events/:event_id/comments`: return all comments for event_id
  - GET `/api/users/:user_id/comments`: return all comments for user_id
  - POST `/api/events/:event_id/comments`: create new comment
  - PUT `/api/events/:event_id/comments/:comment_id`: update comment
  - DELETE `/api/events/:event_id/comments/:comment_id`: delete comment
