import { useCurrency } from '../Calculator/CurrencyContext';
import { generatePdf } from '@/lib/utils/pdfGenerator';
import type { ResultsData } from '../Results/ResultsSection.types';

export function useExportPdf(resultsData: ResultsData | null) {
  const { getCurrencyPrefix } = useCurrency();

  const handleExportPdf = async () => {
    if (!resultsData) {
      alert('No hay datos para exportar. Por favor, complete el formulario primero.');
      return;
    }

    try {
      await generatePdf({
        ...resultsData,
        currencyPrefix: getCurrencyPrefix(),
      });
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Error al generar el PDF. Por favor, intente nuevamente.');
    }
  };

  return handleExportPdf;
}
