import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, AppBar, Toolbar, Typography, Container } from '@mui/material';
import { LanguageProvider } from './contexts/LanguageContext';
import theme from './theme';
import LanguageSwitcher from './components/LanguageSwitcher';
import Home from './pages/Home';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import HospitalDetail from './pages/HospitalDetail';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <LanguageProvider>
        <CssBaseline />
        <Router>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar position="static">
              <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Montreal Health
                </Typography>
                <LanguageSwitcher />
              </Toolbar>
            </AppBar>
            <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/hospital/:id" element={<HospitalDetail />} />
              </Routes>
            </Container>
            <Box component="footer" sx={{ py: 3, bgcolor: 'background.paper' }}>
              <Container maxWidth="lg">
                <Typography variant="body2" color="text.secondary" align="center">
                  © {new Date().getFullYear()} Montreal Health. All rights reserved.
                </Typography>
              </Container>
            </Box>
          </Box>
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App; 