define({ "api": [
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
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>New User Username.</p>"
          },
          {
            "group": "Parameter",
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
          "content": "HTTP/1.1 200 OK\n{\n  \"user {username} signed up\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
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
    "filename": "controllers/authController.js",
    "groupTitle": "Auth"
  }
] });
