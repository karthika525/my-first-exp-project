var express = require('express');
var router = express.Router();
const Product = require('../models/productsModel');
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const fs = require('fs').promises;
const pdf = require('html-pdf-node');

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

    // Route to handle page visit
router.get('/pagevisit', (req, res) => {
    // Get the current count from the session, or set it to 0 if it doesn't exist
    const count = req.session.page_count || 0;
   
    // Increment the count
    req.session.page_count = count + 1;
 
    // Render the template with the count variable
    res.render('product/page_view', { count: req.session.page_count });
  });

router.get('/generate-pdf/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        
        // Fetch product data from database
        const product = await Product.findById(productId);
        
        // Read and render the EJS template with product data
        const template = await fs.readFile('./views/product/product_pdf_template.ejs', 'utf8');
        const html = ejs.render(template, { product });
        
        // Create PDF options
        const options = { format: 'A4' };

        // Generate PDF buffer
        const pdfBuffer = await pdf.generatePdf({ content: html }, options);

        // Set the response headers and send the PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${product.name}.pdf"`);
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});
router.get('/send_product_email/:id', async (req, res) => {
  try {
    // Assuming a Product model or equivalent
    const product = await Product.findById(req.params.id);


    // Create a nodemailer transport object
    
  var transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "80e0589af08d46",
    pass: "2a1333ad791562"
  }
});


    const template = await fs.readFile('./views/product/product_email.ejs', 'utf8');
    // Email content
    const mailOptions = {
      from: 'user123@gmail.com', // Sender email address
      to: 'abcd123@mailtrap.io', // Receiver email address
      subject: `New Product: ${product.name}`, // Email subject
      html: ejs.render(template, { product }) // Render HTML using EJS
    };


    // Send the email
    const info = await transport.sendMail(mailOptions);
    console.log('Email sent:', info.response);


    // Close the transport after sending the email
    transport.close();


    res.send('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
