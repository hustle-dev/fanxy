import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';

import { getPostBySlug, getAllPostsFrontmatter } from '~/app/libs/post';
import normalizeSlug from '~/app/utils/normalizeSlug';

import MDXComponents from './components/MDXComponents';

import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    return {
      title: '페이지를 찾을 수 없습니다',
      description: '요청하신 페이지를 찾을 수 없습니다.',
    };
  }
  const { frontmatter } = post;
  const { title, description, date, tags, ogImage, ogImageAlt } = frontmatter;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? '';
  const postUrl = `${baseUrl}/posts/${slug}`;
  const ogImageUrl = `${baseUrl}${ogImage}`;
  return {
    title,
    description,
    keywords: tags,
    authors: [{ name: 'fanxy' }],
    openGraph: {
      title,
      description,
      url: postUrl,
      siteName: 'fanxy 블로그',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: ogImageAlt,
        },
      ],
      locale: 'ko_KR',
      type: 'article',
      publishedTime: date,
      tags,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: postUrl,
    },
  };
};

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
        <div className="my-8 overflow-hidden">
          <img
            src={frontmatter.ogImage}
            alt={frontmatter.ogImageAlt}
            className="mx-auto max-h-56 rounded-xs object-contain"
          />
        </div>
      </header>
      <div className="my-10">
        <MDXRemote
          source={content}
          components={MDXComponents}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm, remarkBreaks],
              rehypePlugins: [
                [rehypeSlug],
                [
                  rehypeAutolinkHeadings,
                  {
                    content: {
                      type: 'element',
                      tagName: 'div',
                      properties: {
                        className: ['anchor'],
                      },
                      children: [{ type: 'text', value: '#' }],
                    },
                  },
                ],
                [
                  rehypePrettyCode,
                  {
                    keepBackground: false,
                    theme: {
                      dark: 'night-owl',
                      light: 'github-light',
                    },
                  },
                ],
              ],
            },
          }}
        />
      </div>
      <div className="border-border mt-16 mb-32 border-t pt-8">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 transition-colors"
        >
          ← Back to Home
        </Link>
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
export { generateStaticParams, generateMetadata };
