<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Impulse

## Installation

1. create .env file
2. copy variables from .env.example and paste to .env file
3. make sure the terminal has been opened in the root folder of the project
4. run `docker-compose up -d`

To run migrations do these steps:

1. run `docker exec -it main sh` on Windows or `docker exec -it main bash` on Linux
2. `npm run migration:run`

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## API calls

### POST `http://localhost:3000/api/auth/signup`

Input

``` 
body: {
    "email": "mail@mail.com",
    "password": "123Qq_edwa1"
}
```

Output

```201 Created```

Expected errors

400 Bad Request

```
 "message": [
        "email should not be empty",
        "email must be an email",
        "password should not be empty"
    ],
    "error": "Bad Request",
    "statusCode": 400
```

409 Conflict

```
{
    statusCode: 409,
    message: "User with given email already exists"
}
```

500 Internal Server Error

```
{
    statusCode: 500,
    message: "InternalServerError"
}
```

### POST `http://localhost:3000/api/auth/signin`

Input

``` 
body: {
    "email": "mail@mail.com",
    "password": "123Qq_edwa1"
}
```

Output

```200 OK```

Expected errors

400 Bad Request

```
{
    "message": [
        "email should not be empty",
        "email must be an email",
        "password should not be empty"
    ],
    "error": "Bad Request",
    "statusCode": 400
}
```

401 Unauthorized

```  
{
    "statusCode": 401,
    "message": "Invalid email or password"
}
```

500 Internal Server Error

```
{
    statusCode: 500,
    message: "InternalServerError"
}
```

### POST `http://localhost:3000/api/auth/signout`

Output

```204 No Content```

Expected errors

401 Unauthorized

```  
{
    "message": "Unauthorized"
}
```

500 Internal Server Error

```
{
    statusCode: 500,
    message: "InternalServerError"
}
```

### GET `http://localhost:3000/api/user/mail@mail.com`

Following the authorization process, you acquire the capability to access account-specific information by submitting an
email that was used during signIn/signUp to the URI

Output

200 OK

```
{
    "id": "134d214d-ec8e-41c1-8bf2-f92b7dd0885a",
    "email": "mail@mail.com",
    "password": "$2a$05$RZrIf8UT7h5mJee3qYIEz.T4vR7jxrVrujIexY8pYjku2E7kKBZ7O"
}
```

Expected errors

401 Unauthorized

```  
{
    "message": "Unauthorized"
}
```

404 Not Found

```
{
    "statusCode": 404,
    "message": "User not found"
}
```

429 Too Many Requests

```
{
    "statusCode": 429,
    "message": "ThrottlerException: Too Many Requests"
}
```

500 Internal Server Error

```
{
    statusCode: 500,
    message: "InternalServerError"
}
```

