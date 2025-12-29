'use client';

import { useState } from 'react';
import { Header } from './components/Header';
import { Calculator } from './components/Calculator';
import { ResultsSection } from './components/Results';
import { CurrencyProvider } from './components/Calculator/CurrencyContext';
import type { ResultsData } from './components/Results/ResultsSection.types';
import { HomeContainer, Main, GridContainer, FormContainer, ResultsContainer } from './page.styled';
import type { CalculatorFormData } from './components/Calculator/CalculatorForm.types';

export default function Home() {
  const [results, setResults] = useState<CalculatorFormData | null>(null);
  const [resultsData, setResultsData] = useState<ResultsData | null>(null);

  return (
    <CurrencyProvider>
      <HomeContainer>
        <Header resultsData={resultsData} />
        <Main>
          <GridContainer>
            <FormContainer>
              <Calculator onResultsChange={setResults} />
            </FormContainer>
            <ResultsContainer>
              <ResultsSection results={results} onDataCalculated={setResultsData} />
            </ResultsContainer>
          </GridContainer>
        </Main>
      </HomeContainer>
    </CurrencyProvider>
  );
}
