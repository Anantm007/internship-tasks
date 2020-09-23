//jshint esversion: 8

const express = require("express");
const router = express.Router();
const { check, validationResult} = require("express-validator/");
const bodyParser = require('body-parser');
const multer = require("multer");
const fs = require("fs");

const multerConf = {
  storage: multer.diskStorage({
    destination: function(req, file, next)
    {
      next(null,"./public/images");
    },

    filename: function(req, file, next)
    {
      const ext = file.mimetype.split("/")[1];
      next(null, file.fieldname + '-' + Date.now()+ "." + ext);
    }
  }),

  fileFilter: function(req, file, next)
  {
    if(!file)
    {
      next();
    }

    const image = file.mimetype.startsWith("image/");

    if(image)
    {
      next(null, true);
    }
    else
    {
      next({message: "File type not supported"}, false);
    }
  }
};


router.use(bodyParser());

const Product = require("../../models/Product");

// @route   POST api/upload
// @desc    Register product details
router.post('/', [ multer(multerConf).single("imageUrl"),
[
  // Checks on various fields
check('category', 'category is required')
  .not()
  .isEmpty(),

  check('name', 'name is required')
  .not()
  .isEmpty(),

check('brand', 'brand is required')
  .not()
  .isEmpty(),

check('price', 'price is required')
  .not()
  .isEmpty(),

  check('discount', 'discount is required')
    .not()
    .isEmpty(),

check('in_stock', 'true or false is required')
  .not()
  .isEmpty()
  ]
],


// async callback function
async (req, res) => {

if(req.file)
{
  req.body.imageUrl = req.file;
}


const errors = validationResult(req);

  if(!errors.isEmpty())
  {
    return res.status(400).json({ errors: errors.array() });
  }


  const {category, name, brand, price, discount, in_stock, imageUrl} = req.body;

//  console.log(req.body.imageUrl);

  try {

    // Create new instance of product
    product = new Product({
      category,
      name,
      brand,
      price,
      discount,
      in_stock,
      //imageUrl: req.body.imageUrl
  });

  product.imageUrl.data = fs.readFileSync(req.file.path);
  product.imageUrl.contentType = "image/png";
  // product.imageUrl.data = fsreq.body.imageUrl;
  console.log(product.imageUrl);

// Saving product to the Database
    await product.save();

    res.send("Registered");
  }

  catch(err)
  {
    console.log(err.message);
    res.status(500).send("server error");
  }


});


// @route    GET api/products
// @desc     Get all products

router.get("/", async(req, res) => {

  try
  {
      const posts = await Post.find().sort({ date: -1});
      res.json(posts);
  }

  catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
