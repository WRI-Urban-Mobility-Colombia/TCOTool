'use client';

import React from 'react';
import { StepModal, Input } from 'vizonomy';
import type { DownloadModalProps } from './DownloadModal.types';
import {
  TITLE_TEXT,
  FORM_LABELS,
  BUTTON_LABELS,
  CONSENT_TEXT,
  SECTOR_OPTIONS,
  MAX_RATING,
  UNKNOWN_USER_DATA,
} from './DownloadModal.constants';
import { createNumericRadioOptions } from '@/app/components/EBusRadio';
import { useDownloadModalForm } from './useDownloadModalForm';
import { useDownloadModalValidation } from './useDownloadModalValidation';
import { EBusFormField } from '@/app/components/Calculator/components/EBusFormField';
import { EBusSelect } from '@/app/components/Calculator/components/eBusSelect';
import { EBusButton } from '@/app/components/EBusButton';
import { EBusRadio } from '@/app/components/EBusRadio';
import { EBusTextarea } from '@/app/components/EBusTextarea';
import { addUserToCsv } from '@/lib/utils/csvGenerator';
import {
  StepModalOverlayStyled,
  StepModalContentStyled,
  StepModalHeaderStyled,
  HeaderSpacer,
  StepModalCloseStyled,
  StepModalBodyStyled,
  StepModalFooterStyled,
  TitleText,
  FormContainer,
  ConsentText,
  ButtonContainer,
} from './DownloadModal.styled';

export function DownloadModal({ isOpen, onClose, onDownload }: DownloadModalProps) {
  const { form, submit } = useDownloadModalForm({
    onSubmit: async (values) => {
      await addUserToCsv(values);
    },
  });

  const { submitAttempted, handleSubmit } = useDownloadModalValidation(form);

  const handleSignUp = async () => {
    const isValid = handleSubmit();
    if (isValid) {
      await submit();
      onDownload();
      onClose();
    }
  };

  const handleNoThanks = async () => {
    await addUserToCsv(UNKNOWN_USER_DATA);
    onDownload();
    onClose();
  };

  const ratingOptions = createNumericRadioOptions(MAX_RATING);

  return (
    <StepModal.Root isOpen={isOpen} onClose={onClose}>
      <StepModalOverlayStyled>
        <StepModalContentStyled>
          <StepModalHeaderStyled>
            <HeaderSpacer />
            <StepModalCloseStyled />
          </StepModalHeaderStyled>
          <StepModalBodyStyled>
            <FormContainer>
              <TitleText>{TITLE_TEXT}</TitleText>
              <EBusFormField
                title={FORM_LABELS.email}
                required
                value={form.values.email}
                submitAttempted={submitAttempted}
                requiredMessage="Este campo es obligatorio"
              >
                <Input
                  type="email"
                  value={form.values.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.setValue('email', e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className="font-['Inter',sans-serif] h-[40px] w-full rounded-[4px]
                  border border-solid border-[#c9c9c9] bg-white text-[#3d3b3b] px-3 py-2"
                />
              </EBusFormField>

              <EBusFormField
                title={FORM_LABELS.firstName}
                required
                value={form.values.firstName}
                submitAttempted={submitAttempted}
                requiredMessage="Este campo es obligatorio"
              >
                <Input
                  value={form.values.firstName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.setValue('firstName', e.target.value)}
                  placeholder="Nombre"
                  className="font-['Inter',sans-serif] h-[40px] w-full rounded-[4px]
                  border border-solid border-[#c9c9c9] bg-white text-[#3d3b3b] px-3 py-2"
                />
              </EBusFormField>

              <EBusFormField
                title={FORM_LABELS.lastName}
                required
                value={form.values.lastName}
                submitAttempted={submitAttempted}
                requiredMessage="Este campo es obligatorio"
              >
                <Input
                  value={form.values.lastName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.setValue('lastName', e.target.value)}
                  placeholder="Apellido"
                  className="font-['Inter',sans-serif] h-[40px] w-full rounded-[4px]
                  border border-solid border-[#c9c9c9] bg-white text-[#3d3b3b] px-3 py-2"
                />
              </EBusFormField>

              <EBusFormField
                title={FORM_LABELS.jobTitle}
                value={form.values.jobTitle}
                submitAttempted={submitAttempted}
              >
                <Input
                  value={form.values.jobTitle}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.setValue('jobTitle', e.target.value)}
                  placeholder="Cargo"
                  className="font-['Inter',sans-serif] h-[40px] w-full rounded-[4px]
                  border border-solid border-[#c9c9c9] bg-white text-[#3d3b3b] px-3 py-2"
                />
              </EBusFormField>

              <EBusFormField
                title={FORM_LABELS.organization}
                value={form.values.organization}
                submitAttempted={submitAttempted}
              >
                <Input
                  value={form.values.organization}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.setValue('organization', e.target.value)}
                  placeholder="Organización"
                  className="font-['Inter',sans-serif] h-[40px] w-full rounded-[4px]
                  border border-solid border-[#c9c9c9] bg-white text-[#3d3b3b] px-3 py-2"
                />
              </EBusFormField>

              <EBusFormField
                title={FORM_LABELS.sector}
                required
                value={form.values.sector}
                defaultValue=""
                submitAttempted={submitAttempted}
                requiredMessage="Este campo es obligatorio"
              >
                <EBusSelect
                  value={form.values.sector}
                  onChange={(value: string) => form.setValue('sector', value)}
                  options={[...SECTOR_OPTIONS]}
                  placeholder="Seleccione una opción"
                />
              </EBusFormField>

              <EBusFormField title={FORM_LABELS.rating} value={form.values.rating} submitAttempted={submitAttempted}>
                <EBusRadio
                  name="rating"
                  value={form.values.rating}
                  options={ratingOptions}
                  onChange={(value: string) => form.setValue('rating', value)}
                />
              </EBusFormField>

              <EBusFormField
                title={FORM_LABELS.comments}
                value={form.values.comments}
                submitAttempted={submitAttempted}
              >
                <EBusTextarea
                  value={form.values.comments}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => form.setValue('comments', e.target.value)}
                  placeholder="Ingrese sus comentarios aquí"
                  rows={4}
                />
              </EBusFormField>
            </FormContainer>
            <ConsentText>{CONSENT_TEXT}</ConsentText>
          </StepModalBodyStyled>
          <StepModalFooterStyled>
            <ButtonContainer>
              <EBusButton
                variant="primary"
                buttonLabel={BUTTON_LABELS.signUp}
                onClick={handleSignUp}
                className="h-[40px] w-full"
              />
              <EBusButton
                variant="only-text"
                buttonLabel={BUTTON_LABELS.noThanks}
                onClick={handleNoThanks}
                className="text-[#3d3b3b] hover:text-[#007bff] underline"
              />
            </ButtonContainer>
          </StepModalFooterStyled>
        </StepModalContentStyled>
      </StepModalOverlayStyled>
    </StepModal.Root>
  );
}
