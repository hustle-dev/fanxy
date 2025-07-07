import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';

import { getPostBySlug, getAllPostsFrontmatter } from '~/app/libs/post';
import normalizeSlug from '~/app/utils/normalizeSlug';

import type { PropsWithChildren } from 'react';

const mdxComponents = {
  h1: ({ children }: PropsWithChildren) => (
    <h1 className="text-foreground mt-8 mb-4 text-3xl font-bold first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }: PropsWithChildren) => (
    <h2 className="text-foreground mt-6 mb-3 text-2xl font-bold">{children}</h2>
  ),
  h3: ({ children }: PropsWithChildren) => (
    <h3 className="text-foreground mt-5 mb-2 text-xl font-semibold">
      {children}
    </h3>
  ),
  p: ({ children }: PropsWithChildren) => (
    <p className="text-foreground mt-4 leading-relaxed">{children}</p>
  ),
  code: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 font-mono text-sm font-medium">
          {children}
        </code>
      );
    }
    return (
      <pre className="bg-muted border-border my-4 overflow-x-auto rounded-lg border p-4">
        <code className="text-foreground font-mono text-sm">{children}</code>
      </pre>
    );
  },
  ul: ({ children }: PropsWithChildren) => (
    <ul className="text-foreground mt-4 list-inside list-disc space-y-2">
      {children}
    </ul>
  ),
  ol: ({ children }: PropsWithChildren) => (
    <ol className="text-foreground mt-4 list-inside list-decimal space-y-2">
      {children}
    </ol>
  ),
  li: ({ children }: PropsWithChildren) => (
    <li className="text-foreground mt-1">{children}</li>
  ),
  blockquote: ({ children }: PropsWithChildren) => (
    <blockquote className="border-border bg-muted/50 text-muted-foreground my-4 border-l-4 py-2 pl-4 italic [&_p]:mt-0">
      {children}
    </blockquote>
  ),
  a: ({ children, href }: PropsWithChildren<{ href?: string }>) => (
    <a
      href={href}
      className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  hr: () => <hr className="border-border my-8" />,
  table: ({ children }: PropsWithChildren) => (
    <div className="my-4 overflow-x-auto">
      <table className="border-border min-w-full border-collapse border">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }: PropsWithChildren) => (
    <thead className="bg-muted">{children}</thead>
  ),
  tbody: ({ children }: PropsWithChildren) => <tbody>{children}</tbody>,
  tr: ({ children }: PropsWithChildren) => (
    <tr className="border-border border-b">{children}</tr>
  ),
  th: ({ children }: PropsWithChildren) => (
    <th className="border-border text-foreground border px-4 py-2 text-left font-semibold">
      {children}
    </th>
  ),
  td: ({ children }: PropsWithChildren) => (
    <td className="border-border text-foreground border px-4 py-2">
      {children}
    </td>
  ),
};

interface Props {
  params: Promise<{ slug: string }>;
}

const Page = async ({ params }: Props) => {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    notFound();
  }
  const { frontmatter, content } = post;
  return (
    <article className="mt-16">
      <header>
        <h1 className="text-4xl font-bold">{frontmatter.title}</h1>
        <div className="text-muted-foreground mt-6 flex gap-4">
          <time className="mt-0.5 font-mono text-sm">
            {new Date(frontmatter.date).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          <div className="flex gap-2">
            {frontmatter.tags.map((tag) => (
              <span
                key={tag}
                className="bg-muted rounded-md px-2 py-1 text-xs font-semibold"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        {/* <div className="mt-6 overflow-hidden">
          <img
            src={frontmatter.heroImage}
            alt={frontmatter.heroImageAlt}
            className="mx-auto max-h-56 rounded-xs object-contain"
          />
        </div> */}
      </header>
      <div className="my-10">
        <MDXRemote source={content} components={mdxComponents} />
      </div>
    </article>
  );
};

const generateStaticParams = async () => {
  const posts = await getAllPostsFrontmatter();
  return posts.map((post) => ({
    slug: normalizeSlug(post.slug),
  }));
};

export default Page;
export { generateStaticParams };
