import { getMessagesAction } from '@/actions/message.actions';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useSelectedUser } from '@/store/use-selected-user';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import AppMessageSkeleton from '../skeletons/app-message-skeleton';

export default function AppMessagesList() {
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const { selectedUser } = useSelectedUser();
  const { user: currentUser, isLoading: isUserLoading } =
    useKindeBrowserClient();

  const { data: messages, isLoading: isMessagesLoading } = useQuery({
    queryKey: ['messages', selectedUser?.id],
    queryFn: async () => {
      if (selectedUser && currentUser) {
        return await getMessagesAction(selectedUser?.id, currentUser?.id);
      }
    },
    enabled: !!selectedUser && !!currentUser && !isUserLoading,
  });

  // scroll to the bottom of the message container when the messages are updated
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={messageContainerRef}
      className='flex h-full w-full flex-col overflow-y-auto overflow-x-hidden'
    >
      {/* This component ensure that an animation is applied when items are added to or removed from the list */}
      <AnimatePresence>
        {isMessagesLoading ? (
          <AppMessageSkeleton />
        ) : (
          messages?.map((message, index) => (
            <motion.div
              key={index}
              layout
              initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
              transition={{
                opacity: { duration: 0.1 },
                layout: {
                  type: 'spring',
                  bounce: 0.3,
                  duration: messages.indexOf(message) * 0.05 + 0.2,
                },
              }}
              style={{
                originX: 0.5,
                originY: 0.5,
              }}
              className={cn(
                'flex flex-col gap-2 whitespace-pre-wrap p-4',
                message.senderId === currentUser?.id
                  ? 'items-end'
                  : 'items-start',
              )}
            >
              <div className='flex items-center gap-3'>
                {message.senderId === selectedUser?.id && (
                  <Avatar className='flex items-center justify-center'>
                    <AvatarImage
                      src={selectedUser?.image}
                      alt='User Image'
                      className='rounded-full border-2 border-white'
                    />
                  </Avatar>
                )}
                {message.messageType === 'text' ? (
                  <span className='max-w-xs rounded-md bg-accent p-3'>
                    {message.content}
                  </span>
                ) : (
                  <img
                    src={message.content}
                    alt='Message Image'
                    className='h-40 rounded border object-cover p-2 md:h-52'
                  />
                )}

                {message.senderId === currentUser?.id && (
                  <Avatar className='flex items-center justify-center'>
                    <AvatarImage
                      src={currentUser?.picture || '/user-placeholder.png'}
                      alt='User Image'
                      className='rounded-full border-2 border-white'
                    />
                  </Avatar>
                )}
              </div>
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </div>
  );
}
