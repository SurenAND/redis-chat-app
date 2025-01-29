import { Button } from '@/components/ui/button';

export default function AppAuthButtons() {
  return (
    <div className='relative z-50 flex flex-1 flex-col gap-3 md:flex-row'>
      <Button className='w-full' variant='outline'>
        Sign up
      </Button>
      <Button className='w-full'>Login</Button>
    </div>
  );
}
