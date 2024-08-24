import { get } from './Util/http.ts';
import { type ReactNode, useEffect, useState } from 'react';
import BlogPosts, { BlogPost } from './BlogPosts.tsx';
import fetchingImage from './assets/data-fetching.png';

type RawDataBlogPost = {
  id: number;
  userId: number;
  title: string;
  body: string;
};

export default function App() {
  const [fetchedPosts, setFetchedPosts] = useState<BlogPost[]>();

  ///
  useEffect(() => {
    async function fetchPosts() {
      const data = (await get(
        'https://jsonplaceholder.typicode.com/posts',
      )) as RawDataBlogPost[];

      const blogPosts: BlogPost[] = data.map((rawPost) => {
        return {
          id: rawPost.id,
          title: rawPost.title,
          text: rawPost.body,
        };
      });
      setFetchedPosts(blogPosts);
    }
    fetchPosts();
  }, []);
  ///

  let content: ReactNode;
  if (fetchedPosts) {
    content = <BlogPosts posts={fetchedPosts} />;
  }

  return (
    <main>
      <img src={fetchingImage} alt="fetchingImage" />
      {content}
    </main>
  );
}
