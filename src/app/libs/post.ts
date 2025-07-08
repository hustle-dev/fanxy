import fs from 'fs';
import path from 'path';

import { glob } from 'glob';
import matter from 'gray-matter';

import normalizeSlug from '../utils/normalizeSlug';

import type PostFrontmatter from '../types/PostFrontmatter';

const POSTS_DIR = path.join(process.cwd(), 'posts');
const PUBLIC_DIR = path.join(process.cwd(), 'public');

const copyImageToPublic = (imagePath: string, postPath: string): string => {
  const postDir = path.dirname(postPath);
  const fullImagePath = path.resolve(postDir, imagePath);

  // 파일이 없으면 원본 경로 반환
  if (!fs.existsSync(fullImagePath)) {
    return imagePath;
  }

  // 포스트 폴더의 상대 경로를 구함
  const relativePath = path.relative(POSTS_DIR, postDir);
  const publicImageDir = path.join(PUBLIC_DIR, 'posts', relativePath);

  // public 폴더에 디렉토리 생성
  if (!fs.existsSync(publicImageDir)) {
    fs.mkdirSync(publicImageDir, { recursive: true });
  }

  const imageFileName = path.basename(imagePath);
  const publicImagePath = path.join(publicImageDir, imageFileName);

  // 이미지 복사
  if (!fs.existsSync(publicImagePath)) {
    fs.copyFileSync(fullImagePath, publicImagePath);
  }

  // public 폴더 기준 경로 반환
  return `/posts/${relativePath}/${imageFileName}`;
};

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
  frontmatter.ogImage = copyImageToPublic(
    frontmatter.ogImage as string,
    postPath,
  );
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
