'use client';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { SmileIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

interface IProps {
  onChange: (emoji: string) => void;
}

export default function AppEmojiPicker({ onChange }: IProps) {
  const { theme } = useTheme();

  return (
    <Popover>
      <PopoverTrigger>
        <SmileIcon className='h-5 w-5 text-muted-foreground transition hover:text-foreground' />
      </PopoverTrigger>
      <PopoverContent className='w-full'>
        <Picker
          emojiSize={18}
          data={data}
          maxFrequentRows={1}
          theme={theme === 'dark' ? 'dark' : 'light'}
          onEmojiSelect={(emoji: any) => onChange(emoji.native)}
        />
      </PopoverContent>
    </Popover>
  );
}
