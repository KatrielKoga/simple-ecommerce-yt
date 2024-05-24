import { Prisma } from '@prisma/client';
import { eachDayOfInterval, interval, startOfDay, subDays } from 'date-fns';
import { ReactNode } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '../../components/ui/card';
import db from '../../db/db';
import { formatCurrency, formatDate, formatNumber } from '../../lib/formatters';
import { OrdersByDayChart } from './_components/charts/OrdersByDayChart';

async function getSalesData(
	createdAfter: Date | null,
	createdBefore: Date | null
) {
	const createdAtQuery: Prisma.OrderWhereInput['createdAt'] = {};
	if (createdAfter) createdAtQuery.gte = createdAfter;
	if (createdBefore) createdAtQuery.lte = createdBefore;

	const [data, chartData] = await Promise.all([
		db.order.aggregate({
			_sum: { priceInCents: true },
			_count: true,
		}),
		db.order.findMany({
			select: { createdAt: true, priceInCents: true },
			where: { createdAt: createdAtQuery },
			orderBy: { createdAt: 'asc' },
		}),
	]);

	const dayArray = eachDayOfInterval(
		interval(
			createdAfter || startOfDay(chartData[0].createdAt),
			createdBefore || new Date()
		)
	).map(date => {
		return {
			date: formatDate(date),
			totalSales: 0,
		};
	});

	return {
		chartData: chartData.reduce((data, order) => {
			const formattedDate = formatDate(order.createdAt);
			const entry = dayArray.find(day => day.date === formattedDate);
			if (entry == null) return data;
			entry.totalSales += order.priceInCents / 100;
			return data;
		}, dayArray),
		amount: (data._sum.priceInCents || 0) / 100,
		numberOfSales: data._count,
	};
}

async function getUserData() {
	const [userCount, orderData] = await Promise.all([
		db.user.count(),
		db.order.aggregate({
			_sum: { priceInCents: true },
		}),
	]);

	return {
		userCount,
		averageValuePerUser:
			userCount === 0
				? 0
				: (orderData._sum.priceInCents || 0) / userCount / 100,
	};
}

async function getProductData() {
	const [activeCount, inactiveCount] = await Promise.all([
		db.product.count({ where: { isAvailableForPurchase: true } }),
		db.product.count({ where: { isAvailableForPurchase: false } }),
	]);

	return { activeCount, inactiveCount };
}

export default async function AdminDashboard() {
	const [salesData, userData, productData] = await Promise.all([
		getSalesData(subDays(new Date(), 6), new Date()),
		getUserData(),
		getProductData(),
	]);
	return (
		<>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				<DashboardCard
					title="Sales"
					subtitle={`${formatNumber(salesData.numberOfSales)} Orders`}
					body={formatCurrency(salesData.amount)}
				/>
				<DashboardCard
					title="Customers"
					subtitle={`${formatCurrency(
						userData.averageValuePerUser
					)} Average Value`}
					body={formatNumber(userData.userCount)}
				/>
				<DashboardCard
					title="Active Products"
					subtitle={`${formatNumber(productData.inactiveCount)} Inactive`}
					body={formatNumber(productData.activeCount)}
				/>
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
				<ChartCard title="Total Sales">
					<OrdersByDayChart data={salesData.chartData} />
				</ChartCard>
				<ChartCard title="Total Sales">
					<OrdersByDayChart data={salesData.chartData} />
				</ChartCard>
			</div>
		</>
	);
}

type DashboardCardProps = {
	title: string;
	subtitle: string;
	body: string;
};

function DashboardCard({ title, subtitle, body }: DashboardCardProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{subtitle}</CardDescription>
			</CardHeader>
			<CardContent>
				<p>{body}</p>
			</CardContent>
		</Card>
	);
}

type ChartCardProps = {
	title: string;
	children: ReactNode;
};

function ChartCard({ title, children }: ChartCardProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
			</CardHeader>
			<CardContent>{children}</CardContent>
		</Card>
	);
}
