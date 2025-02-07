import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { useSelectedUser } from '@/store/use-selected-user';
import { Info, X } from 'lucide-react';

export default function AppChatTopBar() {
  const { selectedUser, setSelectedUser } = useSelectedUser();
  return (
    <div className='flex h-20 w-full items-center justify-between border-b p-4'>
      <div className='flex items-center gap-2'>
        <Avatar className='flex items-center justify-center'>
          <AvatarImage
            src={selectedUser?.image || '/user-placeholder.png'}
            alt='User Image'
            className='h-10 w-10 rounded-full object-cover'
          />
        </Avatar>
        <span className='font-medium'>{selectedUser?.name}</span>
      </div>

      <div className='flex gap-2'>
        <Info className='cursor-pointer text-muted-foreground hover:text-primary' />
        <X
          className='cursor-pointer text-muted-foreground hover:text-primary'
          onClick={() => setSelectedUser(null)}
        />
      </div>
    </div>
  );
}
