'use client';
import Link from 'next/link';
import {
	Button,
	IconButton,
	Link as MuiLink,
	ListItem,
	ListItemText,
	Stack,
	Typography,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { faPenToSquare, faPlus } from '@fortawesome/free-solid-svg-icons';
import type { BlogPostSummary } from '@/types';
import { isAdmin } from '@/constants/admin-role';
import { useSession } from '@/lib/auth-client';
import AsyncList, { DeleteFnType } from '@/components/shared/async-list';
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
				primary={
					<MuiLink component={Link} href={`/blog/${slug}`}>
						{title}
					</MuiLink>
				}
				secondary={
					<>
						{markdownToHtml(excerpt)}
						<Typography variant='caption'>
							Last updated at {new Date(date).toLocaleString()}
						</Typography>
					</>
				}
				slotProps={{
					primary: { component: 'div' },
					secondary: { component: 'div' },
				}}
			/>
			{isAdmin(session?.user.role) ? (
				<>
					<IconButton
						aria-label={`Edit post ${slug}`}
						color='info'
						LinkComponent={Link}
						href={`/blog/edit-post/${slug}`}
					>
						<FontAwesomeIcon id={`edit-${slug}-icon`} icon={faPenToSquare} />
					</IconButton>
					<IconButton
						aria-label={`Delete post ${slug}`}
						color='primary'
						onClick={() => fnDeleteItem(slug, title)}
					>
						<FontAwesomeIcon id={`delete-${slug}-icon`} icon={faTrashCan} />
					</IconButton>
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
				<Stack direction='row-reverse'>
					<Button
						variant='contained'
						endIcon={<FontAwesomeIcon icon={faPlus} aria-label='Add Post' />}
						component={Link}
						href='/blog/add-post'
					>
						Add Post
					</Button>
				</Stack>
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
