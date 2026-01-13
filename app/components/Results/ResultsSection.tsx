'use client';

import { When } from 'vizonomy';
import { TotalCostOfOwnership } from './TotalCostOfOwnership';
import { AnnualOperationComparison } from './AnnualOperationComparison';
import { CostPerKilometer } from './CostPerKilometer';
import type { ResultsSectionProps } from './ResultsSection.types';
import { useResultsSection } from './hooks/useResultsSection';
import { ResultsContainer, ResultsSectionContainer, ResultsDivider } from './ResultsSection.styled';

export function ResultsSection(props: ResultsSectionProps) {
  const {
    className,
    shouldRender,
    totalCostPropertyData,
    costPerKilometerData,
    comparisonOperationAnnualData,
    chartTotalCostOfOwnershipData,
    chartCostPerKilometerData,
    chartComparisonOperationAnnualData,
  } = useResultsSection(props);

  return (
    <When condition={shouldRender}>
      <ResultsContainer className={className}>
        <ResultsSectionContainer>
          <TotalCostOfOwnership
            totalCostPropertyData={totalCostPropertyData!}
            chartTotalCostOfOwnershipData={chartTotalCostOfOwnershipData!}
          />
        </ResultsSectionContainer>
        <ResultsDivider />
        <ResultsSectionContainer>
          <AnnualOperationComparison
            comparisonOperationAnnualData={comparisonOperationAnnualData!}
            chartComparisonOperationAnnualData={chartComparisonOperationAnnualData!}
          />
        </ResultsSectionContainer>
        <ResultsDivider />
        <ResultsSectionContainer>
          <CostPerKilometer
            costPerKilometerData={costPerKilometerData!}
            chartCostPerKilometerData={chartCostPerKilometerData!}
          />
        </ResultsSectionContainer>
      </ResultsContainer>
    </When>
  );
}
