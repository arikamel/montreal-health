import React, { createContext, useState, useContext, ReactNode } from 'react';

type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations
const translations = {
  en: {
    // Common
    'app.name': 'Montreal Health',
    'app.findHospitals': 'Find Hospitals Near You',
    'app.enterAddress': 'Enter your address',
    'app.addressPlaceholder': 'e.g., 123 Rue Sainte-Catherine',
    'app.findHospitalsButton': 'Find Hospitals',
    'app.yourLocation': 'Your Location',
    'app.viewDetails': 'View Details',
    'app.waitTime': 'Wait Time',
    'app.patientsWaiting': 'Patients waiting',
    'app.updated': 'Updated',
    'app.getDirections': 'Get Directions',
    'app.visitWebsite': 'Visit Hospital Website',
    'app.hospitalInfo': 'Hospital Information',
    'app.address': 'Address',
    'app.phone': 'Phone',
    'app.emergencyHours': 'Emergency Room Hours',
    'app.specialServices': 'Special Services',
    'app.nonInsuredCosts': 'Non-Insured Costs',
    'app.costDisclaimer': 'The following costs are estimates for non-insured patients. Please verify with the hospital directly for the most accurate pricing.',
    'app.service': 'Service',
    'app.cost': 'Cost',
    'app.returnHome': 'Return to Home',
    
    // Home page
    'home.search.title': 'Find Hospitals Near You',
    'home.search.addressLabel': 'Enter your address',
    'home.search.addressPlaceholder': 'e.g., 123 Rue Sainte-Catherine',
    'home.search.button': 'Find Hospitals',
    'home.search.locationFound': 'Found location: {address}',
    'home.map.yourLocation': 'Your Location',
    
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.faq': 'FAQ',
    'nav.contact': 'Contact',
    
    // About page
    'about.title': 'About Montreal Hospital Wait Time Finder',
    'about.description': 'This tool is designed to help Montreal residents access healthcare efficiently by providing real-time wait times and cost estimates for non-insured services. Whether you\'re a long-time resident or new to Quebec, our platform makes it easier to navigate the healthcare system.',
    'about.findHospitals': 'Find Nearby Hospitals',
    'about.findHospitalsDesc': 'Our interactive map helps you locate hospitals in your area. Simply enter your address to see all healthcare facilities within your vicinity, complete with real-time wait times.',
    'about.waitTimes': 'Real-Time Wait Times',
    'about.waitTimesDesc': 'We provide up-to-date emergency room wait times sourced directly from the Données Québec API. This information helps you make informed decisions about which hospital to visit based on current conditions.',
    'about.nonInsuredCosts': 'Non-Insured Cost Estimates',
    'about.nonInsuredCostsDesc': 'For newcomers or those without Quebec health insurance, we provide estimates for common medical services. This helps you understand potential costs before visiting a hospital.',
    'about.bilingual': 'Bilingual Support',
    'about.bilingualDesc': 'Our platform is available in both English and French to serve Montreal\'s diverse population. We\'re committed to making healthcare information accessible to everyone in the community.',
    'about.dataSources': 'Data Sources',
    'about.dataSourcesDesc': 'Our information comes from reliable sources:',
    'about.waitTimesSource': 'Wait times: Données Québec API provides real-time emergency room wait times for Montreal hospitals.',
    'about.hospitalInfoSource': 'Hospital information: We collect and verify data from official hospital websites and government sources.',
    'about.costsSource': 'Non-insured costs: Cost estimates are gathered from hospital websites and official documentation, with regular updates to ensure accuracy.',
    
    // FAQ page
    'faq.title': 'Frequently Asked Questions',
    'faq.description': 'Find answers to common questions about our hospital wait time finder and healthcare in Quebec.',
    'faq.waitTimeAccuracy': 'How accurate are the wait times?',
    'faq.waitTimeAccuracyAnswer': 'Wait times are sourced directly from the Données Québec API and are updated in real-time. However, emergency room conditions can change rapidly. We recommend calling the hospital directly for the most current information before making a trip.',
    'faq.nonInsuredCosts': 'What do non-insured costs mean?',
    'faq.nonInsuredCostsAnswer': 'Non-insured costs are fees charged to individuals who don\'t have Quebec health insurance (RAMQ) or whose insurance doesn\'t cover certain services. This includes newcomers to Quebec who haven\'t yet received their health card, visitors from other provinces or countries, and services not covered by the public health system.',
    'faq.eligibility': 'How do I know if I\'m eligible for free healthcare in Quebec?',
    'faq.eligibilityAnswer': 'Quebec residents with a valid health insurance card (RAMQ) are eligible for free healthcare services. To be eligible, you must be a Canadian citizen or permanent resident who has lived in Quebec for at least 183 days in a 12-month period. Newcomers should apply for RAMQ as soon as possible after arriving in Quebec.',
    'faq.outsideMontreal': 'Can I use this tool outside Montreal?',
    'faq.outsideMontrealAnswer': 'Currently, our wait time data is limited to hospitals in the Montreal area. However, we plan to expand coverage to other regions of Quebec in the future. For hospitals outside Montreal, you can still use our platform to find basic information, but wait times may not be available.',
    'faq.updateFrequency': 'How often are wait times updated?',
    'faq.updateFrequencyAnswer': 'Wait times are updated in real-time through the Données Québec API. Each hospital reports their current wait times, which are then reflected on our platform. The timestamp of the last update is displayed on each hospital\'s detail page.',
    'faq.emergency': 'What should I do in a medical emergency?',
    'faq.emergencyAnswer': 'In a medical emergency, call 911 immediately. Do not rely on wait times to decide whether to seek emergency care. Emergency rooms prioritize patients based on the severity of their condition, not arrival time.',
    'faq.reportIncorrect': 'How can I report incorrect information?',
    'faq.reportIncorrectAnswer': 'If you notice any incorrect information on our platform, please use the Contact page to report it. We strive to maintain accurate data and appreciate your help in keeping our information up-to-date.',
    
    // Contact page
    'contact.title': 'Contact Us',
    'contact.description': 'Have questions or feedback about our hospital wait time finder? We\'d love to hear from you. Fill out the form below and we\'ll get back to you as soon as possible.',
    'contact.name': 'Name',
    'contact.email': 'Email',
    'contact.subject': 'Subject',
    'contact.message': 'Message',
    'contact.send': 'Send Message',
    'contact.success': 'Your message has been sent successfully!',
    
    // Footer
    'footer.disclaimer': 'Wait times are sourced from Données Québec and are updated in real-time. Non-insured costs are estimates only—please verify with the hospital.',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
  },
  fr: {
    // Common
    'app.name': 'Montreal Santé',
    'app.findHospitals': 'Trouver des hôpitaux près de vous',
    'app.enterAddress': 'Entrez votre adresse',
    'app.addressPlaceholder': 'ex: 123 Rue Sainte-Catherine',
    'app.findHospitalsButton': 'Trouver des hôpitaux',
    'app.yourLocation': 'Votre emplacement',
    'app.viewDetails': 'Voir les détails',
    'app.waitTime': 'Temps d\'attente',
    'app.patientsWaiting': 'Patients en attente',
    'app.updated': 'Mis à jour',
    'app.getDirections': 'Obtenir l\'itinéraire',
    'app.visitWebsite': 'Visiter le site web de l\'hôpital',
    'app.hospitalInfo': 'Informations sur l\'hôpital',
    'app.address': 'Adresse',
    'app.phone': 'Téléphone',
    'app.emergencyHours': 'Heures d\'urgence',
    'app.specialServices': 'Services spéciaux',
    'app.nonInsuredCosts': 'Coûts pour les non-assurés',
    'app.costDisclaimer': 'Les coûts suivants sont des estimations pour les patients non assurés. Veuillez vérifier directement avec l\'hôpital pour obtenir les prix les plus précis.',
    'app.service': 'Service',
    'app.cost': 'Coût',
    'app.returnHome': 'Retour à l\'accueil',
    
    // Home page
    'home.search.title': 'Trouver des hôpitaux près de vous',
    'home.search.addressLabel': 'Entrez votre adresse',
    'home.search.addressPlaceholder': 'ex: 123 Rue Sainte-Catherine',
    'home.search.button': 'Trouver des hôpitaux',
    'home.search.locationFound': 'Emplacement trouvé: {address}',
    'home.map.yourLocation': 'Votre emplacement',
    
    // Navigation
    'nav.home': 'Accueil',
    'nav.about': 'À propos',
    'nav.faq': 'FAQ',
    'nav.contact': 'Contact',
    
    // About page
    'about.title': 'À propos de Montreal Santé',
    'about.description': 'Cet outil est conçu pour aider les résidents de Montréal à accéder aux soins de santé efficacement en fournissant des temps d\'attente en temps réel et des estimations de coûts pour les services non assurés. Que vous soyez un résident de longue date ou nouveau au Québec, notre plateforme facilite la navigation dans le système de santé.',
    'about.findHospitals': 'Trouver des hôpitaux à proximité',
    'about.findHospitalsDesc': 'Notre carte interactive vous aide à localiser les hôpitaux dans votre région. Entrez simplement votre adresse pour voir tous les établissements de santé à proximité, avec les temps d\'attente en temps réel.',
    'about.waitTimes': 'Temps d\'attente en temps réel',
    'about.waitTimesDesc': 'Nous fournissons des temps d\'attente à jour pour les salles d\'urgence provenant directement de l\'API Données Québec. Ces informations vous aident à prendre des décisions éclairées sur l\'hôpital à visiter en fonction des conditions actuelles.',
    'about.nonInsuredCosts': 'Estimations des coûts pour les non-assurés',
    'about.nonInsuredCostsDesc': 'Pour les nouveaux arrivants ou ceux sans assurance maladie du Québec, nous fournissons des estimations pour les services médicaux courants. Cela vous aide à comprendre les coûts potentiels avant de visiter un hôpital.',
    'about.bilingual': 'Support bilingue',
    'about.bilingualDesc': 'Notre plateforme est disponible en anglais et en français pour servir la population diversifiée de Montréal. Nous nous engageons à rendre les informations sur la santé accessibles à tous dans la communauté.',
    'about.dataSources': 'Sources de données',
    'about.dataSourcesDesc': 'Nos informations proviennent de sources fiables:',
    'about.waitTimesSource': 'Temps d\'attente: L\'API Données Québec fournit des temps d\'attente en temps réel pour les salles d\'urgence des hôpitaux de Montréal.',
    'about.hospitalInfoSource': 'Informations sur les hôpitaux: Nous collectons et vérifions les données des sites web officiels des hôpitaux et des sources gouvernementales.',
    'about.costsSource': 'Coûts pour les non-assurés: Les estimations de coûts sont recueillies à partir des sites web des hôpitaux et de la documentation officielle, avec des mises à jour régulières pour assurer l\'exactitude.',
    
    // FAQ page
    'faq.title': 'Questions fréquemment posées',
    'faq.description': 'Trouvez des réponses aux questions courantes sur notre outil de recherche de temps d\'attente des hôpitaux et les soins de santé au Québec.',
    'faq.waitTimeAccuracy': 'Quelle est la précision des temps d\'attente?',
    'faq.waitTimeAccuracyAnswer': 'Les temps d\'attente proviennent directement de l\'API Données Québec et sont mis à jour en temps réel. Cependant, les conditions des salles d\'urgence peuvent changer rapidement. Nous vous recommandons d\'appeler directement l\'hôpital pour obtenir les informations les plus récentes avant de vous y rendre.',
    'faq.nonInsuredCosts': 'Que signifient les coûts pour les non-assurés?',
    'faq.nonInsuredCostsAnswer': 'Les coûts pour les non-assurés sont des frais facturés aux personnes qui n\'ont pas d\'assurance maladie du Québec (RAMQ) ou dont l\'assurance ne couvre pas certains services. Cela inclut les nouveaux arrivants au Québec qui n\'ont pas encore reçu leur carte d\'assurance maladie, les visiteurs d\'autres provinces ou pays, et les services non couverts par le système de santé public.',
    'faq.eligibility': 'Comment savoir si je suis admissible aux soins de santé gratuits au Québec?',
    'faq.eligibilityAnswer': 'Les résidents du Québec ayant une carte d\'assurance maladie valide (RAMQ) sont admissibles aux services de santé gratuits. Pour être admissible, vous devez être un citoyen canadien ou un résident permanent qui a vécu au Québec pendant au moins 183 jours sur une période de 12 mois. Les nouveaux arrivants devraient demander la RAMQ dès que possible après leur arrivée au Québec.',
    'faq.outsideMontreal': 'Puis-je utiliser cet outil en dehors de Montréal?',
    'faq.outsideMontrealAnswer': 'Actuellement, nos données de temps d\'attente sont limitées aux hôpitaux de la région de Montréal. Cependant, nous prévoyons d\'étendre la couverture à d\'autres régions du Québec à l\'avenir. Pour les hôpitaux en dehors de Montréal, vous pouvez toujours utiliser notre plateforme pour trouver des informations de base, mais les temps d\'attente peuvent ne pas être disponibles.',
    'faq.updateFrequency': 'À quelle fréquence les temps d\'attente sont-ils mis à jour?',
    'faq.updateFrequencyAnswer': 'Les temps d\'attente sont mis à jour en temps réel via l\'API Données Québec. Chaque hôpital signale ses temps d\'attente actuels, qui sont ensuite reflétés sur notre plateforme. L\'horodatage de la dernière mise à jour est affiché sur la page de détails de chaque hôpital.',
    'faq.emergency': 'Que dois-je faire en cas d\'urgence médicale?',
    'faq.emergencyAnswer': 'En cas d\'urgence médicale, appelez immédiatement le 911. Ne vous fiez pas aux temps d\'attente pour décider si vous devez chercher des soins d\'urgence. Les salles d\'urgence priorisent les patients en fonction de la gravité de leur état, et non du temps d\'arrivée.',
    'faq.reportIncorrect': 'Comment puis-je signaler des informations incorrectes?',
    'faq.reportIncorrectAnswer': 'Si vous remarquez des informations incorrectes sur notre plateforme, veuillez utiliser la page Contact pour les signaler. Nous nous efforçons de maintenir des données précises et nous apprécions votre aide pour maintenir nos informations à jour.',
    
    // Contact page
    'contact.title': 'Contactez-nous',
    'contact.description': 'Vous avez des questions ou des commentaires sur notre outil de recherche de temps d\'attente des hôpitaux? Nous aimerions avoir de vos nouvelles. Remplissez le formulaire ci-dessous et nous vous répondrons dès que possible.',
    'contact.name': 'Nom',
    'contact.email': 'Courriel',
    'contact.subject': 'Sujet',
    'contact.message': 'Message',
    'contact.send': 'Envoyer le message',
    'contact.success': 'Votre message a été envoyé avec succès!',
    
    // Footer
    'footer.disclaimer': 'Les temps d\'attente proviennent de Données Québec et sont mis à jour en temps réel. Les coûts pour les non-assurés sont des estimations uniquement—veuillez vérifier avec l\'hôpital.',
    'footer.privacy': 'Politique de confidentialité',
    'footer.terms': 'Conditions d\'utilisation',
  },
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 