'use client';

import { Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from '../../../../lib/formatters';

type RevenueByProductChartProps = {
	data: {
		name: string;
		revenue: number;
	}[];
};

export function RevenueByProductChart({ data }: RevenueByProductChartProps) {
	return (
		<ResponsiveContainer width="100%" minHeight={300}>
			<PieChart>
				<Tooltip
					cursor={{ fill: 'hsl(var(--muted))' }}
					formatter={value => formatCurrency(value as number)}
				/>
				<Pie
					data={data}
					label={item => item.name}
					dataKey="revenue"
					nameKey="name"
					fill="hsl(var(--primary))"
				/>
			</PieChart>
		</ResponsiveContainer>
	);
}
