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
    DialogContentText,
    DialogTitle,
    Grid,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { Delete, Edit, Add, Search, FilterList } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { getAllProducts, addProduct, updateProduct, deleteProduct } from '../services/api';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [open, setOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        image: '',
        category: '',
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await getAllProducts();
            setProducts(data);
        } catch (err) {
            toast.error(err.toString() || 'Failed to fetch products');
        }
    };

    const handleOpen = (product = null) => {
        if (product) {
            setSelectedProduct(product);
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price,
                image: product.image,
                category: product.category,
            });
        } else {
            setSelectedProduct(null);
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
        setSelectedProduct(null);
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
            if (selectedProduct) {
                await updateProduct(selectedProduct._id, formData);
                toast.success('Product updated successfully');
            } else {
                await addProduct(formData);
                toast.success('Product added successfully');
            }
            handleClose();
            fetchProducts();
        } catch (err) {
            toast.error(err.toString() || 'An error occurred');
        }
    };

    const handleDelete = async (product) => {
        setSelectedProduct(product);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteProduct(selectedProduct._id);
            toast.success('Product deleted successfully');
            setDeleteDialogOpen(false);
            fetchProducts();
        } catch (err) {
            toast.error(err.toString() || 'Failed to delete product');
        }
    };

    const filteredProducts = products
        .filter(product => 
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter(product => category === 'all' ? true : product.category === category)
        .sort((a, b) => {
            switch(sortBy) {
                case 'price-asc':
                    return a.price - b.price;
                case 'price-desc':
                    return b.price - a.price;
                case 'name':
                default:
                    return a.name.localeCompare(b.name);
            }
        });

    const categories = ['all', ...new Set(products.map(product => product.category))];

    return (
        <Container>
            <Box sx={{ my: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h4" component="h1">
                        Products
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => handleOpen()}
                    >
                        Add New Product
                    </Button>
                </Box>

                <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
                    <TextField
                        size="small"
                        label="Search Products"
                        variant="outlined"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ flexGrow: 1 }}
                    />
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={category}
                            label="Category"
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            {categories.map((cat) => (
                                <MenuItem key={cat} value={cat}>
                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Sort By</InputLabel>
                        <Select
                            value={sortBy}
                            label="Sort By"
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <MenuItem value="name">Name</MenuItem>
                            <MenuItem value="price-asc">Price: Low to High</MenuItem>
                            <MenuItem value="price-desc">Price: High to Low</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <Grid container spacing={3}>
                    {filteredProducts.map((product) => (
                        <Grid item xs={12} sm={6} md={4} key={product._id}>
                            <Card 
                                elevation={3}
                                sx={{ 
                                    height: '100%', 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                        transform: 'scale(1.02)',
                                    },
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={product.image || 'https://via.placeholder.com/200'}
                                    alt={product.name}
                                    sx={{ objectFit: 'cover' }}
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {product.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {product.description}
                                    </Typography>
                                    <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                                        ${product.price.toFixed(2)}
                                    </Typography>
                                    <Typography variant="caption" display="block">
                                        Category: {product.category}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                                    <IconButton 
                                        color="primary"
                                        onClick={() => handleOpen(product)}
                                        title="Edit"
                                    >
                                        <Edit />
                                    </IconButton>
                                    <IconButton 
                                        color="error"
                                        onClick={() => handleDelete(product)}
                                        title="Delete"
                                    >
                                        <Delete />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Add/Edit Product Dialog */}
                <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        {selectedProduct ? 'Edit Product' : 'Add New Product'}
                    </DialogTitle>
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
                                inputProps={{ min: 0, step: 0.01 }}
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
                            {selectedProduct ? 'Update' : 'Add'} Product
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <Dialog
                    open={deleteDialogOpen}
                    onClose={() => setDeleteDialogOpen(false)}
                >
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete "{selectedProduct?.name}"?
                            This action cannot be undone.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                        <Button onClick={confirmDelete} color="error" variant="contained">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Container>
    );
};

export default Products;
