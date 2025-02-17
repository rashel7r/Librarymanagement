import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Snackbar,
  Alert,
} from '@mui/material';
import axios from 'axios';

function AddBook() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const editId = searchParams.get('edit');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [
    '/images/Add book1.jpg',
    '/images/Add book2.jpg'
  ];

  // Book cover images mapping
  const bookCovers = {
    'atomic habits': 'HM-Blog-Atomic-Habits.webp',
    'daring greatly': 'Daring Greatly.jpg',
    'becoming': 'Becoming.webp',
    'tom sawyer': 'Tom Sawyer.jpg',
    'city of ashes': 'The-Mortal-Instruments-2-City-of-Ashes-City-of-Ashes-Book-2.webp',
    'city of bones': 'The-Mortal-Instruments-1-City-of-Bones.jpg',
    'the jungle book': 'The-Jungle-Book.jpg',
    'oliver twist': 'Oliver Twist.jpg',
    'black beauty': 'Black Beauty.jpg'
  };

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    isbn: '',
    publishedYear: '',
    genre: '',
    availableCopies: '',
    imageUrl: ''
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (editId) {
      fetchBook();
    }
  }, [editId]);

  // Update the title effect to set the imageUrl based on title
  useEffect(() => {
    if (formData.title && !formData.imageUrl) {  // Only set automatic image if no manual URL is provided
      const titleLower = formData.title.toLowerCase().trim();
      const matchingCover = bookCovers[titleLower];
      
      // Set the imageUrl based on the matching cover or default
      setFormData(prev => ({
        ...prev,
        imageUrl: matchingCover || '/images/Default Book1.jpg'
      }));
    }
  }, [formData.title]);

  const fetchBook = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/books/${editId}`);
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching book:', error);
      setSnackbarMessage('Failed to load book details');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // For number fields, only allow numbers
    if (name === 'publishedYear' || name === 'availableCopies') {
      if (value === '' || /^\d+$/.test(value)) {
        setFormData({
          ...formData,
          [name]: value
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const bookData = {
        ...formData,
        publishedYear: parseInt(formData.publishedYear),
        availableCopies: parseInt(formData.availableCopies)
      };

      console.log('Sending book data:', bookData);

      // Validate required fields
      if (!bookData.title || !bookData.author || !bookData.description || 
          !bookData.isbn || !bookData.publishedYear || !bookData.genre || 
          !bookData.availableCopies) {
        setSnackbarMessage('Please fill in all required fields');
        setOpenSnackbar(true);
        return;
      }

      // Validate number fields
      if (isNaN(bookData.publishedYear) || isNaN(bookData.availableCopies)) {
        setSnackbarMessage('Published Year and Available Copies must be valid numbers');
        setOpenSnackbar(true);
        return;
      }

      // Additional validation for publishedYear
      const currentYear = new Date().getFullYear();
      if (bookData.publishedYear < 0 || bookData.publishedYear > currentYear) {
        setSnackbarMessage(`Published Year must be between 0 and ${currentYear}`);
        setOpenSnackbar(true);
        return;
      }

      // Additional validation for availableCopies
      if (bookData.availableCopies < 0) {
        setSnackbarMessage('Available Copies must be a positive number');
        setOpenSnackbar(true);
        return;
      }

      let response;
      if (editId) {
        response = await axios.put(`http://localhost:5000/api/books/${editId}`, bookData);
        setSnackbarMessage('Book updated successfully!');
      } else {
        response = await axios.post('http://localhost:5000/api/books', bookData);
        setSnackbarMessage('Book added successfully!');
      }

      if (response.status === 200 || response.status === 201) {
        setOpenSnackbar(true);
        
        // Clear form data
        if (!editId) {
          setFormData({
            title: '',
            author: '',
            description: '',
            isbn: '',
            publishedYear: '',
            genre: '',
            availableCopies: '',
            imageUrl: '',
          });
        }

        // Navigate immediately after successful response
        navigate('/', { state: { refresh: true } });
      }
    } catch (error) {
      console.error('Error saving book:', error);
      console.error('Error response:', error.response?.data);
      
      // Check specifically for duplicate ISBN error
      if (error.response?.data?.message?.includes('duplicate key') || 
          error.response?.status === 400) {
        setSnackbarMessage('A book with this ISBN already exists. Please use a different ISBN.');
      } else {
        setSnackbarMessage(error.response?.data?.message || 'Error saving book. Please try again.');
      }
      
      setOpenSnackbar(true);
    }
  };

  return (
    <Box 
      sx={{ 
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        px: 2,
        gap: 16,
        bgcolor: '#f8f8f8',
        minHeight: '100vh',
        position: 'relative',
        top: 0,
        left: 0,
        right: 0,
        pt: 8,
        zIndex: 1
      }}
    >
      <Snackbar
        open={openSnackbar}
        autoHideDuration={1500}
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
          severity={snackbarMessage.includes('Error') ? 'error' : 'success'}
          variant="filled"
          sx={{ 
            width: '100%',
            boxShadow: 2
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Box 
        sx={{ 
          position: 'relative',
          mt: '55px',
          width: '550px',
          height: '580px',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              transition: 'transform 0.5s ease-in-out',
              transform: `translateX(-${currentImageIndex * 100}%)`,
              height: '100%',
            }}
          >
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Add Book ${index + 1}`}
                style={{
                  minWidth: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>
      <Paper 
        elevation={3} 
        sx={{ 
          pt: 1.5,
          px: 2,
          pb: 0.5,
          mt: '80px',
          height: 'fit-content',
          width: '650px',
          ml: 2,
          bgcolor: '#f5f5f5',
          borderRadius: '8px'
        }}
      >
        <Typography 
          variant="h5" 
          component="h2" 
          gutterBottom 
          sx={{ 
            mb: 1.5,
            fontFamily: '"Playfair Display", serif',
            textAlign: 'center',
            fontSize: '1.8rem',
            fontWeight: 600,
            color: '#2c3e50',
            letterSpacing: '0.5px'
          }}
        >
          {editId ? 'Edit Book Details' : 'Add New Book'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 0 }}>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            margin="dense"
            size="small"
            sx={{
              '& .MuiInputLabel-root': {
                fontFamily: '"Roboto", sans-serif',
                fontWeight: 500
              },
              '& .MuiInputBase-input': {
                fontFamily: '"Roboto", sans-serif'
              }
            }}
          />
          <TextField
            fullWidth
            label="Author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
            margin="dense"
            size="small"
            sx={{
              '& .MuiInputLabel-root': {
                fontFamily: '"Roboto", sans-serif',
                fontWeight: 500
              },
              '& .MuiInputBase-input': {
                fontFamily: '"Roboto", sans-serif'
              }
            }}
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            margin="dense"
            multiline
            rows={1}
            size="small"
            sx={{
              '& .MuiInputLabel-root': {
                fontFamily: '"Roboto", sans-serif',
                fontWeight: 500
              },
              '& .MuiInputBase-input': {
                fontFamily: '"Roboto", sans-serif'
              }
            }}
          />
          <TextField
            fullWidth
            label="ISBN"
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
            required
            margin="dense"
            size="small"
            sx={{
              '& .MuiInputLabel-root': {
                fontFamily: '"Roboto", sans-serif',
                fontWeight: 500
              },
              '& .MuiInputBase-input': {
                fontFamily: '"Roboto", sans-serif'
              }
            }}
          />
          <TextField
            fullWidth
            label="Published Year"
            name="publishedYear"
            type="number"
            value={formData.publishedYear}
            onChange={handleChange}
            required
            margin="dense"
            size="small"
            inputProps={{ min: 0 }}
            sx={{
              '& .MuiInputLabel-root': {
                fontFamily: '"Roboto", sans-serif',
                fontWeight: 500
              },
              '& .MuiInputBase-input': {
                fontFamily: '"Roboto", sans-serif'
              }
            }}
          />
          <TextField
            fullWidth
            label="Genre"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            required
            margin="dense"
            size="small"
            sx={{
              '& .MuiInputLabel-root': {
                fontFamily: '"Roboto", sans-serif',
                fontWeight: 500
              },
              '& .MuiInputBase-input': {
                fontFamily: '"Roboto", sans-serif'
              }
            }}
          />
          <TextField
            fullWidth
            label="Available Copies"
            name="availableCopies"
            type="number"
            value={formData.availableCopies}
            onChange={handleChange}
            required
            margin="dense"
            size="small"
            inputProps={{ min: 0 }}
            sx={{
              '& .MuiInputLabel-root': {
                fontFamily: '"Roboto", sans-serif',
                fontWeight: 500
              },
              '& .MuiInputBase-input': {
                fontFamily: '"Roboto", sans-serif'
              }
            }}
          />
          <TextField
            fullWidth
            label="Book Cover Image URL"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            margin="dense"
            size="small"
            helperText="Leave empty for automatic cover selection based on title, or enter a custom image URL"
            sx={{
              '& .MuiInputLabel-root': {
                fontFamily: '"Roboto", sans-serif',
                fontWeight: 500
              },
              '& .MuiInputBase-input': {
                fontFamily: '"Roboto", sans-serif'
              },
              mb: 1
            }}
          />
          {formData.imageUrl && (
            <Box sx={{ mt: 1, mb: 2, textAlign: 'center' }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Preview:</Typography>
              <img 
                src={formData.imageUrl.startsWith('/') ? formData.imageUrl : `/images/${formData.imageUrl}`}
                alt="Book cover preview"
                style={{
                  maxWidth: '150px',
                  maxHeight: '200px',
                  objectFit: 'contain',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
                onError={(e) => {
                  e.target.src = '/images/Default Book1.jpg';
                }}
              />
            </Box>
          )}
          <Box sx={{ mt: 1.5, mb: 1, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ 
                py: 1,
                bgcolor: '#75767A',
                '&:hover': {
                  bgcolor: '#636466'
                }
              }}
            >
              {editId ? 'Update Book' : 'Add Book'}
            </Button>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={() => editId ? navigate('/profile', { state: { showDetails: true } }) : navigate('/')}
              sx={{ py: 1 }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default AddBook; 