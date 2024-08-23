export type BlogPost = {
  id: number;
  title: string;
  text: string;
};

type BlogPostProps = {
  posts: BlogPost[];
};

export default function BlogPost({ posts }: BlogPostProps) {
  return (
    <div id="blog-posts">
      <h1>Blog Post</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
