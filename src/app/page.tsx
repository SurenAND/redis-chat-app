import AppPreferencesTab from '@/components/common/app-preferences-tab';
import AppChat from '@/components/pages/home/chat/app-chat';
import { User } from '@/db/dummy';
import { redis } from '@/lib/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

async function getUsers(): Promise<User[]> {
  const userKeys: string[] = [];
  let cursor = '0';

  do {
    const [nextCursor, keys] = await redis.scan(cursor, {
      match: 'user:*',
      type: 'hash',
      count: 100,
    });
    cursor = nextCursor;
    userKeys.push(...keys);
  } while (cursor !== '0');

  // get current user
  const { getUser } = getKindeServerSession();
  const currentUser = await getUser();

  // get all users
  const pipeline = redis.pipeline();
  userKeys.forEach((key) => pipeline.hgetall(key));
  const results = (await pipeline.exec()) as User[];

  const users: User[] = results.filter((user) => user.id !== currentUser?.id);

  return users;
}

export default async function Home() {
  const layout = (await cookies()).get('react-resizable-panels:layout');
  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;

  const { isAuthenticated } = getKindeServerSession();

  if (!(await isAuthenticated())) redirect('/auth');

  const users = await getUsers();

  return (
    <main className='flex h-screen flex-col items-center justify-center gap-4 p-4 py-32 md:px-24'>
      <AppPreferencesTab />

      {/* dotted bg */}
      <div
        className='absolute top-0 z-[-2] h-screen w-screen bg-[#ffffff] bg-[radial-gradient(#00000033_1px,#ffffff_1px)] 
				bg-[size:20px_20px] dark:bg-[#000000] dark:bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] dark:bg-[size:20px_20px]'
        aria-hidden='true'
      />

      <div className='z-10 min-h-[85vh] w-full max-w-5xl rounded-lg border text-sm '>
        <AppChat defaultLayout={defaultLayout} users={users} />
      </div>
    </main>
  );
}
