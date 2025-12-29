import { useForm } from '@/lib/Form/useForm';
import type { DownloadModalFormData, UseDownloadModalFormProps } from './DownloadModal.types';

const DEFAULT_VALUES: DownloadModalFormData = {
  email: '',
  firstName: '',
  lastName: '',
  jobTitle: '',
  organization: '',
  sector: '',
  rating: '',
  comments: '',
};

export const useDownloadModalForm = ({ onSubmit }: UseDownloadModalFormProps) => {
  const form = useForm<DownloadModalFormData>({
    initialValues: DEFAULT_VALUES,
    onSubmit: async (values) => {
      onSubmit(values);
    },
  });

  return {
    form,
    submit: form.handleSubmit,
    reset: form.reset,
  };
};
