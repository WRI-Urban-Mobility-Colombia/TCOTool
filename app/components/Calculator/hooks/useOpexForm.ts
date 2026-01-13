import { useState, useRef } from 'react';
import type {
  CombustibleTableRow,
  ConsumoTableRow,
  ConsumptionValidationKmUnitAcProps,
  TecnologiaTableRow,
  ValidationMaintenancePerKilometerProps,
  OpexFormProps,
} from '../CalculatorForm.types';
import { ACValue, AC_VALUE_LABELS, TechnologyType, FieldTablesId } from '../CalculatorForm.constants';
import { createSelectOptionsFromEnum, setNestedFormValue, createTableData } from '../CalculatorForm.utils';
import { createConsumoColumns, createTecnologiaColumns, createCombustibleColumns } from '../OpexFormColumns';
import { getBusDataByTechnology } from '../../Results/ResultsSection.utils';

export function useOpexForm(props: OpexFormProps) {
  const { form, handleContinue, submitAttempted, onBack, busesData } = props;

  const consumptionTableData = createTableData<ConsumoTableRow>(FieldTablesId.consumption);
  const technologyTableData = createTableData<TecnologiaTableRow>(FieldTablesId.technology);
  const fuelTableData = createTableData<CombustibleTableRow>(FieldTablesId.fuel);

  const acOptions = createSelectOptionsFromEnum(ACValue, AC_VALUE_LABELS);
  const [fuelCostToggle, setFuelCostToggle] = useState(true);
  const previousValuesRef = useRef<ConsumptionValidationKmUnitAcProps | null>(null);
  const [maintenanceToggle, setMaintenanceToggle] = useState(true);
  const previousMaintenanceValuesRef = useRef<ValidationMaintenancePerKilometerProps | null>(null);
  const { dieselKmGallon, gasKmM3, electricityKmKwh } = form.values.consumptionUnitKm.consumptionValidationKmUnitAc;
  const dieselBusData = getBusDataByTechnology({ busesData, technology: TechnologyType.diesel });
  const gnvBusData = getBusDataByTechnology({ busesData, technology: TechnologyType.gnv });
  const electricBusData = getBusDataByTechnology({ busesData, technology: TechnologyType.electric });

  const defaultConsumptionValues = {
    dieselKmGallon: dieselBusData?.consumptionKmUnitDefault ?? '',
    gasKmM3: gnvBusData?.consumptionKmUnitDefault ?? '',
    electricityKmKwh: electricBusData?.consumptionKmUnitDefault ?? '',
  };

  const { dieselCOPKm, gasCOPKm, electricityCOPKm } = form.values.technology.validationMaintenancePerKilometer;

  const defaultMaintenanceValues = {
    dieselCOPKm: dieselBusData?.maintenanceUSDKm ?? '',
    gasCOPKm: gnvBusData?.maintenanceUSDKm ?? '',
    electricityCOPKm: electricBusData?.maintenanceUSDKm ?? '',
  };

  const handleConsumoInputChange = (
    column: 'consumptionValidationKmUnitAc',
    row: 'dieselKmGallon' | 'gasKmM3' | 'electricityKmKwh',
    value: string
  ) => {
    setNestedFormValue(form, 'consumptionUnitKm', column, row, value, true);
  };

  const handleTecnologiaInputChange = (
    column: 'validationMaintenancePerKilometer',
    row: 'dieselCOPKm' | 'gasCOPKm' | 'electricityCOPKm',
    value: string
  ) => {
    setNestedFormValue(form, 'technology', column, row, value, true);
  };

  const handleFuelCostToggle = () => {
    const newToggleState = !fuelCostToggle;
    setFuelCostToggle(newToggleState);

    if (newToggleState) {
      previousValuesRef.current = { dieselKmGallon, gasKmM3, electricityKmKwh };

      form.setValue('consumptionUnitKm', {
        ...form.values.consumptionUnitKm,
        consumptionValidationKmUnitAc: defaultConsumptionValues,
      });
    } else if (!newToggleState && previousValuesRef.current) {
      form.setValue('consumptionUnitKm', {
        ...form.values.consumptionUnitKm,
        consumptionValidationKmUnitAc: previousValuesRef.current,
      });
      previousValuesRef.current = null;
    }
  };

  const handleMaintenanceToggle = () => {
    const newToggleState = !maintenanceToggle;
    setMaintenanceToggle(newToggleState);

    if (newToggleState) {
      previousMaintenanceValuesRef.current = { dieselCOPKm, gasCOPKm, electricityCOPKm };

      form.setValue('technology', {
        ...form.values.technology,
        validationMaintenancePerKilometer: defaultMaintenanceValues,
      });
    } else if (!newToggleState && previousMaintenanceValuesRef.current) {
      form.setValue('technology', {
        ...form.values.technology,
        validationMaintenancePerKilometer: previousMaintenanceValuesRef.current,
      });
      previousMaintenanceValuesRef.current = null;
    }
  };

  const consumptionColumns = createConsumoColumns({
    form,
    consumptionUnitKm: form.values.consumptionUnitKm,
    handleConsumoInputChange,
    submitAttempted,
    fuelCostToggle,
    defaultValues: defaultConsumptionValues,
  });

  const technologyColumns = createTecnologiaColumns({
    form,
    technology: form.values.technology,
    handleTecnologiaInputChange,
    submitAttempted,
    maintenanceToggle,
    defaultValues: defaultMaintenanceValues,
  });

  const handleCombustibleInputChange = (
    column: 'price' | 'increaseRisk',
    row: 'dieselCOPGallon' | 'gasCOPM3' | 'electricityCOPKwh',
    value: string
  ) => {
    const extractNumeric = column === 'price';
    setNestedFormValue(form, 'fuel', column, row, value, extractNumeric);
  };

  const combustibleColumns = createCombustibleColumns({
    form,
    fuel: form.values.fuel,
    handleCombustibleInputChange,
    submitAttempted,
  });

  return {
    form,
    handleContinue,
    submitAttempted,
    onBack,
    consumptionTableData,
    technologyTableData,
    fuelTableData,
    acOptions,
    fuelCostToggle,
    maintenanceToggle,
    handleFuelCostToggle,
    handleMaintenanceToggle,
    consumptionColumns,
    technologyColumns,
    combustibleColumns,
  };
}
