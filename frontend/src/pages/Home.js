import React from 'react';
import { Box, Button, Container, Grid, Typography, Card, CardContent, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StyleIcon from '@mui/icons-material/Style';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SupportIcon from '@mui/icons-material/Support';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();

  const features = [
    {
      icon: <StyleIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Premium Quality',
      description: 'Crafted with the finest materials for lasting durability and style.'
    },
    {
      icon: <LocalShippingIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Fast Delivery',
      description: 'Quick and reliable shipping to your doorstep.'
    },
    {
      icon: <SupportIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: '24/7 Support',
      description: 'Our dedicated team is always here to help you.'
    }
  ];

  return (
    <Box className="fade-in">
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          position: 'relative',
          pt: { xs: 4, md: 8 },
          pb: { xs: 8, md: 12 },
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ maxWidth: 480 }}>
                <Typography
                  component="h1"
                  variant="h1"
                  color="primary"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Elevate Your Living Space
                </Typography>
                <Typography
                  variant="h5"
                  color="text.secondary"
                  paragraph
                  sx={{ mb: 4 }}
                >
                  Discover our curated collection of modern and elegant furniture.
                  Transform your home into a sanctuary of style and comfort.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {!user ? (
                    <>
                      <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate('/login')}
                        startIcon={<ShoppingCartIcon />}
                        className="btn-hover-effect"
                      >
                        Shop Now
                      </Button>
                      <Button
                        variant="outlined"
                        size="large"
                        onClick={() => navigate('/register')}
                        className="btn-hover-effect"
                      >
                        Join Us
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate('/products')}
                      startIcon={<ShoppingCartIcon />}
                      className="btn-hover-effect"
                    >
                      View Products
                    </Button>
                  )}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box className="image-hover-effect">
                <img
                  src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80"
                  alt="Modern Furniture"
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: 500,
                    objectFit: 'cover',
                    borderRadius: '20px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            color="primary"
            gutterBottom
            sx={{ mb: 6 }}
          >
            Why Choose Us
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  className="card-hover-effect"
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    p: 3,
                    backgroundColor: 'background.paper',
                  }}
                >
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="h3"
                      color="primary"
                    >
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: theme.palette.primary.main,
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" gutterBottom>
            Ready to Transform Your Space?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join us today and discover the perfect pieces for your home.
          </Typography>
          <Button
            variant="contained"
            size="large"
            color="secondary"
            onClick={() => navigate(user ? '/products' : '/register')}
            className="btn-hover-effect"
            sx={{ px: 4, py: 1.5 }}
          >
            {user ? 'Browse Collection' : 'Get Started'}
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
