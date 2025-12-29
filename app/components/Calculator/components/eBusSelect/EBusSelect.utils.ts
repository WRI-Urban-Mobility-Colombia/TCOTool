import { SelectOption } from './EBusSelect.types';
import { Option } from '@/lib/Select/Select.d';

export const optionsParser = (options: SelectOption[]) => {
  return options.map((option) => ({
    id: option.value,
    value: option.value,
    label: option.label,
  }));
};

export const selectedOptionsParser = (value: string, selectOptions: Option[]): Option[] => {
  if (!value) return [];
  const option = selectOptions.find((opt) => opt.value === value);
  return option ? [option] : [];
};
