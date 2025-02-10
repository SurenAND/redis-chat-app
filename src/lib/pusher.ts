import PusherServer from 'pusher';
import PusherClient from 'pusher-js';

declare global {
  var pusherServer: PusherServer | undefined;
  var pusherClient: PusherClient | undefined;
}

console.log('Pusher App ID:', process.env.PUSHER_APP_ID);
console.log('Pusher Key:', process.env.PUSHER_APP_KEY);
console.log('Pusher Secret:', process.env.PUSHER_APP_SECRET);

export const pusherServer =
  global.pusherServer ||
  new PusherServer({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.PUSHER_APP_KEY!,
    secret: process.env.PUSHER_APP_SECRET!,
    cluster: 'eu',
    useTLS: true,
  });

export const pusherClient =
  global.pusherClient ||
  new PusherClient(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, { cluster: 'eu' });
