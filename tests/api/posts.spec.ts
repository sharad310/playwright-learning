import { test, expect } from '@playwright/test';

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

test.describe('Posts API', () => {
  test('gets a post by id', async ({ request }) => {
    const response = await request.get('/posts/1');

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const post: Post = await response.json();
    expect(post).toMatchObject({
      userId: 1,
      id: 1,
      title: expect.any(String),
      body: expect.any(String),
    });
  });

  test('filters posts by user id', async ({ request }) => {
    const response = await request.get('/posts', {
      params: { userId: 1 },
    });

    expect(response.status()).toBe(200);

    const posts: Post[] = await response.json();
    expect(posts.length).toBeGreaterThan(0);
    expect(posts.every((post) => post.userId === 1)).toBe(true);
    expect(posts[0]).toMatchObject({
      id: expect.any(Number),
      title: expect.any(String),
      body: expect.any(String),
    });
  });

  test('creates a post', async ({ request }) => {
    const newPost = {
      userId: 1,
      title: 'Playwright API demo',
      body: 'A sample post created by an API test.',
    };
    const response = await request.post('/posts', { data: newPost });

    expect(response.status()).toBe(201);

    const createdPost: Post = await response.json();
    expect(createdPost).toMatchObject({
      ...newPost,
      id: expect.any(Number),
    });
  });
});
