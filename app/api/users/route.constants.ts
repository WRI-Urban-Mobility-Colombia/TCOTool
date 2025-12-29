export const CSV_FILENAME = 'usuarios-descargas.csv';
export const CSV_DELIMITER = ',';
export const CSV_BOM = '\uFEFF'; // BOM para compatibilidad con Excel

export const CSV_HEADERS = [
  'Fecha',
  'Hora',
  'Correo electrónico',
  'Nombre',
  'Apellido',
  'Cargo',
  'Organización',
  'Sector / Afiliación',
  'Calificación (1-10)',
  'Comentarios adicionales',
] as const;
