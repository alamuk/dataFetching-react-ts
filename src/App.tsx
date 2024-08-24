import { get } from './Util/http.ts';
import { type ReactNode, useEffect, useState } from 'react';
import BlogPosts, { BlogPost } from './BlogPosts.tsx';
import fetchingImage from './assets/data-fetching.png';
import ErrorMessage from './ErrorMessage.tsx';

type RawDataBlogPost = {
  id: number;
  userId: number;
  title: string;
  body: string;
};

export default function App() {
  const [fetchedPosts, setFetchedPosts] = useState<BlogPost[]>();
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string>();

  ///
  useEffect(() => {
    async function fetchPosts() {
      setIsFetching(true);
      try {
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
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
        // setError((error as Error).message);
        // if(error)
        // setError('Failed to fetch posts');
      }
      setIsFetching(false);
    }
    fetchPosts();
  }, []);
  ///

  let content: ReactNode;
  if (error) {
    content = <ErrorMessage text={error} />;
  }

  if (fetchedPosts) {
    content = <BlogPosts posts={fetchedPosts} />;
  }

  if (isFetching) {
    content = <p id="loading-fallback">Fetching posts...</p>;
  }
  return (
    <main>
      <img src={fetchingImage} alt="fetchingImage" />
      {content}
    </main>
  );
}
