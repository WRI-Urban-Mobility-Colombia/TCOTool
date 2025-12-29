export interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
}

export interface DownloadModalFormData extends Record<string, unknown> {
  email: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  organization: string;
  sector: string;
  rating: string;
  comments: string;
}

export interface UseDownloadModalFormProps {
  onSubmit: (values: DownloadModalFormData) => void;
}
