import { sendMessageAction } from '@/actions/message.actions';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Message } from '@/db/dummy';
import { pusherClient } from '@/lib/pusher';
import { usePreferences } from '@/store/use-preferences';
import { useSelectedUser } from '@/store/use-selected-user';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Image as ImageIcon,
  Loader,
  SendHorizontal,
  ThumbsUp,
} from 'lucide-react';
import { CldUploadWidget, CloudinaryUploadWidgetInfo } from 'next-cloudinary';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import useSound from 'use-sound';
import AppEmojiPicker from './app-emoji-picker';

export default function AppChatBottomBar() {
  const [message, setMessage] = useState<string>('');
  const [imgUrl, setImgUrl] = useState<string>('');

  const { user: currentUser } = useKindeBrowserClient();
  const queryClient = useQueryClient();

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const { selectedUser } = useSelectedUser();
  const { soundEnabled } = usePreferences();
  const [playSound1] = useSound('/sounds/keystroke1.mp3');
  const [playSound2] = useSound('/sounds/keystroke2.mp3');
  const [playSound3] = useSound('/sounds/keystroke3.mp3');
  const [playSound4] = useSound('/sounds/keystroke4.mp3');

  const [playNotificationSound] = useSound('/sounds/notification.mp3');

  const playSoundFunction = [playSound1, playSound2, playSound3, playSound4];

  const playRandomKeyStrokeSound = () => {
    const randomIndex = Math.floor(Math.random() * playSoundFunction.length);
    soundEnabled && playSoundFunction[randomIndex]();
  };
  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: sendMessageAction,
  });

  const handleSendMessage = () => {
    if (!message.trim()) return;

    sendMessage({
      content: message,
      messageType: 'text',
      receiverId: selectedUser?.id!,
    });

    setMessage('');

    textAreaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }

    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      setMessage(message + '\n');
    }
  };

  useEffect(() => {
    const channelName = `${currentUser?.id}__${selectedUser?.id}`
      .split('__')
      .sort()
      .join('__');
    const channel = pusherClient?.subscribe(channelName);

    const handleNewMessage = (data: { message: Message }) => {
      queryClient.setQueryData(
        ['messages', selectedUser?.id],
        (oldMessages: Message[]) => {
          return [...oldMessages, data.message];
        },
      );

      if (soundEnabled && data.message.senderId !== currentUser?.id) {
        playNotificationSound();
      }
    };

    channel.bind('newMessage', handleNewMessage);

    // ! Absolutely important, otherwise the event listener will be added multiple times which means you'll see the incoming new message multiple times
    return () => {
      channel.unbind('newMessage', handleNewMessage);
      pusherClient.unsubscribe(channelName);
    };
  }, [
    currentUser?.id,
    selectedUser?.id,
    queryClient,
    playNotificationSound,
    soundEnabled,
  ]);

  return (
    <div className='flex w-full items-center justify-between gap-2 p-2'>
      {!message.trim() && (
        <CldUploadWidget
          signatureEndpoint={'/api/sign-cloudinary-params'}
          onSuccess={(result, { widget }) => {
            setImgUrl((result.info as CloudinaryUploadWidgetInfo).secure_url);
            widget.close();
          }}
        >
          {({ open }) => {
            return (
              <ImageIcon
                size={20}
                onClick={() => open()}
                className='cursor-pointer text-muted-foreground'
              />
            );
          }}
        </CldUploadWidget>
      )}

      <Dialog open={!!imgUrl}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>
          <div className='relative mx-auto flex h-96 w-full items-center justify-center'>
            <Image
              src={imgUrl}
              alt='Image Preview'
              fill
              className='object-contain'
            />
          </div>

          <DialogFooter>
            <Button
              type='submit'
              onClick={() => {
                sendMessage({
                  content: imgUrl,
                  messageType: 'image',
                  receiverId: selectedUser?.id!,
                });
                setImgUrl('');
              }}
            >
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AnimatePresence>
        <motion.div
          layout
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{
            opacity: { duration: 0.5 },
            layout: {
              type: 'spring',
              bounce: 0.15,
            },
          }}
          className='relative w-full'
        >
          <Textarea
            autoComplete='off'
            placeholder='Aa'
            rows={1}
            className='flex h-9 min-h-0 w-full resize-none items-center overflow-hidden rounded-full
						border bg-background'
            value={message}
            onKeyDown={handleKeyDown}
            onChange={(e) => {
              setMessage(e.target.value);
              playRandomKeyStrokeSound();
            }}
            ref={textAreaRef}
          />
          <div className='absolute bottom-0.5 right-2'>
            <AppEmojiPicker
              onChange={(emoji) => {
                setMessage(message + emoji);
                if (textAreaRef.current) {
                  textAreaRef.current.focus();
                }
              }}
            />
          </div>
        </motion.div>

        {message.trim() ? (
          <Button
            className='h-9 w-9 shrink-0 dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white'
            variant={'ghost'}
            size={'icon'}
            onClick={handleSendMessage}
          >
            <SendHorizontal size={20} className='text-muted-foreground' />
          </Button>
        ) : (
          <Button
            className='h-9 w-9 shrink-0 dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white'
            variant={'ghost'}
            size={'icon'}
            onClick={() => {
              if (!isPending) {
                sendMessage({
                  content: '👍',
                  messageType: 'text',
                  receiverId: selectedUser?.id!,
                });
              }
            }}
          >
            {!isPending ? (
              <ThumbsUp size={20} className='text-muted-foreground' />
            ) : (
              <Loader size={20} className='animate-spin' />
            )}
          </Button>
        )}
      </AnimatePresence>
    </div>
  );
}
