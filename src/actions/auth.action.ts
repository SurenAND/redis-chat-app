'use server';

import { redis } from '@/lib/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export async function checkAuthStatus() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  // if user was not found in database
  if (!user) return { success: false };

  const userId = `user:${user.id}`;

  const isUserExists = await redis.hgetall(userId);

  // sign up
  if (!isUserExists || Object.keys(isUserExists).length === 0) {
    const imgIsNull = user.picture?.includes('gravatar');
    const image = imgIsNull ? '' : user.picture;

    await redis.hset(userId, {
      id: user.id,
      email: user.email,
      name: `${user.given_name} ${user.family_name}`,
      image,
    });
  }

  return { success: true };
}
