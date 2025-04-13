import React from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  Box
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const FAQ: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Frequently Asked Questions
        </Typography>
        <Typography variant="body1" paragraph>
          Find answers to common questions about our hospital wait time finder and healthcare in Quebec.
        </Typography>
      </Paper>

      <Box sx={{ mb: 4 }}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">How accurate are the wait times?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Wait times are sourced directly from the Données Québec API and are updated in real-time. However, emergency room conditions can change rapidly. We recommend calling the hospital directly for the most current information before making a trip.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">What do non-insured costs mean?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Non-insured costs are fees charged to individuals who don't have Quebec health insurance (RAMQ) or whose insurance doesn't cover certain services. This includes newcomers to Quebec who haven't yet received their health card, visitors from other provinces or countries, and services not covered by the public health system.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">How do I know if I'm eligible for free healthcare in Quebec?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Quebec residents with a valid health insurance card (RAMQ) are eligible for free healthcare services. To be eligible, you must be a Canadian citizen or permanent resident who has lived in Quebec for at least 183 days in a 12-month period. Newcomers should apply for RAMQ as soon as possible after arriving in Quebec.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Can I use this tool outside Montreal?</Typography>
          </AccordionSummary>
          <AccordionDetails>
              <Typography>
                Currently, our wait time data is limited to hospitals in the Montreal area. However, we plan to expand coverage to other regions of Quebec in the future. For hospitals outside Montreal, you can still use our platform to find basic information, but wait times may not be available.
              </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">How often are wait times updated?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Wait times are updated in real-time through the Données Québec API. Each hospital reports their current wait times, which are then reflected on our platform. The timestamp of the last update is displayed on each hospital's detail page.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">What should I do in a medical emergency?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              In a medical emergency, call 911 immediately. Do not rely on wait times to decide whether to seek emergency care. Emergency rooms prioritize patients based on the severity of their condition, not arrival time.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">How can I report incorrect information?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              If you notice any incorrect information on our platform, please use the Contact page to report it. We strive to maintain accurate data and appreciate your help in keeping our information up-to-date.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Container>
  );
};

export default FAQ; 