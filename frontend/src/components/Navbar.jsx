import { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../App';

function Navbar() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const handleAddBookClick = () => {
    if (!user) {
      navigate('/signup');
    } else {
      navigate('/add');
    }
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        width: '100%', 
        top: 0, 
        left: 0,
        bgcolor: '#75767A', // Grey background
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)' // Subtle shadow
      }}
    >
      <Toolbar sx={{ minHeight: '64px' }}>
        <Typography 
          variant="h6" 
          component={Link} 
          to="/" 
          sx={{ 
            flexGrow: 1, 
            textDecoration: 'none', 
            color: '#ffffff', // Ensuring text is white for contrast
            fontWeight: 700,
            letterSpacing: '1px',
            fontFamily: '"Titillium Web", sans-serif',
            fontSize: '1.5rem',
            textTransform: 'uppercase'
          }}
        >
          Page Flow
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button 
            color="inherit" 
            component={Link} 
            to="/"
            sx={{ 
              color: '#ffffff', // Ensuring button text is white
              fontFamily: '"Titillium Web", sans-serif',
              fontWeight: 600,
              '&:hover': { 
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: 'translateY(-2px)',
                transition: 'all 0.2s'
              }
            }}
          >
            Books
          </Button>
          {user?.role === 'admin' && (
            <Button 
              color="inherit" 
              onClick={handleAddBookClick}
              sx={{ 
                color: '#ffffff',
                fontFamily: '"Titillium Web", sans-serif',
                fontWeight: 600,
                '&:hover': { 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s'
                }
              }}
            >
              Add Book
            </Button>
          )}
          {user ? (
            <Box 
              component={Link}
              to="/profile"
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'flex-end',
                minWidth: '150px',
                textDecoration: 'none',
                cursor: 'pointer',
                '&:hover': {
                  '& .MuiTypography-root': {
                    color: 'rgba(255, 255, 255, 0.9)'
                  }
                }
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#ffffff',
                  fontFamily: '"Titillium Web", sans-serif',
                  fontWeight: 600,
                  lineHeight: 1.2,
                  transition: 'color 0.2s'
                }}
              >
                {user?.email?.split('@')[0]}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontFamily: '"Titillium Web", sans-serif',
                  fontSize: '0.75rem',
                  transition: 'color 0.2s'
                }}
              >
                {user?.email}
              </Typography>
            </Box>
          ) : (
            <Button 
              color="inherit" 
              component={Link} 
              to="/login"
              sx={{ 
                color: '#ffffff',
                fontFamily: '"Titillium Web", sans-serif',
                fontWeight: 600,
                '&:hover': { 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s'
                }
              }}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 