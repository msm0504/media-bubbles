const { getCollection } = require('./db-connection');

const COLLECTION_NAME = 'blog_posts';
const PAGE_SIZE = 10;

const _collection = getCollection(COLLECTION_NAME);

const formatExcerpt = content => {
	const MAX_LENGTH = 350;
	const lastSentenceEnd = content.substring(0, MAX_LENGTH).search(/[,.?!]\s[^,.?!]*$/);
	return `${content.substring(0, lastSentenceEnd)}...`;
};

const SLUG_WITH_TS_PATTERN = /^\d{4}_\d{2}_\d{2}_/;

async function savePost(post) {
	return SLUG_WITH_TS_PATTERN.test(post.slug) ? updatePost(post) : createPost(post);
}

async function createPost(post) {
	const db = await _collection;
	const createTs = new Date().toISOString();
	const slugWithTs = `${createTs.split('T')[0].replace(/-/g, '_')}_${post.slug.toLowerCase()}`;
	const { insertedId } = await db.insertOne({
		...post,
		_id: slugWithTs,
		slug: slugWithTs,
		excerpt: formatExcerpt(post.content),
		createdAt: createTs,
		updatedAt: createTs
	});
	return { slug: insertedId };
}

async function updatePost(post) {
	const db = await _collection;
	const updateTs = new Date().toISOString();
	const { modifiedCount } = await db.updateOne(
		{ _id: post.slug },
		{ $set: { ...post, excerpt: formatExcerpt(post.content), updatedAt: updateTs } }
	);
	return { slug: modifiedCount === 1 && post.slug };
}

async function getAllPostSlugs() {
	const db = await _collection;
	return db
		.find()
		.sort({ updatedAt: -1 })
		.map(({ slug }) => slug)
		.toArray();
}

async function getPost(slug) {
	const db = await _collection;
	return db.findOne({ _id: slug });
}

async function getPostSummaries(filter = '', page = 1) {
	const db = await _collection;
	const count = await db
		.find({
			$or: [
				{ slug: { $regex: `^.*${filter}.*$`, $options: 'i' } },
				{ title: { $regex: `^.*${filter}.*$`, $options: 'i' } }
			]
		})
		.count();
	const postSummaries = await db
		.find({
			$or: [
				{ slug: { $regex: `^.*${filter}.*$`, $options: 'i' } },
				{ title: { $regex: `^.*${filter}.*$`, $options: 'i' } }
			]
		})
		.sort({ updatedAt: -1 })
		.skip(PAGE_SIZE * (page - 1))
		.limit(PAGE_SIZE)
		.map(({ content, ...metaData }) => metaData)
		.toArray();

	return {
		posts: postSummaries,
		pageCount: Math.ceil(count / PAGE_SIZE)
	};
}

async function deletePost(slug) {
	const db = await _collection;
	const { deletedCount } = await db.deleteOne({ _id: slug });
	return { itemDeleted: deletedCount === 1 };
}

module.exports = {
	deletePost,
	getAllPostSlugs,
	getPost,
	getPostSummaries,
	savePost
};
