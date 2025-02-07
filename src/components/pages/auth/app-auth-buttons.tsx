'use client';
import { Button } from '@/components/ui/button';
import {
  LoginLink,
  RegisterLink,
} from '@kinde-oss/kinde-auth-nextjs/components';
import { useState } from 'react';

export default function AppAuthButtons() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  return (
    <div className='relative z-50 flex flex-1 flex-col gap-3 md:flex-row'>
      <RegisterLink className='flex-1' onClick={() => setIsLoading(true)}>
        <Button className='w-full' variant='outline' disabled={isLoading}>
          Sign up
        </Button>
      </RegisterLink>
      <LoginLink className='flex-1' onClick={() => setIsLoading(true)}>
        <Button className='w-full' disabled={isLoading}>
          Login
        </Button>
      </LoginLink>
    </div>
  );
}
