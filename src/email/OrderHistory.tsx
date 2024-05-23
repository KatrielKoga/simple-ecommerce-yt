import {
	Body,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Preview,
	Tailwind,
} from '@react-email/components';
import { OrderInformation } from './components/OrderInformation';
import React from 'react';

type OrderHistoryEmailProps = {
	orders: {
		id: string;
		priceInCents: number;
		createdAt: Date;
		product: {
			name: string;
			imagePath: string;
			description: string;
		};
		downloadVerificationId: string;
	}[];
};

OrderHistoryEmail.PreviewProps = {
	orders: [
		{
			id: '42eb1482-3ebd-4fd7-9df2-24fd8f2a2a6e',
			createdAt: new Date(),
			priceInCents: 1000,
			product: {
				name: 'product name',
				description: 'product description',
				imagePath:
					'/products/0297b8b7-0fc4-46ea-898b-9dadc47aa405-bridge_loneliness_art_129333_1440x900.jpg',
			},
			downloadVerificationId: '42eb1482-3ebd-4fd7-9df2-24fd8f2a2a6e',
		},
		{
			id: '42eb1482-3ebd-4fd7-9df2-24fd8f2a2a6e',
			createdAt: new Date(),
			priceInCents: 2000,
			product: {
				name: 'product name 2',
				description: 'product description',
				imagePath:
					'/products/0297b8b7-0fc4-46ea-898b-9dadc47aa405-bridge_loneliness_art_129333_1440x900.jpg',
			},
			downloadVerificationId: '42eb1482-3ebd-4fd7-9df2-24fd8f2a2a6e',
		},
	],
} satisfies OrderHistoryEmailProps;

export default function OrderHistoryEmail({ orders }: OrderHistoryEmailProps) {
	return (
		<Html>
			<Preview>Order History & Downloads</Preview>
			<Tailwind>
				<Head />
				<Body className="font-sans bg-white">
					<Container className="max-w-xl">
						<Heading>Order History</Heading>
						{orders.map((order, index) => (
							<React.Fragment key={order.id}>
								<OrderInformation
									key={order.id}
									order={order}
									product={order.product}
									downloadVerificationId={order.downloadVerificationId}
								/>
								{index < orders.length - 1 && <Hr />}
							</React.Fragment>
						))}
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}
