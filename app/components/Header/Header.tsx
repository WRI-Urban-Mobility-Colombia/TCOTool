'use client';

import { useState } from 'react';
import { When } from 'vizonomy';
import {
  HeaderContainer,
  NavContainer,
  NavContent,
  Logo,
  Divider,
  TitleSectionContainer,
  Title,
  ButtonResourcesLibrary,
  ButtonExportPdf,
} from './Header.styled';
import { SHOW_LOGO } from './Header.constants';
import { AboutUsModal } from './AboutUsModal';
import { DownloadModal } from './DownloadModal';
import { useHeader } from './useHeader';
import { useExportPdf } from './useExportPdf';
import type { ResultsData } from '../Results/ResultsSection.types';

export function Header({ resultsData }: { resultsData: ResultsData | null }) {
  const { isModalOpen, handleOpenModal, handleCloseModal } = useHeader();
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const handleExportPdf = useExportPdf(resultsData);

  const handleOpenDownloadModal = () => {
    if (!resultsData) {
      alert('No hay datos para exportar. Por favor, complete el formulario primero.');
      return;
    }
    setIsDownloadModalOpen(true);
  };

  const handleCloseDownloadModal = () => {
    setIsDownloadModalOpen(false);
  };

  const handleDownload = () => {
    handleExportPdf();
  };

  return (
    <HeaderContainer>
      <NavContainer>
        <NavContent>
          <When condition={SHOW_LOGO}>
            <Logo />
          </When>
          <ButtonResourcesLibrary onClick={handleOpenModal} />
        </NavContent>
        <Divider />
      </NavContainer>
      <TitleSectionContainer>
        <Title>Calculadora de costo total de propiedad para buses en Colombia</Title>
        <ButtonExportPdf onClick={handleOpenDownloadModal} />
      </TitleSectionContainer>
      <AboutUsModal isOpen={isModalOpen} onClose={handleCloseModal} />
      <DownloadModal isOpen={isDownloadModalOpen} onClose={handleCloseDownloadModal} onDownload={handleDownload} />
    </HeaderContainer>
  );
}
