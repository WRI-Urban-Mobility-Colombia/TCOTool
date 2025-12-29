import React from 'react';
import Image from 'next/image';
import { StepModal } from 'vizonomy';

export function StepModalOverlayStyled({ children }: { children: React.ReactNode }) {
  return (
    <StepModal.Overlay
      className="z-[12] fixed inset-0 flex items-start justify-center pt-20
      bg-black/50 backdrop-blur-sm"
    >
      {children}
    </StepModal.Overlay>
  );
}

export function StepModalContentStyled({ children }: { children: React.ReactNode }) {
  return (
    <StepModal.Content
      size="xl"
      className="!w-[800px] max-w-[800px] max-h-[85vh] overflow-y-auto z-[13] !bg-white
      border border-[#e7e6e6] !rounded-none"
    >
      {children}
    </StepModal.Content>
  );
}

export function StepModalHeaderStyled({ children }: { children: React.ReactNode }) {
  return (
    <StepModal.Header className="bg-white flex gap-3 h-10 items-center px-2 border-b border-[#ffffff]">
      {children}
    </StepModal.Header>
  );
}

export function HeaderSpacer() {
  return <div className="flex-1" />;
}

export function StepModalCloseStyled() {
  return (
    <StepModal.Close
      className="bg-[#e7e6e6] cursor-pointer flex items-center 
      justify-center rounded size-5 !text-[#3d3b3b] hover:!bg-[#d1d1d1]"
    />
  );
}

export function StepModalBodyStyled({ children }: { children: React.ReactNode }) {
  return <StepModal.Body className="flex flex-col gap-3 items-start p-3 w-full">{children}</StepModal.Body>;
}

export function BodyContentWrapper({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-3 items-start justify-center pb-[12px] px-6 w-full">{children}</div>;
}

export function StepModalFooterStyled({ children }: { children: React.ReactNode }) {
  return <StepModal.Footer className="border-t-2 border-[#e7e6e6] w-full">{children}</StepModal.Footer>;
}

export function ContentContainer({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-4 items-start w-full">{children}</div>;
}

export function TextSection({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal text-[#5c5959] w-full">
      <p className="leading-6">{children}</p>
    </div>
  );
}

export function BoldText({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold text-[#5c5959] w-full">
      <p className="leading-6">{children}</p>
    </div>
  );
}

export function TitleText({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold text-[#3d3b3b] text-[30px] w-full">
      <p className="leading-[36px]">{children}</p>
    </div>
  );
}

export function TextSpan({ children }: { children: React.ReactNode }) {
  return <span className="leading-6">{children}</span>;
}

export function ButtonContainer({ children }: { children: React.ReactNode }) {
  return <div className="flex gap-2 items-end justify-end px-4 py-3 w-full">{children}</div>;
}

export function ModalImage() {
  return (
    <div className="w-full mt-[24px] mb-0 flex justify-center">
      <Image
        src="/Modal_Image.png"
        alt="About Us"
        width={524}
        height={161}
        className="max-w-full h-auto object-contain"
        unoptimized
      />
    </div>
  );
}
