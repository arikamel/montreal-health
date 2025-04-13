const hospitalData = {
    "Hôpital en santé mentale Albert-Prévost": {
        names: {
            en: "Albert-Prévost Mental Health Hospital",
            fr: "Hôpital en santé mentale Albert-Prévost"
        },
        nonInsuredServices: [
            {
                names: {
                    en: "Medical Certificate",
                    fr: "Certificat médical"
                },
                cost: "$50",
                description: {
                    en: "Official medical certificate for various purposes (work, school, insurance, etc.)",
                    fr: "Certificat médical officiel pour divers usages (travail, école, assurance, etc.)"
                },
                source: "https://ciusss-centresudmtl.gc.ca/en/our-services/mental-health-and-addiction/albert-prevost-mental-health-hospital",
                sourceName: "Hospital Website"
            },
            {
                names: {
                    en: "Medical Records Copy",
                    fr: "Copie des dossiers médicaux"
                },
                cost: "$30",
                description: {
                    en: "Copy of medical records for personal or professional use",
                    fr: "Copie des dossiers médicaux pour usage personnel ou professionnel"
                },
                source: "https://ciusss-centresudmtl.gc.ca/en/our-services/mental-health-and-addiction/albert-prevost-mental-health-hospital",
                sourceName: "Hospital Website"
            }
        ],
        additionalInfo: {
            website: "https://ciusss-centresudmtl.gc.ca/en/our-services/mental-health-and-addiction/albert-prevost-mental-health-hospital",
            specialties: ["Mental Health", "Psychiatry"],
            hours: "24/7",
            parking: "Available on site",
            publicTransport: "Metro: Pie-IX (Green Line), Bus: 139, 187"
        }
    },
    "Hôpital du Sacré-Coeur de Montréal": {
        names: {
            en: "Sacré-Coeur Hospital of Montreal",
            fr: "Hôpital du Sacré-Coeur de Montréal"
        },
        nonInsuredServices: [
            {
                names: {
                    en: "Medical Certificate",
                    fr: "Certificat médical"
                },
                cost: "$50",
                description: {
                    en: "Official medical certificate for various purposes (work, school, insurance, etc.)",
                    fr: "Certificat médical officiel pour divers usages (travail, école, assurance, etc.)"
                },
                source: "https://ciusss-nordmtl.gc.ca/en/our-services/emergency-department/sacre-coeur-hospital",
                sourceName: "Hospital Website"
            },
            {
                names: {
                    en: "Medical Records Copy",
                    fr: "Copie des dossiers médicaux"
                },
                cost: "$30",
                description: {
                    en: "Copy of medical records for personal or professional use",
                    fr: "Copie des dossiers médicaux pour usage personnel ou professionnel"
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
        nonInsuredServices: [
            {
                names: {
                    en: "Medical Certificate",
                    fr: "Certificat médical"
                },
                cost: "$50",
                description: {
                    en: "Official medical certificate for various purposes (work, school, insurance, etc.)",
                    fr: "Certificat médical officiel pour divers usages (travail, école, assurance, etc.)"
                },
                source: "https://ciusss-nordmtl.gc.ca/en/our-services/emergency-department/fleury-hospital",
                sourceName: "Hospital Website"
            },
            {
                names: {
                    en: "Medical Records Copy",
                    fr: "Copie des dossiers médicaux"
                },
                cost: "$30",
                description: {
                    en: "Copy of medical records for personal or professional use",
                    fr: "Copie des dossiers médicaux pour usage personnel ou professionnel"
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
        nonInsuredServices: [
            {
                names: {
                    en: "Medical Certificate",
                    fr: "Certificat médical"
                },
                cost: "$50",
                description: {
                    en: "Official medical certificate for various purposes (work, school, insurance, etc.)",
                    fr: "Certificat médical officiel pour divers usages (travail, école, assurance, etc.)"
                },
                source: "https://jgh.ca/patients/medical-records",
                sourceName: "Hospital Website"
            },
            {
                names: {
                    en: "Medical Records Copy",
                    fr: "Copie des dossiers médicaux"
                },
                cost: "$30",
                description: {
                    en: "Copy of medical records for personal or professional use",
                    fr: "Copie des dossiers médicaux pour usage personnel ou professionnel"
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
        nonInsuredServices: [
            {
                names: {
                    en: "Medical Certificate",
                    fr: "Certificat médical"
                },
                cost: "$50",
                description: {
                    en: "Official medical certificate for various purposes (work, school, insurance, etc.)",
                    fr: "Certificat médical officiel pour divers usages (travail, école, assurance, etc.)"
                },
                source: "https://www.chusj.org/en/patients-families/medical-records",
                sourceName: "Hospital Website"
            },
            {
                names: {
                    en: "Medical Records Copy",
                    fr: "Copie des dossiers médicaux"
                },
                cost: "$30",
                description: {
                    en: "Copy of medical records for personal or professional use",
                    fr: "Copie des dossiers médicaux pour usage personnel ou professionnel"
                },
                source: "https://www.chusj.org/en/patients-families/medical-records",
                sourceName: "Hospital Website"
            }
        ],
        additionalInfo: {
            website: "https://www.chusj.org",
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
        nonInsuredServices: [
            {
                names: {
                    en: "Medical Certificate",
                    fr: "Certificat médical"
                },
                cost: "$50",
                description: {
                    en: "Official medical certificate for various purposes (work, school, insurance, etc.)",
                    fr: "Certificat médical officiel pour divers usages (travail, école, assurance, etc.)"
                },
                source: "https://www.smhc.qc.ca/en/patients-visitors/medical-records",
                sourceName: "Hospital Website"
            },
            {
                names: {
                    en: "Medical Records Copy",
                    fr: "Copie des dossiers médicaux"
                },
                cost: "$30",
                description: {
                    en: "Copy of medical records for personal or professional use",
                    fr: "Copie des dossiers médicaux pour usage personnel ou professionnel"
                },
                source: "https://www.smhc.qc.ca/en/patients-visitors/medical-records",
                sourceName: "Hospital Website"
            }
        ],
        additionalInfo: {
            website: "https://www.smhc.qc.ca",
            specialties: ["Emergency Medicine", "General Medicine"],
            hours: "24/7",
            parking: "Available on site",
            publicTransport: "Metro: Vendôme (Orange Line), Bus: 90, 104"
        }
    },
    "Hôpital Jean-Talon": {
        names: {
            en: "Jean-Talon Hospital",
            fr: "Hôpital Jean-Talon"
        },
        nonInsuredServices: [
            {
                names: {
                    en: "Medical Certificate",
                    fr: "Certificat médical"
                },
                cost: "$50",
                description: {
                    en: "Official medical certificate for various purposes (work, school, insurance, etc.)",
                    fr: "Certificat médical officiel pour divers usages (travail, école, assurance, etc.)"
                },
                source: "https://ciusss-centresudmtl.gc.ca/en/our-services/emergency-department/jean-talon-hospital",
                sourceName: "Hospital Website"
            },
            {
                names: {
                    en: "Medical Records Copy",
                    fr: "Copie des dossiers médicaux"
                },
                cost: "$30",
                description: {
                    en: "Copy of medical records for personal or professional use",
                    fr: "Copie des dossiers médicaux pour usage personnel ou professionnel"
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
        nonInsuredServices: [
            {
                names: {
                    en: "Medical Certificate",
                    fr: "Certificat médical"
                },
                cost: "$50",
                description: {
                    en: "Official medical certificate for various purposes (work, school, insurance, etc.)",
                    fr: "Certificat médical officiel pour divers usages (travail, école, assurance, etc.)"
                },
                source: "https://muhc.ca/patients-visitors/medical-records",
                sourceName: "Hospital Website"
            },
            {
                names: {
                    en: "Medical Records Copy",
                    fr: "Copie des dossiers médicaux"
                },
                cost: "$30",
                description: {
                    en: "Copy of medical records for personal or professional use",
                    fr: "Copie des dossiers médicaux pour usage personnel ou professionnel"
                },
                source: "https://muhc.ca/patients-visitors/medical-records",
                sourceName: "Hospital Website"
            }
        ],
        additionalInfo: {
            website: "https://muhc.ca",
            specialties: ["Emergency Medicine", "Cardiology", "Neurology", "Oncology"],
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
        nonInsuredServices: [
            {
                names: {
                    en: "Medical Certificate",
                    fr: "Certificat médical"
                },
                cost: "$50",
                description: {
                    en: "Official medical certificate for various purposes (work, school, insurance, etc.)",
                    fr: "Certificat médical officiel pour divers usages (travail, école, assurance, etc.)"
                },
                source: "https://muhc.ca/patients-visitors/medical-records",
                sourceName: "Hospital Website"
            },
            {
                names: {
                    en: "Medical Records Copy",
                    fr: "Copie des dossiers médicaux"
                },
                cost: "$30",
                description: {
                    en: "Copy of medical records for personal or professional use",
                    fr: "Copie des dossiers médicaux pour usage personnel ou professionnel"
                },
                source: "https://muhc.ca/patients-visitors/medical-records",
                sourceName: "Hospital Website"
            }
        ],
        additionalInfo: {
            website: "https://muhc.ca",
            specialties: ["Emergency Medicine", "Trauma", "Neurosurgery"],
            hours: "24/7",
            parking: "Available on site",
            publicTransport: "Metro: Guy-Concordia (Green Line), Bus: 15, 24"
        }
    },
    "Centre hospitalier de l'Université de Montréal (CHUM)": {
        names: {
            en: "University of Montreal Hospital Centre (CHUM)",
            fr: "Centre hospitalier de l'Université de Montréal (CHUM)"
        },
        nonInsuredServices: [
            {
                names: {
                    en: "Emergency Triage Visit",
                    fr: "Visite de triage aux urgences"
                },
                cost: "$171.45",
                description: {
                    en: "Triage assessment only",
                    fr: "Évaluation de triage uniquement"
                },
                source: "https://www.chumontreal.qc.ca/en/patients-visitors/billing",
                sourceName: "CHUM Billing Information"
            },
            {
                names: {
                    en: "Day Surgery",
                    fr: "Chirurgie d'un jour"
                },
                cost: "$4,819.95",
                description: {
                    en: "Includes operating room and basic care",
                    fr: "Comprend la salle d'opération et les soins de base"
                },
                source: "https://www.chumontreal.qc.ca/en/patients-visitors/billing",
                sourceName: "CHUM Billing Information"
            },
            {
                names: {
                    en: "Medical Certificate",
                    fr: "Certificat médical"
                },
                cost: "$50",
                description: {
                    en: "Official medical certificate for various purposes (work, school, insurance, etc.)",
                    fr: "Certificat médical officiel pour divers usages (travail, école, assurance, etc.)"
                },
                source: "https://www.chumontreal.qc.ca/en/patients-visitors/medical-records",
                sourceName: "Hospital Website"
            },
            {
                names: {
                    en: "Medical Records Copy",
                    fr: "Copie des dossiers médicaux"
                },
                cost: "$30",
                description: {
                    en: "Copy of medical records for personal or professional use",
                    fr: "Copie des dossiers médicaux pour usage personnel ou professionnel"
                },
                source: "https://www.chumontreal.qc.ca/en/patients-visitors/medical-records",
                sourceName: "Hospital Website"
            }
        ],
        additionalInfo: {
            website: "https://www.chumontreal.qc.ca",
            specialties: ["Emergency Medicine", "Cardiology", "Oncology", "Neurology"],
            hours: "24/7",
            parking: "Available on site",
            publicTransport: "Metro: Champ-de-Mars (Orange Line), Bus: 14, 55, 80, 129"
        }
    },
    "Hôpital Maisonneuve-Rosemont": {
        names: {
            en: "Maisonneuve-Rosemont Hospital",
            fr: "Hôpital Maisonneuve-Rosemont"
        },
        nonInsuredServices: [
            {
                names: {
                    en: "Medical Certificate",
                    fr: "Certificat médical"
                },
                cost: "$50",
                description: {
                    en: "Official medical certificate for various purposes (work, school, insurance, etc.)",
                    fr: "Certificat médical officiel pour divers usages (travail, école, assurance, etc.)"
                },
                source: "https://ciusss-estmtl.gc.ca/en/our-services/emergency-department/maisonneuve-rosemont-hospital",
                sourceName: "Hospital Website"
            },
            {
                names: {
                    en: "Medical Records Copy",
                    fr: "Copie des dossiers médicaux"
                },
                cost: "$30",
                description: {
                    en: "Copy of medical records for personal or professional use",
                    fr: "Copie des dossiers médicaux pour usage personnel ou professionnel"
                },
                source: "https://ciusss-estmtl.gc.ca/en/our-services/emergency-department/maisonneuve-rosemont-hospital",
                sourceName: "Hospital Website"
            }
        ],
        additionalInfo: {
            website: "https://ciusss-estmtl.gc.ca/en/our-services/emergency-department/maisonneuve-rosemont-hospital",
            specialties: ["Emergency Medicine", "Ophthalmology", "Oncology"],
            hours: "24/7",
            parking: "Available on site",
            publicTransport: "Metro: Pie-IX (Green Line), Bus: 139, 187"
        }
    },
    "Hôpital Santa-Cabrini": {
        names: {
            en: "Santa-Cabrini Hospital",
            fr: "Hôpital Santa-Cabrini"
        },
        nonInsuredServices: [
            {
                names: {
                    en: "Medical Certificate",
                    fr: "Certificat médical"
                },
                cost: "$50",
                description: {
                    en: "Official medical certificate for various purposes (work, school, insurance, etc.)",
                    fr: "Certificat médical officiel pour divers usages (travail, école, assurance, etc.)"
                },
                source: "https://www.santacabrini.qc.ca/en/patients-visitors/medical-records",
                sourceName: "Hospital Website"
            },
            {
                names: {
                    en: "Medical Records Copy",
                    fr: "Copie des dossiers médicaux"
                },
                cost: "$30",
                description: {
                    en: "Copy of medical records for personal or professional use",
                    fr: "Copie des dossiers médicaux pour usage personnel ou professionnel"
                },
                source: "https://www.santacabrini.qc.ca/en/patients-visitors/medical-records",
                sourceName: "Hospital Website"
            }
        ],
        additionalInfo: {
            website: "https://www.santacabrini.qc.ca",
            specialties: ["Emergency Medicine", "General Medicine"],
            hours: "24/7",
            parking: "Available on site",
            publicTransport: "Metro: Viau (Green Line), Bus: 33, 141"
        }
    },
    "Hôpital de Verdun": {
        names: {
            en: "Verdun Hospital",
            fr: "Hôpital de Verdun"
        },
        nonInsuredServices: [
            {
                names: {
                    en: "Medical Certificate",
                    fr: "Certificat médical"
                },
                cost: "$50",
                description: {
                    en: "Official medical certificate for various purposes (work, school, insurance, etc.)",
                    fr: "Certificat médical officiel pour divers usages (travail, école, assurance, etc.)"
                },
                source: "https://ciusss-centresudmtl.gc.ca/en/our-services/emergency-department/verdun-hospital",
                sourceName: "Hospital Website"
            },
            {
                names: {
                    en: "Medical Records Copy",
                    fr: "Copie des dossiers médicaux"
                },
                cost: "$30",
                description: {
                    en: "Copy of medical records for personal or professional use",
                    fr: "Copie des dossiers médicaux pour usage personnel ou professionnel"
                },
                source: "https://ciusss-centresudmtl.gc.ca/en/our-services/emergency-department/verdun-hospital",
                sourceName: "Hospital Website"
            }
        ],
        additionalInfo: {
            website: "https://ciusss-centresudmtl.gc.ca/en/our-services/emergency-department/verdun-hospital",
            specialties: ["Emergency Medicine", "General Medicine"],
            hours: "24/7",
            parking: "Available on site",
            publicTransport: "Metro: Verdun (Green Line), Bus: 58, 61"
        }
    },
    "Lakeshore General Hospital": {
        names: {
            en: "Lakeshore General Hospital",
            fr: "Hôpital général du Lakeshore"
        },
        nonInsuredServices: [
            {
                names: {
                    en: "Medical Certificate",
                    fr: "Certificat médical"
                },
                cost: "$50",
                description: {
                    en: "Official medical certificate for various purposes (work, school, insurance, etc.)",
                    fr: "Certificat médical officiel pour divers usages (travail, école, assurance, etc.)"
                },
                source: "https://www.westislandhealth.ca/en/patients-visitors/medical-records",
                sourceName: "Hospital Website"
            },
            {
                names: {
                    en: "Medical Records Copy",
                    fr: "Copie des dossiers médicaux"
                },
                cost: "$30",
                description: {
                    en: "Copy of medical records for personal or professional use",
                    fr: "Copie des dossiers médicaux pour usage personnel ou professionnel"
                },
                source: "https://www.westislandhealth.ca/en/patients-visitors/medical-records",
                sourceName: "Hospital Website"
            }
        ],
        additionalInfo: {
            website: "https://www.westislandhealth.ca",
            specialties: ["Emergency Medicine", "General Medicine"],
            hours: "24/7",
            parking: "Available on site",
            publicTransport: "Bus: 201, 211, 405"
        }
    },
    "Hôpital de LaSalle": {
        names: {
            en: "LaSalle Hospital",
            fr: "Hôpital de LaSalle"
        },
        nonInsuredServices: [
            {
                names: {
                    en: "Medical Certificate",
                    fr: "Certificat médical"
                },
                cost: "$50",
                description: {
                    en: "Official medical certificate for various purposes (work, school, insurance, etc.)",
                    fr: "Certificat médical officiel pour divers usages (travail, école, assurance, etc.)"
                },
                source: "https://ciusss-centresudmtl.gc.ca/en/our-services/emergency-department/lasalle-hospital",
                sourceName: "Hospital Website"
            },
            {
                names: {
                    en: "Medical Records Copy",
                    fr: "Copie des dossiers médicaux"
                },
                cost: "$30",
                description: {
                    en: "Copy of medical records for personal or professional use",
                    fr: "Copie des dossiers médicaux pour usage personnel ou professionnel"
                },
                source: "https://ciusss-centresudmtl.gc.ca/en/our-services/emergency-department/lasalle-hospital",
                sourceName: "Hospital Website"
            }
        ],
        additionalInfo: {
            website: "https://ciusss-centresudmtl.gc.ca/en/our-services/emergency-department/lasalle-hospital",
            specialties: ["Emergency Medicine", "General Medicine"],
            hours: "24/7",
            parking: "Available on site",
            publicTransport: "Metro: Angrignon (Green Line), Bus: 37, 78"
        }
    },
    "Institut universitaire en santé mentale de Montréal": {
        names: {
            en: "Montreal Mental Health University Institute",
            fr: "Institut universitaire en santé mentale de Montréal"
        },
        nonInsuredServices: [
            {
                names: {
                    en: "Medical Certificate",
                    fr: "Certificat médical"
                },
                cost: "$50",
                description: {
                    en: "Official medical certificate for various purposes (work, school, insurance, etc.)",
                    fr: "Certificat médical officiel pour divers usages (travail, école, assurance, etc.)"
                },
                source: "https://www.iusmm.ca/en/patients-visitors/medical-records",
                sourceName: "Hospital Website"
            },
            {
                names: {
                    en: "Medical Records Copy",
                    fr: "Copie des dossiers médicaux"
                },
                cost: "$30",
                description: {
                    en: "Copy of medical records for personal or professional use",
                    fr: "Copie des dossiers médicaux pour usage personnel ou professionnel"
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

module.exports = hospitalData; 