import { useEffect, useRef, useMemo } from 'react';
import { Typology, TYPOLOGY_VALUES } from '../../Calculator/CalculatorForm.constants';
import { useGetBusesDataByTypeAndTechnology } from '@/lib/hooks/useGetBusesDataByTypeAndTechnology';
import { calculateResultsData } from '../ResultsCalculations.utils';
import type { ResultsSectionProps } from '../ResultsSection.types';

export function useResultsSection(props: ResultsSectionProps) {
  const { className, results, onDataCalculated } = props;

  const typology = results?.typology ? TYPOLOGY_VALUES[results.typology as Typology] : undefined;
  const busesData = useGetBusesDataByTypeAndTechnology(typology);

  const resultsData = useMemo(() => calculateResultsData(results, busesData), [results, busesData]);

  const onDataCalculatedRef = useRef(onDataCalculated);

  useEffect(() => {
    onDataCalculatedRef.current = onDataCalculated;
  }, [onDataCalculated]);

  useEffect(() => {
    if (onDataCalculatedRef.current && resultsData) {
      onDataCalculatedRef.current(resultsData);
    }
  }, [resultsData]);

  const shouldRender = !(!results || !busesData || !resultsData);

  const {
    totalCostPropertyData,
    costPerKilometerData,
    comparisonOperationAnnualData,
    chartTotalCostOfOwnershipData,
    chartCostPerKilometerData,
    chartComparisonOperationAnnualData,
  } = resultsData || {};

  return {
    className,
    shouldRender,
    totalCostPropertyData: totalCostPropertyData || null,
    costPerKilometerData: costPerKilometerData || null,
    comparisonOperationAnnualData: comparisonOperationAnnualData || null,
    chartTotalCostOfOwnershipData: chartTotalCostOfOwnershipData || null,
    chartCostPerKilometerData: chartCostPerKilometerData || null,
    chartComparisonOperationAnnualData: chartComparisonOperationAnnualData || null,
  };
}
