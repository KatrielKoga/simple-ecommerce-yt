'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { DropdownMenuItem } from '../../../../components/ui/dropdown-menu';
import {
	deleteDiscountCode,
	toggleDiscountCodeActive,
} from '../../_actions/discountCodes';

export function ActiveToggleDropdownItem({
	id,
	isActive,
}: {
	id: string;
	isActive: boolean;
}) {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();
	return (
		<DropdownMenuItem
			disabled={isPending}
			onClick={() => {
				startTransition(async () => {
					await toggleDiscountCodeActive(id, !isActive);
					router.refresh();
				});
			}}
		>
			{isActive ? 'Deactivate' : 'Activate'}
		</DropdownMenuItem>
	);
}

export function DeleteDropdownItem({
	id,
	disabled,
}: {
	id: string;
	disabled: boolean;
}) {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();
	return (
		<DropdownMenuItem
			variant="destructive"
			disabled={disabled || isPending}
			onClick={() => {
				startTransition(async () => {
					await deleteDiscountCode(id);
					router.refresh();
				});
			}}
		>
			Delete
		</DropdownMenuItem>
	);
}
