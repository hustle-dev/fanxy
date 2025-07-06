import fs from 'fs';
import path from 'path';

import { glob } from 'glob';
import matter from 'gray-matter';

import normalizeSlug from '../utils/normalizeSlug';

import type PostFrontmatter from '../types/PostFrontmatter';

const POSTS_DIR = path.join(process.cwd(), 'posts');

const getPostPaths = async () => await glob(`${POSTS_DIR}/**/*.md`);

const getPostFrontmatter = (postPath: string): PostFrontmatter => {
  const post = fs.readFileSync(postPath, 'utf8');
  const { data: frontmatter } = matter(post);
  return frontmatter as PostFrontmatter;
};

const getAllPostsFrontmatter = async () => {
  const postPaths = await getPostPaths();
  const posts = await Promise.all(postPaths.map(getPostFrontmatter));
  return posts;
};

const getPost = (postPath: string) => {
  const post = fs.readFileSync(postPath, 'utf8');
  const { data: frontmatter, content } = matter(post);
  return {
    frontmatter: frontmatter as PostFrontmatter,
    content,
  };
};

const getPostBySlug = async (slug: string) => {
  const postPaths = await getPostPaths();
  const postPath = postPaths.find((path) => {
    const frontmatter = getPostFrontmatter(path);
    const normalizedSlug = normalizeSlug(frontmatter.slug);
    return normalizedSlug === slug;
  });
  if (!postPath) {
    return null;
  }
  return getPost(postPath);
};

export {
  getPostPaths,
  getPostFrontmatter,
  getAllPostsFrontmatter,
  getPostBySlug,
};
