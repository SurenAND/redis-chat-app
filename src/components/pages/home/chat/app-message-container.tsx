import AppChatBottomBar from './app-chat-bottom-bar';
import AppChatTopBar from './app-chat-top-bar';
import AppMessagesList from './app-messages-list';

export default function AppMessageContainer() {
  return (
    <div className='flex h-full w-full flex-col justify-between'>
      <AppChatTopBar />

      <div
        className='wf
     flex h-full flex-col overflow-y-auto overflow-x-hidden'
      >
        <AppMessagesList />
        <AppChatBottomBar />
      </div>
    </div>
  );
}
