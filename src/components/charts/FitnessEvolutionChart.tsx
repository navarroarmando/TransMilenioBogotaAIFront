import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface FitnessEvolutionChartProps {
  data: {
    generation: number;
    fitness: number;
  }[];
}

const FitnessEvolutionChartPresenter = ({ data }: FitnessEvolutionChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="generation" label={{ value: 'Generación', position: 'insideBottom', offset: -5 }} />
        <YAxis label={{ value: 'Fitness', angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="fitness" stroke="#3b82f6" strokeWidth={2} name="Fitness" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default FitnessEvolutionChartPresenter;
