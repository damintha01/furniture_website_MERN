//api tika hadagnne methana express eke tiyana router() kiyana function eken

const router = require('express').Router();
const Product = require('../model/Product');
const auth = require('../middleware/auth');

// Get all products
//http://localhost:5000/products/
router.route('/').get(auth, (req, res) => {
    Product.find()
        .then(products => res.json(products))
        .catch(err => res.status(400).json('Error: ' + err)); 
});

// Add a new product
//http://localhost:5000/products/add
router.route('/add').post(auth, (req,res)=>{
    const name = req.body.name; 
    const description = req.body.description;
    const price = Number(req.body.price);
    const image = req.body.image;
    const category = req.body.category;
    const newProduct = new Product({
        name,
        description,
        price,
        image,
        category
    });

    newProduct.save()
        .then(() => res.json('Product added!'))
        .catch((err)=>{
            console.error(err);
            res.status(400).json('Error: ' + err);
        });
});

// Get a product by Name
//http://localhost:5000/products/:id

router.route('/:id').get(auth, (req, res) => {
    Product.findOne({ _id: req.params.id })
        .then(product => res.json(product))
        .catch(err => res.status(400).json('Error: ' + err));
})

// Delete a product by Name
//http://localhost:5050/products/delete/:id

router.route('/delete/:id').delete(auth, async(req, res) => {
    try {
        let userId = req.params.id; //backend  eke idn ena userid eka gnnw
        const deletedProduct = await Product.findByIdAndDelete(userId);
        
        if (!deletedProduct) {
            return res.status(404).json('Product not found');
        }
        
        res.json('Product deleted!');
    } catch (err) {
        console.error(err);
        res.status(400).json('Error: ' + err);
    }
})

// Update a product
//http://localhost:5000/products/update/:id

router.route('/update/:id').put(auth, async(req, res) => {

    let userId=req.params.id; //backend  eke idn ena userid eka gnnw
    const{name,description,price,image,category}=req.body; //frontend eke idn ena ewa gnnwa

    //update krnna object ekak hadagnnwa
    const updateProduct={
        name,
        description,
        price,
        image,
        category
    }

    const update=await Product.findByIdAndUpdate(userId,updateProduct)
    .then(() => res.json('Product updated!'))
    .catch((err)=>{
        console.error(err);
        res.status(400).json('Error: ' + err); 
    });


 
})

module.exports = router;


