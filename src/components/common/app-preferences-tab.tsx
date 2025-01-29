'use client';

import { usePreferences } from '@/store/use-preferences';
import { MoonIcon, SunIcon, Volume2, VolumeX } from 'lucide-react';
import { useTheme } from 'next-themes';
import useSound from 'use-sound';
import { Button } from '../ui/button';

export default function AppPreferencesTab() {
  const { setTheme } = useTheme();
  const { soundEnabled, setSoundEnabled } = usePreferences();
  const [playMouseClick] = useSound('/sounds/mouse-click.mp3');

  return (
    <div className='flex flex-wrap gap-2 px-1 md:px-2'>
      <Button
        variant={'outline'}
        size={'icon'}
        onClick={() => {
          setTheme('light');
          soundEnabled && playMouseClick();
        }}
      >
        <SunIcon className='size-[1.2rem] text-muted-foreground' />
      </Button>
      <Button
        variant={'outline'}
        size={'icon'}
        onClick={() => {
          setTheme('dark');
          soundEnabled && playMouseClick();
        }}
      >
        <MoonIcon className='size-[1.2rem] text-muted-foreground' />
      </Button>
      <Button
        variant={'outline'}
        size={'icon'}
        onClick={() => {
          setSoundEnabled(!soundEnabled);
          !soundEnabled && playMouseClick();
        }}
      >
        {soundEnabled ? (
          <Volume2 className='size-[1.2rem] text-muted-foreground' />
        ) : (
          <VolumeX className='size-[1.2rem] text-muted-foreground' />
        )}
      </Button>
    </div>
  );
}
