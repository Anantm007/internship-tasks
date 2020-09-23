# Product-API

This is an API to upload, update and delete product details for an e-commerce website.

### To run this API :
1. npm install
2. nodemon server.js

### There are 2 database schemas : 
1. Product.js : It consists of :-
* category - String
* name - String
* brand - String
* Price: Number
* discount: Number
* in_stock: Boolean
* imageUrl - Object
Database name : "products"
A Unique ID is generated in the database for the product

2. Deleted.js : It consists of :-
* old_id : Number
** All other fields are same as Product schema
Database name: "deleteds"

#### The databases are currently connected to my personal MongoDB cloud account. Change it in the config folder.
### The API broadly consists of 5 parts: 

• Uploading a product ( creating a new product)
• Updating a product ( using the product id)
• Listing all products
• Deleting a product ( adding the item into a new collection called "deleteds" for recovery and deleting from the original "products" database) 
• Recovering a product (Adding the product from "deleteds" to the original "products" database).

### Routes : 

• upload.js - This route makes a POST request to upload a new product after taking all the necessary information(checks applied) from the user. A unique id is generated in the database and the product is added into the "products" collection.

• products.js - This route makes a GET request to the "products" database to display all the records.

• update.js - This route makes a POST request to update a product (Either all or only specific fields). To access this route we need the product's unique id from the database.

• delete.js - This route makes a DELETE request deleting the product from the "product" database but adding the item into a new collection called "deleteds" for future recovery. We need the id to access this route.

• recover.js - Makes a POST request to add the back the product from "deleteds" to the original "products" database. We need the id to access this route.
