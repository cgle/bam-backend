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

##Tech stack
1. Backend: nodeJS
  - Server: AWS EC2
  - Redis: AWS ElastiCache or RedisLabs
  - MongoDB: MongoLabs

2. Frontend: AngularJS, iOS, Android

##Models:
1. User
  - username
  - password
  - fullname
  - phone
  - email
  - createdAt //auto generated
  - birthyear
  - profile pic //not yet working
  - zip
  - current_pos: {lng, lat}
  - address
  - created_events
  - attended_events
  - cohosted_events
2. Event
  - name
  - address
  - user_id //event creator id
  - address
  - createdAt //auto generated
  - updatedAt //auto generated
  - description
  - pos: {lng, lat}
  - zip
  - public: true/false //whether events are open to public
  - upvotes
  - downvotes
  - categories: []
  - cohosts: []
  - attendants: []
3. Vote
  - event_id
  - user_id
  - is_upvote: true/false
  - createdAt //auto generated
  - updatedAt //auto generated
4. Comment
  - event_id
  - user_id
  - comment
  - createdAt //auto generated
  - updatedAt //auto generated

##API Endpoints:
1. Authenticate:
  - POST `/api/authenticate/register`: register new user
    ```
    $.ajax({
      url: '/api/authenticate/register',
      data: {
        username: 'test',
        password: 'test',
        email: '',
        fullname: '',
        ....
      },
      type: 'post',
      success: function(data) {
        //success callback
      },
      error: function(err) {
        //error callback
      }
    });

    ```
  - POST `/api/authenticate/login`: log user in
    ```
    $.ajax({
      url: '/api/authenticate/login',
      data: {
        username: 'test',
        password: 'test'
      },
      type: 'post',
      success: function(data) {
        //success callback
      },
      error: function(err) {
        //error callback
      }
    });

    ```
  - GET `/api/authenticate/loggedin`: test if current user is logged in
    only works on browser using cookie
      ```
    $.ajax({
      url: '/api/authenticate/loggedin',
      type: 'get',
      success: function(data) {
        //success callback
      },
      error: function(err) {
        //error callback
      }
    });

    ```
  - POST `/api/authenticate/logout`: log user out
    ```
    $.ajax({
      url: '/api/authenticate/logout',
      headers: {
        "Authorization": "Bearer ACCESS_TOKEN"
      }, //IMPORTANT: ACCESS TOKEN IS REQUIRED TO LOGOUT
      type: 'post',
      success: function(data) {
        //success callback
      },
      error: function(err) {
        //error callback
      }
    });

    ```

2. Event:
  - GET `/api/events`: get events, with or without query string. If query includes `lat` and `lng`, return events within `distance`, by default 100 m.
      ```
    $.ajax({
      url: '/api/events' + QUERY_STRING, //not required
      type: 'get',
      success: function(data) {
        //success callback
      },
      error: function(err) {
        //error callback
      }
    });

    ```
  - GET `/api/events/:event_id`: return event by event_id
  - POST `/api/events`: create new event
    ```
    $.ajax({
      url: '/api/authenticate/events',
      type: 'post',
      headers: {
        "Authorization": "Bearer ACCESS_TOKEN"
      }, //IMPORTANT: ACCESS TOKEN IS REQUIRED TO POST/PUT EVENT
      data: {
        name: 'dollhouse winter ball party',
        pos: {
          lng: 12.23, //required, by default 0.0
          lat: 20.22 //required, by default 0.0
        },
        ...
      },
      success: function(data) {
        //success callback
      },
      error: function(err) {
        //error callback
      }
    });

    ```
  - PUT `/api/events/:event_id`: update event by event_id

3. User
  - GET `/api/users`: return users with query or all users
  - GET `/api/users/:user_id`: return user by user_id
  - PUT `/api/users/:user_id`: update user profile
    ```
    $.ajax({
      url: '/api/users/:user_id',
      type: 'put',
      headers: {
        "Authorization": "Bearer ACCESS_TOKEN"
      }, //IMPORTANT: ACCESS TOKEN IS REQUIRED TO POST/PUT USER PROFILE
      data: {
        fullname: 'dollhouse winter ball party',
        ...
      },
      success: function(data) {
        //success callback
      },
      error: function(err) {
        //error callback
      }
    });


4. Vote //REQUIRE ACCESS TOKEN TO POST/PUT VOTES
  - GET `/api/events/:event_id/votes`: return all votes given event_id, can query by user_id
  - GET `/api/users/:user_id/votes`: return all votes given user_id
  - POST `/api/events/:event_id/votes`: create new vote
  - PUT `/api/events/:event_id/votes/:vote_id`: update vote

5. Comment //REQUIRE ACCESS TOKEN TO POST/PUT COMMENTS
  - GET `/api/events/:event_id/comments`: return all comments for event_id
  - GET `/api/users/:user_id/comments`: return all comments for user_id
  - POST `/api/events/:event_id/comments`: create new comment
  - PUT `/api/events/:event_id/comments/:comment_id`: update comment
  - DELETE `/api/events/:event_id/comments/:comment_id`: delete comment


