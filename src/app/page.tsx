import AppPreferencesTab from '@/components/common/app-preferences-tab';

export default function Home() {
  return (
    <main className='flex h-screen flex-col items-center justify-center gap-4 p-4 py-32 md:px-24'>
      <AppPreferencesTab />

      {/* dotted bg */}
      <div
        className='absolute top-0 z-[-2] h-screen w-screen bg-[#ffffff] bg-[radial-gradient(#00000033_1px,#ffffff_1px)] 
				bg-[size:20px_20px] dark:bg-[#000000] dark:bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] dark:bg-[size:20px_20px]'
        aria-hidden='true'
      />
    </main>
  );
}
