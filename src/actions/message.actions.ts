'use server';

import { redis } from '@/lib/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

interface ISendMessageActionArgs {
  content: string;
  receiverId: string;
  messageType: 'text' | 'image';
}
export async function sendMessageAction({
  content,
  receiverId,
  messageType,
}: ISendMessageActionArgs) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) return { success: false, error: 'User not authenticated' };

  const senderId = user.id;

  const conversationId = `conversation:${[senderId, receiverId].sort().join(':')}`;

  const isConversationExists = await redis.exists(conversationId);

  if (!isConversationExists) {
    await redis.hset(conversationId, {
      participant1: senderId,
      participant2: receiverId,
    });

    await redis.sadd(`user:${senderId}:conversations`, conversationId);
    await redis.sadd(`user:${receiverId}:conversations`, conversationId);
  }

  const messageId = `message:${Date.now()}:${Math.random().toString(36).substring(2, 9)}`;

  const timestamp = Date.now();

  // create message hash
  await redis.hset(messageId, {
    senderId,
    content,
    timestamp,
    messageType,
  });

  // add message to conversation
  await redis.zadd(`${conversationId}:messages`, {
    score: timestamp,
    member: JSON.stringify(messageId),
  });

  return { success: true, conversationId, messageId };
}
