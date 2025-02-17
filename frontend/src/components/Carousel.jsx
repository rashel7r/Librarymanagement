import { useState, useEffect } from 'react';
import { Box, IconButton, Typography, Container } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const carouselData = [
  {
    image: '/images/homepage1.jpg',
    title: 'Welcome to Page Flow',
    description: 'Discover your next favorite book in our extensive collection'
  },
  {
    image: '/images/homepage%202.jpg',
    title: 'Explore New Worlds',
    description: 'Immerse yourself in countless stories and adventures'
  },
  {
    image: '/images/homepage3.jpg',
    title: 'Join Our Community',
    description: 'Connect with fellow book lovers and share your passion for reading'
  }
];

function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselData.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + carouselData.length) % carouselData.length);
  };

  const handleImageError = (e) => {
    console.error('Image failed to load:', e.target.src);
    e.target.src = 'https://via.placeholder.com/1200x600?text=Image+Not+Found';
  };

  useEffect(() => {
    const loadImages = async () => {
      try {
        const imagePromises = carouselData.map((item) => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = item.image;
            img.onload = resolve;
            img.onerror = reject;
          });
        });
        await Promise.all(imagePromises);
        setImagesLoaded(true);
      } catch (error) {
        console.error('Error loading images:', error);
        setImagesLoaded(true);
      }
    };
    loadImages();

    const timer = setInterval(handleNext, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box
      sx={{
        width: '100%',
        position: 'relative',
        mt: '-64px',
        mb: 0,
        marginLeft: '-24px',
        marginRight: '-24px',
        height: 'auto'
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: 'calc(100% + 48px)',
          height: { xs: '400px', sm: '500px', md: '600px' },
          overflow: 'hidden',
          mt: '64px'
        }}
      >
        {/* Carousel Items */}
        <Box
          sx={{
            display: 'flex',
            height: '100%',
            transition: 'transform 0.5s ease-in-out',
            transform: `translateX(-${currentIndex * 100}%)`,
            position: 'relative',
          }}
        >
          {carouselData.map((item, index) => (
            <Box
              key={index}
              sx={{
                minWidth: '100%',
                height: '100%',
                position: 'relative',
              }}
            >
              <Box
                component="img"
                src={item.image}
                alt={item.title}
                onError={handleImageError}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'brightness(0.7)',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: '20%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  textAlign: 'center',
                  color: 'white',
                  width: '80%',
                  maxWidth: '800px',
                  zIndex: 1,
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                    fontFamily: '"Titillium Web", sans-serif',
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                    fontFamily: '"Titillium Web", sans-serif',
                    fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                  }}
                >
                  {item.description}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Navigation Buttons - Moved outside carousel items */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10,
            pointerEvents: 'none',
          }}
        >
          <IconButton
            onClick={handlePrevious}
            aria-label="Previous slide"
            sx={{
              position: 'absolute',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'white',
              width: { xs: 40, md: 48 },
              height: '100%',
              borderRadius: 0,
              bgcolor: 'rgba(0, 0, 0, 0.3)',
              pointerEvents: 'auto',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.5)',
              },
            }}
          >
            <ChevronLeftIcon sx={{ fontSize: { xs: 32, md: 40 } }} />
          </IconButton>

          <IconButton
            onClick={handleNext}
            aria-label="Next slide"
            sx={{
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'white',
              width: { xs: 40, md: 48 },
              height: '100%',
              borderRadius: 0,
              bgcolor: 'rgba(0, 0, 0, 0.3)',
              pointerEvents: 'auto',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.5)',
              },
            }}
          >
            <ChevronRightIcon sx={{ fontSize: { xs: 32, md: 40 } }} />
          </IconButton>
        </Box>

        {/* Indicators */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 2,
            zIndex: 10,
          }}
        >
          {carouselData.map((_, index) => (
            <Box
              key={index}
              component="button"
              onClick={() => setCurrentIndex(index)}
              sx={{
                width: 12,
                height: 12,
                padding: 0,
                border: 'none',
                borderRadius: '50%',
                bgcolor: index === currentIndex ? 'white' : 'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.2)',
                  bgcolor: 'white',
                },
              }}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default Carousel; 