
# News Aggregator

## Installation

1. Clone the Clone the repository:

```bash
  git clone 
```

2. Navigate to the project directory:

```bash
  cd [project_directory_name]
```

3. Install the required dependencies:

```bash
  npm install
```

4. Start the server:

```bash
  npm run start:dev
```

The server will start on the default port 3000.

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`JWT_SECRET`
`NEWS_API_KEY`

## API Reference

All the APIs have the prefix

```http
  /api/v1
```

### Health Check

```http
  GET /hello
```

| Parameter | Type     | Description                | Response |
| :-------- | :------- | :------------------------- | ---------|
|  |  |  | Hello World! |

### Auth

#### Register User

```http
  POST /user/register
```

Request Body

```http
{
  "user": {
    "username": "your_username",
    "password": "your_password",
    "email": "your_email@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

Response:

```http
{
    "message": "User logged in successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InlhdGhpc2hyYW1hbXVydGh5IiwiaWF0IjoxNjk2OTU5MzY4LCJleHAiOjE2OTY5NjI5Njh9.OljtuU2xNCt8KZEyLLq0X9krWLl9HRAHBFlL_qy2mQ0",
    "user": {
        "id": "dfef2a8c-6125-4dab-baf9-35822d9efc72",
        "username": "yathishramamurthy",
        "email": "123yathish@gmail.com",
        "firstName": "yathish",
        "lastName": "ramamurthy",
        "preferences": [],
        "favorites": [],
        "read": [],
        "created_at": "2023-10-10T17:35:59.029Z",
        "last_login": "2023-10-10T17:35:59.029Z"
    }
}
```

#### Login User

```http
  POST /user/login
```

```http
{
  "user": {
    "username": "your_username",
    "password": "your_password"
  }
}
```

Response:

```http
{
    "message": "User logged in successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InlhdGhpc2hyYW1hbXVydGh5IiwiaWF0IjoxNjk2OTU5MzY4LCJleHAiOjE2OTY5NjI5Njh9.OljtuU2xNCt8KZEyLLq0X9krWLl9HRAHBFlL_qy2mQ0",
    "user": {
        "id": "dfef2a8c-6125-4dab-baf9-35822d9efc72",
        "username": "yathishramamurthy",
        "email": "123yathish@gmail.com",
        "firstName": "yathish",
        "lastName": "ramamurthy",
        "preferences": [],
        "favorites": [],
        "read": [],
        "created_at": "2023-10-10T17:35:59.029Z",
        "last_login": "2023-10-10T17:35:59.029Z"
    }
}
```

### News API

#### Get News For User Preference

```http
  GET /news
```

JWT Token as Auth Header

Response:

```http
{
  "message": "News retrieved successfully",
  "data": {
    "news": {
      "technology": [
        // List of articles for the "technology" preference
      ],
      "sports": [
        // List of articles for the "sports" preference
      ],
      "science": [
        // List of articles for the "science" preference
      ]
    }
  }
}

```

#### Get Preferences of the user

```http
  GET /news/prefernece
```

Response:

```http
{
    "message": "Preferences retrieved successfully",
    "data": {
        "preferences": [
            "twitter"
        ]
    }
}
```

#### Update Preference of users

```http
  PUT /news/preferences
```

Request

```http
{
    "preferences": [
        "bitcoin"
    ]
}
```

Response:

```http
{
    "message": "Preferences updated successfully",
    "data": {
        "preferences": [
            "twitter", "bitcoint"
        ]
    }
}
```

#### Search News

```http
  GET /news/:search
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `search`      | `string` | **Required**. search param |

Response:

```http
{
  "message": "News retrieved successfully",
  "data": {
    "news": [{
    
    }]
  }
}
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
