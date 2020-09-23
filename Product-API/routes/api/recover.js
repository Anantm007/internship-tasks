//jshint esversion: 8

const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');
const Product = require("../../models/Product");
const Deleted = require("../../models/Deleted");


router.use(bodyParser());

router.post("/:id", async(req, res) =>
{
  try
  {
    let product = await Deleted.findById({_id: req.params.id});
    console.log(product.name);

    productd = new Product({
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

      res.send(productd);

  }

  catch(err)
  {
    res.send(err.message);
  }
})

.delete("/:id", (req, res) => {

      Deleted.remove({_id: req.params.id}, (err) => {
        if(err)
        console.log(er.message);

        else
        res.send("Successfully deletd");
      });

});

module.exports = router;
