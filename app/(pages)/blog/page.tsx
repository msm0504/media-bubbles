'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { faPenToSquare, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/shared/base-ui';
import type { BlogPostSummary } from '@/types';
import { isAdmin } from '@/constants/admin-role';
import { useSession } from '@/lib/auth-client';
import AsyncList, { ListItemProps } from '@/components/shared/async-list';
import { Link } from '@/components/shared/base-ui';
import markdownToHtml from '@/components/shared/markdown-to-html';
import PageHeading from '@/components/shared/page-heading';

const PostSummary: React.FC<ListItemProps<BlogPostSummary>> = ({
	item: { title, excerpt, slug, updatedAt: date },
	fnDeleteItem,
}) => {
	const { data: session } = useSession();

	return (
		<li className='flex items-center gap-2 px-2 py-1 even:bg-gray-200'>
			<div className='grow'>
				<h3>
					<Link href={`/blog/${slug}`}>{title}</Link>
				</h3>
				{markdownToHtml(excerpt)}
				<p className='text-sm'>Last updated at {new Date(date).toLocaleString()}</p>
			</div>
			{isAdmin(session?.user.role) ? (
				<>
					<Button color='info' variant='text' href={`/blog/edit-post/${slug}`}>
						<FontAwesomeIcon
							id={`edit-${slug}-icon`}
							aria-label={`Edit post ${slug}`}
							size='lg'
							icon={faPenToSquare}
						/>
					</Button>
					<Button color='primary' variant='text' onClick={() => fnDeleteItem(slug, title)}>
						<FontAwesomeIcon
							id={`delete-${slug}-icon`}
							aria-label={`Delete post ${slug}`}
							size='lg'
							icon={faTrashCan}
						/>
					</Button>
				</>
			) : null}
		</li>
	);
};

const BlogPosts: React.FC = () => {
	const { data: session } = useSession();

	return (
		<>
			<PageHeading heading='Blog Posts' />
			{isAdmin(session?.user.role) && (
				<div className='flex flex-row-reverse'>
					<Button variant='contained' href='/blog/add-post'>
						Add Post
						{<FontAwesomeIcon icon={faPlus} aria-label='Add Post' />}
					</Button>
				</div>
			)}
			<AsyncList<BlogPostSummary>
				apiListName='posts'
				apiPath='blog-posts'
				keyField='slug'
				ListItemComponent={PostSummary}
			/>
		</>
	);
};

export default BlogPosts;
