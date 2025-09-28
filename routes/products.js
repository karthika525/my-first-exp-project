var express = require('express');
var router = express.Router();
const Product = require('../models/productsModel');

router.get('/create_product', (req, res) => {
  res.render('product/create', { error: null });
});

router.post('/create_product', (req, res) => {
  const { name, description, price } = req.body;
  const product = new Product({ name, description, price });
  const validationError = product.validateSync();

  if (validationError) {
    return res.render('product/create', { error: validationError.errors });
  }

  product.save()
    .then(() => res.redirect('/'))
    .catch(error => {
      console.error(error);
      res.render('product/create', { error: { general: { message: 'Failed to save product' } } });
    });
});

router.get('/retrieve_product', (req, res) => {
  Product.find()
    .then(data => res.render('product/retrieve', { data }))
    .catch(error => {
      console.error(error);
      res.status(500).send("Error retrieving products");
    });
});

router.route('/update_product/:id')
  .get((req, res) => {
    Product.findById(req.params.id).lean()
      .then(product => {
        if (!product) return res.status(404).send("Product not found");
        res.render('product/update', { product, error: null });
      })
      .catch(error => {
        console.error(error);
        res.status(500).send("Error retrieving product");
      });
  })
  .post((req, res) => {
    const { name, description, price } = req.body;
    const product = new Product({ name, description, price });
    const validationError = product.validateSync();

    if (validationError) {
      return res.render('product/update', { product, error: validationError.errors });
    }

    Product.findByIdAndUpdate(req.params.id, { name, description, price })
      .then(() => res.redirect('/products/retrieve_product'))
      .catch(error => {
        console.error(error);
        res.status(500).send("Error updating product");
      });
  });

  router.get('/delete_product/:id',(req , res) =>{
    const productId = req.params.id;
   Product.findById(productId).then(product =>{
        res.render('./product/delete',{product:product})
    }).catch(error => {
        console.error(error);
      });
})

router.post('/delete_product/:id',(req, res) =>{
    const productId = req.params.id;
    Product.findByIdAndDelete(productId)
        .then(() => {
          res.redirect('/products/retrieve_product'); // Redirect to the product list after deleting
        })
        .catch(error => {
          console.error(error);
        });
})

router.get('/listing_page', (req, res) => {
    const { page = 1, limit = 3 } = req.query; // Set default page and limit
 
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    };
 
    Product.paginate({}, options)
      .then(result => {
        res.render('product/list', { products: result.docs, pagination: result });
      })
      .catch(error => {
        console.error(error);
        res.status(500).send('Internal Server Error');
      });
  });

module.exports = router;
