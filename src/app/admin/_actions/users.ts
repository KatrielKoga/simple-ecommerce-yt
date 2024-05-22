'use server';

import { notFound } from 'next/navigation';
import db from '../../../db/db';

export async function deleteUser(id: string) {
	const user = await db.user.delete({
		where: { id },
	});

	if (user == null) return notFound();

	return user;
}
