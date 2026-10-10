import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import EmptyState from './EmptyState.jsx';

const RADIAN = Math.PI / 180;

function renderLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent, total }) {
  if (total === 0 || percent <= 0) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={12}>
      {`${Math.round(percent * 100)}%`}
    </text>
  );
}

/** Donut chart showing how issues are distributed across statuses. */
export default function StatusDistributionChart({ data }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return <EmptyState message="No issues to chart yet." />;
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={62}
            outerRadius={96}
            paddingAngle={2}
            strokeWidth={0}
            label={renderLabel}
            labelLine={false}
          >
            {data.map((entry) => (
              <Cell key={entry.status} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [`${value} issues`, name]}
            contentStyle={{
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              fontSize: 12,
            }}
          />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
