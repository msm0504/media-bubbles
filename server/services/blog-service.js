const fsPromises = require('fs').promises;
const path = require('path');
const matter = require('gray-matter');

const blogPostsDir = path.join(process.cwd(), 'server/blog-posts');
const PAGE_SIZE = 10;

const formatPost = (title, slug, author, date, content) =>
	`---
title: ${title}
slug: ${slug}
author: ${author}
date: '${date}'
---
${content}`;

const formatExcerpt = content => {
	const MAX_LENGTH = 350;
	const lastSentenceEnd = content.substring(0, MAX_LENGTH).search(/[.?!][^.?!]*$/);
	return `${content.substring(0, lastSentenceEnd)}...`;
};

const SLUG_WITH_TS_PATTERN = /^\d{4}_\d{2}_\d{2}_/;

async function addPost({ author, slug, title, content }) {
	const date = new Date().toISOString();
	const slugWithTs = SLUG_WITH_TS_PATTERN.test(slug)
		? slug
		: `${date.split('T')[0].replace(/-/g, '_')}_${slug.toLowerCase()}`;
	const fileName = path.join(blogPostsDir, `${slugWithTs}.md`);
	await fsPromises.writeFile(fileName, formatPost(title, slugWithTs, author, date, content), {
		mode: '666'
	});
	return { slug: slugWithTs };
}

async function getAllPostSlugs() {
	const unorderedSlugs = await fsPromises.readdir(blogPostsDir);
	return unorderedSlugs.sort().reverse();
}

async function getPost(slug) {
	const fileName = slug.endsWith('.md') ? slug : `${slug}.md`;
	const fileContents = await fsPromises.readFile(path.join(blogPostsDir, fileName));
	const { data, content } = matter(fileContents);
	return { ...data, content };
}

async function getPostMetaData(slug) {
	const fileName = slug.endsWith('.md') ? slug : `${slug}.md`;
	const fileContents = await fsPromises.readFile(path.join(blogPostsDir, fileName));
	const { data, content } = matter(fileContents);
	return { ...data, excerpt: formatExcerpt(content) };
}

async function getPostSummaries(filter = '', page = 1) {
	const allSlugs = await getAllPostSlugs();
	const matchingSlugs = allSlugs.filter(slug => !filter || slug.includes(filter.toLowerCase()));
	const posts = await Promise.all(
		matchingSlugs.slice(PAGE_SIZE * (page - 1), PAGE_SIZE * page).map(getPostMetaData)
	);

	return {
		posts,
		hasMore: matchingSlugs.length > PAGE_SIZE
	};
}

async function deletePost(slug) {
	const fileName = slug.endsWith('.md') ? slug : `${slug}.md`;
	const error = await fsPromises.unlink(path.join(blogPostsDir, fileName));
	return { itemDeleted: !error };
}

module.exports = {
	addPost,
	deletePost,
	getAllPostSlugs,
	getPost,
	getPostSummaries
};
