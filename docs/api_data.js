define({ "api": [
  {
    "type": "post",
    "url": "/signin",
    "title": "User Sign In",
    "name": "Sign_In",
    "group": "Auth",
    "examples": [
      {
        "title": "Example Usage:",
        "content": "curl -H \"Content-Type: application/json\" -X POST -d '{\"username\":\"alice\",\"password\":\"alice\"}' -c cookie.txt localhost:5000/signin/",
        "type": "curl"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>Must be <code>application/json</code>.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Request Body": [
          {
            "group": "Request Body",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>Username of the user to sign in, must be Alphanumeric.</p>"
          },
          {
            "group": "Request Body",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Password of the user to sign in.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "success",
            "description": "<p>user {username} signed in</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": \"user {username} signed up\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 400": [
          {
            "group": "Error 400",
            "optional": false,
            "field": "BadFormat",
            "description": "<p>Username is not Alphanumeric</p>"
          }
        ],
        "Error 401": [
          {
            "group": "Error 401",
            "optional": false,
            "field": "AccessDeny",
            "description": "<p>Wrong Username/Password.</p>"
          }
        ],
        "Error 500": [
          {
            "group": "Error 500",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Error from backend.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "backend/controllers/authController.js",
    "groupTitle": "Auth"
  },
  {
    "type": "get",
    "url": "/signout",
    "title": "User Sign Out",
    "name": "Sign_Out",
    "group": "Auth",
    "examples": [
      {
        "title": "Example Usage:",
        "content": "curl -b cookie.txt -c cookie.txt localhost:5000/signout/",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "success",
            "description": "<p>user {username} signed out</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": \"user {username} signed out\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "backend/controllers/authController.js",
    "groupTitle": "Auth"
  },
  {
    "type": "post",
    "url": "/signup",
    "title": "New User Sign Up",
    "name": "Sign_Up",
    "group": "Auth",
    "examples": [
      {
        "title": "Example Usage:",
        "content": "curl -H \"Content-Type: application/json\" -X POST -d '{\"username\":\"alice\",\"password\":\"alice\"}' -c cookie.txt localhost:5000/signup/",
        "type": "curl"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>Must be <code>application/json</code>.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Request Body": [
          {
            "group": "Request Body",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>New User Username, must be Alphanumeric.</p>"
          },
          {
            "group": "Request Body",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>New User Password.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "success",
            "description": "<p>user {username} signed up</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": \"user {username} signed up\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 400": [
          {
            "group": "Error 400",
            "optional": false,
            "field": "BadFormat",
            "description": "<p>Username is not Alphanumeric</p>"
          }
        ],
        "Error 409": [
          {
            "group": "Error 409",
            "optional": false,
            "field": "UsernameUsed",
            "description": "<p>The Username has been used by others.</p>"
          }
        ],
        "Error 500": [
          {
            "group": "Error 500",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Error from backend.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "backend/controllers/authController.js",
    "groupTitle": "Auth"
  },
  {
    "type": "post",
    "url": "/api/posts",
    "title": "Create a new Post",
    "name": "Create_Post",
    "group": "Posts",
    "examples": [
      {
        "title": "Example Usage:",
        "content": "curl -b cookie.txt -c cookie.txt -F \"title=hello\" -F \"description=My New Post!\" -F \"pictures=@hello.jpg\" localhost:5000/api/posts",
        "type": "curl"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>Must be <code>multipart/form-data</code>.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Form Data": [
          {
            "group": "Form Data",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>Title of the post, no more than <code>30</code> chars.</p>"
          },
          {
            "group": "Form Data",
            "type": "Integer",
            "optional": false,
            "field": "description",
            "description": "<p>The content of the post, no more than <code>200</code> chars.</p>"
          },
          {
            "group": "Form Data",
            "type": "Files",
            "optional": false,
            "field": "pictures",
            "description": "<p>An array of Post pictures, accepted Format: <code>.jpeg/.jpg/.png/.gif</code> and no more than <code>9</code> pictures.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>The id of the post</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"_id\": \"jed5672jd90xfffsdg4wo\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 400": [
          {
            "group": "Error 400",
            "optional": false,
            "field": "BadFormat",
            "description": "<p>title/description/pictures has the wrong format.</p>"
          }
        ],
        "Error 401": [
          {
            "group": "Error 401",
            "optional": false,
            "field": "AccessDeny",
            "description": "<p>Not Log In.</p>"
          }
        ],
        "Error 500": [
          {
            "group": "Error 500",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Error from backend.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "backend/controllers/postController.js",
    "groupTitle": "Posts"
  },
  {
    "type": "delete",
    "url": "/api/posts/:id/",
    "title": "Delete a Post By Post id",
    "name": "Delete_a_Post",
    "group": "Posts",
    "description": "<p>Delete a Post by it's id, if success, empty response with status code <code>200</code>. Otherwise, response is error message with corresponding error message</p>",
    "examples": [
      {
        "title": "Example Usage:",
        "content": "curl -x DELETE -b cookie.txt -c cookie.txt localhost:5000/api/posts/jed5672jd90xfffsdg4wk/",
        "type": "curl"
      }
    ],
    "parameter": {
      "fields": {
        "Path Params": [
          {
            "group": "Path Params",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The unique id of the post to delete</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "empty"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 400": [
          {
            "group": "Error 400",
            "optional": false,
            "field": "BadFormat",
            "description": "<p>Request Query has the wrong format.</p>"
          }
        ],
        "Error 401": [
          {
            "group": "Error 401",
            "optional": false,
            "field": "AccessDeny",
            "description": "<p>Not Log In.</p>"
          }
        ],
        "Error 403": [
          {
            "group": "Error 403",
            "optional": false,
            "field": "AccessForbidden",
            "description": "<p>Not the post owner.</p>"
          }
        ],
        "Error 404": [
          {
            "group": "Error 404",
            "optional": false,
            "field": "NotFind",
            "description": "<p>Not Image or Post in the path.</p>"
          }
        ],
        "Error 500": [
          {
            "group": "Error 500",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Error from backend.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "backend/controllers/postController.js",
    "groupTitle": "Posts"
  },
  {
    "type": "get",
    "url": "/api/posts/:id/",
    "title": "Get Post By Post id",
    "name": "Get_Post_by_Post_id",
    "group": "Posts",
    "examples": [
      {
        "title": "Example Usage:",
        "content": "curl -b cookie.txt -c cookie.txt localhost:5000/api/posts/jed5672jd90xfffsdg4wo/",
        "type": "curl"
      }
    ],
    "parameter": {
      "fields": {
        "Path Params": [
          {
            "group": "Path Params",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The unique id of the post</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "String": [
          {
            "group": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>The unique id of the post</p>"
          }
        ],
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>The title of the post</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "dis",
            "description": "<p>The description of the post</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "pictureCounts",
            "description": "<p>The number of the pictures this post has</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "time",
            "description": "<p>The time of post creation</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"_id\": \"jed5672jd90xfffsdg4wo\",\n  \"title\": \"Hello\",\n  \"dis\": \"This is my first post\",\n  \"pictureCounts\": 2,\n  \"time\": 1586391820095\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 400": [
          {
            "group": "Error 400",
            "optional": false,
            "field": "BadFormat",
            "description": "<p>Path Params id has the wrong format.</p>"
          }
        ],
        "Error 401": [
          {
            "group": "Error 401",
            "optional": false,
            "field": "AccessDeny",
            "description": "<p>Not Log In.</p>"
          }
        ],
        "Error 403": [
          {
            "group": "Error 403",
            "optional": false,
            "field": "AccessForbidden",
            "description": "<p>Not the post owner or the owner's follower</p>"
          }
        ],
        "Error 404": [
          {
            "group": "Error 404",
            "optional": false,
            "field": "NotFind",
            "description": "<p>Not find post with such id</p>"
          }
        ],
        "Error 500": [
          {
            "group": "Error 500",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Error from backend.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "backend/controllers/postController.js",
    "groupTitle": "Posts"
  },
  {
    "type": "get",
    "url": "/api/posts/?username=:username&page=:page",
    "title": "Get Posts By username",
    "name": "Get_Posts_of_some_user",
    "group": "Posts",
    "examples": [
      {
        "title": "Example Usage:",
        "content": "curl -b cookie.txt -c cookie.txt localhost:5000/api/posts/?username=Alice&page=0",
        "type": "curl"
      }
    ],
    "parameter": {
      "fields": {
        "Request Query": [
          {
            "group": "Request Query",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>The username of the posts owner, can only be user himself or the user's fpllowing</p>"
          },
          {
            "group": "Request Query",
            "type": "Integer",
            "optional": false,
            "field": "page",
            "description": "<p>The Page number of the posts to display, each page has at most <code>10</code> posts</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Objects[]",
            "optional": false,
            "field": "posts",
            "description": "<p>Array of the posts created by the user. The latest posts come first</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "posts.title",
            "description": "<p>The title of the post</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "posts.dis",
            "description": "<p>The description of the post</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "posts.pictureCounts",
            "description": "<p>The number of the pictures this post has</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "posts.time",
            "description": "<p>The time of post creation</p>"
          }
        ],
        "String": [
          {
            "group": "String",
            "optional": false,
            "field": "posts._id",
            "description": "<p>The unique id of the post</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " HTTP/1.1 200 OK\n [\n  {\n      \"_id\": \"jed5672jd90xfffsdg4wo\",\n      \"title\": \"Hello\",\n      \"dis\": \"This is my first post\",\n      \"pictureCounts\": 2,\n      \"time\": 1586391820095\n  },\n  {\n      \"_id\": \"jed5672jd90xfffsdg4wo\",\n      \"title\": \"Good Morning\",\n      \"dis\": \"This is my second post\",\n      \"pictureCounts\": 2,\n      \"time\": 1586391820095\n  }\n]",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 400": [
          {
            "group": "Error 400",
            "optional": false,
            "field": "BadFormat",
            "description": "<p>Request Query has the wrong format.</p>"
          }
        ],
        "Error 401": [
          {
            "group": "Error 401",
            "optional": false,
            "field": "AccessDeny",
            "description": "<p>Not Log In.</p>"
          }
        ],
        "Error 403": [
          {
            "group": "Error 403",
            "optional": false,
            "field": "AccessForbidden",
            "description": "<p>Not the post owner or the owner's follower</p>"
          }
        ],
        "Error 404": [
          {
            "group": "Error 404",
            "optional": false,
            "field": "NotFind",
            "description": "<p>Not find user of the username</p>"
          }
        ],
        "Error 500": [
          {
            "group": "Error 500",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Error from backend.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "backend/controllers/postController.js",
    "groupTitle": "Posts"
  },
  {
    "type": "get",
    "url": "/api/posts/:id/images/:image_index/",
    "title": "Get the picture of the post",
    "name": "Get_the_picture_of_the_post",
    "group": "Posts",
    "description": "<p>Get the picture of the post by it's index, if success, a image file will be sent. Otherwise, response is error message with corresponding error message.</p>",
    "examples": [
      {
        "title": "Example Usage:",
        "content": "curl -b cookie.txt -c cookie.txt localhost:5000/api/posts/jed5672jd90xfffsdg4wk/images/0/",
        "type": "curl"
      }
    ],
    "parameter": {
      "fields": {
        "Path Params": [
          {
            "group": "Path Params",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The unique id of the post</p>"
          },
          {
            "group": "Path Params",
            "type": "String",
            "optional": false,
            "field": "image_index",
            "description": "<p>The index of the picture, to indicate which image to get, max value decided by <code>posts.pictureCounts</code></p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "BinaryFile",
            "optional": false,
            "field": "image",
            "description": "<p>The binary of the image file, the format <code>Content-Type</code> is in response header.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\nContent-Type: images/jpeg",
          "type": "BinaryFile"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 400": [
          {
            "group": "Error 400",
            "optional": false,
            "field": "BadFormat",
            "description": "<p>Request Query has the wrong format.</p>"
          }
        ],
        "Error 401": [
          {
            "group": "Error 401",
            "optional": false,
            "field": "AccessDeny",
            "description": "<p>Not Log In.</p>"
          }
        ],
        "Error 403": [
          {
            "group": "Error 403",
            "optional": false,
            "field": "AccessForbidden",
            "description": "<p>Not the post owner or the owner's follower.</p>"
          }
        ],
        "Error 404": [
          {
            "group": "Error 404",
            "optional": false,
            "field": "NotFind",
            "description": "<p>Not find Image or Post in the path.</p>"
          }
        ],
        "Error 500": [
          {
            "group": "Error 500",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Error from backend.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "backend/controllers/postController.js",
    "groupTitle": "Posts"
  },
  {
    "type": "get",
    "url": "/api/posts/following/?page=:page",
    "title": "Get the posts of following",
    "name": "See_the_all_the_posts_created_by_user's_following",
    "group": "Posts",
    "description": "<p>Get the posts of following, if success, a list of posts sliced by page number will be sent back. Otherwise, response is error message with corresponding error message.</p>",
    "examples": [
      {
        "title": "Example Usage:",
        "content": "curl -b cookie.txt -c cookie.txt localhost:5000/api/posts/following/?page=0",
        "type": "curl"
      }
    ],
    "parameter": {
      "fields": {
        "Request Query": [
          {
            "group": "Request Query",
            "type": "Integer",
            "optional": false,
            "field": "page",
            "description": "<p>The Page number of the posts to display, each page has at most <code>10</code> posts</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Objects[]",
            "optional": false,
            "field": "posts",
            "description": "<p>Array of the posts created by the user. The latest posts come first</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "posts.title",
            "description": "<p>The title of the post</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "posts.dis",
            "description": "<p>The description of the post</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "posts.pictureCounts",
            "description": "<p>The number of the pictures this post has</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "posts.time",
            "description": "<p>The time of post creation</p>"
          }
        ],
        "String": [
          {
            "group": "String",
            "optional": false,
            "field": "posts._id",
            "description": "<p>The unique id of the post</p>"
          },
          {
            "group": "String",
            "optional": false,
            "field": "posts.username",
            "description": "<p>The creator of the post</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " HTTP/1.1 200 OK\n [\n  {\n      \"_id\": \"jed5672jd90xfffsdg4wo\",\n      \"title\": \"What a nice day\",\n      \"username\": \"Leo11\"\n      \"dis\": \"How are you?\",\n      \"pictureCounts\": 7,\n      \"time\": 1586391820095\n  },\n  {\n      \"_id\": \"jed5672jd90xfffsdg4wk\",\n      \"title\": \"Good Morning\",\n      \"username\": \"Flydog\"\n      \"dis\": \"Looks delicious\",\n      \"pictureCounts\": 1,\n      \"time\": 1586391820033\n  }\n]",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 400": [
          {
            "group": "Error 400",
            "optional": false,
            "field": "BadFormat",
            "description": "<p>Request Query has the wrong format.</p>"
          }
        ],
        "Error 401": [
          {
            "group": "Error 401",
            "optional": false,
            "field": "AccessDeny",
            "description": "<p>Not Log In.</p>"
          }
        ],
        "Error 500": [
          {
            "group": "Error 500",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Error from backend.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "backend/controllers/postController.js",
    "groupTitle": "Posts"
  },
  {
    "type": "get",
    "url": "/api/profile?username=:username",
    "title": "Get User Profile",
    "name": "Get_User_Profile_by_Post_id",
    "group": "Profile",
    "examples": [
      {
        "title": "Example Usage:",
        "content": "curl -b cookie.txt -c cookie.txt localhost:5000/api/profile/?username=alice",
        "type": "curl"
      }
    ],
    "parameter": {
      "fields": {
        "Request Query": [
          {
            "group": "Request Query",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The unique id of the user, must be Alphanumeric.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "String": [
          {
            "group": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>The unique id of the user.</p>"
          }
        ],
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "following_ids",
            "description": "<p>The list of the username followed by this user</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "follower_ids",
            "description": "<p>The list of the username who follows this user</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "post_counts",
            "description": "<p>The number of the post created by this user</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"_id\": \"FlyDog\",\n  \"following_ids\": [\"Hello\", \"Leo123\", \"bill\"],\n  \"follower_ids\": [\"Keep\", \"thrree\"],\n  \"post_counts\": 11,\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 400": [
          {
            "group": "Error 400",
            "optional": false,
            "field": "BadFormat",
            "description": "<p>Request Query id has the wrong format.</p>"
          }
        ],
        "Error 401": [
          {
            "group": "Error 401",
            "optional": false,
            "field": "AccessDeny",
            "description": "<p>Not Log In.</p>"
          }
        ],
        "Error 404": [
          {
            "group": "Error 404",
            "optional": false,
            "field": "NotFind",
            "description": "<p>Not find user with such username</p>"
          }
        ],
        "Error 500": [
          {
            "group": "Error 500",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Error from backend.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "backend/controllers/profileController.js",
    "groupTitle": "Profile"
  },
  {
    "type": "get",
    "url": "/api/profile/avatar?username=:username",
    "title": "Get the avatar of the user",
    "name": "Get_the_user's_avatar",
    "group": "Profile",
    "description": "<p>Get the avatar of the user by their's id, if success, a image file will be sent. Otherwise, response is error message with corresponding error message.</p>",
    "examples": [
      {
        "title": "Example Usage:",
        "content": "curl -b cookie.txt -c cookie.txt localhost:5000/api/profile/avatar?username=alice",
        "type": "curl"
      }
    ],
    "parameter": {
      "fields": {
        "Request Query": [
          {
            "group": "Request Query",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>The unique id of the avatar's owner, must be Alphanumeric.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "BinaryFile",
            "optional": false,
            "field": "image",
            "description": "<p>The binary of the image file, the format <code>Content-Type</code> is in response header.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\nContent-Type: images/jpeg",
          "type": "BinaryFile"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 400": [
          {
            "group": "Error 400",
            "optional": false,
            "field": "BadFormat",
            "description": "<p>Request Query has the wrong format.</p>"
          }
        ],
        "Error 401": [
          {
            "group": "Error 401",
            "optional": false,
            "field": "AccessDeny",
            "description": "<p>Not Log In.</p>"
          }
        ],
        "Error 404": [
          {
            "group": "Error 404",
            "optional": false,
            "field": "NotFind",
            "description": "<p>Not find the user in the query.</p>"
          }
        ],
        "Error 500": [
          {
            "group": "Error 500",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Error from backend.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "backend/controllers/profileController.js",
    "groupTitle": "Profile"
  },
  {
    "type": "get",
    "url": "/api/search?username=:username&page=:page",
    "title": "Search Users",
    "name": "Search_Users_by_Username",
    "group": "Search",
    "examples": [
      {
        "title": "Example Usage:",
        "content": "curl -b cookie.txt -c cookie.txt localhost:5000/api/search/?username=alice&page=0",
        "type": "curl"
      }
    ],
    "parameter": {
      "fields": {
        "Request Query": [
          {
            "group": "Request Query",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>username regex to search.</p>"
          },
          {
            "group": "Request Query",
            "type": "Integer",
            "optional": false,
            "field": "page",
            "description": "<p>the page number of the result, Each page has at most 10 result</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "users",
            "description": "<p>Array of User ids that contains the username in request</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"users\": [\"roy\", \"flydog\", \"rockrock\"]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 400": [
          {
            "group": "Error 400",
            "optional": false,
            "field": "BadFormat",
            "description": "<p>Username is not Alphanumeric or page is not an int.</p>"
          }
        ],
        "Error 401": [
          {
            "group": "Error 401",
            "optional": false,
            "field": "AccessDeny",
            "description": "<p>Not Log In.</p>"
          }
        ],
        "Error 500": [
          {
            "group": "Error 500",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Error from backend.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "backend/controllers/searchController.js",
    "groupTitle": "Search"
  }
] });
