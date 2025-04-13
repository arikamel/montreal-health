import React from 'react';
import { Button, ButtonGroup } from '@mui/material';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <ButtonGroup variant="outlined" size="small">
      <Button
        onClick={() => setLanguage('en')}
        variant={language === 'en' ? 'contained' : 'outlined'}
        sx={{ minWidth: '60px' }}
      >
        EN
      </Button>
      <Button
        onClick={() => setLanguage('fr')}
        variant={language === 'fr' ? 'contained' : 'outlined'}
        sx={{ minWidth: '60px' }}
      >
        FR
      </Button>
    </ButtonGroup>
  );
};

export default LanguageSwitcher; 