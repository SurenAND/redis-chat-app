import { Skeleton } from '@/components/ui/skeleton';

export default function AppMessageSkeleton() {
  return (
    <div className='p-4'>
      <div className='flex items-center gap-3'>
        <div className='skeleton h-10 w-10 shrink-0 rounded-full'></div>
        <div className='flex gap-2'>
          <Skeleton className='h-12 w-12 rounded-full' />
          <div className='flex flex-col gap-1'>
            <Skeleton className='h-4 w-40' />
            <Skeleton className='h-4 w-40' />
          </div>
        </div>
      </div>
      <div className='flex items-center justify-end gap-3 '>
        <div className='skeleton h-10 w-10 shrink-0 rounded-full'></div>
        <div className='flex gap-2'>
          <div className='flex flex-col gap-1'>
            <Skeleton className='h-4 w-40' />
            <Skeleton className='h-4 w-40' />
          </div>
          <Skeleton className='h-12 w-12 rounded-full' />
        </div>
      </div>
    </div>
  );
}
