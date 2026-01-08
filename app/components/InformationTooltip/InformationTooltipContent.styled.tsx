function TooltipContentParagraph({ children }: { children: React.ReactNode }) {
  return <p className="tooltip-content-paragraph">{children}</p>;
}

export function TypologyTooltip() {
  return (
    <>
      <TooltipContentParagraph>
        <strong>Van</strong>: Van especial de xx pasajeros. 
        <br />
        <br />
        <strong>Busetón</strong>: Bus urbano de 9 metros de largo, en promedio.
        <br />
        <br />
        <strong>Padrón</strong>: Bus urbano de 12 metros de largo, en promedio.
      </TooltipContentParagraph>
    </>
  );
}

export function TrmTooltip() {
  return (
    <>
      <TooltipContentParagraph>
        <strong>TRM</strong>: El precio del dólar en pesos colombianos, se calcula en operaciones internacionales de
        compra y venta. Referenciar la pagina oficial del Banco de la Republica.
        <br />
        <br />
        <a href="https://www.banrep.gov.co/es/estadisticas/trm" target="_blank" rel="noopener noreferrer">
          https://www.banrep.gov.co/es/estadisticas/trm
        </a>
      </TooltipContentParagraph>
    </>
  );
}

export function EligibilityTooltip() {
  return (
    <>
      <TooltipContentParagraph>
        <strong>Eléctrico</strong>: Vehículos eléctricos a batería (BEV) o con celda de combustible de hidrógeno (FCEV).
        Referencias Ministerio de Transporte: <br />
        <br />
        <a
          href="https://mintransporte.gov.co/publicaciones/10754/transporte-sostenible/"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://mintransporte.gov.co/publicaciones/10754/transporte-sostenible/
        </a>
        <br />
        <br />
        <strong>GNV</strong>: Vehículos dedicados a gas combustible (GNCV, GNL, GLP). Referencias Ministerio de
        Transporte:
        <br />
        <br />
        <a
          href="https://mintransporte.gov.co/publicaciones/10754/transporte-sostenible/"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://mintransporte.gov.co/publicaciones/10754/transporte-sostenible/
        </a>
      </TooltipContentParagraph>
    </>
  );
}

export function InterestEaTooltip() {
  return (
    <>
      <TooltipContentParagraph>
        <strong>Interés E.A.</strong>: Costos de financiamiento del proyecto, teniendo en cuenta intereses anuales y el
        período de tiempo durante el cual se financiará el proyecto.
      </TooltipContentParagraph>
    </>
  );
}

export function AnnualKilometersTooltip() {
  return (
    <>
      <TooltipContentParagraph>
        <strong>Kilómetros Anuales por Bus</strong>: La suma de costos de operacion comparables entre las tecnologias
        durante la vida util del bus, especificamente combustible y mantenimiento promedio.
      </TooltipContentParagraph>
    </>
  );
}

export function AcTooltip() {
  return (
    <>
      <TooltipContentParagraph>
        <strong>A/C</strong>: Aire Condicionado. En este ejercicio el uso de aire condicionado reduce la eficiencia de
        combustible en un 20%.
      </TooltipContentParagraph>
    </>
  );
}
