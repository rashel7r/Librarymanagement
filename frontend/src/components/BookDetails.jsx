import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Paper, Grid, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from './Footer';

function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [book, setBook] = useState(null);
  const images = [
    '/images/Book Details1 (3).jpg',
    '/images/Book Details2.jpg',
    '/images/Book Details3.jpg'
  ];

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/books/${id}`);
        setBook(response.data);
      } catch (error) {
        console.error('Error fetching book details:', error);
      }
    };

    if (id) {
      fetchBookDetails();
    }
  }, [id]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const handleIndicatorClick = (index) => {
    setCurrentImageIndex(index);
  };

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
      backgroundImage: 'url("/images/BookDetailsContainer.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      width: '100vw',
      m: 0,
      p: 0
    }}>
      <Box 
        sx={{ 
          minHeight: 'calc(100vh - 64px)',
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          width: '100%'
        }}
      >
        <Box sx={{ 
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          mb: 2,
          mt: 3
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
              position: 'relative'
            }}
          >
            Book Details
          </Typography>
        </Box>

        <Box 
          sx={{ 
            width: '100vw',
            height: '450px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            bgcolor: '#fff',
            mb: 2,
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          {/* Carousel Inner */}
          <Box
            sx={{
              display: 'flex',
              transition: 'transform 0.5s ease-in-out',
              transform: `translateX(-${currentImageIndex * 100}%)`,
              height: '100%',
              width: '100%',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {images.map((image, index) => (
              <Box
                key={index}
                sx={{
                  minWidth: '100%',
                  height: '100%',
                  flexShrink: 0,
                  position: 'relative'
                }}
              >
                <img
                  src={image}
                  alt={`Book Details ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
              </Box>
            ))}
          </Box>

          {/* Carousel Controls */}
          <Button
            onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
            sx={{
              position: 'absolute',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'white',
              bgcolor: 'rgba(0, 0, 0, 0.3)',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.6)'
              },
              minWidth: '48px',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              ml: 2,
              zIndex: 2,
              fontSize: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: '2px solid white',
              p: 0
            }}
          >
            ❮
          </Button>
          <Button
            onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
            sx={{
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'white',
              bgcolor: 'rgba(0, 0, 0, 0.3)',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.6)'
              },
              minWidth: '48px',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              mr: 2,
              zIndex: 2,
              fontSize: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: '2px solid white',
              p: 0
            }}
          >
            ❯
          </Button>

          {/* Carousel Indicators */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 2,
              zIndex: 2,
              bgcolor: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '20px',
              p: 1
            }}
          >
            {images.map((_, index) => (
              <Button
                key={index}
                onClick={() => handleIndicatorClick(index)}
                sx={{
                  minWidth: 'unset',
                  width: index === currentImageIndex ? '32px' : '12px',
                  height: '12px',
                  borderRadius: '8px',
                  p: 0,
                  bgcolor: index === currentImageIndex ? 'white' : 'rgba(255, 255, 255, 0.5)',
                  border: '2px solid rgba(255, 255, 255, 0.8)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: 'white',
                  }
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Book Details Section with Footer */}
        {book && (
          <>
            <Box sx={{ 
              py: 2,
              px: 2,
              width: '100%',
              maxWidth: '800px',
              mx: 'auto',
              mt: 0,
              position: 'relative',
              zIndex: 1,
            }}>
              <Paper 
                elevation={3}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: '#f5f5f5',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  border: '2px solid #000',
                  position: 'relative',
                  zIndex: 2,
                  mb: 2
                }}
              >
                {/* Book Image */}
                <Box
                  sx={{
                    width: '100%',
                    height: '200px',
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    bgcolor: '#f5f5f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2
                  }}
                >
                  <img
                    src={book.imageUrl ? 
                      (book.imageUrl.startsWith('http') ? book.imageUrl : `/images/${book.imageUrl}`)
                      : '/images/Default Book1.jpg'}
                    alt={book.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      padding: '16px'
                    }}
                  />
                </Box>

                {/* Book Information */}
                <Box>
                  <Typography 
                    variant="h3" 
                    component="h2"
                    sx={{ 
                      mb: 2,
                      color: '#75767A',
                      fontWeight: 600,
                      fontSize: {
                        xs: '1.75rem',
                        sm: '2rem',
                        md: '2.5rem'
                      },
                      textAlign: 'center'
                    }}
                  >
                    {book.title}
                  </Typography>
                  
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      mb: 3,
                      color: '#666',
                      fontStyle: 'italic',
                      textAlign: 'center',
                      fontSize: {
                        xs: '1.25rem',
                        sm: '1.5rem'
                      }
                    }}
                  >
                    by {book.author}
                  </Typography>

                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: 2,
                    width: '100%',
                    maxWidth: '600px',
                    mx: 'auto'
                  }}>
                    <Box>
                      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1, textAlign: 'center' }}>
                        Description
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontWeight: 400,
                          lineHeight: 1.7,
                          color: '#2c3e50',
                          textAlign: 'center'
                        }}
                      >
                        {book.description}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1, textAlign: 'center' }}>
                        Genre
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500, textAlign: 'center' }}>
                        {book.genre}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1, textAlign: 'center' }}>
                        Published Year
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500, textAlign: 'center' }}>
                        {book.publishedYear}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1, textAlign: 'center' }}>
                        ISBN
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500, textAlign: 'center' }}>
                        {book.isbn}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1, textAlign: 'center' }}>
                        Available Copies
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500, textAlign: 'center' }}>
                        {book.availableCopies}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 10,
                  mt: 2.5,
                  pt: 2,
                  borderTop: '1px solid rgba(0, 0, 0, 0.1)'
                }}>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/')}
                    sx={{
                      bgcolor: '#d32f2f',
                      px: 8,
                      py: 1,
                      fontSize: '1rem',
                      fontWeight: 500,
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: '#b71c1c'
                      }
                    }}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/profile', {
                      state: {
                        showDetails: true,
                        selectedBook: book
                      }
                    })}
                    sx={{
                      bgcolor: '#75767A',
                      px: 8,
                      py: 1,
                      fontSize: '1rem',
                      fontWeight: 500,
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: '#636466'
                      }
                    }}
                  >
                    Confirm
                  </Button>
                </Box>
              </Paper>
            </Box>

            {/* Footer in full width */}
            <Box 
              sx={{ 
                width: '100vw',
                position: 'relative',
                left: '50%',
                right: '50%',
                marginLeft: '-50vw',
                marginRight: '-50vw',
                mt: 0,
                pt: 0,
                bgcolor: '#75767A'
              }}
            >
              <Footer />
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}

export default BookDetails; 