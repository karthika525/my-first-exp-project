var express = require('express');
var router = express.Router();

router.get('/simpleapi', (req,res) => {
    res.status(200).send({'text': 'Hello world, This is your first api call'})
})

module.exports = router;