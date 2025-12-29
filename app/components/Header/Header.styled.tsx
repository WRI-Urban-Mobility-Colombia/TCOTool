import React from 'react';
import Image from 'next/image';
import { EBusButton } from '../EBusButton';
import { ICON_NAMES } from '../Icon';
import { HEADER_SIZES } from './Header.constants';

export function HeaderContainer({ children }: { children: React.ReactNode }) {
  return <header className="w-full">{children}</header>;
}

export function NavContainer({ children }: { children: React.ReactNode }) {
  return <nav className="px-6 py-4 md:px-12">{children}</nav>;
}

export function NavContent({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center justify-between">{children}</div>;
}

export function Logo() {
  return (
    <div className="flex-shrink-0">
      <Image
        alt="Logo"
        src="/logo.svg"
        width={HEADER_SIZES.LOGO_WIDTH}
        height={HEADER_SIZES.LOGO_HEIGHT}
        className="h-10 w-auto md:h-14"
      />
    </div>
  );
}

export function Divider() {
  return <div className="mt-4 border-b-2 border-[#E7E6E6]" />;
}

export function TitleSectionContainer({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="mt-12 flex flex-col items-start justify-between gap-4 px-6 md:mt-16 md:flex-row md:items-center
      md:px-12"
    >
      {children}
    </div>
  );
}

export function Title({ children }: { children: React.ReactNode }) {
  return <h1 className="text-3xl font-bold text-black md:text-4xl lg:text-5xl">{children}</h1>;
}

export function ButtonResourcesLibrary({ onClick }: { onClick?: () => void }) {
  return <EBusButton variant="primary" buttonLabel="Sobre Nosotros" className="ml-auto" onClick={onClick} />;
}

export function ButtonExportPdf({ onClick }: { onClick?: () => void }) {
  return (
    <EBusButton
      variant="secondary"
      iconName={ICON_NAMES.EXPORT}
      iconPosition="left"
      buttonLabel="Exportar PDF"
      className="whitespace-nowrap"
      onClick={onClick}
    />
  );
}
