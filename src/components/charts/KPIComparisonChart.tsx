import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface KPIComparisonChartProps {
  data: {
    name: string;
    antes: number;
    despues: number;
  }[];
}

const KPIComparisonChartPresenter = ({ data }: KPIComparisonChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="antes" fill="#94a3b8" name="Antes" />
        <Bar dataKey="despues" fill="#3b82f6" name="Después" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default KPIComparisonChartPresenter;
