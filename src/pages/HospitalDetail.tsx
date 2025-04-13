import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Grid, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  CircularProgress,
  Divider,
  Chip
} from '@mui/material';
import { 
  AccessTime, 
  LocalHospital, 
  Phone, 
  Language, 
  Directions, 
  People,
  Update
} from '@mui/icons-material';
import { getHospitalDetails, HospitalWaitTime } from '../services/api';

// Mock data for non-insured costs
const mockNonInsuredCosts = [
  { service: 'Emergency Room Visit', cost: '$500-$800' },
  { service: 'X-Ray', cost: '$150-$300' },
  { service: 'Blood Test', cost: '$50-$100' },
  { service: 'Consultation', cost: '$200-$400' },
  { service: 'Ultrasound', cost: '$300-$600' },
  { service: 'CT Scan', cost: '$800-$1,200' },
];

const HospitalDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [hospital, setHospital] = useState<HospitalWaitTime | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHospitalDetails = async () => {
      try {
        if (!id) return;
        
        setLoading(true);
        const data = await getHospitalDetails(id);
        setHospital(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching hospital details:', err);
        setError('Failed to load hospital information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchHospitalDetails();
  }, [id]);

  const handleGetDirections = () => {
    if (hospital) {
      const { latitude, longitude } = hospital.location;
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`, '_blank');
    }
  };

  const getWaitTimeColor = (waitTime: number) => {
    if (waitTime <= 2) return 'success';
    if (waitTime <= 4) return 'warning';
    return 'error';
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !hospital) {
    return (
      <Container>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error" gutterBottom>
            {error || 'Hospital not found'}
          </Typography>
          <Button variant="contained" onClick={() => navigate('/')}>
            Return to Home
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LocalHospital color="primary" sx={{ fontSize: 40, mr: 2 }} />
          <Typography variant="h4">
            {hospital.hospital_name}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Chip 
            icon={<AccessTime />} 
            label={`Wait Time: ${hospital.wait_time} hours`}
            color={getWaitTimeColor(hospital.wait_time)}
            sx={{ mr: 2 }}
          />
          <Chip 
            icon={<People />} 
            label={`${hospital.number_of_patients} patients waiting`}
            variant="outlined"
            sx={{ mr: 2 }}
          />
          <Chip 
            icon={<Update />} 
            label={`Updated: ${new Date(hospital.last_updated).toLocaleString()}`}
            variant="outlined"
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button 
            variant="contained" 
            startIcon={<Directions />}
            onClick={handleGetDirections}
          >
            Get Directions
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<Language />}
            href="#"
            target="_blank"
          >
            Visit Hospital Website
          </Button>
        </Box>
      </Paper>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Hospital Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Address:
              </Typography>
              <Typography variant="body1">
                {/* This would come from the API in a real implementation */}
                123 Hospital Street, Montreal, QC H3A 1A1
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Phone:
              </Typography>
              <Typography variant="body1">
                {/* This would come from the API in a real implementation */}
                (514) 555-0123
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Emergency Room Hours:
              </Typography>
              <Typography variant="body1">
                24 hours / 7 days a week
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Special Services:
              </Typography>
              <Typography variant="body1">
                Pediatrics, Cardiology, Trauma Center
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Non-Insured Costs
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Typography variant="body2" paragraph>
              The following costs are estimates for non-insured patients. Please verify with the hospital directly for the most accurate pricing.
            </Typography>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Service</TableCell>
                    <TableCell align="right">Cost</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockNonInsuredCosts.map((item) => (
                    <TableRow key={item.service}>
                      <TableCell component="th" scope="row">
                        {item.service}
                      </TableCell>
                      <TableCell align="right">{item.cost}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HospitalDetail; 