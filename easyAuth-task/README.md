# Product API for easyAuth-task

## Project Setup
```javascript
1. Clone the repo
2. cd easyAuth-task
3. npm install
4. make a .env file with the following keys: MONGOURI
5. npm run dev
6. Open the project on 127.0.0.1:3000
```

## Tech Stack:
* Node.js
* Express.js
* MongoDB
* Dependencies - body-parser, dotenv, express, express-validator, mongoose, morgan

## Features
1. Product Creation Signup (POST /api/products)
2. Add a review for a product (POST /api/products/reviews/:productId)
3. Get all products (GET /api/products)
5. Get a specific product (GET /api/products/:productId)
6. Update Product (PUT /api/products/:productId)
7. Delete Product (DELETE /api/products/:productId)
