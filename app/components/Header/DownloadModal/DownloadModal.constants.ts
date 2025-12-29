import type { DownloadModalFormData } from './DownloadModal.types';

export const TITLE_TEXT = 'Descargar publicación';

export const MAX_RATING = 10;

export const FORM_LABELS = {
  email: 'Correo electrónico',
  firstName: 'Nombre',
  lastName: 'Apellido',
  jobTitle: 'Cargo',
  organization: 'Organización',
  sector: 'Sector / Afiliación',
  rating: '¿De 1 a 10, como calificaría el uso y la utilidad de la calculadora?',
  comments: 'Comentarios adicionales',
} as const;

export const BUTTON_LABELS = {
  signUp: 'Enviar',
  noThanks: 'No gracias. Proceder a descargar.',
} as const;

export const CONSENT_TEXT =
  'Al compartir tu información, aceptas recibir actualizaciones de WRI. ' +
  'Puedes cambiar tus preferencias de correo electrónico en cualquier momento.';

export const SECTOR_OPTIONS = [
  { value: '', label: '- Seleccionar -' },
  { value: 'private', label: 'Sector privado' },
  { value: 'national-government', label: 'Gobierno Nacional' },
  { value: 'subnational-government', label: 'Gobierno Subnacional' },
  { value: 'ngo', label: 'ONG' },
  { value: 'academic', label: 'Academia' },
  { value: 'other', label: 'Otro' },
] as const;

export const UNKNOWN_USER_DATA: DownloadModalFormData = {
  email: '',
  firstName: 'Desconocido',
  lastName: '',
  jobTitle: '',
  organization: '',
  sector: '',
  rating: '',
  comments: '',
} as const;
