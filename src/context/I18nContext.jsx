import React, { createContext, useContext, useState, useEffect } from 'react';

// Default translations
const translations = {
  en: {
    nav: {
      dashboard: 'Dashboard',
      calls: 'Call History',
      analytics: 'Analytics',
      team: 'Team',
      settings: 'Settings',
      logout: 'Logout',
    },
    common: {
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      confirm: 'Confirm',
      close: 'Close',
      search: 'Search...',
      filter: 'Filter',
      noData: 'No data found',
      error: 'Error',
      success: 'Success',
      warning: 'Warning',
      info: 'Info',
      settings: 'Settings',
      profile: 'Profile',
      logout: 'Logout',
    },
    actions: {
      create: 'Create',
      edit: 'Edit',
      update: 'Update',
      remove: 'Remove',
      export: 'Export',
      import: 'Import',
      download: 'Download',
      upload: 'Upload',
    },
    pagination: {
      first: 'First',
      previous: 'Previous',
      next: 'Next',
      last: 'Last',
      of: 'of',
    },
    form: {
      required: 'This field is required',
      email: 'Please enter a valid email',
      password: 'Password must be at least 8 characters',
      confirm: 'Passwords do not match',
    },
  },
  es: {
    nav: {
      dashboard: 'Panel de Control',
      calls: 'Historial de Llamadas',
      analytics: 'Análisis',
      team: 'Equipo',
      settings: 'Configuración',
      logout: 'Cerrar Sesión',
    },
    common: {
      loading: 'Cargando...',
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      confirm: 'Confirmar',
      close: 'Cerrar',
      search: 'Buscar...',
      filter: 'Filtro',
      noData: 'Sin datos',
      error: 'Error',
      success: 'Éxito',
      warning: 'Advertencia',
      info: 'Información',
      settings: 'Configuración',
      profile: 'Perfil',
      logout: 'Cerrar Sesión',
    },
    actions: {
      create: 'Crear',
      edit: 'Editar',
      update: 'Actualizar',
      remove: 'Eliminar',
      export: 'Exportar',
      import: 'Importar',
      download: 'Descargar',
      upload: 'Cargar',
    },
    pagination: {
      first: 'Primero',
      previous: 'Anterior',
      next: 'Siguiente',
      last: 'Último',
      of: 'de',
    },
    form: {
      required: 'Este campo es requerido',
      email: 'Por favor ingrese un correo válido',
      password: 'La contraseña debe tener al menos 8 caracteres',
      confirm: 'Las contraseñas no coinciden',
    },
  },
  fr: {
    nav: {
      dashboard: 'Tableau de Bord',
      calls: 'Historique des Appels',
      analytics: 'Analyse',
      team: 'Équipe',
      settings: 'Paramètres',
      logout: 'Déconnexion',
    },
    common: {
      loading: 'Chargement...',
      save: 'Enregistrer',
      cancel: 'Annuler',
      delete: 'Supprimer',
      confirm: 'Confirmer',
      close: 'Fermer',
      search: 'Rechercher...',
      filter: 'Filtrer',
      noData: 'Aucune donnée',
      error: 'Erreur',
      success: 'Succès',
      warning: 'Avertissement',
      info: 'Information',
      settings: 'Paramètres',
      profile: 'Profil',
      logout: 'Déconnexion',
    },
    actions: {
      create: 'Créer',
      edit: 'Éditer',
      update: 'Mettre à jour',
      remove: 'Supprimer',
      export: 'Exporter',
      import: 'Importer',
      download: 'Télécharger',
      upload: 'Télécharger',
    },
    pagination: {
      first: 'Premier',
      previous: 'Précédent',
      next: 'Suivant',
      last: 'Dernier',
      of: 'de',
    },
    form: {
      required: 'Ce champ est requis',
      email: 'Veuillez entrer un email valide',
      password: 'Le mot de passe doit contenir au moins 8 caractères',
      confirm: 'Les mots de passe ne correspondent pas',
    },
  },
};

const I18nContext = createContext();

export const I18nProvider = ({ children, initialLanguage = 'en' }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language-preference');
    return saved || initialLanguage;
  });

  useEffect(() => {
    localStorage.setItem('language-preference', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (path, defaultValue = '') => {
    const keys = path.split('.');
    let value = translations[language] || translations.en;

    for (const key of keys) {
      value = value?.[key];
    }

    return value || defaultValue || path;
  };

  const changeLanguage = (lang) => {
    if (translations[lang]) {
      setLanguage(lang);
    }
  };

  const addTranslations = (lang, newTranslations) => {
    if (translations[lang]) {
      translations[lang] = {
        ...translations[lang],
        ...newTranslations,
      };
    }
  };

  return (
    <I18nContext.Provider value={{ language, t, changeLanguage, addTranslations }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
};
