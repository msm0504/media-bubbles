const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const matter = require('gray-matter');

const writeFilePromise = promisify(fs.writeFile);
const readDirPromise = promisify(fs.readdir);
const readFilePromise = promisify(fs.readFile);

const blogPostsDir = path.join(process.cwd(), 'server/blog-posts');
const PAGE_SIZE = 10;

const formatPost = (title, excerpt, slug, author, date, content) =>
	`---
title: ${title}
excerpt: ${excerpt}
slug: ${slug}
author: ${author}
date: ${date}
---

${content}`;

async function addPost({ author, slug, title, content }) {
	const date = new Date().toISOString();
	const slugWithTs = `${date.split('T')[0].replace(/-/g, '_')}_${slug.toLowerCase()}`;
	const excerpt = content.substring(0, content.lastIndexOf(' ', 300));
	const fileName = path.join(blogPostsDir, `${slugWithTs}.md`);
	await writeFilePromise(fileName, formatPost(title, excerpt, slugWithTs, author, date, content));
	return { slug: slugWithTs };
}

async function getAllPostSlugs() {
	const unorderedSlugs = await readDirPromise(blogPostsDir);
	return unorderedSlugs.sort().reverse();
}

async function getPost(slug) {
	const fileContents = await readFilePromise(path.join(blogPostsDir, slug));
	const { data, content } = matter(fileContents);
	return { ...data, content };
}

async function getPostMetaData(slug) {
	const fileContents = await readFilePromise(path.join(blogPostsDir, slug));
	return matter(fileContents).data;
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

module.exports = {
	addPost,
	getAllPostSlugs,
	getPost,
	getPostSummaries
};
