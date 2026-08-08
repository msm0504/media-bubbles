'use client';
import { ListItem, ListItemText } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { faPenToSquare, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Button, LinkButton } from '@/components/shared/base-ui';
import type { BlogPostSummary } from '@/types';
import { isAdmin } from '@/constants/admin-role';
import { useSession } from '@/lib/auth-client';
import AsyncList, { DeleteFnType } from '@/components/shared/async-list';
import { Link } from '@/components/shared/base-ui';
import markdownToHtml from '@/components/shared/markdown-to-html';
import PageHeading from '@/components/shared/page-heading';

type PostSummaryProps = {
	item: BlogPostSummary;
	fnDeleteItem: DeleteFnType;
};

const PostSummary: React.FC<PostSummaryProps> = ({
	item: { title, excerpt, slug, updatedAt: date },
	fnDeleteItem,
}) => {
	const { data: session } = useSession();

	return (
		<ListItem>
			<ListItemText
				primary={<Link href={`/blog/${slug}`}>{title}</Link>}
				secondary={
					<>
						{markdownToHtml(excerpt)}
						<p className='text-sm'>Last updated at {new Date(date).toLocaleString()}</p>
					</>
				}
				slotProps={{
					primary: { component: 'div' },
					secondary: { component: 'div' },
				}}
			/>
			{isAdmin(session?.user.role) ? (
				<>
					<LinkButton color='info' href={`/blog/edit-post/${slug}`}>
						<FontAwesomeIcon
							id={`edit-${slug}-icon`}
							aria-label={`Edit post ${slug}`}
							icon={faPenToSquare}
						/>
					</LinkButton>
					<Button color='primary' onClick={() => fnDeleteItem(slug, title)}>
						<FontAwesomeIcon
							id={`delete-${slug}-icon`}
							aria-label={`Delete post ${slug}`}
							icon={faTrashCan}
						/>
					</Button>
				</>
			) : null}
		</ListItem>
	);
};

const BlogPosts: React.FC = () => {
	const { data: session } = useSession();

	return (
		<>
			<PageHeading heading='Blog Posts' />
			{isAdmin(session?.user.role) && (
				<div className='flex flex-row-reverse'>
					<LinkButton variant='contained' href='/blog/add-post'>
						Add Post
						{<FontAwesomeIcon icon={faPlus} aria-label='Add Post' />}
					</LinkButton>
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
