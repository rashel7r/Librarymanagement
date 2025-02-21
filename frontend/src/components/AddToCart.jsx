import { useState, useEffect, useContext } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  IconButton,
  Divider,
  Link,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Snackbar,
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import Footer from './Footer';
import { UserContext } from '../App';

function CartPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(UserContext);
  const [showError, setShowError] = useState(false);
  
  // Initialize cart items with the book data if it exists
  const [cartItems, setCartItems] = useState(() => {
    const newBookData = location.state?.bookData;
    if (newBookData) {
      // Check if the book is already in the cart
      const existingItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
      const existingItem = existingItems.find(item => item.id === newBookData.id);
      
      if (existingItem) {
        // If book exists, increment quantity
        const updatedItems = existingItems.map(item =>
          item.id === newBookData.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        localStorage.setItem('cartItems', JSON.stringify(updatedItems));
        return updatedItems;
      } else {
        // If book doesn't exist, add it to cart
        const updatedItems = [...existingItems, newBookData];
        localStorage.setItem('cartItems', JSON.stringify(updatedItems));
        return updatedItems;
      }
    }
    // If no new book, load existing cart items
    return JSON.parse(localStorage.getItem('cartItems') || '[]');
  });

  // Update localStorage whenever cart items change
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const handleQuantityChange = (id, change) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckoutClick = () => {
    if (!user) {
      setShowError(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      return;
    }

    if (user.role === 'admin') {
      // Redirect admin directly to order details page
      navigate('/order-details');
      return;
    }

    navigate('/checkout', { 
      state: { 
        cartItems,
        total: calculateTotal()
      }
    });
  };

  return (
    <Box 
      sx={{ 
        minHeight: 'calc(100vh - 64px)',
        mt: 8,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        width: '100vw',
        left: '48%',
        transform: 'translateX(-50%)',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url("/images/Cart1.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.4,
          zIndex: -1
        }
      }}
    >
      <Snackbar
        open={showError}
        autoHideDuration={2000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowError(false)} 
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {!user ? 'Please login to proceed with checkout' : 'Admins cannot place orders. Please use a client account.'}
        </Alert>
      </Snackbar>

      <Box sx={{ 
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        mb: 3,
        mt: 4
      }}>
        <Typography 
          variant="h2" 
          component="h1" 
          align="center" 
          sx={{ 
            fontWeight: 700,
            color: '#75767A',
            fontFamily: '"Playfair Display", serif',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            fontSize: {
              xs: '2.5rem',
              sm: '3rem',
              md: '3.75rem'
            },
            position: 'relative',
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          Add To Cart
        </Typography>
      </Box>

      <Container maxWidth="lg">
        {cartItems.length === 0 ? (
          <Paper sx={{ 
            p: 4, 
            textAlign: 'center',
            backgroundColor: '#f5f5f5',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#666' }}>
              Your cart is empty
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/')}
              sx={{
                bgcolor: '#75767A',
                '&:hover': { bgcolor: '#636466' }
              }}
            >
              Continue Shopping
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper sx={{ 
                p: 3, 
                mb: 3,
                maxWidth: '600px',
                mx: 'auto',
                backgroundColor: '#f5f5f5',
                backdropFilter: 'blur(10px)',
                border: '2px solid #000000',
                borderRadius: '4px'
              }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    textAlign: 'center',
                    mb: 3,
                    fontWeight: 600,
                    color: '#75767A'
                  }}
                >
                  Book Cart Info
                </Typography>
                {cartItems.map((item) => (
                  <Box key={item.id}>
                    <Grid container direction="column" spacing={2}>
                      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                        <img
                          src={item.imageUrl ? 
                            (item.imageUrl.startsWith('http') ? item.imageUrl : `/images/${item.imageUrl}`)
                            : '/images/Default Book1.jpg'}
                          alt={item.title}
                          style={{
                            width: 'auto',
                            height: 'auto',
                            maxHeight: '200px',
                            maxWidth: '150px',
                            objectFit: 'contain'
                          }}
                          onError={(e) => {
                            console.log('Image failed to load:', e.target.src);
                            e.target.src = '/images/Default Book1.jpg';
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="h6" sx={{ fontWeight: 500, mb: 1, textAlign: 'center' }}>
                          {item.title}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 1, textAlign: 'center' }}>
                          by {item.author}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2, textAlign: 'center' }}>
                          {item.description}
                        </Typography>
                        <Box sx={{ 
                          display: 'flex', 
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 1,
                          mb: 2
                        }}>
                          <Typography variant="body2" color="text.secondary">
                            ISBN: {item.isbn}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Available Copies: {item.availableCopies}
                          </Typography>
                        </Box>
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'center',
                          alignItems: 'center',
                          gap: 4,
                          flexWrap: 'wrap'
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconButton
                              size="small"
                              onClick={() => handleQuantityChange(item.id, -1)}
                              sx={{ bgcolor: '#f5f5f5' }}
                            >
                              <RemoveIcon />
                            </IconButton>
                            <Typography>{item.quantity}</Typography>
                            <IconButton
                              size="small"
                              onClick={() => handleQuantityChange(item.id, 1)}
                              sx={{ bgcolor: '#f5f5f5' }}
                            >
                              <AddIcon />
                            </IconButton>
                          </Box>
                          <Typography variant="h6">
                            ${(item.price * item.quantity).toFixed(2)}
                          </Typography>
                          <IconButton
                            onClick={() => handleRemoveItem(item.id)}
                            sx={{ color: '#666' }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Grid>
                    </Grid>
                    <Divider sx={{ my: 2 }} />
                  </Box>
                ))}
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ 
                p: 3,
                maxWidth: '600px',
                mx: 'auto',
                backgroundColor: '#f5f5f5',
                backdropFilter: 'blur(10px)',
                border: '2px solid #000000',
                borderRadius: '4px'
              }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    textAlign: 'center',
                    mb: 3,
                    fontWeight: 600,
                    color: '#75767A'
                  }}
                >
                  Order Summary
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Grid container justifyContent="space-between">
                    <Grid item>
                      <Typography>Subtotal</Typography>
                    </Grid>
                    <Grid item>
                      <Typography>${calculateTotal().toFixed(2)}</Typography>
                    </Grid>
                  </Grid>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ mb: 2 }}>
                  <Grid container justifyContent="space-between">
                    <Grid item>
                      <Typography variant="h6">Total</Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h6">${calculateTotal().toFixed(2)}</Typography>
                    </Grid>
                  </Grid>
                </Box>
                <Box sx={{ mt: 3, display: 'flex', gap: 4, justifyContent: 'center' }}>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/')}
                    sx={{
                      bgcolor: '#000000',
                      '&:hover': { bgcolor: '#636466' },
                      display: 'flex',
                      alignItems: 'center',
                      minWidth: '130px',
                      fontSize: '0.9rem',
                      gap: 0.5
                    }}
                  >
                    Continue Shopping
                    <ShoppingBagIcon sx={{ ml: 0.5 }} />
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    onClick={handleCheckoutClick}
                    sx={{
                      bgcolor: '#75767A',
                      '&:hover': { bgcolor: '#1a2632' },
                      minWidth: '130px',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5
                    }}
                  >
                    {user?.role === 'admin' ? 'View Orders' : 'Checkout'}
                    {user?.role === 'admin' ? <ReceiptLongIcon sx={{ ml: 0.5 }} /> : <ShoppingCartIcon sx={{ ml: 0.5 }} />}
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Container>

      <Footer />
    </Box>
  );
}

export default CartPage;