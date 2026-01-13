import type { DownloadModalFormData } from '@/app/components/Header/DownloadModal/DownloadModal.types';

export interface SaveUserToDatabaseParams {
  userData: DownloadModalFormData;
}

export interface SaveUserToDatabaseResult {
  id: number;
  createdAt: Date;
}
