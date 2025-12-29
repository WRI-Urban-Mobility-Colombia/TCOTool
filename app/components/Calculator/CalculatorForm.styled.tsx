import { formatNumberThousands } from '@/lib/utils';
import { EBusButton } from '../EBusButton';
import { ICON_NAMES } from '../Icon';
import { ICON_POSITIONS } from '../EBusButton/EBusButton.constants';
import { TaxesButtonProps } from './CalculatorForm.types';
import { InformationTooltip } from '../InformationTooltip';

export interface InputFormLabelProps {
  children: React.ReactNode;
  disableTooltip?: boolean;
  tooltipText?: string | React.ReactNode;
}

export function InputFormLabel({ children, disableTooltip = false, tooltipText = '' }: InputFormLabelProps) {
  return (
    <label className="input-form-label" style={{ display: 'flex', alignItems: 'center' }}>
      {children}
      {!disableTooltip && <InformationTooltip text={tooltipText} />}
    </label>
  );
}

export function FormSectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="form-section-title">{children}</h2>;
}

export function FormSectionDescription({ children }: { children?: React.ReactNode }) {
  return (
    <p className="form-section-description" lang="es">
      {children}
    </p>
  );
}

export function CapexDescription() {
  return (
    <FormSectionDescription>
      Costos promedio de inversión que abarcan el precio del autobús, la infraestructura necesaria para el suministro de
      combustible (como cargadores o tanques de gas) y el costo de las baterías en el caso de autobuses eléctricos.
    </FormSectionDescription>
  );
}

export function OpexDescription() {
  return (
    <FormSectionDescription>
      La suma de costos de operación comparables entre las tecnologías durante la vida util del bus, específicamente
      combustible y mantenimiento promedio.
    </FormSectionDescription>
  );
}

export function FinexDescription() {
  return (
    <FormSectionDescription>
      Costos de financiamiento del proyecto, teniendo en cuenta intereses anuales y el período de tiempo durante el cual
      se financiará el proyecto.
    </FormSectionDescription>
  );
}

export function ReferenceDescription() {
  return (
    <FormSectionDescription>
      Gastos generales de operación, distintos de los costos de combustible y mantenimiento preventivo y correctivo, que
      pueden abarcar pólizas y seguros, impuestos, accesorios, servicios de estacionamiento, conductores, mecánicos,
      entre otros. Estos costos son iguales para todas las tecnologías. En este modelo, estos gastos pueden incluirse
      como un costo anual o expresarse como un porcentaje.
    </FormSectionDescription>
  );
}

export function FormFieldContainer({ children }: { children: React.ReactNode }) {
  return <div className="form-field-container">{children}</div>;
}

export function FormTextContainer({ children }: { children: React.ReactNode }) {
  return <span className="form-text-container">{children}</span>;
}

export function DollarSignStyled({ currencyPrefix = '$' }: { currencyPrefix?: string }) {
  return <span className="shrink-0 form-text-container">{currencyPrefix}</span>;
}

export function DashStyled() {
  return <FormTextContainer>-</FormTextContainer>;
}

export function FormTextStyled(value: string) {
  return <FormTextContainer>{value}</FormTextContainer>;
}

export function ValuesContainerStyled({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-1">{children}</div>;
}

function getValueContent(value: number | null | undefined, currencyPrefix: string) {
  if (!value) {
    return <DashStyled />;
  }

  const roundedValue = Math.round(value);

  return (
    <>
      <DollarSignStyled currencyPrefix={currencyPrefix} />
      <FormTextContainer>{formatNumberThousands(roundedValue)}</FormTextContainer>
    </>
  );
}

export function ValueWithDollarSignStyled({
  value,
  currencyPrefix = '$',
}: {
  value: number | null | undefined;
  currencyPrefix?: string;
}) {
  return <ValuesContainerStyled>{getValueContent(value, currencyPrefix)}</ValuesContainerStyled>;
}

export function TaxesButton({ isOpen, onClick }: TaxesButtonProps) {
  return (
    <EBusButton
      variant="only-text"
      buttonLabel="Taxes, insurance, HOA fees down-arrow"
      iconName={ICON_NAMES.CHEVRON_DOWN}
      iconPosition={ICON_POSITIONS.RIGHT}
      iconClassName={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
      onClick={onClick}
    />
  );
}
