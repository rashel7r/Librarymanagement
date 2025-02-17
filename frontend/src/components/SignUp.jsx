import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Snackbar,
  Alert,
  IconButton,
  InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Simulated existing emails (in real app, this would be checked against your database)
  const existingEmails = ['test@example.com']; // Add test email for demonstration

  const validateEmail = (email) => {
    if (!email.includes('@')) {
      return 'Please include @ symbol in your email';
    }
    return '';
  };

  const validatePassword = (password) => {
    const errors = [];
    
    if (password.length < 8) {
      errors.push('At least 8 characters');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('One uppercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('One number');
    }
    if (!/[!@#$%^&*]/.test(password)) {
      errors.push('One special character (!@#$%^&*)');
    }
    
    return errors.length > 0 ? `Password requirements: ${errors.join(', ')}` : '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Validate email as user types
    if (name === 'email') {
      const emailError = validateEmail(value);
      setEmailError(emailError);
    }
    
    // Validate password as user types
    if (name === 'password') {
      const passwordError = validatePassword(value);
      setPasswordError(passwordError);
      
      // Also validate confirm password if it exists
      if (formData.confirmPassword) {
        setConfirmPasswordError(
          value !== formData.confirmPassword ? "Passwords don't match!" : ''
        );
      }
    }
    
    // Validate confirm password as user types
    if (name === 'confirmPassword') {
      setConfirmPasswordError(
        value !== formData.password ? "Passwords don't match!" : ''
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate email
    const emailError = validateEmail(formData.email);
    if (emailError) {
      setEmailError(emailError);
      return;
    }
    
    // Validate password
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setPasswordError(passwordError);
      return;
    }
    
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setConfirmPasswordError("Passwords don't match!");
      return;
    }

    try {
      // Attempt to register the user
      const response = await axios.post('http://localhost:5000/api/register', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      });

      if (response.status === 201 || response.status === 200) {
        setSnackbarMessage('Registration successful! Please Login');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle connection refused error
      if (error.code === 'ERR_NETWORK') {
        setSnackbarMessage('Unable to connect to the server. Please make sure the server is running on port 5000.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        return;
      }

      // Handle 404 error
      if (error.response?.status === 404) {
        setSnackbarMessage('Registration service is currently unavailable. Please try again later.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        return;
      }

      if (error.response?.data) {
        const errorMessage = error.response.data.message || error.response.data;
        
        // Handle email and password existence
        if (typeof errorMessage === 'string') {
          if (errorMessage.toLowerCase().includes('email already exists')) {
            setEmailError('Email already exists. Please login instead.');
            setFormData(prev => ({
              ...prev,
              email: ''
            }));
            return;
          }
          
          if (errorMessage.toLowerCase().includes('password already exists')) {
            const errorMsg = 'Password already exists. Please choose a different one.';
            setPasswordError(errorMsg);
            setFormData(prev => ({
              ...prev,
              password: '',
              confirmPassword: ''
            }));
            return;
          }
        }
        
        // Generic error handling
        setSnackbarMessage(typeof errorMessage === 'string' ? errorMessage : 'Registration failed. Please try again.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      } else {
        setSnackbarMessage('Registration service is temporarily unavailable. Please try again later.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    }
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
        backgroundImage: `url('/images/Sign up.jpg')`,
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
          severity={snackbarSeverity}
          variant="filled"
          sx={{ 
            width: '100%',
            boxShadow: 2
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Container 
        maxWidth="sm" 
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          pl: 10,
          position: 'relative',
          zIndex: 1,
          mt: 12
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            width: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(8px)',
            '& .MuiTextField-root': {
              my: 1
            }
          }}
        >
          <Typography 
            variant="h5" 
            component="h2" 
            gutterBottom 
            align="center"
            sx={{
              mb: 2,
              fontWeight: 600
            }}
          >
            Sign Up
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                margin="dense"
                size="small"
              />
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                margin="dense"
                size="small"
              />
            </Box>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              margin="dense"
              size="small"
              error={!!emailError}
              helperText={emailError}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              required
              margin="dense"
              size="small"
              error={!!passwordError}
              helperText={passwordError}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              margin="dense"
              size="small"
              error={!!confirmPasswordError}
              helperText={confirmPasswordError}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
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
                Register
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
                Already have an account?{' '}
                <Typography
                  component="span"
                  onClick={() => navigate('/login')}
                  sx={{
                    color: '#75767A',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontWeight: 500,
                    '&:hover': {
                      color: '#636466'
                    }
                  }}
                >
                  Login
                </Typography>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default SignUp; 