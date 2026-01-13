import { useEffect, useState } from 'react';
import { BUSES_ENDPOINTS, fetchJson } from '@/lib/api.settings';
import type { BusRow } from '@/app/components/Results/ResultsSection.types';

interface BusesResponse {
  data: BusRow[];
}

export function useGetBusesDataByTypeAndTechnology(typology?: string): BusRow[] {
  const [data, setData] = useState<BusRow[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const params = new URLSearchParams();
        if (typology) params.append('typology', typology);

        const url = `${BUSES_ENDPOINTS.list}${params.toString() ? `?${params.toString()}` : ''}`;
        const response = await fetchJson<BusesResponse>(url);
        setData(response.data);
      } catch (error) {
        console.error('Hook: Error fetching buses data:', error);
        if (error instanceof Error) {
          console.error('Hook: Error message:', error.message);
          console.error('Hook: Error stack:', error.stack);
        }
        setData([]);
      }
    };

    loadData();
  }, [typology]);

  return data;
}
