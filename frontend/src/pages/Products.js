import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    TextField,
    Typography,
} from '@mui/material';
import { getAllProducts, addProduct, updateProduct, deleteProduct } from '../services/api';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [open, setOpen] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        image: '',
        category: '',
    });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await getAllProducts();
            setProducts(data);
        } catch (err) {            setError(typeof err === 'string' ? err : 'Failed to fetch products');
        }
    };

    const handleOpen = (product = null) => {
        if (product) {
            setEditProduct(product);
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price,
                image: product.image,
                category: product.category,
            });
        } else {
            setEditProduct(null);
            setFormData({
                name: '',
                description: '',
                price: '',
                image: '',
                category: '',
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditProduct(null);
        setFormData({
            name: '',
            description: '',
            price: '',
            image: '',
            category: '',
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editProduct) {
                await updateProduct(editProduct._id, formData);
            } else {
                await addProduct(formData);
            }
            handleClose();
            fetchProducts();
        } catch (err) {
            setError(err.message || 'An error occurred');
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteProduct(id);
            fetchProducts();
        } catch (err) {
            setError(err.message || 'Failed to delete product');
        }
    };

    return (
        <Container>
            <Box sx={{ my: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h4" component="h1">
                        Products
                    </Typography>
                    <Button variant="contained" onClick={() => handleOpen()}>
                        Add New Product
                    </Button>
                </Box>

                {error && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}

                <Grid container spacing={3}>
                    {products.map((product) => (
                        <Grid item xs={12} sm={6} md={4} key={product._id}>
                            <Card>
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={product.image || 'https://via.placeholder.com/140'}
                                    alt={product.name}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {product.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {product.description}
                                    </Typography>
                                    <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                                        ${product.price}
                                    </Typography>
                                    <Typography variant="caption" display="block">
                                        Category: {product.category}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" onClick={() => handleOpen(product)}>
                                        Edit
                                    </Button>
                                    <Button size="small" color="error" onClick={() => handleDelete(product._id)}>
                                        Delete
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>{editProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                    <DialogContent>
                        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Description"
                                multiline
                                rows={4}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Price"
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Image URL"
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Category"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleSubmit} variant="contained">
                            {editProduct ? 'Update' : 'Add'} Product
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Container>
    );
};

export default Products;
