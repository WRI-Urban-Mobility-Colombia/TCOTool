import React from 'react';
import { FormProps, ButtonProps } from './Form.types';
import { FormFooter } from './FormElements';

function Button({ children, onClick, disabled, className = '', type = 'button', ...props }: ButtonProps) {
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={className} {...props}>
      {children}
    </button>
  );
}

function Form<T extends Record<string, unknown>>({
  children,
  form,
  className = '',
  widthFull = true,
  gap = 4,
  primaryButton,
  secondaryButton,
  onSubmit,
}: FormProps<T>) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await form.handleSubmit();
    if (onSubmit && Object.keys(form.errors).length === 0) {
      onSubmit(form.values);
    }
  };

  const widthClass = widthFull ? 'w-full' : 'w-auto';
  const formClasses = `flex flex-col ${widthClass} gap-${gap} ${className}`;

  return (
    <form onSubmit={handleSubmit} className={formClasses}>
      {typeof children === 'function' ? children(form) : children}
      {(primaryButton || secondaryButton) && (
        <FormFooter>
          {secondaryButton && (
            <Button type="button" {...secondaryButton} disabled={secondaryButton.disabled ?? form.isSubmitting} />
          )}
          {primaryButton && (
            <Button type="submit" {...primaryButton} disabled={primaryButton.disabled ?? form.isSubmitting} />
          )}
        </FormFooter>
      )}
    </form>
  );
}

export default Form;
