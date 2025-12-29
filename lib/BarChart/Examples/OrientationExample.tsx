import { BarChart, StackedBarChartDataPoint, BarChartSeries } from '../';

const sampleData: StackedBarChartDataPoint[] = [
  { id: 'jan', label: 'Jan', values: { sales: 100, marketing: 50 } },
  { id: 'feb', label: 'Feb', values: { sales: 150, marketing: 75 } },
  { id: 'mar', label: 'Mar', values: { sales: 120, marketing: 60 } },
  { id: 'apr', label: 'Apr', values: { sales: 200, marketing: 100 } },
];

const sampleSeries: BarChartSeries[] = [
  { key: 'sales', label: 'Sales', color: '#3b82f6' },
  { key: 'marketing', label: 'Marketing', color: '#ef4444' },
];

function OrientationExample() {
  return (
    <div style={{ padding: '32px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>BarChart Orientation Examples</h1>

      <div
        style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          marginBottom: '32px',
        }}
      >
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Vertical Orientation (Default)</h2>
        <BarChart
          data={sampleData}
          series={sampleSeries}
          title="Monthly Performance - Vertical"
          xAxisLabel="Month"
          yAxisLabel="Amount ($K)"
          orientation="vertical"
          width={600}
          height={400}
          showLegend={true}
          showGrid={true}
          showTooltip={true}
        />
      </div>

      <div
        style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Horizontal Orientation</h2>
        <BarChart
          data={sampleData}
          series={sampleSeries}
          title="Monthly Performance - Horizontal"
          xAxisLabel="Amount ($K)"
          yAxisLabel="Month"
          orientation="horizontal"
          width={600}
          height={400}
          showLegend={true}
          showGrid={true}
          showTooltip={true}
        />
      </div>
    </div>
  );
}

export default OrientationExample;
