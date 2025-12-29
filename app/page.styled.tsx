import React from 'react';

export function HomeContainer({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-white">{children}</div>;
}

export function Main({ children }: { children: React.ReactNode }) {
  return <main className="px-4 py-8 md:px-8 lg:px-12">{children}</main>;
}

export function GridContainer({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`mx-auto grid w-full grid-cols-1 gap-6 lg:max-w-[1600px] lg:grid-cols-2 
        xl:gap-8 grid-container-centered`}
    >
      {children}
    </div>
  );
}

export function FormContainer({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`flex w-full max-w-[700px] min-w-0 justify-center lg:justify-start 
        form-container-centered`}
    >
      {children}
    </div>
  );
}

export function ResultsContainer({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`flex w-full max-w-[700px] min-w-0 items-start justify-center
        lg:ml-auto lg:justify-end results-container-centered`}
    >
      {children}
    </div>
  );
}

export function ResultsPlaceholder({ children }: { children: React.ReactNode }) {
  return <div className="w-full rounded-lg bg-gray-50 p-6 text-center text-gray-500">{children}</div>;
}
