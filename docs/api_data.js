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
            "description": "<p>Only Accept <code>application/json</code>.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Body": [
          {
            "group": "Body",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>Username of the user to sign in, must be Alphanumeric.</p>"
          },
          {
            "group": "Body",
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
            "description": "<p>Error Message from backend.</p>"
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
        "content": "curl -b cookie.txt -c cookie.txt localhost:3000/signout/",
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
    "title": "Register a new account",
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
            "description": "<p>Only Accept <code>application/json</code>.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Body": [
          {
            "group": "Body",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>New User Username, must be Alphanumeric.</p>"
          },
          {
            "group": "Body",
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
            "description": "<p>Error Message from backend.</p>"
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
    "url": "/api/search?username=:username&page=:page",
    "title": "Search Users",
    "name": "Search_Users_by_Username",
    "group": "Search",
    "examples": [
      {
        "title": "Example Usage:",
        "content": "curl -b cookie.txt -c cookie.txt localhost:3000/api/search/?username=alice&page=0",
        "type": "curl"
      }
    ],
    "parameter": {
      "fields": {
        "Query": [
          {
            "group": "Query",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>username regex to search.</p>"
          },
          {
            "group": "Query",
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
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "backend/controllers/searchController.js",
    "groupTitle": "Search"
  }
] });
