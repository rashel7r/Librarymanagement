import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Snackbar,
  Alert
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Footer from './Footer';
import axios from 'axios';

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, total, editMode, existingFormData } = location.state || { cartItems: [], total: 0 };

  const [formData, setFormData] = useState(
    editMode ? existingFormData : {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      paymentMethod: ''
    }
  );

  const [validationErrors, setValidationErrors] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    paymentMethod: ''
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorSnackbar, setErrorSnackbar] = useState({ open: false, message: '' });

  const validateEmail = (email) => {
    if (!email) return 'Email is required';
    if (!email.includes('@')) return 'Email must include @ symbol';
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) return 'Invalid email format';
    return '';
  };

  const validatePhone = (phone) => {
    if (!phone) return 'Phone number is required';
    if (!/^\d+$/.test(phone)) return 'Phone number must contain only digits';
    if (phone.length !== 10) return 'Phone number must be exactly 10 digits';
    return '';
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'fullName':
        return !value ? 'Full name is required' : '';
      case 'email':
        return validateEmail(value);
      case 'phone':
        return validatePhone(value);
      case 'address':
        return !value ? 'Delivery address is required' : '';
      case 'city':
        return !value ? 'City is required' : '';
      case 'paymentMethod':
        return !value ? 'Payment method is required' : '';
      default:
        return '';
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));

    const error = validateField(name, value);
    setValidationErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const errors = {};
    let hasErrors = false;

    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        errors[field] = error;
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setValidationErrors(errors);
      setErrorSnackbar({
        open: true,
        message: 'Please fill in all required fields correctly'
      });
      return;
    }

    // Check if cart is empty
    if (!cartItems || cartItems.length === 0) {
      setErrorSnackbar({
        open: true,
        message: 'Your cart is empty. Please add items before checking out.'
      });
      return;
    }

    try {
      // Create order in database
      const response = await axios.post('http://localhost:5000/api/orders', {
        customer: formData,
        items: cartItems,
        total: total
      });

      if (response.status === 201) {
        // Show success message
        setOpenSnackbar(true);
        
        // Clear cart from localStorage
        localStorage.removeItem('cartItems');
        
        // Navigate to order details page after 1 second
        setTimeout(() => {
          navigate('/order-details', {
            state: {
              orderData: {
                formData,
                cartItems,
                total
              }
            }
          });
        }, 1000);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      setErrorSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to create order. Please try again.'
      });
    }
  };

  const handleCloseErrorSnackbar = () => {
    setErrorSnackbar({ ...errorSnackbar, open: false });
  };

  // If no cart items, redirect to cart page
  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'url("/images/BookCheckout1.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        width: '100vw',
        overflowX: 'hidden',
        overflowY: 'auto',
        m: 0,
        p: 0
      }}
    >
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ marginTop: '64px' }}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity="success" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          Order placed successfully!
        </Alert>
      </Snackbar>

      <Snackbar
        open={errorSnackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseErrorSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ marginTop: '64px' }}
      >
        <Alert 
          onClose={handleCloseErrorSnackbar} 
          severity="error" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {errorSnackbar.message}
        </Alert>
      </Snackbar>

      <Container maxWidth="md" sx={{ mt: 10, mb: 2, pt: 0.5 }}>
        <Typography 
          variant="h2" 
          component="h1" 
          align="center" 
          sx={{ 
            fontWeight: 700,
            color: '#2e2e2e',
            fontFamily: '"Playfair Display", serif',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            fontSize: {
              xs: '2.5rem',
              sm: '3rem',
              md: '3.75rem'
            },
            mt: 2,
            mb: 6,
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          {editMode ? 'Edit Order' : 'Checkout'}
        </Typography>

        <Paper 
          sx={{ 
            p: 1.5,
            mb: 2,
            maxWidth: '500px',
            mx: 'auto',
            backgroundColor: 'rgba(245, 245, 245, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '2px solid #000000',
            borderRadius: '4px'
          }}
        >
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    mt: 2,
                    mb: 2,
                    color: '#75767A',
                    fontWeight: 600,
                    textAlign: 'center'
                  }}
                >
                  Checkout Info
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleFormChange}
                  required
                  variant="outlined"
                  size="small"
                  error={!!validationErrors.fullName}
                  helperText={validationErrors.fullName}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                  variant="outlined"
                  size="small"
                  error={!!validationErrors.email}
                  helperText={validationErrors.email}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  required
                  variant="outlined"
                  size="small"
                  error={!!validationErrors.phone}
                  helperText={validationErrors.phone}
                  inputProps={{ maxLength: 10 }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Delivery Address"
                  name="address"
                  multiline
                  rows={2}
                  value={formData.address}
                  onChange={handleFormChange}
                  required
                  variant="outlined"
                  size="small"
                  error={!!validationErrors.address}
                  helperText={validationErrors.address}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleFormChange}
                  required
                  variant="outlined"
                  size="small"
                  error={!!validationErrors.city}
                  helperText={validationErrors.city}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth required error={!!validationErrors.paymentMethod}>
                  <InputLabel>Payment Method</InputLabel>
                  <Select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleFormChange}
                    label="Payment Method"
                    size="small"
                  >
                    <MenuItem value="credit">Credit Card</MenuItem>
                    <MenuItem value="debit">Debit Card</MenuItem>
                    <MenuItem value="cash">Cash on Delivery</MenuItem>
                  </Select>
                  {validationErrors.paymentMethod && (
                    <Typography color="error" variant="caption" sx={{ mt: 0.5, ml: 1.5 }}>
                      {validationErrors.paymentMethod}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 0.5 }} />
                <Box sx={{ mb: 1 }}>
                  <Typography variant="h6" gutterBottom sx={{ mb: 0.5 }}>
                    Order Summary
                  </Typography>

                  {/* Book Titles Section */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      Books in Order:
                    </Typography>
                    {cartItems.map((item, index) => (
                      <Grid container key={index} sx={{ mb: 0.5 }}>
                        <Grid item xs={8}>
                          <Typography variant="body2" sx={{ color: '#2c3e50' }}>
                            {item.title}
                          </Typography>
                        </Grid>
                        <Grid item xs={4} sx={{ textAlign: 'right' }}>
                          <Typography variant="body2" sx={{ color: '#2c3e50' }}>
                            x{item.quantity}
                          </Typography>
                        </Grid>
                      </Grid>
                    ))}
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  
                  <Grid container justifyContent="space-between">
                    <Grid item>
                      <Typography>Total Items:</Typography>
                    </Grid>
                    <Grid item>
                      <Typography>
                        {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container justifyContent="space-between">
                    <Grid item>
                      <Typography variant="h6">Total Amount:</Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h6">${total.toFixed(2)}</Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              <Grid item xs={12} sx={{ mt: -1 }}>
                <Box sx={{ 
                  display: 'flex',
                  gap: 4,
                  justifyContent: 'center',
                  mb: 2
                }}>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/cart')}
                    sx={{
                      px: 3,
                      py: 0.75,
                      bgcolor: '#000000',
                      '&:hover': { bgcolor: '#636466' },
                      display: 'flex',
                      alignItems: 'center',
                      minWidth: '130px',
                      fontSize: '0.9rem',
                      gap: 1
                    }}
                  >
                    <ArrowBackIcon sx={{ fontSize: '1.2rem', color: '#ffffff' }} />
                    Back to Cart
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      px: 2.5,
                      py: 0.75,
                      bgcolor: '#75767A',
                      '&:hover': { bgcolor: '#1a2632' },
                      minWidth: '130px',
                      fontSize: '0.9rem'
                    }}
                  >
                    {editMode ? 'Update Order' : 'Place Order'}
                    <ShoppingCartIcon sx={{ ml: 1 }} />
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>

      <Box sx={{ mt: 'auto', width: '100%' }}>
        <Footer />
      </Box>
    </Box>
  );
}

export default Checkout; 