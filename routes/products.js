var express = require('express');
var router = express.Router();
const Product = require('../models/productsModel')

router.get('/create_product', (req, res) => {
    res.render('./product/create', { error: null });
});

router.post('/create_product', (req, res) => {
    const { name, description, price } = req.body;
    const product = new Product({ name, description, price });

    const validationError = product.validateSync();
    if (validationError) {
        res.render('./product/create', { error: validationError.errors });
    } else {
        product.save()
            .then(() => res.redirect('/'))
            .catch((error) => {
                console.error(error);
                res.render('product/create', { error: { general: { message: 'Failed to save product' } } });
            });
    }
});
router.get('/retrieve_product', (req, res) => {
  Product.find()
    .then(data => {
      res.render('product/retrieve', { data }); 
    })
    .catch(error => {
      console.error(error);
      res.status(500).send("Error retrieving products");
    });
});


module.exports = router;