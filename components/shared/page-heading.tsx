type PageHeadingProps = {
	heading: string;
};

const PageHeading: React.FC<PageHeadingProps> = ({ heading }) => (
	<h2 className='mb-2 text-3xl font-bold text-info'>{heading}</h2>
);

export default PageHeading;
