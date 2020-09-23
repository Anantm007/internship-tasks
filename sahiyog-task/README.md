# SIGNUP/SIGNIN PORTAL FOR SAHIYOG-TECHNOLOGIES

## Project Setup
```javascript
1. Clone the repo
2. cd sahiyog-task
3. npm install
4. make a .env file with the following keys: MONGOURI, JWTSECRET, CAPTCHASECRETKEY
5. npm run dev
6. Open the project on 127.0.0.1:5000
```

## Tech Stack:
* Node.js
* Express.js
* MongoDB
* EJS Templating Engine (with Bootstrap 4.1 and CSS)
* Dependencies - bcryptjs, body-parser, dotenv, ejs, express, express-validator, jsonwebtoken, mongoose, morgan, node-fetch

## Features
1. User Signup
2. User Signin
3. Change Password after signing in
5. Logout 
6. Google Re-captcha for signup
7. json web tokens for authentication
8. bcrypt to hash sensitive information
9. morgan to check app logs
10. Segregation into models and routes (MVC model)
11. EJS engine for frontend

## Missing Functionalities:
1. Google Signup/Signin (OAuth 2.0)
2. Emails (using Nodemailer) for forgot password, welcome and user updated. 
