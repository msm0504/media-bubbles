import { Card } from 'react-bootstrap';

const SearchInstructions: React.FC = () => (
	<Card.Body className='bg-white rounded-xl my-3'>
		<p className='m-3'>
			<strong>How to Use This Search:</strong>
		</p>
		<p className='mx-3 mt-3 mb-0'>We offer several different ways to view the latest news:</p>
		<ul className='mx-3 my-0'>
			<li>
				{`Across the Spectrum: This will return results from a sources with various biases. If
					"Include Multiple Sources in Each Category" is selected, results will be organized
					according to political bias (left, center-left, center, center-right, right), with
					multiple sources included under each. Otherwise, results will include news from 5 sources,
					1 from each category.`}
			</li>
			<li>
				{`Stay in My Bubble / Burst My Bubble: These searches will show results from 5 sources all
					with the same political bias. "Stay" will pick sources that match the bias you select;
					"Burst" will pick sources that have the opposite.`}
			</li>
			<li>
				{`Random: This one picks 5 random sources to include in results, which can give some very
					different combinations than any of the others.`}
			</li>
			<li>
				{`I Want to Pick: You pick up to 5 sources from our list to include in the search results.`}
			</li>
		</ul>
		<p className='m-3'>
			{`With any of these search types, you can either enter a keyword, which limits results to those
			about that topic, or get whatever the latest news is from these various sources. All search
			results are from Twitter and will show the contents of the individual tweets along with the
			articles they link to. The results can be saved and shared, and if you are logged in, you can
			view your past saved results. There are a plethora of media outlets on Twitter, so we pull
			from between 30 and 40 sources total, with about the same number for each political bias. The
			bias ratings are from AllSides, and their method for determining them can be found `}
			<a
				href='https://www.allsides.com/media-bias/media-bias-ratings'
				rel='noreferrer'
				target='_blank'
			>
				here
			</a>
			{`. So, other than selecting the source list, we do not want any of our opinions influencing
			this search tool.`}
		</p>
	</Card.Body>
);

export default SearchInstructions;
