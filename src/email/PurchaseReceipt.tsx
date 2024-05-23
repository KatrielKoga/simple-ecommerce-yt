import {
	Body,
	Container,
	Head,
	Heading,
	Html,
	Preview,
	Tailwind,
} from '@react-email/components';
import { OrderInformation } from './components/OrderInformation';

type PurchaseReceiptEmailProps = {
	order: { id: string; createdAt: Date; priceInCents: number };
	product: {
		name: string;
		imagePath: string;
		description: string;
	};
	downloadVerificationId: string;
};

PurchaseReceiptEmail.PreviewProps = {
	product: {
		name: 'product name',
		description: 'product description',
		imagePath:
			'/products/0297b8b7-0fc4-46ea-898b-9dadc47aa405-bridge_loneliness_art_129333_1440x900.jpg',
	},
	order: {
		id: '42eb1482-3ebd-4fd7-9df2-24fd8f2a2a6e',
		createdAt: new Date(),
		priceInCents: 1000,
	},
	downloadVerificationId: '42eb1482-3ebd-4fd7-9df2-24fd8f2a2a6e',
} satisfies PurchaseReceiptEmailProps;

export default function PurchaseReceiptEmail({
	product,
	order,
	downloadVerificationId,
}: PurchaseReceiptEmailProps) {
	return (
		<Html>
			<Preview>Download {product.name} and view receipt</Preview>
			<Tailwind>
				<Head />
				<Body className="font-sans bg-white">
					<Container className="max-w-xl">
						<Heading>Purchase Receipt</Heading>
						<OrderInformation
							order={order}
							product={product}
							downloadVerificationId={downloadVerificationId}
						/>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}
