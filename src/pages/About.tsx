import React from 'react';
import { Box, Typography, Paper, Container, Grid } from '@mui/material';
import { LocalHospital, AccessTime, AttachMoney, Language } from '@mui/icons-material';

const About: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          About Montreal Hospital Wait Time Finder
        </Typography>
        <Typography variant="body1" paragraph>
          This tool is designed to help Montreal residents access healthcare efficiently by providing real-time wait times and cost estimates for non-insured services. Whether you're a long-time resident or new to Quebec, our platform makes it easier to navigate the healthcare system.
        </Typography>
      </Paper>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocalHospital color="primary" sx={{ mr: 1, fontSize: 28 }} />
              <Typography variant="h6">Find Nearby Hospitals</Typography>
            </Box>
            <Typography variant="body2">
              Our interactive map helps you locate hospitals in your area. Simply enter your address to see all healthcare facilities within your vicinity, complete with real-time wait times.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AccessTime color="primary" sx={{ mr: 1, fontSize: 28 }} />
              <Typography variant="h6">Real-Time Wait Times</Typography>
            </Box>
            <Typography variant="body2">
              We provide up-to-date emergency room wait times sourced directly from the Données Québec API. This information helps you make informed decisions about which hospital to visit based on current conditions.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AttachMoney color="primary" sx={{ mr: 1, fontSize: 28 }} />
              <Typography variant="h6">Non-Insured Cost Estimates</Typography>
            </Box>
            <Typography variant="body2">
              For newcomers or those without Quebec health insurance, we provide estimates for common medical services. This helps you understand potential costs before visiting a hospital.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Language color="primary" sx={{ mr: 1, fontSize: 28 }} />
              <Typography variant="h6">Bilingual Support</Typography>
            </Box>
            <Typography variant="body2">
              Our platform is available in both English and French to serve Montreal's diverse population. We're committed to making healthcare information accessible to everyone in the community.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Data Sources
        </Typography>
        <Typography variant="body1" paragraph>
          Our information comes from reliable sources:
        </Typography>
        <ul>
          <li>
            <Typography variant="body2" paragraph>
              <strong>Wait times:</strong> Données Québec API provides real-time emergency room wait times for Montreal hospitals.
            </Typography>
          </li>
          <li>
            <Typography variant="body2" paragraph>
              <strong>Hospital information:</strong> We collect and verify data from official hospital websites and government sources.
            </Typography>
          </li>
          <li>
            <Typography variant="body2" paragraph>
              <strong>Non-insured costs:</strong> Cost estimates are gathered from hospital websites and official documentation, with regular updates to ensure accuracy.
            </Typography>
          </li>
        </ul>
      </Paper>
    </Container>
  );
};

export default About; 