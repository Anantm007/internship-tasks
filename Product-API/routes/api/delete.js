//jshint esversion: 8

const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');
const Product = require("../../models/Product");
const Deleted = require("../../models/Deleted");


router.use(bodyParser());

router.delete("/:id", async(req, res) =>
{
let product = await Product.findById({_id: req.params.id});
productd = new Deleted({
  old_id: req.params.id,
  category: product.category,
  name: product.name,
  price: product.price,
  discount: product.discount,
  in_stock: product.in_stock,
  brand: product.brand,
  imageUrl: product.imageUrl
});

  // Saving product to the Database
await productd.save();

  // Adding to the recovery database
  Product.remove({_id: req.params.id}, (err) => {
    if(err)
    console.log(er.message);

    else
    res.send("Successfully deleted");
  });
});


module.exports = router;
