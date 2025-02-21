import { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  CircularProgress,
  Box,
  Grow,
  Snackbar,
  Alert,
  IconButton,
  TextField,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from 'axios';
import Carousel from './Carousel';
import Footer from './Footer';
import { UserContext } from '../App';

function BookList() {
  const { user } = useContext(UserContext);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('title');
  const navigate = useNavigate();
  const location = useLocation();

  const fetchBooks = async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setRefreshing(true);
      }
      setError(null);
      const response = await axios.get('http://localhost:5000/api/books');
      console.log('Fetched books:', response.data);
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
      if (error.code === 'ERR_NETWORK') {
        setError('Unable to connect to the server. Please make sure the server is running.');
      } else if (error.response) {
        setError(`Error: ${error.response.data.message || 'Failed to load books'}`);
      } else {
        setError('Failed to load books. Please try again.');
      }
    } finally {
      setLoading(false);
      if (showRefreshIndicator) {
        setRefreshing(false);
      }
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [location.key]); // Only fetch when navigation occurs

  const handleRefresh = () => {
    fetchBooks(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await axios.delete(`http://localhost:5000/api/books/${id}`);
        await fetchBooks(); // Refetch books after deletion
      } catch (error) {
        console.error('Error deleting book:', error);
        setError('Failed to delete book. Please try again.');
      }
    }
  };

  const filteredBooks = books.filter((book) => {
    const query = searchQuery.toLowerCase();
    switch (searchType) {
      case 'title':
        return book.title.toLowerCase().includes(query);
      case 'author':
        return book.author.toLowerCase().includes(query);
      case 'genre':
        return book.genre.toLowerCase().includes(query);
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: 'calc(100vh - 80px)' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'auto',
      backgroundImage: 'url("/images/Homepagebg1.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      width: '100vw',
      m: 0,
      p: 0
    }}>
      <Carousel />
      {error && (
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setError(null)} 
            severity="error" 
            variant="filled"
            sx={{ width: '100%' }}
          >
            {error}
          </Alert>
        </Snackbar>
      )}
      <Container 
        maxWidth="xl" 
        sx={{ 
          py: 4, 
          mt: 4, 
          flex: 1,
          px: { xs: 1, sm: 2, md: 3 }
        }}
      >
        <Box 
          sx={{ 
            bgcolor: '#E0E0E0',
            py: 8,
            px: 4,
            mb: 8,
            borderRadius: 2,
            boxShadow: '0px 4px 18px 0px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <Typography 
                variant="h4" 
                sx={{ 
                  color: '#333333',
                  fontFamily: '"Poppins", sans-serif',
                  fontWeight: 300,
                  mb: 1
                }}
              >
                Where Every Page
                <Typography 
                  component="span" 
                  variant="h4" 
                  sx={{ 
                    display: 'block',
                    fontWeight: 600,
                    color: '#333333'
                  }}
                >
                  Tells A Story
                </Typography>
              </Typography>
              <Typography 
                sx={{ 
                  color: '#666666',
                  fontFamily: '"Poppins", sans-serif'
                }}
              >
                Read. Imagine. Explore.
              </Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Box sx={{ 
                display: 'flex',
                gap: 0,
                boxShadow: '0px 4px 18px 0px rgba(0, 0, 0, 0.1)',
                bgcolor: '#CCCCCC',
                borderRadius: 1,
                overflow: 'hidden'
              }}>
                <TextField
                  select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  sx={{ 
                    minWidth: 120,
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { border: 'none' },
                      height: '60px',
                      bgcolor: '#E0E0E0'
                    },
                    '& .MuiSelect-select': {
                      bgcolor: '#E0E0E0'
                    }
                  }}
                >
                  <MenuItem value="title">Title</MenuItem>
                  <MenuItem value="author">Author</MenuItem>
                  <MenuItem value="genre">Genre</MenuItem>
                </TextField>
                <TextField
                  placeholder={`Search by ${searchType}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ 
                    flexGrow: 1,
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { border: 'none' },
                      height: '60px',
                      bgcolor: '#F0F0F0'
                    },
                    '& .MuiInputBase-input': {
                      bgcolor: '#F0F0F0'
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#75767A' }} />
                      </InputAdornment>
                    ),
                    endAdornment: searchQuery ? (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setSearchQuery('')}
                          edge="end"
                          size="small"
                          sx={{ 
                            mr: 0.5,
                            '&:hover': { 
                              bgcolor: 'rgba(0, 0, 0, 0.04)' 
                            }
                          }}
                        >
                          <ClearIcon sx={{ color: '#75767A', fontSize: '1.2rem' }} />
                        </IconButton>
                      </InputAdornment>
                    ) : null
                  }}
                />
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: '#75767A',
                    borderRadius: 0,
                    px: 6,
                    '&:hover': {
                      bgcolor: '#636466'
                    }
                  }}
                >
                  Search
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
        {filteredBooks.length === 0 ? (
          <Typography 
            variant="h6" 
            sx={{ 
              textAlign: 'center', 
              color: '#666',
              mt: 4 
            }}
          >
            {searchQuery ? 'No Books Found.' : 'No books available. Add books to see them here!'}
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {filteredBooks.map((book, index) => (
              <Grow
                in={true}
                key={book._id}
                timeout={(index + 1) * 200}
              >
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <Card sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    borderRadius: 2,
                    overflow: 'hidden',
                    bgcolor: '#F5F5F5',
                    border: '2px solid #000000',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                    }
                  }}>
                    <CardContent sx={{ 
                      flexGrow: 1,
                      p: 3,
                      '&:last-child': { pb: 3 }
                    }}>
                      <Box 
                        sx={{ 
                          width: '100%',
                          height: 200,
                          mb: 2,
                          borderRadius: 1,
                          overflow: 'hidden',
                          bgcolor: '#fff',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          position: 'relative'
                        }}
                      >
                        <img
                          src={book.imageUrl ? 
                            (book.imageUrl.startsWith('http') || book.imageUrl.startsWith('https') ? 
                              book.imageUrl : `/images/${book.imageUrl}`)
                            : '/images/Default Book1.jpg'}
                          alt={`${book.title} cover`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            padding: '8px',
                            transition: 'opacity 0.3s ease'
                          }}
                          onError={(e) => {
                            console.log('Image failed to load:', book.imageUrl);
                            e.target.onerror = null; // Prevent infinite loop
                            e.target.src = '/images/Default Book1.jpg';
                          }}
                          loading="lazy"
                        />
                      </Box>
                      {user?.role === 'admin' && (
                        <Box sx={{ 
                          width: '100%',
                          display: 'flex',
                          justifyContent: 'center',
                          alighItems: 'center',
                          mt: 2,
                          mb: 2
                        }}>
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => navigate(`/add?edit=${book._id}`)}
                            sx={{
                              minWidth: 'unset',
                              px: 2,
                              py: 0.5,
                              bgcolor: '#75767A',
                              fontSize: '0.75rem',
                              textTransform: 'none',
                              '&:hover': {
                                bgcolor: '#636466'
                              }
                            }}
                          >
                            Change Cover
                          </Button>
                        </Box>
                      )}
                      <Typography 
                        variant="h6" 
                        component="div" 
                        gutterBottom
                        sx={{ 
                          fontWeight: 600,
                          color: '#75767A',
                          mb: 1
                        }}
                      >
                        {book.title}
                      </Typography>
                      <Typography 
                        color="text.secondary" 
                        gutterBottom
                        sx={{ 
                          fontStyle: 'italic',
                          mb: 2
                        }}
                      >
                        By {book.author}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          mb: 2,
                          color: '#34495e',
                          lineHeight: 1.6
                        }}
                      >
                        {book.description}
                      </Typography>
                      <Box sx={{ 
                        mt: 2,
                        p: 2,
                        bgcolor: 'rgba(0,0,0,0.02)',
                        borderRadius: 1
                      }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Genre: {book.genre}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          ISBN: {book.isbn}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Published: {book.publishedYear}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Available Copies: {book.availableCopies}
                        </Typography>
                      </Box>
                    </CardContent>
                    <CardActions sx={{ 
                      p: 2, 
                      pt: 0,
                      justifyContent: 'center',
                      gap: 2
                    }}>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => user?.role === 'admin' ? 
                          navigate('/profile', { state: { showDetails: true } }) : 
                          navigate(`/book/${book._id}`)}
                        sx={{
                          bgcolor: '#75767A',
                          width: '35%',
                          py: 1,
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          textTransform: 'none',
                          '&:hover': {
                            bgcolor: '#636466'
                          }
                        }}
                      >
                        {user?.role === 'admin' ? 'View Books' : 'View Book'}
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => navigate('/cart', { 
                          state: { 
                            bookData: {
                              id: book._id,
                              title: book.title,
                              author: book.author,
                              description: book.description,
                              isbn: book.isbn,
                              availableCopies: book.availableCopies,
                              price: 29.99, // You can set your own price logic
                              quantity: 1,
                              imageUrl: book.imageUrl
                            }
                          }
                        })}
                        sx={{
                          bgcolor: 'secondary.main',
                          width: '35%',
                          py: 1,
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          textTransform: 'none',
                          '&:hover': {
                            bgcolor: 'secondary.dark'
                          }
                        }}
                      >
                        Add to Cart
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              </Grow>
            ))}
          </Grid>
        )}
      </Container>
      <Box 
        sx={{ 
          width: '100vw',
          position: 'relative',
          left: '50%',
          right: '50%',
          marginLeft: '-50vw',
          marginRight: '-50vw',
          mt: 'auto',
          bgcolor: '#75767A'
        }}
      >
        <Footer />
      </Box>
    </Box>
  );
}

export default BookList; 