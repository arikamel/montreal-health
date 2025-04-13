import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Paper, CircularProgress, Alert, Grid, Card, CardContent, CardActions } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import { getHospitalWaitTimes, HospitalWaitTime } from '../services/api';
import { geocodeAddress, GeocodingResult } from '../services/geocoding';
import { useLanguage } from '../contexts/LanguageContext';

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom hospital icon
const hospitalIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to update map view when user location changes
const MapUpdater: React.FC<{ center: [number, number], zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
};

const Home: React.FC = () => {
  const [address, setAddress] = useState('');
  const [userLocation, setUserLocation] = useState<GeocodingResult | null>(null);
  const [hospitals, setHospitals] = useState<HospitalWaitTime[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([45.508888, -73.561668]); // Montreal coordinates
  const [mapZoom, setMapZoom] = useState(13);
  
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Fetch hospitals on component mount
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const data = await getHospitalWaitTimes();
        setHospitals(data);
      } catch (err) {
        console.error('Error fetching hospitals:', err);
        setError('Failed to load hospital data. Please try again later.');
      }
    };

    fetchHospitals();
  }, []);

  const handleSearch = async () => {
    if (!address.trim()) {
      setError('Please enter an address');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await geocodeAddress(address);
      
      if (result) {
        setUserLocation(result);
        setMapCenter([result.latitude, result.longitude]);
        setMapZoom(14);
      } else {
        setError('Could not find the address. Please try a different address.');
      }
    } catch (err) {
      console.error('Error geocoding address:', err);
      setError('An error occurred while searching. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkerClick = (hospitalId: string) => {
    navigate(`/hospital/${hospitalId}`);
  };

  const getWaitTimeColor = (waitTime: number) => {
    if (waitTime <= 2) return 'green';
    if (waitTime <= 4) return 'orange';
    return 'red';
  };

  const features = [
    {
      title: t('home.features.emergency.title'),
      description: t('home.features.emergency.description'),
      action: t('home.features.emergency.action'),
      path: '/emergency'
    },
    {
      title: t('home.features.appointments.title'),
      description: t('home.features.appointments.description'),
      action: t('home.features.appointments.action'),
      path: '/appointments'
    },
    {
      title: t('home.features.hospitals.title'),
      description: t('home.features.hospitals.description'),
      action: t('home.features.hospitals.action'),
      path: '/hospitals'
    }
  ];

  return (
    <Box>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          {t('home.hero.title')}
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          {t('home.hero.subtitle')}
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/hospitals')}
          sx={{ mt: 2 }}
        >
          {t('home.hero.cta')}
        </Button>
      </Box>

      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {feature.title}
                </Typography>
                <Typography>
                  {feature.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate(feature.path)}>
                  {feature.action}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Paper sx={{ p: 3, mb: 2 }}>
          <Typography variant="h4" gutterBottom>
            {t('home.search.title')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label={t('home.search.addressLabel')}
              placeholder={t('home.search.addressPlaceholder')}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              sx={{ minWidth: '150px' }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : t('home.search.button')}
            </Button>
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {userLocation && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {t('home.search.locationFound', { address: userLocation.formattedAddress })}
            </Alert>
          )}
        </Paper>

        <Box sx={{ flex: 1, minHeight: '500px' }}>
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            <MapUpdater center={mapCenter} zoom={mapZoom} />
            
            {/* User location marker */}
            {userLocation && (
              <Marker 
                position={[userLocation.latitude, userLocation.longitude]}
                icon={new L.Icon({
                  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                  shadowSize: [41, 41]
                })}
              >
                <Popup>
                  <Typography variant="subtitle2">{t('home.map.yourLocation')}</Typography>
                </Popup>
              </Marker>
            )}
            
            {/* Hospital markers */}
            {hospitals.map((hospital) => (
              <Marker 
                key={hospital.hospital_name}
                position={[hospital.location.latitude, hospital.location.longitude]}
                icon={hospitalIcon}
                eventHandlers={{
                  click: () => handleMarkerClick(hospital.hospital_name),
                }}
              >
                <Popup>
                  <Box sx={{ minWidth: '200px' }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {hospital.hospital_name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: getWaitTimeColor(hospital.wait_time) }}>
                      Wait Time: {hospital.wait_time} hours
                    </Typography>
                    <Typography variant="body2">
                      Patients waiting: {hospital.number_of_patients}
                    </Typography>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      sx={{ mt: 1 }}
                      onClick={() => handleMarkerClick(hospital.hospital_name)}
                    >
                      View Details
                    </Button>
                  </Box>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default Home; 