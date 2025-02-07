'use client';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { User } from '@/db/dummy';
import { cn } from '@/lib/utils';
import { useSelectedUser } from '@/store/use-selected-user';
import { useEffect, useState } from 'react';
import AppChatSidebar from './app-chat-sidebar';
import AppMessageContainer from './app-message-container';

interface IProps {
  defaultLayout: number[] | undefined;
  users: User[];
}

export default function AppChat({ defaultLayout = [320, 480], users }: IProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { selectedUser } = useSelectedUser();

  useEffect(() => {
    const checkScreenWidth = () => setIsMobile(window.innerWidth <= 768);

    // initial check
    checkScreenWidth();

    // Event listener for screen width change
    window.addEventListener('resize', checkScreenWidth);

    // Cleanup function to remove event listener
    return () => window.removeEventListener('resize', checkScreenWidth);
  }, []);

  return (
    <ResizablePanelGroup
      direction='horizontal'
      className='h-full items-stretch rounded-lg bg-background'
      onLayout={(sizes: number[]) => {
        document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`;
      }}
    >
      <ResizablePanel
        defaultSize={defaultLayout[0]}
        collapsedSize={8}
        collapsible
        minSize={isMobile ? 0 : 24}
        maxSize={isMobile ? 8 : 30}
        onCollapse={() => {
          setIsCollapsed(true);
          document.cookie = `react-resizable-panels:collapsed=true`;
        }}
        onExpand={() => {
          setIsCollapsed(false);
          document.cookie = `react-resizable-panels:collapsed=false`;
        }}
        className={cn(
          isCollapsed && 'min-w-[80px] transition-all duration-300 ease-in-out',
        )}
      >
        <AppChatSidebar isCollapsed={isCollapsed} users={users} />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
        {!selectedUser && (
          <div className='flex h-full w-full items-center justify-center px-10'>
            <div className='flex flex-col items-center justify-center gap-4'>
              <img
                src='/logo.png'
                alt='Logo'
                className='w-full md:w-2/3 lg:w-1/2'
              />
              <p className='text-center text-muted-foreground'>
                Click on a chat to view the messages
              </p>
            </div>
          </div>
        )}
        {selectedUser && <AppMessageContainer />}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
