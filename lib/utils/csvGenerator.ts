import type { DownloadModalFormData } from '@/app/components/Header/DownloadModal/DownloadModal.types';
import { USERS_ENDPOINTS, fetchJson } from '@/lib/api.settings';

interface UserResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export async function addUserToCsv(userData: DownloadModalFormData): Promise<void> {
  try {
    const result = await fetchJson<UserResponse>(USERS_ENDPOINTS.create, {
      method: 'POST',
      body: userData,
    });

    if (!result.success) {
      throw new Error(result.error || 'Error al guardar usuario');
    }
  } catch (error) {
    console.error('Error al guardar usuario en CSV:', error);
  }
}
