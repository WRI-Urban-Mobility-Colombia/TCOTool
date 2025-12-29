'use client';

import React from 'react';
import { StepModal } from 'vizonomy';
import { EBusButton } from '../../EBusButton';
import type { AboutUsModalProps } from './AboutUsModal.types';
import { TITLE_TEXT, CONTINUE_BUTTON_TEXT } from './AboutUsModal.constants';
import {
  StepModalOverlayStyled,
  StepModalContentStyled,
  StepModalHeaderStyled,
  HeaderSpacer,
  StepModalCloseStyled,
  StepModalBodyStyled,
  BodyContentWrapper,
  ContentContainer,
  TextSection,
  BoldText,
  TitleText,
  TextSpan,
  ButtonContainer,
  StepModalFooterStyled,
  ModalImage,
} from './AboutUsModal.styled';

export function AboutUsModal({ isOpen, onClose }: AboutUsModalProps) {
  return (
    <StepModal.Root isOpen={isOpen} onClose={onClose}>
      <StepModalOverlayStyled>
        <StepModalContentStyled>
          <StepModalHeaderStyled>
            <HeaderSpacer />
            <StepModalCloseStyled />
          </StepModalHeaderStyled>
          <StepModalBodyStyled>
            <BodyContentWrapper>
              <ContentContainer>
                <TitleText>{TITLE_TEXT}</TitleText>
                <BoldText>
                  ¿Desea calcular el costo total de propiedad de su flota? ¡Utilice la calculadora de costo total de
                  propiedad para costo total de propiedad para buses en Colombia!
                </BoldText>
                <TextSection>
                  <TextSpan>
                    El costo total de propiedad (TCO, por sus siglas en inglés) permite evaluar los costos reales de los
                    buses a lo largo de su vida útil, integrando los gastos de inversión, operación y financiamiento.
                    Esta perspectiva integral demuestra que la movilidad eléctrica puede resultar más económica y
                    sostenible en el largo plazo, facilitando decisiones estratégicas para acelerar la transición hacia
                    un transporte público limpio.
                  </TextSpan>
                </TextSection>
                <TextSection>
                  <TextSpan>
                    Esta calculadora es parte de un esfuerzo estratégico respaldado por la asistencia técnica y
                    financiera de WRI. Su propósito es ofrecer una herramienta comparativa entre diferentes tecnologías;
                    no está diseñada para brindar recomendaciones financieras o técnicas específicas. Su función
                    principal es permitir la comparación de costos dentro de un periodo de tiempo determinado y con
                    insumos predefinidos.
                  </TextSpan>
                </TextSection>
                <TextSection>
                  <TextSpan>
                    Los supuestos utilizados provienen de estudios de mercado, análisis macroeconómicos e información de
                    prefactibilidad de proyectos de electromovilidad en ciudades colombianas. Los costos operativos
                    considerados se basan en promedios de mantenimiento preventivo por kilómetro y precios actuales de
                    combustible, sin incluir gastos administrativos. Esta herramienta no constituye un estudio de
                    estimación de demanda.
                  </TextSpan>
                </TextSection>
                <TextSection>
                  <TextSpan>
                    El desarrollo de esta herramienta fue financiado con recursos Deep Dive del Centro Ross de Ciudades
                    de WRI y está dirigida a operadores de transporte, entes gestores y tomadores de decisiones. Para
                    más información sobre el costo total de propiedad, consulte nuestra página.
                  </TextSpan>
                </TextSection>
              </ContentContainer>
              <ModalImage />
            </BodyContentWrapper>
          </StepModalBodyStyled>
          <StepModalFooterStyled>
            <ButtonContainer>
              <EBusButton variant="primary" buttonLabel={CONTINUE_BUTTON_TEXT} onClick={onClose} />
            </ButtonContainer>
          </StepModalFooterStyled>
        </StepModalContentStyled>
      </StepModalOverlayStyled>
    </StepModal.Root>
  );
}
