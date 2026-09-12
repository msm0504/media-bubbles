'use client';
import { useState, useEffect, useMemo } from 'react';
import debounce from 'lodash.debounce';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightLong } from '@fortawesome/free-solid-svg-icons';
import { BskyArticle } from '@/types';
import { SOURCE_SLANT_MAP } from '@/constants/source-slant';
import { callApi } from '@/services/api-service';
import { textVariants } from '@/styles/color-variants';
import getColorBySlant from '@/util/get-color-by-slant';
import { Button, Paper, SearchInput } from '@/components/shared/base-ui';

const Home: React.FC = () => {
	const [searchTerm, setSearchTerm] = useState<string>('');
	const [mostRecent, setMostRecent] = useState<BskyArticle[]>([]);

	const getMostRecent = useMemo(
		() =>
			debounce((keyword = '') => {
				callApi<BskyArticle[], { keyword: string }>('get', '/headlines/most-recent', {
					keyword,
				}).then(resp => setMostRecent(resp));
			}, 300),
		[]
	);

	useEffect(() => {
		getMostRecent(searchTerm);
		return () => getMostRecent.cancel();
	}, [searchTerm, getMostRecent]);

	const handleSearch = (newSearchTerm: string) => {
		setSearchTerm(newSearchTerm);
	};

	return (
		<div className='m-auto grid max-w-6xl grid-cols-1 gap-4 px-4 py-20 md:grid-cols-2'>
			<div className='mb-2 flex flex-col justify-center gap-4 py-8 md:col-span-1'>
				<h2 className='text-5xl font-extrabold md:text-6xl xl:text-7xl'>
					See the{' '}
					<span className='bg-linear-[100deg] from-info via-primary via-48% to-error bg-clip-text text-transparent'>
						whole story.
					</span>
					<br />
					Not just one side.
				</h2>
				<p className='text-slate-700 dark:text-slate-300'>
					{`
						In the age of social media and targeted advertising, it's easy to
						get trapped inside of our own bubbles. We only see information from sources we are already
						likely to agree with. This site provides a way out. Search for recent news from outlets
						across the spectrum, outlets you agree with ("Stay in my Bubble"), outlets you disagree with
						("Burst my Bubble"), or specific outlets of your choosing. Escape your information bubble!
					`}
				</p>
				<div className='flex flex-row gap-2'>
					<Button className='grow-2' color='neutral' variant='contained' href='/search'>
						Explore the headlines
						<FontAwesomeIcon size='2xs' icon={faArrowRightLong} />
					</Button>
					<Button className='grow' color='neutral' variant='text' href='/about'>
						Learn how it works
						<FontAwesomeIcon size='2xs' icon={faArrowRightLong} />
					</Button>
				</div>
			</div>
			<div className='relative flex flex-col gap-4 py-8 md:col-span-1'>
				<div className='orb orb-left'></div>
				<div className='orb orb-right'></div>
				<Paper className='flex items-center gap-4'>
					<h3 className='grow-2 font-bold'>Recent Headlines</h3>
					<SearchInput
						rootClassName='flex grow flex-col gap-1'
						className='pl-10'
						name='search'
						placeholder='Search'
						value={searchTerm}
						onValueChange={newValue => handleSearch(newValue)}
					/>
				</Paper>
				{mostRecent.map(article => (
					<Paper key={article._id} className='text-sm'>
						<div className={textVariants({ color: getColorBySlant(article.slant) })}>
							{typeof article.slant !== 'undefined' ? `${SOURCE_SLANT_MAP[article.slant]}: ` : ''}
							{article.sourceName}
						</div>
						<div className='font-semibold'>{article.title || article.description}</div>
					</Paper>
				))}
			</div>
		</div>
	);
};

export default Home;
