import React from 'react';
import { FormFieldContainer, InputFormLabel } from '../../CalculatorForm.styled';
import { FormFieldWrapper, RequiredMessage } from './EBusFormField.styled';
import { getFieldValidationState, getBorderClass } from './EBusFormField.utils';
import type { EBusFormFieldProps } from './EBusFormField.types';
import { When } from 'vizonomy';

export function EBusFormField({
  title,
  tooltipText,
  required = false,
  value,
  defaultValue,
  children,
  submitAttempted = false,
  disableTooltip = false,
  requiredMessage,
  variant = 'default',
}: EBusFormFieldProps) {
  const validationState = getFieldValidationState(value, required, submitAttempted, defaultValue);
  const isTableVariant = variant === 'table';
  const showRequiredMessage = !isTableVariant && validationState === 'invalid' && requiredMessage;
  const borderClass = getBorderClass(validationState, variant);

  const renderChildren = () => {
    if (isTableVariant && React.isValidElement(children)) {
      const element = children as React.ReactElement<{ className?: string }>;
      const currentClassName = element.props.className ?? '';
      const newClassName = `${currentClassName} ${borderClass}`.trim().replace(/bg-white/g, '');
      return React.cloneElement(element, { className: newClassName });
    }
    return children;
  };

  return (
    <FormFieldContainer>
      <When condition={!isTableVariant}>
        <InputFormLabel tooltipText={tooltipText} disableTooltip={disableTooltip}>
          {title}
        </InputFormLabel>
      </When>
      <FormFieldWrapper className={borderClass}>{renderChildren()}</FormFieldWrapper>
      {showRequiredMessage && <RequiredMessage>{requiredMessage}</RequiredMessage>}
    </FormFieldContainer>
  );
}
