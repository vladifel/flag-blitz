import { reddit } from '@devvit/web/server';

export const createPost = async () => {
  return await reddit.submitCustomPost({
    title: 'Flag Blitz — Guess the Flag!',
    entry: 'default',
  });
};
