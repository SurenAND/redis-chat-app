import AppPreferencesTab from '@/components/common/app-preferences-tab';
import AppChat from '@/components/pages/home/chat/app-chat';
import { cookies } from 'next/headers';

export default async function Home() {
  const layout = (await cookies()).get('react-resizable-panels:layout');
  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;

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
        <AppChat defaultLayout={defaultLayout} />
      </div>
    </main>
  );
}
