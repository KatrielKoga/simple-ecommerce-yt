'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { DropdownMenuItem } from '../../../../components/ui/dropdown-menu';
import { deleteUser } from '../../_actions/users';

export function DeleteDropDownItem({ id }: { id: string }) {
	const [isPending, startTransaction] = useTransition();
	const router = useRouter();

	return (
		<DropdownMenuItem
			variant="destructive"
			disabled={isPending}
			onClick={() =>
				startTransaction(async () => {
					await deleteUser(id);
					router.refresh();
				})
			}
		>
			Delete
		</DropdownMenuItem>
	);
}
