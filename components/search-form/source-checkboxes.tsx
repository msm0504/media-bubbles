'use client';
import { Checkbox } from '../shared/base-ui';
import type { Source } from '@/types';
import MAX_SOURCE_SELECTIONS from '@/constants/max-source-selections';
import getColorBySlant from '@/util/get-color-by-slant';

type SourceCheckboxesProps = {
	sourceList: Source[];
	selections: string[];
	onChange: (checked: boolean, sourceId: string) => void;
};

const SourceCheckboxes: React.FC<SourceCheckboxesProps> = ({
	sourceList,
	selections,
	onChange,
}) => {
	const checkboxes = sourceList.map(source => {
		const isChecked = selections.indexOf(source.id) > -1;
		const isDisabled =
			selections.indexOf(source.id) === -1 && selections.length === MAX_SOURCE_SELECTIONS;
		return (
			<label key={source.id + 'Checkbox'}>
				<Checkbox
					name={source.id + 'Checkbox'}
					size='xl'
					color={typeof source.slant !== 'undefined' ? getColorBySlant(source.slant) : undefined}
					value={source.id}
					checked={isChecked}
					disabled={isDisabled}
					onCheckedChange={checked => onChange(checked, source.id)}
				/>
				{source.name}
			</label>
		);
	});

	return (
		<>
			<p className='font-bold'>Choose up to {MAX_SOURCE_SELECTIONS} sources.</p>
			<div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6'>{checkboxes}</div>
		</>
	);
};

export default SourceCheckboxes;
