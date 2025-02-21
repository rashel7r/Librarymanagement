import { Box, Container, Grid, Typography, Link, Table, TableBody, TableRow, TableCell } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        position: 'relative',
        left: 0,
        right: 0,
        bgcolor: '#75767A',
        mt: 3,
        mb: 0
      }}
    >
      <Container sx={{ py: 3 }}>
        <Grid container spacing={4}>
          {/* Footer Content */}
          <Grid item xs={12} lg={6} md={12} sx={{ mb: 2 }}>
            <Typography
              variant="h5"
              sx={{
                mb: 2,
                letterSpacing: '2px',
                color: '#ffffff',
                fontWeight: 600
              }}
            >
              ABOUT PAGE FLOW
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: '#e0e0e0', lineHeight: 1.8 }}
            >
              Welcome to Page Flow, your premier online library destination. We offer a vast collection of books across all genres, from timeless classics to contemporary bestsellers. Our mission is to make reading accessible to everyone, anywhere, anytime. With our user-friendly platform, you can easily browse, borrow, and manage your reading list. Join this dreamy reading adventure where you can see yourself in different worlds as it says in our motto read, imagine, explore.
            </Typography>
          </Grid>

          {/* Links */}
          <Grid item xs={12} lg={3} md={6} sx={{ mb: 2 }}>
            <Typography
              variant="h5"
              sx={{
                mb: 2,
                letterSpacing: '2px',
                color: '#ffffff',
                fontWeight: 600,
                textTransform: 'capitalize'
              }}
            >
              QUICK LINKS
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              '& > a': {
                mb: 1.5,
                color: '#e0e0e0',
                fontSize: '0.9rem',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                  color: '#ffffff'
                }
              }
            }}>
              <Link component={RouterLink} to="/">Home</Link>
              <Link component={RouterLink} to="/profile">User Profile</Link>
              <Link component={RouterLink} to="/cart">Shopping Cart</Link>
              <Link component={RouterLink} to="/add">Add Book</Link>
              <Link component={RouterLink} to="/login">Login</Link>
              <Link component={RouterLink} to="/signup">Sign Up</Link>
            </Box>
          </Grid>

          {/* Opening Hours */}
          <Grid item xs={12} lg={3} md={6} sx={{ mb: 2 }}>
            <Typography
              variant="h5"
              sx={{
                mb: 2,
                letterSpacing: '2px',
                color: '#ffffff',
                fontWeight: 600,
                textTransform: 'capitalize'
              }}
            >
              WORKING HOURS
            </Typography>
            <Table size="small" sx={{ 
              '& td': { 
                border: 'none',
                color: '#e0e0e0',
                padding: '4px 0',
                fontSize: '0.9rem'
              }
            }}>
              <TableBody>
                <TableRow>
                  <TableCell component="td" sx={{ pl: 0 }}>Mon - Fri:</TableCell>
                  <TableCell component="td">8am - 9pm</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="td" sx={{ pl: 0 }}>Sat - Sun:</TableCell>
                  <TableCell component="td">8am - 12am</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Grid>
        </Grid>
      </Container>

      {/* Copyright */}
      <Box
        sx={{
          bgcolor: '#636466',
          py: 1.5,
          px: 3,
          textAlign: 'center'
        }}
      >
        <Typography variant="body2" sx={{ 
          color: '#e0e0e0'
        }}>
          © 2025 PAGE FLOW. ALL RIGHTS RESERVED.
        </Typography>
      </Box>
    </Box>
  );
}

export default Footer; 