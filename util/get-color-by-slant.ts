import { SOURCE_SLANT_MAP } from '@/constants/source-slant';
import type { Color } from '@/styles/color-variants';

const CENTER = Math.floor(Object.keys(SOURCE_SLANT_MAP).length / 2);
const getColorBySlant = (slant: number): Color => {
	if (isNaN(slant)) return 'neutral';
	return slant > CENTER ? 'error' : slant < CENTER ? 'info' : 'primary';
};

export default getColorBySlant;
