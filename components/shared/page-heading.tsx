type PageHeadingProps = {
	heading: string;
};

const PageHeading: React.FC<PageHeadingProps> = ({ heading }) => (
	<h2 className='mb-2'>
		<span className='bg-linear-[100deg] from-info via-primary via-48% to-error bg-clip-text text-3xl font-bold text-transparent'>
			{heading}
		</span>
	</h2>
);

export default PageHeading;
