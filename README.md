
# Inventory Management App Backend

This is the backend for Stockflow - a full-stack Inventory Management Application.


## Tech Stack


**Server:** Node, Express

**Database:** MongoDB

**Third-Party:** mongoose, multer, cloudinary, jsonwebtoken, bcrypt, cors, cookie-parser
## Features

- RESTfull API made with Node and Express
- CRUD Operations on models like user and product
- Authentication and Authorization using jsonwebtokens and cookies
- Images received and stored via multer and coudinary


## Lessons Learned

I have learned a lot of things while building this project especially working with jsonwebtokens and cookies. I became familier with the concept of access and refresh tokens and how to keep user data secure with cookies. I have also learned about mongoose and mongoDB and got used to designing and creating database models.
Overall, I can now build robust RESTfull backend systems with ease. This project inspired to work more on backend projects.
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DATABASE_URI`

`PORT`

`CORS_ORIGIN`

`ACCESS_TOKEN_SECRET`

`REFRESH_TOKEN_SECRET`

`ACCESS_TOKEN_EXPIRY`

`REFRESH_TOKEN_EXPIRY`

`CLOUD_NAME`

`API_KEY`

`API_SECRET`
## Run Locally

Clone the project

```bash
  git clone https://github.com/S-jenishPatel/Stockflow-Backend.git
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```


## Author

- [@Jenish Patel](https://github.com/S-jenishPatel)

