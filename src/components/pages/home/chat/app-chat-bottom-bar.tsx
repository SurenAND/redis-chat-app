import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Image as ImageIcon,
  Loader,
  SendHorizontal,
  ThumbsUp,
} from 'lucide-react';
import { useRef, useState } from 'react';
import AppEmojiPicker from './app-emoji-picker';

export default function AppChatBottomBar() {
  const [message, setMessage] = useState<string>('');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const isPending = false;

  return (
    <div className='flex w-full items-center justify-between gap-2 p-2'>
      {/* {!message.trim() && (
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
      )} */}

      {!message.trim() && (
        <ImageIcon
          size={20}
          onClick={() => open()}
          className='cursor-pointer text-muted-foreground'
        />
      )}

      {/* <Dialog open={!!imgUrl}>
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
        </Dialog> */}

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
            // onKeyDown={handleKeyDown}
            onChange={(e) => {
              setMessage(e.target.value);
              // playRandomKeyStrokeSound();
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
            // onClick={handleSendMessage}
          >
            <SendHorizontal size={20} className='text-muted-foreground' />
          </Button>
        ) : (
          <Button
            className='h-9 w-9 shrink-0 dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white'
            variant={'ghost'}
            size={'icon'}
          >
            {!isPending && (
              <ThumbsUp
                size={20}
                className='text-muted-foreground'
                // onClick={() => {
                //   sendMessage({
                //     content: '👍',
                //     messageType: 'text',
                //     receiverId: selectedUser?.id!,
                //   });
                // }}
              />
            )}
            {isPending && <Loader size={20} className='animate-spin' />}
          </Button>
        )}
      </AnimatePresence>
    </div>
  );
}
