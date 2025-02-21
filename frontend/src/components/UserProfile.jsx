import { useContext, useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../App';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Button,
  IconButton,
  Input,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Grid
} from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import axios from 'axios';
import Footer from './Footer';

function UserProfile() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [userBooks, setUserBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(location.state?.showDetails || false);
  const [selectedBook, setSelectedBook] = useState(location.state?.selectedBook || null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState({ show: false, message: '', severity: 'success' });

  useEffect(() => {
    if (showDetails && !selectedBook) {
      fetchBooks();
    }
  }, [showDetails, selectedBook]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:5000/api/books');
      setUserBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
      setError('Failed to load books. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleShowDetails = () => {
    if (!showDetails) {
      setSelectedBook(null);
      fetchBooks();
    }
    setShowDetails(!showDetails);
  };

  const handleSignOut = () => {
    setOpenSnackbar(true);
    setTimeout(() => {
      setUser(null);
      navigate('/login');
    }, 1500);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleChangeProfilePic = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        // Update user context with the new image
        setUser(prev => ({
          ...prev,
          profileImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteClick = (book) => {
    setBookToDelete(book);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/api/books/${bookToDelete._id}`);
      setDeleteDialogOpen(false);
      setDeleteStatus({
        show: true,
        message: 'Book deleted successfully',
        severity: 'success'
      });
      // Refresh the book list
      fetchBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
      setDeleteStatus({
        show: true,
        message: 'Failed to delete book. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
      setBookToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setBookToDelete(null);
  };

  const handleStatusClose = () => {
    setDeleteStatus({ ...deleteStatus, show: false });
  };

  return (
    <Container 
      maxWidth={false}
      disableGutters 
      sx={{ 
        m: 0,
        p: 0,
        minHeight: '100vh',
        minWidth: '100vw',
        backgroundImage: `url('./images/userprofile.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pt: 12
      }}
    >
      <Snackbar
        open={openSnackbar}
        autoHideDuration={1500}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{
          position: 'fixed',
          top: '100px !important',
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
          Signing out...
        </Alert>
      </Snackbar>
      <Snackbar
        open={deleteStatus.show}
        autoHideDuration={3000}
        onClose={handleStatusClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleStatusClose} 
          severity={deleteStatus.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {deleteStatus.message}
        </Alert>
      </Snackbar>
      <Typography 
        variant="h3" 
        component="h1" 
        sx={{ 
          mb: 4, 
          fontWeight: 700,
          color: '#2e2e2e',
          textAlign: 'center',
          fontFamily: '"Titillium Web", sans-serif',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}
      >
        User Profile
      </Typography>
      <Paper 
        elevation={3} 
        sx={{ 
          p: { xs: 2, sm: 3, md: 4 }, 
          borderRadius: 2,
          maxWidth: showDetails ? '90%' : '800px',
          width: '100%',
          mx: 'auto',
          backgroundColor: 'rgba(245, 245, 245, 0.95)',
          backdropFilter: 'blur(8px)',
          transition: 'max-width 0.3s ease-in-out',
          mb: 4
        }}
      >
        <Input
          type="file"
          inputRef={fileInputRef}
          sx={{ display: 'none' }}
          inputProps={{
            accept: 'image/*'
          }}
          onChange={handleFileChange}
        />
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          gap: 4
        }}>
          {/* Top Section with Avatar and User Info */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'center',
            gap: { xs: 3, sm: 6 },
            width: '100%',
            maxWidth: '800px'
          }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
            }}>
              <Avatar 
                src={profileImage || user?.profileImage}
                sx={{ 
                  width: 130, 
                  height: 130, 
                  bgcolor: '#75767A',
                  fontSize: '3rem',
                  mb: 2,
                  border: '4px solid rgba(255, 255, 255, 0.8)'
                }}
              >
                {user?.email?.charAt(0).toUpperCase()}
              </Avatar>
              <Button
                startIcon={<CameraAltIcon />}
                size="small"
                sx={{
                  color: '#fff',
                  textTransform: 'none',
                  bgcolor: '#7A7A7A',
                  '&:hover': {
                    backgroundColor: '#666666'
                  },
                  px: 2,
                  py: 0.5
                }}
                onClick={handleChangeProfilePic}
              >
                Profile Picture
              </Button>
            </Box>

            <Box sx={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: { xs: 'center', sm: 'flex-start' },
              textAlign: { xs: 'center', sm: 'left' }
            }}>
              <Typography variant="h4" sx={{ 
                fontWeight: 600, 
                mb: 1,
                color: '#2c3e50'
              }}>
                {user?.email?.split('@')[0]}
              </Typography>
              <Typography variant="body1" sx={{ 
                color: '#666', 
                mb: 1,
                fontSize: '1.1rem'
              }}>
                {user?.email}
              </Typography>
            </Box>
          </Box>

          {/* Account Information Section */}
          <Box sx={{ 
            width: '100%',
            maxWidth: '800px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <Typography variant="h6" sx={{ 
              mb: 3, 
              fontWeight: 600,
              color: '#75767A',
              alignSelf: { xs: 'center', sm: 'flex-start' },
              ml: { xs: 0, sm: 8 }
            }}>
              Account Information
            </Typography>
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 3,
              width: '100%',
              px: { xs: 2, sm: 8 }
            }}>
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
                bgcolor: 'rgba(0,0,0,0.02)',
                p: 2,
                borderRadius: 1,
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}>
                <Typography variant="subtitle2" sx={{ color: '#666' }}>
                  Username
                </Typography>
                <Typography variant="body1" sx={{ color: '#2c3e50', fontWeight: 500 }}>
                  {user?.email?.split('@')[0]}
                </Typography>
              </Box>
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
                bgcolor: 'rgba(0,0,0,0.02)',
                p: 2,
                borderRadius: 1,
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}>
                <Typography variant="subtitle2" sx={{ color: '#666' }}>
                  Email Address
                </Typography>
                <Typography variant="body1" sx={{ color: '#2c3e50', fontWeight: 500 }}>
                  {user?.email}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          gap: 2,
          mt: 6
        }}>
          <Button
            variant="contained"
            size='small'
            onClick={handleShowDetails}
            sx={{
              px: 4,
              py: 1,
              fontSize: '1rem',
              fontWeight: 600,
              bgcolor: '#75767A',
              color: 'white',
              '&:hover': {
                bgcolor: '#636466'
              }
            }}
          >
            {showDetails ? 'Hide Details' : 'Book Details'}
          </Button>
          <Button
            variant="contained"
            size='small'
            onClick={handleSignOut}
            color="secondary"
            sx={{
              px: 3,
              py: 1,
              fontSize: '1rem',
              fontWeight: 600
            }}
          >
            Sign Out
          </Button>
        </Box>

        {showDetails && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ 
              mb: 2, 
              mt: 2,
              fontWeight: 600,
              color: '#75767A',
              textAlign: 'center',
              fontSize: '1.5rem'
            }}>
              Book Info
            </Typography>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Typography color="error" sx={{ p: 2 }}>{error}</Typography>
            ) : selectedBook ? (
              <Box sx={{ p: 2 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <img
                      src={selectedBook.imageUrl ? 
                        (selectedBook.imageUrl.startsWith('http') ? selectedBook.imageUrl : `/images/${selectedBook.imageUrl}`)
                        : '/images/Default Book1.jpg'}
                      alt={selectedBook.title}
                      style={{
                        width: '100%',
                        height: 'auto',
                        maxHeight: '300px',
                        objectFit: 'contain'
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Typography variant="h5" sx={{ mb: 2 }}>{selectedBook.title}</Typography>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>By {selectedBook.author}</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>{selectedBook.description}</Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2">Genre: {selectedBook.genre}</Typography>
                      <Typography variant="body2">ISBN: {selectedBook.isbn}</Typography>
                      <Typography variant="body2">Published Year: {selectedBook.publishedYear}</Typography>
                      <Typography variant="body2">Available Copies: {selectedBook.availableCopies}</Typography>
                    </Box>
                    {user?.role === 'admin' && (
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                          variant="contained"
                          onClick={() => navigate(`/add?edit=${selectedBook._id}`)}
                          sx={{ bgcolor: '#75767A', '&:hover': { bgcolor: '#636466' } }}
                        >
                          Edit Book
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleDeleteClick(selectedBook)}
                        >
                          Delete Book
                        </Button>
                      </Box>
                    )}
                  </Grid>
                </Grid>
              </Box>
            ) : userBooks.length === 0 ? (
              <Typography sx={{ p: 2 }}>No books available.</Typography>
            ) : (
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, bgcolor: '#75767A', color: 'white' }}>Title</TableCell>
                      <TableCell sx={{ fontWeight: 600, bgcolor: '#75767A', color: 'white' }}>Author</TableCell>
                      <TableCell sx={{ fontWeight: 600, bgcolor: '#75767A', color: 'white' }}>Genre</TableCell>
                      <TableCell sx={{ fontWeight: 600, bgcolor: '#75767A', color: 'white' }}>ISBN</TableCell>
                      <TableCell sx={{ fontWeight: 600, bgcolor: '#75767A', color: 'white' }}>Published Year</TableCell>
                      <TableCell sx={{ fontWeight: 600, bgcolor: '#75767A', color: 'white' }}>Available Copies</TableCell>
                      {user?.role === 'admin' && (
                        <TableCell sx={{ fontWeight: 600, bgcolor: '#75767A', color: 'white' }}>Actions</TableCell>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {userBooks.map((book) => (
                      <TableRow 
                        key={book._id}
                        hover
                        sx={{ 
                          '&:nth-of-type(odd)': { bgcolor: 'rgba(0, 0, 0, 0.02)' },
                          '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
                        }}
                      >
                        <TableCell>{book.title}</TableCell>
                        <TableCell>{book.author}</TableCell>
                        <TableCell>{book.genre}</TableCell>
                        <TableCell>{book.isbn}</TableCell>
                        <TableCell>{book.publishedYear}</TableCell>
                        <TableCell>{book.availableCopies}</TableCell>
                        {user?.role === 'admin' && (
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                              <Button
                                size="small"
                                variant="contained"
                                onClick={() => navigate(`/add?edit=${book._id}`)}
                                sx={{
                                  bgcolor: '#75767A',
                                  minWidth: 'unset',
                                  px: 2,
                                  '&:hover': {
                                    bgcolor: '#636466'
                                  }
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                size="small"
                                variant="contained"
                                color="secondary"
                                onClick={() => handleDeleteClick(book)}
                                sx={{
                                  minWidth: 'unset',
                                  px: 2
                                }}
                              >
                                Delete
                              </Button>
                            </Box>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        )}
      </Paper>

      <Footer />

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete "{bookToDelete?.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2 }}>
          <Button 
            onClick={handleDeleteCancel}
            variant="contained"
            sx={{ 
              bgcolor: '#E0E0E0',
              color: '#333333',
              mr: 2,
              '&:hover': {
                bgcolor: '#CCCCCC'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default UserProfile; 