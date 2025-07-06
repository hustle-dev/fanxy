import Link from 'next/link';

import { getAllPostsFrontmatter } from './libs/post';

import type PostFrontmatter from './types/PostFrontmatter';

const groupPostsByYear = (posts: PostFrontmatter[]) =>
  posts.reduce<Record<string, PostFrontmatter[]>>((acc, post) => {
    const year = new Date(post.date).getFullYear().toString();
    acc[year] ??= [];
    acc[year].push(post);
    return acc;
  }, {});

const formatDateToMonthDay = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
  });
};

const Page = async () => {
  const postsFrontmatter = await getAllPostsFrontmatter();
  const postsByYear = groupPostsByYear(postsFrontmatter);
  const sortedYears = Object.keys(postsByYear).sort(
    (a, b) => Number(b) - Number(a),
  );
  return (
    <div>
      {sortedYears.map((year) => (
        <div key={year} className="mt-12">
          <h2 className="text-foreground mb-4 text-2xl font-medium">{year}</h2>
          <div className="space-y-2">
            {postsByYear[year]
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime(),
              )
              .map((post, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between gap-4"
                >
                  <Link
                    href={`/posts/${post.slug}`}
                    className="text-foreground flex-1 cursor-pointer underline decoration-transparent underline-offset-4 transition-all duration-200 hover:decoration-current"
                  >
                    {post.title}
                  </Link>
                  <time className="text-muted-foreground mt-0.5 font-mono text-sm whitespace-nowrap">
                    {formatDateToMonthDay(post.date)}
                  </time>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Page;
