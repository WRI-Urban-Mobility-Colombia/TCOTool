export const DB_TABLE_NAME = 'users';

export const DB_COLUMNS = {
  EMAIL: 'email',
  FIRST_NAME: 'first_name',
  LAST_NAME: 'last_name',
  JOB_TITLE: 'job_title',
  ORGANIZATION: 'organization',
  SECTOR: 'sector',
  RATING: 'rating',
  COMMENTS: 'comments',
} as const;

export const INSERT_USER_QUERY = `
  INSERT INTO ${DB_TABLE_NAME} (
    ${DB_COLUMNS.EMAIL},
    ${DB_COLUMNS.FIRST_NAME},
    ${DB_COLUMNS.LAST_NAME},
    ${DB_COLUMNS.JOB_TITLE},
    ${DB_COLUMNS.ORGANIZATION},
    ${DB_COLUMNS.SECTOR},
    ${DB_COLUMNS.RATING},
    ${DB_COLUMNS.COMMENTS}
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  RETURNING id, created_at
`;

export const UNKNOWN_USER_VALUE = 'Desconocido';
export const EMPTY_VALUE = '';
