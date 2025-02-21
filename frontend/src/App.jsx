import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { useState, createContext } from 'react';
import Navbar from './components/Navbar';
import BookList from './components/BookList';
import AddBook from './components/AddBook';
import Login from './components/Login';
import SignUp from './components/SignUp';
import UserProfile from './components/UserProfile';
import BookDetails from './components/BookDetails';
import AddToCart from './components/AddToCart';
import Checkout from './components/Checkout';
import OrderDetails from './components/OrderDetails';

export const UserContext = createContext(null);

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#ff0000',
    },
    black: {
      main: '#000000',
      contrastText: '#ffffff'
    }
  },
});

// Protected Route Component
const ProtectedRoute = ({ element: Element, allowedRole, user, redirectPath = '/login' }) => {
  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return Element;
};

function App() {
  const [user, setUser] = useState(null);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserContext.Provider value={{ user, setUser }}>
        <Router>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            minHeight: '100vh',
            width: '100%'
          }}>
            <Navbar />
            <Box component="main" sx={{ 
              flexGrow: 1, 
              pt: 0,
              px: 3,
              width: '100%',
              maxWidth: '100%',
              overflowX: 'hidden',
              bgcolor: '#f8f8f8',
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Routes>
                <Route path="/" element={<BookList />} />
                <Route path="/add" element={<ProtectedRoute element={<AddBook />} user={user} allowedRole="admin" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/profile" element={<ProtectedRoute element={<UserProfile />} user={user} />} />
                <Route path="/book/:id" element={<BookDetails />} />
                <Route path="/cart" element={<AddToCart />} />
                <Route path="/checkout" element={<ProtectedRoute element={<Checkout />} user={user} allowedRole="client" />} />
                <Route path="/order-details" element={<ProtectedRoute element={<OrderDetails />} user={user} allowedRole="admin" />} />
              </Routes>
            </Box>
          </Box>
        </Router>
      </UserContext.Provider>
    </ThemeProvider>
  );
}

export default App;
