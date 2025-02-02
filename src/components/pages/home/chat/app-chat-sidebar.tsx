import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { USERS } from '@/db/dummy';
import { cn } from '@/lib/utils';
import { usePreferences } from '@/store/use-preferences';
import { LogOut } from 'lucide-react';
import useSound from 'use-sound';

interface IProps {
  isCollapsed: boolean;
}

export default function AppChatSidebar({ isCollapsed }: IProps) {
  const selectedUser = USERS[0];
  const [playClickSound] = useSound('/sounds/mouse-click.mp3');
  const { soundEnabled } = usePreferences();

  return (
    <div className='relative flex h-full max-h-full flex-col gap-4 overflow-auto bg-background p-2 data-[collapsed=true]:p-2'>
      {!isCollapsed && (
        <div className='flex items-center justify-between p-2'>
          <div className='flex items-center gap-2 text-2xl'>
            <p className='font-medium'>
              Chats{' '}
              <span className='text-muted-foreground'>({USERS.length})</span>
            </p>
          </div>
        </div>
      )}

      <ScrollArea className='gap-2 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2'>
        {USERS.map((user, idx) =>
          isCollapsed ? (
            <TooltipProvider key={idx}>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <div
                    onClick={() => {
                      soundEnabled && playClickSound();
                    }}
                  >
                    <Avatar className='my-1 flex items-center justify-center'>
                      <AvatarImage
                        src={user.image || '/user-placeholder.png'}
                        alt={'User image'}
                        className='h-10 w-10 rounded-full border-2 border-white'
                      />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className='sr-only'>{user.name}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side='right'
                  className='flex items-center gap-4'
                >
                  {user.name}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Button
              key={idx}
              variant='gray'
              size='xl'
              className={cn(
                'my-1 w-full justify-start gap-4',
                selectedUser.email === user.email &&
                  'shrink dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white',
              )}
              onClick={() => {
                soundEnabled && playClickSound();
              }}
            >
              <Avatar className='flex items-center justify-center'>
                <AvatarImage
                  src={user.image || '/user-placeholder.png'}
                  alt={'User image'}
                  className='h-10 w-10'
                />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <div className='flex max-w-28 flex-col'>
                <span>{user.name}</span>
              </div>
            </Button>
          ),
        )}
      </ScrollArea>

      {/* logout section */}
      <div className='mt-auto'>
        <div className='flex items-center justify-between gap-2 py-2 md:px-6'>
          {!isCollapsed && (
            <div className='hidden items-center gap-2 md:flex '>
              <Avatar className='flex items-center justify-center'>
                <AvatarImage
                  // src={user?.picture || '/user-placeholder.png'}
                  src={'/user-placeholder.png'}
                  alt='avatar'
                  referrerPolicy='no-referrer'
                  className='h-8 w-8 rounded-full border-2 border-white'
                />
              </Avatar>
              <p className='font-bold'>
                {/* {user?.given_name} {user?.family_name} */}
                John Doe
              </p>
            </div>
          )}
          <div className='flex'>
            {/* <LogoutLink> */}
            <LogOut size={22} cursor={'pointer'} />
            {/* </LogoutLink> */}
          </div>
        </div>
      </div>
    </div>
  );
}
