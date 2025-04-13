const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const hospitalData = require('./hospital-data');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://unpkg.com; img-src 'self' data: https://unpkg.com https://*.tile.openstreetmap.org; connect-src 'self' https://api.quebec.ca https://*.tile.openstreetmap.org https://nominatim.openstreetmap.org;");
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=()');
    next();
});

// CORS configuration
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Rate limiting middleware
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Serve static files from the current directory
app.use(express.static(__dirname));

// Sample hospital data (fallback)
const sampleHospitals = [
  {
    name: "Montreal General Hospital",
    address: "1650 Cedar Ave, Montreal, QC H3G 1A4",
    waitTime: "45 minutes",
    phone: "(514) 934-1934",
    coordinates: [45.5017, -73.5673],
    lastUpdated: new Date().toISOString(),
    patientsWaiting: 15,
    services: [
      { name: "Emergency", cost: "Free" },
      { name: "X-Ray", cost: "$150" },
      { name: "MRI", cost: "$500" }
    ]
  },
  {
    name: "Royal Victoria Hospital",
    address: "1001 Decarie Blvd, Montreal, QC H4A 3J1",
    waitTime: "30 minutes",
    phone: "(514) 934-1934",
    coordinates: [45.5017, -73.5673],
    lastUpdated: new Date().toISOString(),
    patientsWaiting: 10,
    services: [
      { name: "Emergency", cost: "Free" },
      { name: "X-Ray", cost: "$150" },
      { name: "CT Scan", cost: "$400" }
    ]
  },
  {
    name: "Jewish General Hospital",
    address: "3755 Côte-Sainte-Catherine Rd, Montreal, QC H3T 1E2",
    waitTime: "60 minutes",
    phone: "(514) 340-8222",
    coordinates: [45.5017, -73.5673],
    lastUpdated: new Date().toISOString(),
    patientsWaiting: 20,
    services: [
      { name: "Emergency", cost: "Free" },
      { name: "X-Ray", cost: "$150" },
      { name: "Ultrasound", cost: "$200" }
    ]
  }
];

// Montreal hospitals coordinates mapping with API name mappings
const montrealHospitals = {
    // CIUSSS du Nord-de-l'Île-de-Montréal
    "CIUSSS DU NORD-DE-L'ÎLE-DE-MONTRÉAL": {
        coordinates: [45.5333, -73.6833],
        address: "555 Boulevard Gouin O, Montréal, QC H3L 1K5",
        phone: "(514) 338-2222",
        emergencyHospitals: {
            "Hôpital en santé mentale Albert-Prévost": {
                coordinates: [45.5333, -73.6833],
                address: "6555 Boulevard Gouin O, Montréal, QC H4K 1B3",
                phone: "(514) 338-4201"
            },
            "Hôpital du Sacré-Coeur de Montréal": {
                coordinates: [45.5333, -73.6833],
                address: "5400 Boulevard Gouin O, Montréal, QC H4J 1C5",
                phone: "(514) 338-2222"
            },
            "Hôpital Fleury": {
                coordinates: [45.5500, -73.6500],
                address: "2180 Rue Fleury E, Montréal, QC H2B 1K3",
                phone: "(514) 384-2000"
            },
            "Hôpital Jean-Talon": {
                coordinates: [45.5333, -73.6167],
                address: "1385 Rue Jean-Talon E, Montréal, QC H2E 1S6",
                phone: "(514) 495-6767"
            }
        }
    },

    // CIUSSS du Centre-Ouest-de-l'Île-de-Montréal
    "CIUSSS DU CENTRE-OUEST-DE-L'ÎLE-DE-MONTRÉAL": {
        coordinates: [45.4986, -73.6302],
        address: "3755 Chemin de la Côte-Sainte-Catherine, Montréal, QC H3T 1E2",
        phone: "(514) 340-8222",
        emergencyHospitals: {
            "Hôpital général juif - Jewish General Hospital": {
                coordinates: [45.4986, -73.6302],
                address: "3755 Chemin de la Côte-Sainte-Catherine, Montréal, QC H3T 1E2",
                phone: "(514) 340-8222"
            }
        }
    },

    // Centre hospitalier universitaire Sainte-Justine
    "CENTRE HOSPITALIER UNIVERSITAIRE SAINTE-JUSTINE": {
        coordinates: [45.5033, -73.6247],
        address: "3175 Chemin de la Côte-Sainte-Catherine, Montréal, QC H3T 1C5",
        phone: "(514) 345-4931",
        emergencyHospitals: {
            "CHU Sainte-Justine": {
                coordinates: [45.5033, -73.6247],
                address: "3175 Chemin de la Côte-Sainte-Catherine, Montréal, QC H3T 1C5",
                phone: "(514) 345-4931"
            }
        }
    },

    // CIUSSS de l'Ouest-de-l'Île-de-Montréal
    "CIUSSS DE L'OUEST-DE-L'ÎLE-DE-MONTRÉAL": {
        coordinates: [45.4397, -73.8489],
        address: "160 Avenue Stillview, Pointe-Claire, QC H9R 2Y2",
        phone: "(514) 630-2225",
        emergencyHospitals: {
            "Centre hospitalier de St. Mary": {
                coordinates: [45.4925, -73.6247],
                address: "3830 Avenue Lacombe, Montréal, QC H3T 1M5",
                phone: "(514) 345-3511"
            },
            "Lakeshore General Hospital": {
                coordinates: [45.4397, -73.8489],
                address: "160 Avenue Stillview, Pointe-Claire, QC H9R 2Y2",
                phone: "(514) 630-2225"
            }
        }
    },

    // Centre universitaire de santé McGill (CUSM)
    "CENTRE UNIVERSITAIRE DE SANTÉ MCGILL": {
        coordinates: [45.4769, -73.6032],
        address: "1001 Boulevard Décarie, Montréal, QC H4A 3J1",
        phone: "(514) 934-1934",
        emergencyHospitals: {
            "Hôpital Glen (McGill University Health Centre)": {
                coordinates: [45.4769, -73.6032],
                address: "1001 Boulevard Décarie, Montréal, QC H4A 3J1",
                phone: "(514) 934-1934"
            },
            "Hôpital général de Montréal (CUSM)": {
                coordinates: [45.4973, -73.5874],
                address: "1650 Avenue Cedar, Montréal, QC H3G 1A4",
                phone: "(514) 934-1934"
            }
        }
    },

    // Centre hospitalier de l'Université de Montréal (CHUM)
    "CENTRE HOSPITALIER DE L'UNIVERSITÉ DE MONTRÉAL": {
        coordinates: [45.5122, -73.5587],
        address: "1051 Rue Sanguinet, Montréal, QC H2X 3E4",
        phone: "(514) 890-8000",
        emergencyHospitals: {
            "Centre hospitalier de l'Université de Montréal (CHUM)": {
                coordinates: [45.5122, -73.5587],
                address: "1051 Rue Sanguinet, Montréal, QC H2X 3E4",
                phone: "(514) 890-8000"
            }
        }
    },

    // CIUSSS de l'Est-de-l'Île-de-Montréal
    "CIUSSS DE L'EST-DE-L'ÎLE-DE-MONTRÉAL": {
        coordinates: [45.5762, -73.5497],
        address: "5415 Boulevard de l'Assomption, Montréal, QC H1T 2M4",
        phone: "(514) 252-3400",
        emergencyHospitals: {
            "Hôpital Maisonneuve-Rosemont": {
                coordinates: [45.5762, -73.5497],
                address: "5415 Boulevard de l'Assomption, Montréal, QC H1T 2M4",
                phone: "(514) 252-3400"
            },
            "Hôpital Santa-Cabrini": {
                coordinates: [45.5728, -73.5661],
                address: "5655 Rue Saint-Zotique E, Montréal, QC H1T 1P7",
                phone: "(514) 252-6000"
            },
            "Institut universitaire en santé mentale de Montréal": {
                coordinates: [45.5728, -73.5497],
                address: "7401 Rue Hochelaga, Montréal, QC H1N 3M5",
                phone: "(514) 251-4000"
            }
        }
    },

    // CIUSSS du Centre-Sud-de-l'Île-de-Montréal
    "CIUSSS DU CENTRE-SUD-DE-L'ÎLE-DE-MONTRÉAL": {
        coordinates: [45.4633, -73.5668],
        address: "4000 Boulevard LaSalle, Verdun, QC H4G 2A3",
        phone: "(514) 362-1000",
        emergencyHospitals: {
            "Hôpital de Verdun": {
                coordinates: [45.4633, -73.5668],
                address: "4000 Boulevard LaSalle, Verdun, QC H4G 2A3",
                phone: "(514) 362-1000"
            },
            "Hôpital de LaSalle": {
                coordinates: [45.4308, -73.6314],
                address: "8585 Terrasse Champlain, LaSalle, QC H8P 1C1",
                phone: "(514) 362-8000"
            }
        }
    }
};

// List of the 16 emergency hospitals we care about
const emergencyHospitals = [
    "Hôpital en santé mentale Albert-Prévost",
    "Hôpital du Sacré-Coeur de Montréal",
    "Hôpital Fleury",
    "Hôpital général juif - Jewish General Hospital",
    "CHU Sainte-Justine",
    "Centre hospitalier de St. Mary",
    "Hôpital Jean-Talon",
    "Hôpital Glen (McGill University Health Centre)",
    "Hôpital général de Montréal (CUSM)",
    "Centre hospitalier de l'Université de Montréal (CHUM)",
    "Hôpital Maisonneuve-Rosemont",
    "Hôpital Santa-Cabrini",
    "Hôpital de Verdun",
    "Lakeshore General Hospital",
    "Hôpital de LaSalle",
    "Institut universitaire en santé mentale de Montréal"
];

// Manual mapping of emergency hospitals to their API names and details
const emergencyHospitalMap = {
    "Hôpital en santé mentale Albert-Prévost": {
        apiNames: ["HÔPITAL EN SANTÉ MENTALE ALBERT-PRÉVOST", "HÔPITAL ALBERT-PRÉVOST", "PAVILLON ALBERT-PRÉVOST"],
        coordinates: [45.5333, -73.6833],
        address: "6555 Boulevard Gouin O, Montréal, QC H4K 1B3",
        phone: "(514) 338-4201",
        names: {
            en: "Albert-Prévost Mental Health Hospital",
            fr: "Hôpital en santé mentale Albert-Prévost"
        }
    },
    "Hôpital du Sacré-Coeur de Montréal": {
        apiNames: ["HÔPITAL DU SACRÉ-COEUR DE MONTRÉAL", "HÔPITAL SACRÉ-COEUR", "HÔPITAL DU SACRÉ-CŒUR DE MONTRÉAL"],
        coordinates: [45.5333, -73.6833],
        address: "5400 Boulevard Gouin O, Montréal, QC H4J 1C5",
        phone: "(514) 338-2222",
        names: {
            en: "Sacré-Coeur Hospital of Montreal",
            fr: "Hôpital du Sacré-Coeur de Montréal"
        }
    },
    "Hôpital Fleury": {
        apiNames: ["HÔPITAL FLEURY", "HOPITAL FLEURY"],
        coordinates: [45.5500, -73.6500],
        address: "2180 Rue Fleury E, Montréal, QC H2B 1K3",
        phone: "(514) 384-2000",
        names: {
            en: "Fleury Hospital",
            fr: "Hôpital Fleury"
        }
    },
    "Hôpital général juif - Jewish General Hospital": {
        apiNames: ["HÔPITAL GÉNÉRAL JUIF SIR MORTIMER B. DAVIS", "JEWISH GENERAL HOSPITAL", "HÔPITAL GÉNÉRAL JUIF"],
        coordinates: [45.4986, -73.6302],
        address: "3755 Côte-Sainte-Catherine Rd, Montreal, QC H3T 1E2",
        phone: "(514) 340-8222",
        names: {
            en: "Jewish General Hospital",
            fr: "Hôpital général juif"
        }
    },
    "CHU Sainte-Justine": {
        apiNames: ["CENTRE HOSPITALIER UNIVERSITAIRE SAINTE-JUSTINE", "CHU SAINTE-JUSTINE", "HÔPITAL SAINTE-JUSTINE", "CENTRE HOSPITALIER UNIVERSITAIRE SAINTE-JUSTINE (CHU SAINTE-JUSTINE)"],
        coordinates: [45.5033, -73.6247],
        address: "3175 Chemin de la Côte-Sainte-Catherine, Montréal, QC H3T 1C5",
        phone: "(514) 345-4931",
        names: {
            en: "Sainte-Justine University Hospital Centre",
            fr: "CHU Sainte-Justine"
        }
    },
    "Centre hospitalier de St. Mary": {
        apiNames: ["CENTRE HOSPITALIER DE ST. MARY", "HÔPITAL ST. MARY", "HÔPITAL SAINT-MARY", "CENTRE HOSPITALIER DE SAINT-MARY"],
        coordinates: [45.4925, -73.6247],
        address: "3830 Avenue Lacombe, Montréal, QC H3T 1M5",
        phone: "(514) 345-3511",
        names: {
            en: "St. Mary's Hospital Center",
            fr: "Centre hospitalier de St. Mary"
        }
    },
    "Hôpital Jean-Talon": {
        apiNames: ["HÔPITAL JEAN-TALON", "HOPITAL JEAN-TALON"],
        coordinates: [45.5333, -73.6167],
        address: "1385 Rue Jean-Talon E, Montréal, QC H2E 1S6",
        phone: "(514) 495-6767",
        names: {
            en: "Jean-Talon Hospital",
            fr: "Hôpital Jean-Talon"
        }
    },
    "Hôpital Glen (McGill University Health Centre)": {
        apiNames: ["HÔPITAL ROYAL VICTORIA", "ROYAL VICTORIA HOSPITAL", "GLEN"],
        coordinates: [45.4739, -73.6036],
        address: "1001 Boulevard Décarie, Montréal, QC H4A 3J1",
        phone: "(514) 934-1934",
        names: {
            en: "Royal Victoria Hospital at Glen Site (MUHC)",
            fr: "Hôpital Glen (McGill University Health Centre)"
        }
    },
    "Hôpital général de Montréal (CUSM)": {
        apiNames: ["HÔPITAL GÉNÉRAL DE MONTRÉAL", "CUSM", "MONTREAL GENERAL HOSPITAL", "HÔPITAL GÉNÉRAL DE MONTRÉAL (HGM - CUSM)"],
        coordinates: [45.4973, -73.5874],
        address: "1650 Avenue Cedar, Montréal, QC H3G 1A4",
        phone: "(514) 934-1934",
        names: {
            en: "Montreal General Hospital (MUHC)",
            fr: "Hôpital général de Montréal (CUSM)"
        }
    },
    "Centre hospitalier de l'Université de Montréal (CHUM)": {
        apiNames: ["CENTRE HOSPITALIER DE L'UNIVERSITÉ DE MONTRÉAL", "CHUM", "NOUVEAU CHUM"],
        coordinates: [45.5122, -73.5587],
        address: "1051 Rue Sanguinet, Montréal, QC H2X 3E4",
        phone: "(514) 890-8000",
        names: {
            en: "University of Montreal Hospital Centre (CHUM)",
            fr: "Centre hospitalier de l'Université de Montréal (CHUM)"
        }
    },
    "Hôpital Maisonneuve-Rosemont": {
        apiNames: ["HÔPITAL MAISONNEUVE-ROSEMONT", "HOPITAL MAISONNEUVE-ROSEMONT", "INSTALLATION MAISONNEUVE-ROSEMONT"],
        coordinates: [45.5762, -73.5497],
        address: "5415 Boulevard de l'Assomption, Montréal, QC H1T 2M4",
        phone: "(514) 252-3400",
        names: {
            en: "Maisonneuve-Rosemont Hospital",
            fr: "Hôpital Maisonneuve-Rosemont"
        }
    },
    "Hôpital Santa-Cabrini": {
        apiNames: ["HÔPITAL SANTA CABRINI", "HÔPITAL SANTA-CABRINI", "HOPITAL SANTA CABRINI OSPEDALE"],
        coordinates: [45.5728, -73.5661],
        address: "5655 Rue Saint-Zotique E, Montréal, QC H1T 1P7",
        phone: "(514) 252-6000",
        names: {
            en: "Santa-Cabrini Hospital",
            fr: "Hôpital Santa-Cabrini"
        }
    },
    "Hôpital de Verdun": {
        apiNames: ["HÔPITAL DE VERDUN", "HOPITAL DE VERDUN", "INSTALLATION DE VERDUN"],
        coordinates: [45.4633, -73.5668],
        address: "4000 Boulevard LaSalle, Verdun, QC H4G 2A3",
        phone: "(514) 362-1000",
        names: {
            en: "Verdun Hospital",
            fr: "Hôpital de Verdun"
        }
    },
    "Lakeshore General Hospital": {
        apiNames: ["HÔPITAL GÉNÉRAL DU LAKESHORE", "LAKESHORE GENERAL HOSPITAL", "HÔPITAL GÉNÉRAL LAKESHORE", "INSTALLATION LAKESHORE"],
        coordinates: [45.4397, -73.8489],
        address: "160 Avenue Stillview, Pointe-Claire, QC H9R 2Y2",
        phone: "(514) 630-2225",
        names: {
            en: "Lakeshore General Hospital",
            fr: "Hôpital général du Lakeshore"
        }
    },
    "Hôpital de LaSalle": {
        apiNames: ["HÔPITAL DE LASALLE", "HOPITAL DE LASALLE", "INSTALLATION DE LASALLE"],
        coordinates: [45.4308, -73.6314],
        address: "8585 Terrasse Champlain, LaSalle, QC H8P 1C1",
        phone: "(514) 362-8000",
        names: {
            en: "LaSalle Hospital",
            fr: "Hôpital de LaSalle"
        }
    },
    "Institut universitaire en santé mentale de Montréal": {
        apiNames: ["INSTITUT UNIVERSITAIRE EN SANTÉ MENTALE DE MONTRÉAL", "IUSMM", "INSTALLATION INSTITUT UNIVERSITAIRE EN SANTÉ MENTALE DE MONTRÉAL"],
        coordinates: [45.5728, -73.5497],
        address: "7401 Rue Hochelaga, Montréal, QC H1N 3M5",
        phone: "(514) 251-4000",
        names: {
            en: "Montreal Mental Health University Institute",
            fr: "Institut universitaire en santé mentale de Montréal"
        }
    }
};

// Add this after the existing hospital data
const hospitalDetails = {
    "Hôpital en santé mentale Albert-Prévost": {
        names: {
            en: "Albert-Prévost Mental Health Hospital",
            fr: "Hôpital en santé mentale Albert-Prévost"
        },
        address: "6555 Gouin Blvd W, Montreal, QC H4K 1B3",
        phone: "(514) 331-0000",
        coordinates: [45.5200, -73.7000],
        nonInsuredServices: [
            {
                names: {
                    en: "Emergency Visit",
                    fr: "Visite aux urgences"
                },
                cost: "$1,160.04",
                descriptions: {
                    en: "Diagnostic tests are NOT included in this price",
                    fr: "Les tests diagnostiques ne sont PAS inclus dans ce prix"
                },
                source: "https://santemontreal.qc.ca/en/public/coronavirus-covid-19/",
                sourceName: "CIUSSS du Nord-de-l'Île-de-Montréal"
            },
            {
                names: {
                    en: "Emergency Triage Visit",
                    fr: "Visite de triage aux urgences"
                },
                cost: "$171.45",
                descriptions: {
                    en: "Triage assessment only",
                    fr: "Évaluation de triage seulement"
                },
                source: "https://santemontreal.qc.ca/en/public/coronavirus-covid-19/",
                sourceName: "CIUSSS du Nord-de-l'Île-de-Montréal"
            },
            {
                names: {
                    en: "Clinic Visit",
                    fr: "Visite en clinique"
                },
                cost: "$170.61",
                descriptions: {
                    en: "Per visit",
                    fr: "Par visite"
                },
                source: "https://santemontreal.qc.ca/en/public/coronavirus-covid-19/",
                sourceName: "CIUSSS du Nord-de-l'Île-de-Montréal"
            },
            {
                names: {
                    en: "In-patient Stay",
                    fr: "Séjour hospitalier"
                },
                cost: "$6,522.00/day",
                descriptions: {
                    en: "Private or semi-private room fees may be added",
                    fr: "Des frais de chambre privée ou semi-privée peuvent être ajoutés"
                },
                source: "https://santemontreal.qc.ca/en/public/coronavirus-covid-19/",
                sourceName: "CIUSSS du Nord-de-l'Île-de-Montréal"
            }
        ],
        additionalInfo: {
            website: "https://ciusss-nordmtl.gouv.qc.ca/etablissement/hopital-albert-prevost/",
            specialties: ["Mental Health", "Psychiatry", "Addiction Treatment"],
            hours: "24/7",
            parking: "Available on site",
            publicTransport: "STM Bus 69, 121, 171"
        }
    },
    "Hôpital du Sacré-Coeur de Montréal": {
        names: {
            en: "Sacré-Coeur Hospital of Montreal",
            fr: "Hôpital du Sacré-Coeur de Montréal"
        },
        address: "5400 Boulevard Gouin O, Montréal, QC H4J 1C5",
        phone: "(514) 338-2222",
        coordinates: [45.5333, -73.6833],
        nonInsuredServices: [
            {
                names: {
                    en: "Medical Certificate",
                    fr: "Certificat médical"
                },
                cost: "$50",
                descriptions: {
                    en: "Official medical certificate for various purposes",
                    fr: "Certificat médical officiel pour diverses fins"
                },
                source: "https://ciusss-nordmtl.gc.ca/en/our-services/emergency-department/sacre-coeur-hospital",
                sourceName: "Hospital Website"
            },
            {
                names: {
                    en: "Medical Records Copy",
                    fr: "Copie de dossier médical"
                },
                cost: "$30",
                descriptions: {
                    en: "Copy of medical records and documentation",
                    fr: "Copie du dossier médical et documentation"
                },
                source: "https://ciusss-nordmtl.gc.ca/en/our-services/emergency-department/sacre-coeur-hospital",
                sourceName: "Hospital Website"
            }
        ],
        additionalInfo: {
            website: "https://ciusss-nordmtl.gc.ca/en/our-services/emergency-department/sacre-coeur-hospital",
            specialties: ["Emergency Medicine", "Cardiology", "Neurology"],
            hours: "24/7",
            parking: "Available on site",
            publicTransport: "Metro: Sauvé (Orange Line), Bus: 121, 164"
        }
    },
    "Hôpital Fleury": {
        names: {
            en: "Fleury Hospital",
            fr: "Hôpital Fleury"
        },
        address: "2180 Rue Fleury E, Montréal, QC H2B 1K3",
        phone: "(514) 384-2000",
        coordinates: [45.5500, -73.6500],
        nonInsuredServices: [
            {
                names: {
                    en: "Medical Certificate",
                    fr: "Certificat médical"
                },
                cost: "$50",
                descriptions: {
                    en: "Official medical certificate for various purposes",
                    fr: "Certificat médical officiel pour diverses fins"
                },
                source: "https://ciusss-nordmtl.gc.ca/en/our-services/emergency-department/fleury-hospital",
                sourceName: "Hospital Website"
            },
            {
                names: {
                    en: "Medical Records Copy",
                    fr: "Copie de dossier médical"
                },
                cost: "$30",
                descriptions: {
                    en: "Copy of medical records and documentation",
                    fr: "Copie du dossier médical et documentation"
                },
                source: "https://ciusss-nordmtl.gc.ca/en/our-services/emergency-department/fleury-hospital",
                sourceName: "Hospital Website"
            }
        ],
        additionalInfo: {
            website: "https://ciusss-nordmtl.gc.ca/en/our-services/emergency-department/fleury-hospital",
            specialties: ["Emergency Medicine", "General Medicine"],
            hours: "24/7",
            parking: "Available on site",
            publicTransport: "Metro: Crémazie (Orange Line), Bus: 30, 31"
        }
    },
    "Hôpital général juif - Jewish General Hospital": {
        names: {
            en: "Jewish General Hospital",
            fr: "Hôpital général juif"
        },
        address: "3755 Côte-Sainte-Catherine Rd, Montreal, QC H3T 1E2",
        phone: "(514) 340-8222",
        coordinates: [45.4986, -73.6302],
        nonInsuredServices: [
            {
                names: {
                    en: "Medical Certificate",
                    fr: "Certificat médical"
                },
                cost: "$50",
                descriptions: {
                    en: "Official medical certificate for various purposes",
                    fr: "Certificat médical officiel pour diverses fins"
                },
                source: "https://jgh.ca/patients/medical-records",
                sourceName: "Hospital Website"
            },
            {
                names: {
                    en: "Medical Records Copy",
                    fr: "Copie de dossier médical"
                },
                cost: "$30",
                descriptions: {
                    en: "Copy of medical records and documentation",
                    fr: "Copie du dossier médical et documentation"
                },
                source: "https://jgh.ca/patients/medical-records",
                sourceName: "Hospital Website"
            }
        ],
        additionalInfo: {
            website: "https://jgh.ca",
            specialties: ["Emergency Medicine", "Cardiology", "Oncology", "Neurology"],
            hours: "24/7",
            parking: "Available on site",
            publicTransport: "Metro: Côte-Sainte-Catherine (Blue Line), Bus: 129, 161"
        }
    },
    "CHU Sainte-Justine": {
        names: {
            en: "Sainte-Justine University Hospital Centre",
            fr: "CHU Sainte-Justine"
        },
        address: "3175 Chemin de la Côte-Sainte-Catherine, Montréal, QC H3T 1C5",
        phone: "(514) 345-4931",
        coordinates: [45.5033, -73.6247],
        nonInsuredServices: [
            {
                names: {
                    en: "Emergency Visit",
                    fr: "Visite aux urgences"
                },
                cost: "$1,160.04",
                descriptions: {
                    en: "Diagnostic tests are NOT included in this price",
                    fr: "Les tests diagnostiques ne sont PAS inclus dans ce prix"
                },
                source: "https://chumontreal.qc.ca/en/patients-visitors/billing",
                sourceName: "CHUM Billing Information"
            },
            {
                names: {
                    en: "Emergency Triage Visit",
                    fr: "Visite de triage aux urgences"
                },
                cost: "$171.45",
                descriptions: {
                    en: "Triage assessment only",
                    fr: "Évaluation de triage seulement"
                },
                source: "https://chumontreal.qc.ca/en/patients-visitors/billing",
                sourceName: "CHUM Billing Information"
            },
            {
                names: {
                    en: "Day Surgery",
                    fr: "Chirurgie d'un jour"
                },
                cost: "$4,819.95",
                descriptions: {
                    en: "Includes operating room and basic care",
                    fr: "Inclut la salle d'opération et les soins de base"
                },
                source: "https://chumontreal.qc.ca/en/patients-visitors/billing",
                sourceName: "CHUM Billing Information"
            },
            {
                names: {
                    en: "Minor Surgery",
                    fr: "Chirurgie mineure"
                },
                cost: "$1,160.04",
                descriptions: {
                    en: "In operating or sterile room",
                    fr: "En salle d'opération ou salle stérile"
                },
                source: "https://chumontreal.qc.ca/en/patients-visitors/billing",
                sourceName: "CHUM Billing Information"
            },
            {
                names: {
                    en: "MRI",
                    fr: "IRM"
                },
                cost: "$1,502.01",
                descriptions: {
                    en: "Standard MRI procedure",
                    fr: "Procédure IRM standard"
                },
                source: "https://chumontreal.qc.ca/en/patients-visitors/billing",
                sourceName: "CHUM Billing Information"
            },
            {
                names: {
                    en: "In-patient Stay",
                    fr: "Séjour hospitalier"
                },
                cost: "$6,522.00/day",
                descriptions: {
                    en: "Private or semi-private room fees may be added",
                    fr: "Des frais de chambre privée ou semi-privée peuvent être ajoutés"
                },
                source: "https://chumontreal.qc.ca/en/patients-visitors/billing",
                sourceName: "CHUM Billing Information"
            },
            {
                names: {
                    en: "ICU Stay",
                    fr: "Séjour aux soins intensifs"
                },
                cost: "$19,248.00/day",
                descriptions: {
                    en: "Intensive Care Unit",
                    fr: "Unité de soins intensifs"
                },
                source: "https://chumontreal.qc.ca/en/patients-visitors/billing",
                sourceName: "CHUM Billing Information"
            }
        ],
        additionalInfo: {
            website: "https://chumontreal.qc.ca/",
            specialties: ["Pediatrics", "Maternal Health"],
            hours: "24/7",
            parking: "Available on site",
            publicTransport: "Metro: Côte-Sainte-Catherine (Blue Line), Bus: 51, 119"
        }
    },
    "Centre hospitalier de St. Mary": {
        names: {
            en: "St. Mary's Hospital Center",
            fr: "Centre hospitalier de St. Mary"
        },
        address: "3830 Avenue Lacombe, Montréal, QC H3T 1M5",
        phone: "(514) 345-3511",
        coordinates: [45.4907, -73.6333],
        nonInsuredServices: [
            {
                names: {
                    en: "Medical Certificate",
                    fr: "Certificat médical"
                },
                cost: "$50",
                description: "Official medical certificate for various purposes (work, school, insurance, etc.)"
            },
            {
                names: {
                    en: "Medical Report",
                    fr: "Rapport médical"
                },
                cost: "$100",
                description: "Detailed medical report for insurance or legal purposes"
            },
            {
                names: {
                    en: "Vaccination Certificate",
                    fr: "Certificat de vaccination"
                },
                cost: "$30",
                description: "Official vaccination record and certificate"
            },
            {
                names: {
                    en: "Travel Consultation",
                    fr: "Consultation voyage"
                },
                cost: "$75",
                description: "Pre-travel health consultation and vaccinations"
            },
            {
                names: {
                    en: "Driver's Medical Exam",
                    fr: "Examen médical pour permis de conduire"
                },
                cost: "$120",
                description: "Medical examination required for driver's license"
            },
            {
                names: {
                    en: "Employment Medical Exam",
                    fr: "Examen médical d'emploi"
                },
                cost: "$150",
                description: "Pre-employment medical examination and certificate"
            },
            {
                names: {
                    en: "Insurance Medical Exam",
                    fr: "Examen médical d'assurance"
                },
                cost: "$200",
                description: "Medical examination required for insurance purposes"
            },
            {
                names: {
                    en: "Specialist Consultation",
                    fr: "Consultation spécialisée"
                },
                cost: "$250",
                description: "Consultation with a specialist physician"
            },
            {
                names: {
                    en: "Physiotherapy Session",
                    fr: "Séance de physiothérapie"
                },
                cost: "$85",
                description: "Individual physiotherapy treatment session"
            },
            {
                names: {
                    en: "Occupational Therapy",
                    fr: "Ergothérapie"
                },
                cost: "$95",
                description: "Occupational therapy assessment and treatment"
            },
            {
                names: {
                    en: "Speech Therapy",
                    fr: "Orthophonie"
                },
                cost: "$90",
                description: "Speech and language therapy session"
            },
            {
                names: {
                    en: "Nutrition Consultation",
                    fr: "Consultation en nutrition"
                },
                cost: "$80",
                description: "Dietary assessment and nutritional counseling"
            },
            {
                names: {
                    en: "Psychological Services",
                    fr: "Services psychologiques"
                },
                cost: "$150",
                description: "Individual psychological consultation"
            },
            {
                names: {
                    en: "Dental Services",
                    fr: "Services dentaires"
                },
                cost: "Varies",
                description: "Basic dental services (cleaning, fillings, extractions)"
            },
            {
                names: {
                    en: "Optometry Services",
                    fr: "Services d'optométrie"
                },
                cost: "Varies",
                description: "Eye examination and prescription services"
            },
            {
                names: {
                    en: "Medical Imaging",
                    fr: "Imagerie médicale"
                },
                cost: "Varies",
                description: "X-rays, ultrasounds, and other imaging services"
            },
            {
                names: {
                    en: "Laboratory Tests",
                    fr: "Tests de laboratoire"
                },
                cost: "Varies",
                description: "Blood tests and other laboratory examinations"
            }
        ],
        additionalInfo: {
            website: "https://stmaryshospital.ca",
            specialties: [
                "Emergency Medicine",
                "Internal Medicine",
                "Surgery",
                "Obstetrics and Gynecology",
                "Pediatrics",
                "Mental Health",
                "Rehabilitation"
            ],
            hours: {
                emergency: "24/7",
                general: "Monday to Friday: 8:00 AM - 4:00 PM"
            },
            parking: "Available on-site (paid parking)",
            publicTransport: [
                "Bus: 51, 166",
                "Metro: Snowdon (Orange Line)"
            ]
        }
    },
    "Hôpital Jean-Talon": {
        names: {
            en: "Jean-Talon Hospital",
            fr: "Hôpital Jean-Talon"
        },
        address: "1385 Rue Jean-Talon E, Montréal, QC H2E 1S6",
        phone: "(514) 495-6767",
        coordinates: [45.5333, -73.6167],
        nonInsuredServices: [
            {
                names: {
                    en: "Medical Certificate",
                    fr: "Certificat médical"
                },
                cost: "$50",
                descriptions: {
                    en: "Official medical certificate for various purposes",
                    fr: "Certificat médical officiel pour diverses fins"
                },
                source: "https://ciusss-centresudmtl.gc.ca/en/our-services/emergency-department/jean-talon-hospital",
                sourceName: "Hospital Website"
            },
            {
                names: {
                    en: "Medical Records Copy",
                    fr: "Copie de dossier médical"
                },
                cost: "$30",
                descriptions: {
                    en: "Copy of medical records and documentation",
                    fr: "Copie du dossier médical et documentation"
                },
                source: "https://ciusss-centresudmtl.gc.ca/en/our-services/emergency-department/jean-talon-hospital",
                sourceName: "Hospital Website"
            }
        ],
        additionalInfo: {
            website: "https://ciusss-centresudmtl.gc.ca/en/our-services/emergency-department/jean-talon-hospital",
            specialties: ["Emergency Medicine", "General Medicine"],
            hours: "24/7",
            parking: "Available on site",
            publicTransport: "Metro: Jean-Talon (Orange Line), Bus: 55, 92"
        }
    },
    "Hôpital Glen (McGill University Health Centre)": {
        names: {
            en: "Royal Victoria Hospital at Glen Site (MUHC)",
            fr: "Hôpital Glen (McGill University Health Centre)"
        },
        address: "1001 Boulevard Décarie, Montréal, QC H4A 3J1",
        phone: "(514) 934-1934",
        coordinates: [45.4739, -73.6036],
        nonInsuredServices: [
            {
                names: {
                    en: "Emergency Visit",
                    fr: "Visite aux urgences"
                },
                cost: "$1,160.04",
                descriptions: {
                    en: "Diagnostic tests are NOT included in this price",
                    fr: "Les tests diagnostiques ne sont PAS inclus dans ce prix"
                },
                source: "https://muhc.ca/patients-visitors/billing",
                sourceName: "MUHC Billing Information"
            },
            {
                names: {
                    en: "Emergency Triage Visit",
                    fr: "Visite de triage aux urgences"
                },
                cost: "$171.45",
                descriptions: {
                    en: "Triage assessment only",
                    fr: "Évaluation de triage seulement"
                },
                source: "https://muhc.ca/patients-visitors/billing",
                sourceName: "MUHC Billing Information"
            },
            {
                names: {
                    en: "Day Surgery",
                    fr: "Chirurgie d'un jour"
                },
                cost: "$4,819.95",
                descriptions: {
                    en: "Includes operating room and basic care",
                    fr: "Inclut la salle d'opération et les soins de base"
                },
                source: "https://muhc.ca/patients-visitors/billing",
                sourceName: "MUHC Billing Information"
            },
            {
                names: {
                    en: "Minor Surgery",
                    fr: "Chirurgie mineure"
                },
                cost: "$1,160.04",
                descriptions: {
                    en: "In operating or sterile room",
                    fr: "En salle d'opération ou salle stérile"
                },
                source: "https://muhc.ca/patients-visitors/billing",
                sourceName: "MUHC Billing Information"
            },
            {
                names: {
                    en: "MRI",
                    fr: "IRM"
                },
                cost: "$1,502.01",
                descriptions: {
                    en: "Standard MRI procedure",
                    fr: "Procédure IRM standard"
                },
                source: "https://muhc.ca/patients-visitors/billing",
                sourceName: "MUHC Billing Information"
            },
            {
                names: {
                    en: "In-patient Stay",
                    fr: "Séjour hospitalier"
                },
                cost: "$6,522.00/day",
                descriptions: {
                    en: "Private or semi-private room fees may be added",
                    fr: "Des frais de chambre privée ou semi-privée peuvent être ajoutés"
                },
                source: "https://muhc.ca/patients-visitors/billing",
                sourceName: "MUHC Billing Information"
            },
            {
                names: {
                    en: "ICU Stay",
                    fr: "Séjour aux soins intensifs"
                },
                cost: "$19,248.00/day",
                descriptions: {
                    en: "Intensive Care Unit",
                    fr: "Unité de soins intensifs"
                },
                source: "https://muhc.ca/patients-visitors/billing",
                sourceName: "MUHC Billing Information"
            }
        ],
        additionalInfo: {
            website: "https://muhc.ca",
            specialties: ["Emergency Medicine", "Cardiology", "Oncology", "Neurology"],
            hours: "24/7",
            parking: "Available on site",
            publicTransport: "Metro: Vendôme (Orange Line), Bus: 90, 104"
        }
    },
    "Hôpital général de Montréal (CUSM)": {
        names: {
            en: "Montreal General Hospital (MUHC)",
            fr: "Hôpital général de Montréal (CUSM)"
        },
        address: "1650 Cedar Ave, Montreal, QC H3G 1A4",
        phone: "(514) 934-1934",
        coordinates: [45.4936, -73.5908],
        nonInsuredServices: [
            {
                names: {
                    en: "Emergency Visit",
                    fr: "Visite aux urgences"
                },
                cost: "$1,160.04",
                descriptions: {
                    en: "Diagnostic tests are NOT included in this price",
                    fr: "Les tests diagnostiques ne sont PAS inclus dans ce prix"
                },
                source: "https://muhc.ca/patients-visitors/billing",
                sourceName: "MUHC Billing Information"
            },
            {
                names: {
                    en: "Emergency Triage Visit",
                    fr: "Visite de triage aux urgences"
                },
                cost: "$171.45",
                descriptions: {
                    en: "Triage assessment only",
                    fr: "Évaluation de triage seulement"
                },
                source: "https://muhc.ca/patients-visitors/billing",
                sourceName: "MUHC Billing Information"
            },
            {
                names: {
                    en: "Day Surgery",
                    fr: "Chirurgie d'un jour"
                },
                cost: "$4,819.95",
                descriptions: {
                    en: "Includes operating room and basic care",
                    fr: "Inclut la salle d'opération et les soins de base"
                },
                source: "https://muhc.ca/patients-visitors/billing",
                sourceName: "MUHC Billing Information"
            },
            {
                names: {
                    en: "Minor Surgery",
                    fr: "Chirurgie mineure"
                },
                cost: "$1,160.04",
                descriptions: {
                    en: "In operating or sterile room",
                    fr: "En salle d'opération ou salle stérile"
                },
                source: "https://muhc.ca/patients-visitors/billing",
                sourceName: "MUHC Billing Information"
            },
            {
                names: {
                    en: "Minor Surgery (Local Anesthetic)",
                    fr: "Chirurgie mineure (anesthésie locale)"
                },
                cost: "$209.52",
                descriptions: {
                    en: "Without operating room or sterile environment",
                    fr: "Sans salle d'opération ou environnement stérile"
                },
                source: "https://muhc.ca/patients-visitors/billing",
                sourceName: "MUHC Billing Information"
            },
            {
                names: {
                    en: "MRI",
                    fr: "IRM"
                },
                cost: "$1,502.01",
                descriptions: {
                    en: "Standard MRI procedure",
                    fr: "Procédure IRM standard"
                },
                source: "https://muhc.ca/patients-visitors/billing",
                sourceName: "MUHC Billing Information"
            },
            {
                names: {
                    en: "In-patient Stay",
                    fr: "Séjour hospitalier"
                },
                cost: "$6,522.00/day",
                descriptions: {
                    en: "Private or semi-private room fees may be added",
                    fr: "Des frais de chambre privée ou semi-privée peuvent être ajoutés"
                },
                source: "https://muhc.ca/patients-visitors/billing",
                sourceName: "MUHC Billing Information"
            },
            {
                names: {
                    en: "ICU Stay",
                    fr: "Séjour aux soins intensifs"
                },
                cost: "$19,248.00/day",
                descriptions: {
                    en: "Intensive Care Unit",
                    fr: "Unité de soins intensifs"
                },
                source: "https://muhc.ca/patients-visitors/billing",
                sourceName: "MUHC Billing Information"
            }
        ],
        additionalInfo: {
            website: "https://muhc.ca/",
            specialties: ["Emergency Medicine", "Neurosurgery", "Cardiology", "Oncology"],
            hours: "24/7",
            parking: "Available on site ($)",
            publicTransport: "STM Metro: Guy-Concordia"
        }
    },
    "Centre hospitalier de l'Université de Montréal (CHUM)": {
        names: {
            en: "University of Montreal Hospital Centre (CHUM)",
            fr: "Centre hospitalier de l'Université de Montréal (CHUM)"
        },
        address: "1051 Rue Sanguinet, Montréal, QC H2X 3E4",
        phone: "(514) 890-8000",
        coordinates: [45.5100, -73.5600],
        nonInsuredServices: [
            {
                names: {
                    en: "Emergency Visit",
                    fr: "Visite aux urgences"
                },
                cost: "$1,160.04",
                descriptions: {
                    en: "Diagnostic tests are NOT included in this price",
                    fr: "Les tests diagnostiques ne sont PAS inclus dans ce prix"
                },
                source: "https://chumontreal.qc.ca/en/patients-visitors/billing",
                sourceName: "CHUM Billing Information"
            },
            {
                names: {
                    en: "Emergency Triage Visit",
                    fr: "Visite de triage aux urgences"
                },
                cost: "$171.45",
                descriptions: {
                    en: "Triage assessment only",
                    fr: "Évaluation de triage seulement"
                },
                source: "https://chumontreal.qc.ca/en/patients-visitors/billing",
                sourceName: "CHUM Billing Information"
            },
            {
                names: {
                    en: "Day Surgery",
                    fr: "Chirurgie d'un jour"
                },
                cost: "$4,819.95",
                descriptions: {
                    en: "Includes operating room and basic care",
                    fr: "Inclut la salle d'opération et les soins de base"
                },
                source: "https://chumontreal.qc.ca/en/patients-visitors/billing",
                sourceName: "CHUM Billing Information"
            },
            {
                names: {
                    en: "Minor Surgery",
                    fr: "Chirurgie mineure"
                },
                cost: "$1,160.04",
                descriptions: {
                    en: "In operating or sterile room",
                    fr: "En salle d'opération ou salle stérile"
                },
                source: "https://chumontreal.qc.ca/en/patients-visitors/billing",
                sourceName: "CHUM Billing Information"
            },
            {
                names: {
                    en: "MRI",
                    fr: "IRM"
                },
                cost: "$1,502.01",
                descriptions: {
                    en: "Standard MRI procedure",
                    fr: "Procédure IRM standard"
                },
                source: "https://chumontreal.qc.ca/en/patients-visitors/billing",
                sourceName: "CHUM Billing Information"
            },
            {
                names: {
                    en: "In-patient Stay",
                    fr: "Séjour hospitalier"
                },
                cost: "$6,522.00/day",
                descriptions: {
                    en: "Private or semi-private room fees may be added",
                    fr: "Des frais de chambre privée ou semi-privée peuvent être ajoutés"
                },
                source: "https://chumontreal.qc.ca/en/patients-visitors/billing",
                sourceName: "CHUM Billing Information"
            },
            {
                names: {
                    en: "ICU Stay",
                    fr: "Séjour aux soins intensifs"
                },
                cost: "$19,248.00/day",
                descriptions: {
                    en: "Intensive Care Unit",
                    fr: "Unité de soins intensifs"
                },
                source: "https://chumontreal.qc.ca/en/patients-visitors/billing",
                sourceName: "CHUM Billing Information"
            }
        ],
        additionalInfo: {
            website: "https://chumontreal.qc.ca/",
            specialties: ["Emergency Medicine", "Cardiology", "Neurosurgery", "Transplant"],
            hours: "24/7",
            parking: "Available on site ($)",
            publicTransport: "STM Metro: Champ-de-Mars"
        }
    },
    "Hôpital Maisonneuve-Rosemont": {
        names: {
            en: "Maisonneuve-Rosemont Hospital",
            fr: "Hôpital Maisonneuve-Rosemont"
        },
        address: "5415 Asselin St, Montreal, QC H1T 2M4",
        phone: "(514) 252-3400",
        coordinates: [45.5600, -73.5600],
        nonInsuredServices: [
            {
                names: {
                    en: "Emergency Visit",
                    fr: "Visite aux urgences"
                },
                cost: "$1,160.04",
                descriptions: {
                    en: "Diagnostic tests are NOT included in this price",
                    fr: "Les tests diagnostiques ne sont PAS inclus dans ce prix"
                },
                source: "https://ciusss-estmtl.gouv.qc.ca/etablissement/hopital-maisonneuve-rosemont/",
                sourceName: "CIUSSS de l'Est-de-l'Île-de-Montréal"
            },
            {
                names: {
                    en: "Emergency Triage Visit",
                    fr: "Visite de triage aux urgences"
                },
                cost: "$171.45",
                descriptions: {
                    en: "Triage assessment only",
                    fr: "Évaluation de triage seulement"
                },
                source: "https://ciusss-estmtl.gouv.qc.ca/etablissement/hopital-maisonneuve-rosemont/",
                sourceName: "CIUSSS de l'Est-de-l'Île-de-Montréal"
            },
            {
                names: {
                    en: "Clinic Visit",
                    fr: "Visite en clinique"
                },
                cost: "$170.61",
                descriptions: {
                    en: "Per visit",
                    fr: "Par visite"
                },
                source: "https://ciusss-estmtl.gouv.qc.ca/etablissement/hopital-maisonneuve-rosemont/",
                sourceName: "CIUSSS de l'Est-de-l'Île-de-Montréal"
            },
            {
                names: {
                    en: "In-patient Stay",
                    fr: "Séjour hospitalier"
                },
                cost: "$6,522.00/day",
                descriptions: {
                    en: "Private or semi-private room fees may be added",
                    fr: "Des frais de chambre privée ou semi-privée peuvent être ajoutés"
                },
                source: "https://ciusss-estmtl.gouv.qc.ca/etablissement/hopital-maisonneuve-rosemont/",
                sourceName: "CIUSSS de l'Est-de-l'Île-de-Montréal"
            }
        ],
        additionalInfo: {
            website: "https://ciusss-estmtl.gouv.qc.ca/etablissement/hopital-maisonneuve-rosemont/",
            specialties: ["Emergency Medicine", "Oncology", "Ophthalmology"],
            hours: "24/7",
            parking: "Available on site",
            publicTransport: "STM Metro: Cadillac"
        }
    },
    "Hôpital Santa-Cabrini": {
        names: {
            en: "Santa-Cabrini Hospital",
            fr: "Hôpital Santa-Cabrini"
        },
        address: "5655 St Zotique St E, Montreal, QC H1T 1C7",
        phone: "(514) 252-6000",
        coordinates: [45.5600, -73.5800],
        nonInsuredServices: [
            {
                names: {
                    en: "Emergency Visit",
                    fr: "Visite aux urgences"
                },
                cost: "$1,160.04",
                descriptions: {
                    en: "Diagnostic tests are NOT included in this price",
                    fr: "Les tests diagnostiques ne sont PAS inclus dans ce prix"
                },
                source: "https://santacabrini.qc.ca/en/patients-visitors/billing/",
                sourceName: "Santa-Cabrini Hospital Billing"
            },
            {
                names: {
                    en: "Emergency Triage Visit",
                    fr: "Visite de triage aux urgences"
                },
                cost: "$171.45",
                descriptions: {
                    en: "Triage assessment only",
                    fr: "Évaluation de triage seulement"
                },
                source: "https://santacabrini.qc.ca/en/patients-visitors/billing/",
                sourceName: "Santa-Cabrini Hospital Billing"
            },
            {
                names: {
                    en: "Clinic Visit",
                    fr: "Visite en clinique"
                },
                cost: "$170.61",
                descriptions: {
                    en: "Per visit",
                    fr: "Par visite"
                },
                source: "https://santacabrini.qc.ca/en/patients-visitors/billing/",
                sourceName: "Santa-Cabrini Hospital Billing"
            },
            {
                names: {
                    en: "In-patient Stay",
                    fr: "Séjour hospitalier"
                },
                cost: "$6,522.00/day",
                descriptions: {
                    en: "Private or semi-private room fees may be added",
                    fr: "Des frais de chambre privée ou semi-privée peuvent être ajoutés"
                },
                source: "https://santacabrini.qc.ca/en/patients-visitors/billing/",
                sourceName: "Santa-Cabrini Hospital Billing"
            }
        ],
        additionalInfo: {
            website: "https://santacabrini.qc.ca/",
            specialties: ["Emergency Medicine", "General Medicine", "Oncology"],
            hours: "24/7",
            parking: "Available on site",
            publicTransport: "STM Bus 141, 189"
        }
    },
    "Hôpital de Verdun": {
        names: {
            en: "Verdun Hospital",
            fr: "Hôpital de Verdun"
        },
        address: "4000 Lasalle Blvd, Verdun, QC H4G 2A3",
        phone: "(514) 362-1000",
        coordinates: [45.4500, -73.5700],
        nonInsuredServices: [
            {
                names: {
                    en: "Emergency Visit",
                    fr: "Visite aux urgences"
                },
                cost: "$1,160.04",
                descriptions: {
                    en: "Diagnostic tests are NOT included in this price",
                    fr: "Les tests diagnostiques ne sont PAS inclus dans ce prix"
                },
                source: "https://ciusss-centresudmtl.gouv.qc.ca/etablissement/hopital-de-verdun/",
                sourceName: "CIUSSS du Centre-Sud-de-l'Île-de-Montréal"
            },
            {
                names: {
                    en: "Emergency Triage Visit",
                    fr: "Visite de triage aux urgences"
                },
                cost: "$171.45",
                descriptions: {
                    en: "Triage assessment only",
                    fr: "Évaluation de triage seulement"
                },
                source: "https://ciusss-centresudmtl.gouv.qc.ca/etablissement/hopital-de-verdun/",
                sourceName: "CIUSSS du Centre-Sud-de-l'Île-de-Montréal"
            },
            {
                names: {
                    en: "Clinic Visit",
                    fr: "Visite en clinique"
                },
                cost: "$170.61",
                descriptions: {
                    en: "Per visit",
                    fr: "Par visite"
                },
                source: "https://ciusss-centresudmtl.gouv.qc.ca/etablissement/hopital-de-verdun/",
                sourceName: "CIUSSS du Centre-Sud-de-l'Île-de-Montréal"
            },
            {
                names: {
                    en: "In-patient Stay",
                    fr: "Séjour hospitalier"
                },
                cost: "$6,522.00/day",
                descriptions: {
                    en: "Private or semi-private room fees may be added",
                    fr: "Des frais de chambre privée ou semi-privée peuvent être ajoutés"
                },
                source: "https://ciusss-centresudmtl.gouv.qc.ca/etablissement/hopital-de-verdun/",
                sourceName: "CIUSSS du Centre-Sud-de-l'Île-de-Montréal"
            }
        ],
        additionalInfo: {
            website: "https://ciusss-centresudmtl.gouv.qc.ca/etablissement/hopital-de-verdun/",
            specialties: ["Emergency Medicine", "General Medicine", "Geriatrics"],
            hours: "24/7",
            parking: "Available on site",
            publicTransport: "STM Metro: De l'Église"
        }
    },
    "Lakeshore General Hospital": {
        names: {
            en: "Lakeshore General Hospital",
            fr: "Hôpital général du Lakeshore"
        },
        address: "160 Stillview Ave, Pointe-Claire, QC H9R 2Y2",
        phone: "(514) 630-2225",
        coordinates: [45.4500, -73.8200],
        nonInsuredServices: [
            {
                names: {
                    en: "Emergency Visit",
                    fr: "Visite aux urgences"
                },
                cost: "$1,160.04",
                descriptions: {
                    en: "Diagnostic tests are NOT included in this price",
                    fr: "Les tests diagnostiques ne sont PAS inclus dans ce prix"
                },
                source: "https://ciusss-ouestmtl.gouv.qc.ca/etablissement/hopital-general-du-lakeshore/",
                sourceName: "CIUSSS de l'Ouest-de-l'Île-de-Montréal"
            },
            {
                names: {
                    en: "Emergency Triage Visit",
                    fr: "Visite de triage aux urgences"
                },
                cost: "$171.45",
                descriptions: {
                    en: "Triage assessment only",
                    fr: "Évaluation de triage seulement"
                },
                source: "https://ciusss-ouestmtl.gouv.qc.ca/etablissement/hopital-general-du-lakeshore/",
                sourceName: "CIUSSS de l'Ouest-de-l'Île-de-Montréal"
            },
            {
                names: {
                    en: "Clinic Visit",
                    fr: "Visite en clinique"
                },
                cost: "$170.61",
                descriptions: {
                    en: "Per visit",
                    fr: "Par visite"
                },
                source: "https://ciusss-ouestmtl.gouv.qc.ca/etablissement/hopital-general-du-lakeshore/",
                sourceName: "CIUSSS de l'Ouest-de-l'Île-de-Montréal"
            },
            {
                names: {
                    en: "In-patient Stay",
                    fr: "Séjour hospitalier"
                },
                cost: "$6,522.00/day",
                descriptions: {
                    en: "Private or semi-private room fees may be added",
                    fr: "Des frais de chambre privée ou semi-privée peuvent être ajoutés"
                },
                source: "https://ciusss-ouestmtl.gouv.qc.ca/etablissement/hopital-general-du-lakeshore/",
                sourceName: "CIUSSS de l'Ouest-de-l'Île-de-Montréal"
            }
        ],
        additionalInfo: {
            website: "https://ciusss-ouestmtl.gouv.qc.ca/etablissement/hopital-general-du-lakeshore/",
            specialties: ["Emergency Medicine", "General Medicine", "Maternity"],
            hours: "24/7",
            parking: "Available on site",
            publicTransport: "STM Bus 211, 405"
        }
    },
    "Hôpital de LaSalle": {
        names: {
            en: "LaSalle Hospital",
            fr: "Hôpital de LaSalle"
        },
        address: "8585 Terrasse Champlain, LaSalle, QC H8P 1C1",
        phone: "(514) 363-6363",
        coordinates: [45.4300, -73.6500],
        nonInsuredServices: [
            {
                names: {
                    en: "Emergency Visit",
                    fr: "Visite aux urgences"
                },
                cost: "$1,160.04",
                descriptions: {
                    en: "Diagnostic tests are NOT included in this price",
                    fr: "Les tests diagnostiques ne sont PAS inclus dans ce prix"
                },
                source: "https://ciusss-ouestmtl.gouv.qc.ca/etablissement/hopital-de-lasalle/",
                sourceName: "CIUSSS de l'Ouest-de-l'Île-de-Montréal"
            },
            {
                names: {
                    en: "Emergency Triage Visit",
                    fr: "Visite de triage aux urgences"
                },
                cost: "$171.45",
                descriptions: {
                    en: "Triage assessment only",
                    fr: "Évaluation de triage seulement"
                },
                source: "https://ciusss-ouestmtl.gouv.qc.ca/etablissement/hopital-de-lasalle/",
                sourceName: "CIUSSS de l'Ouest-de-l'Île-de-Montréal"
            },
            {
                names: {
                    en: "Clinic Visit",
                    fr: "Visite en clinique"
                },
                cost: "$170.61",
                descriptions: {
                    en: "Per visit",
                    fr: "Par visite"
                },
                source: "https://ciusss-ouestmtl.gouv.qc.ca/etablissement/hopital-de-lasalle/",
                sourceName: "CIUSSS de l'Ouest-de-l'Île-de-Montréal"
            },
            {
                names: {
                    en: "In-patient Stay",
                    fr: "Séjour hospitalier"
                },
                cost: "$6,522.00/day",
                descriptions: {
                    en: "Private or semi-private room fees may be added",
                    fr: "Des frais de chambre privée ou semi-privée peuvent être ajoutés"
                },
                source: "https://ciusss-ouestmtl.gouv.qc.ca/etablissement/hopital-de-lasalle/",
                sourceName: "CIUSSS de l'Ouest-de-l'Île-de-Montréal"
            }
        ],
        additionalInfo: {
            website: "https://ciusss-ouestmtl.gouv.qc.ca/etablissement/hopital-de-lasalle/",
            specialties: ["Emergency Medicine", "General Medicine", "Geriatrics"],
            hours: "24/7",
            parking: "Available on site",
            publicTransport: "STM Bus 110, 112"
        }
    },
    "Institut universitaire en santé mentale de Montréal": {
        names: {
            en: "Montreal Mental Health University Institute",
            fr: "Institut universitaire en santé mentale de Montréal"
        },
        address: "7401 Rue Hochelaga, Montréal, QC H1N 3M5",
        phone: "(514) 251-4000",
        coordinates: [45.5728, -73.5497],
        nonInsuredServices: [
            {
                names: {
                    en: "Medical Certificate",
                    fr: "Certificat médical"
                },
                cost: "$50",
                descriptions: {
                    en: "Official medical certificate for various purposes",
                    fr: "Certificat médical officiel pour diverses fins"
                },
                source: "https://www.iusmm.ca/en/patients-visitors/medical-records",
                sourceName: "Hospital Website"
            },
            {
                names: {
                    en: "Medical Records Copy",
                    fr: "Copie de dossier médical"
                },
                cost: "$30",
                descriptions: {
                    en: "Copy of medical records and documentation",
                    fr: "Copie du dossier médical et documentation"
                },
                source: "https://www.iusmm.ca/en/patients-visitors/medical-records",
                sourceName: "Hospital Website"
            }
        ],
        additionalInfo: {
            website: "https://www.iusmm.ca",
            specialties: ["Mental Health", "Psychiatry"],
            hours: "24/7",
            parking: "Available on site",
            publicTransport: "Metro: Saint-Laurent (Green Line), Bus: 15, 55"
        }
    }
};

// Function to validate coordinates
function isValidCoordinate(lat, lng) {
  return typeof lat === 'number' && 
         typeof lng === 'number' && 
         !isNaN(lat) && 
         !isNaN(lng) && 
         lat >= -90 && 
         lat <= 90 && 
         lng >= -180 && 
         lng <= 180;
}

// Function to get coordinates for a hospital
function getHospitalCoordinates(hospitalName) {
  // Try to find exact match
  if (montrealHospitals[hospitalName]) {
    return montrealHospitals[hospitalName].coordinates;
  }
  
  // Try to find partial match
  for (const [name, data] of Object.entries(montrealHospitals)) {
    if (hospitalName.toLowerCase().includes(name.toLowerCase()) || 
        name.toLowerCase().includes(hospitalName.toLowerCase())) {
      return data.coordinates;
    }
  }
  
  // If no match found, try to geocode the address
  return null;
}

// Function to get hospital details with exact matching
function getHospitalDetails(installation, etablissement) {
    // Special case for Glen site / Royal Victoria
    if (installation === "HÔPITAL ROYAL VICTORIA" && etablissement === "CENTRE UNIVERSITAIRE DE SANTÉ MCGILL") {
        return {
            name: "Royal Victoria Hospital at Glen Site (MUHC)",
            coordinates: emergencyHospitalMap["Hôpital Glen (McGill University Health Centre)"].coordinates,
            address: emergencyHospitalMap["Hôpital Glen (McGill University Health Centre)"].address,
            phone: emergencyHospitalMap["Hôpital Glen (McGill University Health Centre)"].phone
        };
    }
    
    // Find the matching hospital in our map
    for (const [displayName, details] of Object.entries(emergencyHospitalMap)) {
        // Try all possible API names
        for (const apiName of details.apiNames) {
            // Try exact match
            if (installation === apiName) {
                console.log(`Matched hospital: "${installation}" to "${displayName}"`);
                return {
                    name: displayName,
                    names: details.names,
                    coordinates: details.coordinates,
                    address: details.address,
                    phone: details.phone
                };
            }
            // Try case-insensitive match
            if (installation.toLowerCase() === apiName.toLowerCase()) {
                console.log(`Matched hospital (case-insensitive): "${installation}" to "${displayName}"`);
                return {
                    name: displayName,
                    names: details.names,
                    coordinates: details.coordinates,
                    address: details.address,
                    phone: details.phone
                };
            }
            // Try partial match
            if (installation.toLowerCase().includes(apiName.toLowerCase()) || 
                apiName.toLowerCase().includes(installation.toLowerCase())) {
                console.log(`Matched hospital (partial): "${installation}" to "${displayName}"`);
                return {
                    name: displayName,
                    names: details.names,
                    coordinates: details.coordinates,
                    address: details.address,
                    phone: details.phone
                };
            }
        }
    }

    // Special case for Hôpital Glen (McGill University Health Centre)
    if (etablissement === "CENTRE UNIVERSITAIRE DE SANTÉ MCGILL" && 
        (installation === "SITE GLEN" || installation.includes("GLEN"))) {
        console.log(`Matched hospital by parent organization: "${installation}" to "Hôpital Glen (McGill University Health Centre)"`);
        return {
            name: "Hôpital Glen (McGill University Health Centre)",
            names: emergencyHospitalMap["Hôpital Glen (McGill University Health Centre)"].names,
            coordinates: emergencyHospitalMap["Hôpital Glen (McGill University Health Centre)"].coordinates,
            address: emergencyHospitalMap["Hôpital Glen (McGill University Health Centre)"].address,
            phone: emergencyHospitalMap["Hôpital Glen (McGill University Health Centre)"].phone
        };
    }

    // Special case for Hôpital du Sacré-Coeur de Montréal
    if (etablissement === "CIUSSS DU NORD-DE-L'ÎLE-DE-MONTRÉAL" && 
        (installation.includes("SACRÉ-COEUR") || installation.includes("SACRE-COEUR"))) {
        console.log(`Matched hospital by parent organization: "${installation}" to "Hôpital du Sacré-Coeur de Montréal"`);
        return {
            name: "Hôpital du Sacré-Coeur de Montréal",
            names: emergencyHospitalMap["Hôpital du Sacré-Coeur de Montréal"].names,
            coordinates: emergencyHospitalMap["Hôpital du Sacré-Coeur de Montréal"].coordinates,
            address: emergencyHospitalMap["Hôpital du Sacré-Coeur de Montréal"].address,
            phone: emergencyHospitalMap["Hôpital du Sacré-Coeur de Montréal"].phone
        };
    }
    
    console.log(`No match found for hospital: "${installation}" (Etablissement: "${etablissement}")`);
    return null;
}

// Function to convert French time format to minutes
function convertWaitTimeToMinutes(dmsAmbulatoire) {
    if (!dmsAmbulatoire) return 0;
    
    // Try to parse as decimal hours
    const decimalHours = parseFloat(dmsAmbulatoire);
    if (!isNaN(decimalHours)) {
        return Math.round(decimalHours * 60);
    }
    
    // Try to parse as HH:MM format
    const timeMatch = dmsAmbulatoire.match(/(\d+):(\d+)/);
    if (timeMatch) {
        const hours = parseInt(timeMatch[1]);
        const minutes = parseInt(timeMatch[2]);
        return hours * 60 + minutes;
    }
    
    return 0;
}

// Function to check if a record is a regional total
function isRegionalTotal(record) {
  return record.Nom_installation === "Total régional" || 
         record.Nom_installation === "Ensemble du Québec" ||
         record.Nom_etablissement === "Total régional" ||
         record.Nom_etablissement === "Ensemble du Québec";
}

// Function to safely parse integer values
function safeParseInt(value, defaultValue = 0) {
    const parsed = parseInt(value);
    return isNaN(parsed) ? defaultValue : parsed;
}

// Function to check if a hospital is one of our emergency hospitals
function isEmergencyHospital(hospitalName) {
    return emergencyHospitals.some(emergencyHospital => 
        hospitalName.toLowerCase().includes(emergencyHospital.toLowerCase()) ||
        emergencyHospital.toLowerCase().includes(hospitalName.toLowerCase())
    );
}

// Proxy endpoint for hospital data
app.get('/api/hospitals', async (req, res) => {
    try {
        const API_BASE_URL = 'https://www.donneesquebec.ca/recherche/api/3/action';
        const RESOURCE_ID = 'b256f87f-40ec-4c79-bdba-a23e9c50e741';
        
        console.log('Fetching hospital data from:', `${API_BASE_URL}/datastore_search`);
        
        const response = await axios.get(`${API_BASE_URL}/datastore_search`, {
            params: {
                resource_id: RESOURCE_ID,
                limit: 100,
            },
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Montreal-Health-App/1.0'
            }
        });
        
        console.log('API Response status:', response.status);
        
        if (!response.data || !response.data.result || !response.data.result.records) {
            throw new Error('Invalid API response format');
        }
        
        // Log all hospital names from API for debugging
        console.log('\nAll hospital names from API:');
        for (const record of response.data.result.records) {
            if (record.Nom_etablissement === 'CENTRE UNIVERSITAIRE DE SANTÉ MCGILL') {
                console.log(`\nFound MUHC hospital:
- ID: ${record._id}
- Installation: "${record.Nom_installation}"
- Etablissement: "${record.Nom_etablissement}"
- Permis: "${record.Permis}"
- Fields: ${JSON.stringify(Object.keys(record))}`);
            }
        }
        
        // Create a Map to store unique hospitals by name
        const uniqueHospitals = new Map();
        
        // Process only records that match our emergency hospitals
        response.data.result.records
            .filter(record => !isRegionalTotal(record))
            .forEach(record => {
                const hospitalName = record.Nom_installation;
                const etablissement = record.Nom_etablissement;
                if (hospitalName && hospitalName.trim() !== "") {
                    // Get hospital details
                    const hospitalDetails = getHospitalDetails(hospitalName, etablissement);
                    
                    if (hospitalDetails) {
                        // Calculate occupancy and waiting rates
                        const totalPatients = safeParseInt(record.Nombre_total_de_patients_presents_a_lurgence);
                        const waitingPatients = safeParseInt(record.Nombre_total_de_patients_en_attente_de_PEC);
                        const totalStretchers = safeParseInt(record.Nombre_de_civieres_fonctionnelles);
                        const occupiedStretchers = safeParseInt(record.Nombre_de_civieres_occupees);
                        const patientsOver24Hours = safeParseInt(record.Nombre_de_patients_sur_civiere_plus_de_24_heures);
                        const patientsOver48Hours = safeParseInt(record.Nombre_de_patients_sur_civiere_plus_de_48_heures);

                        // Log the values for debugging
                        console.log(`Hospital: ${hospitalName}`);
                        console.log(`Patients over 24h: ${record.Nombre_de_patients_sur_civiere_plus_de_24_heures} (parsed: ${patientsOver24Hours})`);
                        console.log(`Patients over 48h: ${record.Nombre_de_patients_sur_civiere_plus_de_48_heures} (parsed: ${patientsOver48Hours})`);

                        // Calculate rates
                        const occupancyRate = totalStretchers > 0 ? (occupiedStretchers / totalStretchers) * 100 : 0;
                        const waitingRate = totalPatients > 0 ? (waitingPatients / totalPatients) * 100 : 0;

                        // Ensure all required fields are present with proper defaults
                        const hospitalData = {
                            name: hospitalDetails.name,
                            names: hospitalDetails.names,
                            installation: record.Nom_installation,
                            address: hospitalDetails.address,
                            phone: hospitalDetails.phone,
                            coordinates: hospitalDetails.coordinates,
                            lastUpdated: new Date().toISOString(),
                            patientsWaiting: waitingPatients,
                            totalPatients,
                            functionalStretchers: totalStretchers,
                            occupiedStretchers,
                            patientsOver24Hours,
                            patientsOver48Hours,
                            metrics: {
                                occupancyRate: Math.round(occupancyRate),
                                waitingRate: Math.round(waitingRate),
                                availableStretchers: totalStretchers - occupiedStretchers,
                                totalPatients,
                                waitingPatients,
                                patientsOver24Hours,
                                patientsOver48Hours
                            }
                        };
                        
                        uniqueHospitals.set(hospitalDetails.name, hospitalData);
                    }
                }
            });
        
        // Convert Map to Array and send response
        const hospitals = Array.from(uniqueHospitals.values());
        console.log(`\nProcessed ${hospitals.length} hospitals`);
        res.json(hospitals);
        
    } catch (error) {
        console.error('Error fetching hospital data:', error);
        if (error.response) {
            console.error('Error response:', {
                status: error.response.status,
                data: error.response.data
            });
        }
        res.status(500).json({ 
            error: 'Error fetching hospital data', 
            details: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Input validation middleware
const validateHospitalId = (req, res, next) => {
    try {
        const hospitalId = req.params.id;
        if (!hospitalId || typeof hospitalId !== 'string') {
            return res.status(400).json({ 
                error: 'Invalid hospital ID',
                message: 'Hospital ID is required and must be a string'
            });
        }
        
        // Simply decode the hospital ID and pass it through
        req.params.id = decodeURIComponent(hospitalId);
        next();
    } catch (error) {
        console.error('Error in validateHospitalId:', error);
        return res.status(400).json({ 
            error: 'Invalid hospital ID',
            message: 'Error processing hospital ID'
        });
    }
};

// Hospital details endpoint with validation
app.get('/api/hospital/:id', validateHospitalId, async (req, res) => {
    try {
        // Get the hospital name from the URL
        const hospitalName = decodeURIComponent(req.params.id);
        console.log('Fetching details for hospital:', hospitalName);

        // Get the hospital details from our mapping
        const details = hospitalDetails[hospitalName];

        if (!details) {
            console.log('Hospital not found:', hospitalName);
            console.log('Available hospitals:', Object.keys(hospitalDetails));
            return res.status(404).json({ 
                error: 'Hospital not found',
                message: `No details found for hospital: ${hospitalName}`,
                availableHospitals: Object.keys(hospitalDetails)
            });
        }

        // Fetch current wait times from API with error handling
        const API_BASE_URL = 'https://www.donneesquebec.ca/recherche/api/3/action';
        const RESOURCE_ID = 'b256f87f-40ec-4c79-bdba-a23e9c50e741';
        
        const waitTimeResponse = await axios.get(`${API_BASE_URL}/datastore_search`, {
            params: {
                resource_id: RESOURCE_ID,
                limit: 100
            }
        });

        // Find current wait time for this hospital
        let currentWaitTime = null;
        if (waitTimeResponse.data?.result?.records) {
            currentWaitTime = waitTimeResponse.data.result.records.find(record => {
                const hospitalDetails = getHospitalDetails(record.Nom_installation, record.Nom_etablissement);
                return hospitalDetails && hospitalDetails.name === hospitalName;
            });
        }

        // Construct response object with sanitized data
        const response = {
            id: hospitalName,
            names: details.names,
            address: details.address || 'N/A',
            phone: details.phone || 'N/A',
            coordinates: details.coordinates || [0, 0],
            erOccupancy: currentWaitTime ? Math.round((safeParseInt(currentWaitTime.Nombre_de_civieres_occupees) / safeParseInt(currentWaitTime.Nombre_de_civieres_fonctionnelles)) * 100) : 'N/A',
            waitingRate: currentWaitTime ? Math.round((safeParseInt(currentWaitTime.Nombre_total_de_patients_en_attente_de_PEC) / safeParseInt(currentWaitTime.Nombre_total_de_patients_presents_a_lurgence)) * 100) : 'N/A',
            totalPatients: currentWaitTime ? safeParseInt(currentWaitTime.Nombre_total_de_patients_presents_a_lurgence) : 'N/A',
            patientsWaiting: currentWaitTime ? safeParseInt(currentWaitTime.Nombre_total_de_patients_en_attente_de_PEC) : 'N/A',
            availableStretchers: currentWaitTime ? safeParseInt(currentWaitTime.Nombre_de_civieres_fonctionnelles) - safeParseInt(currentWaitTime.Nombre_de_civieres_occupees) : 'N/A',
            nonInsuredServices: details.nonInsuredServices || [],
            additionalInfo: details.additionalInfo || {
                website: 'N/A',
                specialties: ['Emergency Medicine', 'General Medicine'],
                hours: '24/7',
                parking: 'Available on site',
                publicTransport: 'Accessible by public transit'
            }
        };

        res.json(response);
    } catch (error) {
        console.error('Error fetching hospital details:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Serve the hospital-details.html file
app.get('/hospital-details.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'hospital-details.html'));
});

// Serve FAQ page
app.get('/faq.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'faq.html'));
});

// Serve About page
app.get('/about.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'about.html'));
});

// Serve the index.html file for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
}); 

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    
    // Don't expose internal errors in production
    const errorResponse = {
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred'
    };
    
    res.status(500).json(errorResponse);
});

// Request logging middleware
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.url} ${res.statusCode} ${duration}ms`);
    });
    next();
});

// Serve favicon
app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'favicon.ico'));
});