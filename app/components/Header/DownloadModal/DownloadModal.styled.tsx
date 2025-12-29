import React from 'react';
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
      className="!w-[800px] max-w-[800px] max-h-[85vh] z-[13] !bg-white
      border border-[#e7e6e6] rounded-[16px] overflow-hidden flex flex-col"
    >
      {children}
    </StepModal.Content>
  );
}

export function StepModalHeaderStyled({ children }: { children: React.ReactNode }) {
  return (
    <StepModal.Header className="bg-[#f6f6f6] flex gap-3 h-10 items-center px-2 border-b border-[#f6f6f6]">
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
  return (
    <StepModal.Body className="flex flex-col gap-3 items-start p-6 w-full bg-[#f6f6f6] overflow-y-auto flex-1">
      {children}
    </StepModal.Body>
  );
}

export function StepModalFooterStyled({ children }: { children: React.ReactNode }) {
  return <StepModal.Footer className="border-t-2 border-[#e7e6e6] w-full">{children}</StepModal.Footer>;
}

export function TitleText({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold text-[#3d3b3b] text-[24px] w-full">
      <h2 className="leading-[30px]">{children}</h2>
    </div>
  );
}

export function FormContainer({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-4 w-full">{children}</div>;
}

export function ConsentText({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="font-['Inter',sans-serif] font-normal text-[#5c5959] text-[14px] leading-5 mt-2
      px-6 -mx-6 py-2"
    >
      {children}
    </p>
  );
}

export function ButtonContainer({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-3 items-stretch px-4 py-3 w-full">{children}</div>;
}
