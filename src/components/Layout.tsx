import React from 'react';
import { Box, AppBar, Toolbar, Typography, Button, Container, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component={RouterLink} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
            Montreal Health
          </Typography>
          <Button color="inherit" component={RouterLink} to="/">
            Home
          </Button>
          <Button color="inherit" component={RouterLink} to="/about">
            About
          </Button>
          <Button color="inherit" component={RouterLink} to="/faq">
            FAQ
          </Button>
          <Button color="inherit" component={RouterLink} to="/contact">
            Contact
          </Button>
        </Toolbar>
      </AppBar>

      <Container component="main" sx={{ flex: 1, py: 4 }}>
        {children}
      </Container>

      <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: 'primary.main', color: 'white' }}>
        <Container maxWidth="lg">
          <Typography variant="body2" align="center">
            Wait times are sourced from Données Québec and are updated in real-time. Non-insured costs are estimates only—please verify with the hospital.
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Link href="/privacy" color="inherit" underline="hover">
              Privacy Policy
            </Link>
            <Link href="/terms" color="inherit" underline="hover">
              Terms of Service
            </Link>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout; 