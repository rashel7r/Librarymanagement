import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Divider,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Footer from './Footer';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../App';

function OrderDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:5000/api/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/orders/${orderId}/status`, {
        status: newStatus
      });
      fetchOrders(); // Refresh orders after update
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('Failed to update order status. Please try again.');
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: 'calc(100vh - 64px)',
        mt: 8
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ textAlign: 'center', mt: 10 }}>
        <Typography color="error" variant="h6" sx={{ mb: 2 }}>{error}</Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Return to Home
        </Button>
      </Container>
    );
  }

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
        backgroundImage: 'url("/images/OrderDetails.jpg")',
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
      <Container maxWidth="lg" sx={{ mt: 15, mb: 4 }}>
        <Typography 
          variant="h2" 
          component="h1" 
          align="center" 
          sx={{ 
            fontWeight: 700,
            color: '#ffffff',
            fontFamily: '"Playfair Display", serif',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            fontSize: {
              xs: '2.5rem',
              sm: '3rem',
              md: '3.75rem'
            },
            mb: 6,
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          Order Details
        </Typography>

        {orders.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6">No orders found.</Typography>
          </Paper>
        ) : (
          orders.map((order, index) => (
            <Paper 
              key={order._id}
              sx={{ 
                p: 2.5,
                mb: 3,
                backgroundColor: 'rgba(245, 245, 245, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid #000000',
                borderRadius: '4px'
              }}
            >
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 1,
                  color: '#75767A',
                  fontWeight: 600
                }}
              >
                Order #{index + 1}
              </Typography>

              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Customer Information</Typography>
                  <TableContainer component={Paper} sx={{ mb: 3, boxShadow: 'none', bgcolor: 'transparent' }}>
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell component="th" sx={{ fontWeight: 600 }}>Full Name</TableCell>
                          <TableCell>{order.customer.fullName}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" sx={{ fontWeight: 600 }}>Email</TableCell>
                          <TableCell>{order.customer.email}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" sx={{ fontWeight: 600 }}>Phone</TableCell>
                          <TableCell>{order.customer.phone}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" sx={{ fontWeight: 600 }}>Address</TableCell>
                          <TableCell>{order.customer.address}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" sx={{ fontWeight: 600 }}>City</TableCell>
                          <TableCell>{order.customer.city}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" sx={{ fontWeight: 600 }}>Payment Method</TableCell>
                          <TableCell>{order.customer.paymentMethod}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Order Summary</Typography>
                  <TableContainer component={Paper} sx={{ mb: 2, boxShadow: 'none', bgcolor: 'transparent' }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Book</TableCell>
                          <TableCell align="right">Quantity</TableCell>
                          <TableCell align="right">Price</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {order.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.title}</TableCell>
                            <TableCell align="right">{item.quantity}</TableCell>
                            <TableCell align="right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={2} sx={{ fontWeight: 600 }}>Total Amount</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600 }}>${order.total.toFixed(2)}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      Status: <span style={{ fontWeight: 600 }}>{order.status}</span>
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleUpdateStatus(order._id, 'completed')}
                        disabled={order.status === 'completed'}
                        sx={{
                          bgcolor: '#75767A',
                          '&:hover': { bgcolor: '#636466' }
                        }}
                      >
                        Mark as Completed
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        color="error"
                        onClick={() => handleUpdateStatus(order._id, 'cancelled')}
                        disabled={order.status === 'cancelled'}
                      >
                        Cancel Order
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          ))
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            sx={{
              px: 3,
              py: 0.75,
              fontSize: '0.9rem',
              bgcolor: '#75767A',
              '&:hover': { bgcolor: '#636466' },
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <HomeIcon sx={{ fontSize: '1.2rem' }} />
            Return to Home
          </Button>
        </Box>
      </Container>

      <Box sx={{ mt: 'auto', width: '100%' }}>
        <Footer />
      </Box>
    </Box>
  );
}

export default OrderDetails; 