import type { EBusTextareaProps } from './EBusTextarea.types';
import { TEXTAREA_STYLES } from './EBusTextarea.constants';

export function EBusTextareaStyled({ className, rows = 4, value, onChange, placeholder, ...props }: EBusTextareaProps) {
  const combinedClassName = `${TEXTAREA_STYLES.BASE} ${className ?? ''}`;

  return (
    <textarea
      {...props}
      rows={rows}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={combinedClassName}
    />
  );
}
