import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Snackbar,
  Alert
} from '@mui/material';
import { UserContext } from '../App';

function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [emailError, setEmailError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    if (name === 'email') {
      setEmailError(value && !value.includes('@') ? 'Please include @ in your email address' : '');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.includes('@')) {
      setEmailError('Please include @ in your email address');
      return;
    }
    // TODO: Implement actual login logic here
    console.log('Login submitted:', formData);
    
    // Set user data in context
    setUser({
      email: formData.email,
    });
    
    // Show success message
    setOpenSnackbar(true);
    
    // Navigate to homepage after 2 seconds
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Box 
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url('/images/Login.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{
          position: 'fixed',
          top: '80px !important',
          zIndex: 9999
        }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="success" 
          variant="filled"
          sx={{ 
            width: '100%',
            boxShadow: 2
          }}
        >
          Login successful! Welcome back
        </Alert>
      </Snackbar>
      <Container 
        maxWidth="xs" 
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          pl: 10,
          position: 'relative',
          zIndex: 1,
          mt: 15
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            width: '100%',
            maxWidth: '400px',
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(8px)',
            '& .MuiTextField-root': {
              my: 2
            }
          }}
        >
          <Typography 
            variant="h5" 
            component="h2" 
            gutterBottom 
            align="center"
            sx={{
              mb: 3,
              fontWeight: 600
            }}
          >
            Page Flow Login
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              margin="normal"
              autoComplete="email"
              error={!!emailError}
              helperText={emailError}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              margin="normal"
              autoComplete="current-password"
            />
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ 
                  bgcolor: '#75767A',
                  '&:hover': {
                    bgcolor: '#636466'
                  }
                }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                onClick={() => navigate('/')}
                sx={{
                  py: 1
                }}
              >
                Cancel
              </Button>
            </Box>
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body1" sx={{ color: '#666' }}>
                Don't have an account?
                <Typography
                  component="span"
                  onClick={() => navigate('/signup')}
                  sx={{
                    color: '#75767A',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontWeight: 500,
                    ml: 1,
                    '&:hover': {
                      color: '#636466'
                    }
                  }}
                >
                  Sign Up
                </Typography>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Login;
