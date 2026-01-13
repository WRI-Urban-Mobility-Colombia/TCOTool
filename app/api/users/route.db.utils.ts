import { getPool } from '@/lib/db';
import { INSERT_USER_QUERY, UNKNOWN_USER_VALUE, EMPTY_VALUE } from './route.db.constants';
import type { DownloadModalFormData } from '@/app/components/Header/DownloadModal/DownloadModal.types';
import type { SaveUserToDatabaseParams, SaveUserToDatabaseResult } from './route.db.types';

function mapUserDataToValues(userData: DownloadModalFormData): (string | number)[] {
  return [
    userData.email ?? UNKNOWN_USER_VALUE,
    userData.firstName ?? UNKNOWN_USER_VALUE,
    userData.lastName ?? UNKNOWN_USER_VALUE,
    userData.jobTitle ?? UNKNOWN_USER_VALUE,
    userData.organization ?? UNKNOWN_USER_VALUE,
    userData.sector ?? UNKNOWN_USER_VALUE,
    userData.rating ?? EMPTY_VALUE,
    userData.comments ?? EMPTY_VALUE,
  ];
}

export async function saveUserToDatabase({ userData }: SaveUserToDatabaseParams): Promise<SaveUserToDatabaseResult> {
  const pool = getPool();
  const values = mapUserDataToValues(userData);
  const result = await pool.query(INSERT_USER_QUERY, values);

  return {
    id: result.rows[0].id,
    createdAt: result.rows[0].created_at,
  };
}
