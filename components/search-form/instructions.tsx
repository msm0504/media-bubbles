import { Link, Paper, Typography } from '@mui/material';

const SearchInstructions: React.FC = () => (
	<Paper>
		<Typography gutterBottom fontWeight='bold'>
			How to Use This Search:
		</Typography>
		<Typography>We offer several different ways to view the latest news:</Typography>
		<ul>
			<li>
				<Typography>
					{`Across the Spectrum: This will return results from a sources with various biases. If
					"Include Multiple Sources in Each Category" is selected, results will be organized
					according to political bias (left, center-left, center, center-right, right), with
					multiple sources included under each. Otherwise, results will include news from 5 sources,
					1 from each category.`}
				</Typography>
			</li>
			<li>
				<Typography>
					{`Stay in My Bubble / Burst My Bubble: These searches will show results from 5 sources all
					with the same political bias. "Stay" will pick sources that match the bias you select;
					"Burst" will pick sources that have the opposite.`}
				</Typography>
			</li>
			<li>
				<Typography>
					{`Random: This one picks 5 random sources to include in results, which can give some very
					different combinations than any of the others.`}
				</Typography>
			</li>
			<li>
				<Typography>
					{`I Want to Pick: You pick up to 5 sources from our list to include in the search results.`}
				</Typography>
			</li>
		</ul>
		<Typography>
			{`With any of these search types, you can either enter a keyword, which limits results to those
			about that topic, or get whatever the latest news is from these various sources. All search
			results are from Bluesky and will show the contents of the individual posts along with the
			articles they link to. The results can be saved and shared, and if you are logged in, you can
			view your past saved results. There are a plethora of media outlets on Bluesky, so we pull
			from around 30 sources total, with about the same number for each political bias. The
			bias ratings are from AllSides, and their method for determining them can be found `}
			<Link
				href='https://www.allsides.com/media-bias/media-bias-ratings'
				rel='noreferrer'
				target='_blank'
			>
				here
			</Link>
			{`. So, other than selecting the source list, we do not want any of our opinions influencing
			this search tool.`}
		</Typography>
	</Paper>
);

export default SearchInstructions;
