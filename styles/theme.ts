'use client';
import { createTheme } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

const offWhite = grey[50];
const offBlack = grey[900];

const theme = createTheme({
	cssVariables: true,
	spacing: (factor: number) => `${0.25 * factor}rem`,
	palette: {
		primary: { main: '#e60b76' },
		secondary: { main: grey[200] },
		info: { main: '#340be6' },
		success: { main: '#17e618' },
		warning: { main: '#e6ce17' },
		error: { main: '#a800e6' },
		light: { main: offWhite, contrastText: offBlack },
		dark: { main: offBlack, contrastText: offWhite },
		common: {
			white: offWhite,
			black: offBlack,
		},
		text: {
			primary: offBlack,
		},
		background: {
			default: offWhite,
		},
	},
	typography: {
		fontFamily: 'var(--font-roboto-slab)',
		h1: {
			fontSize: '5rem',
		},
	},
	components: {
		MuiAppBar: {
			styleOverrides: {
				root: {
					borderRadius: 0,
				},
			},
		},
		MuiButton: {
			styleOverrides: {
				root: ({ theme }) => ({
					fontWeight: 'bold',
					borderRadius: theme.spacing(3),
					padding: theme.spacing(3),
				}),
			},
		},
		MuiCardHeader: {
			styleOverrides: {
				root: ({ theme }) => ({
					padding: theme.spacing(2),
				}),
			},
		},
		MuiCardContent: {
			styleOverrides: {
				root: ({ theme }) => ({
					padding: theme.spacing(2),
				}),
			},
		},
		MuiIconButton: {
			defaultProps: {
				disableRipple: true,
			},
		},
		MuiInputLabel: {
			styleOverrides: {
				root: ({ theme }) => ({
					color: theme.palette.text.primary,
					fontWeight: 'bold',
				}),
				asterisk: ({ theme }) => ({
					color: theme.palette.error.main,
				}),
			},
			defaultProps: {
				shrink: true,
			},
		},
		MuiListItem: {
			styleOverrides: {
				root: ({ theme }) => ({
					'&:nth-of-type(even)': {
						backgroundColor: theme.palette.secondary.light,
					},
				}),
			},
		},
		MuiOutlinedInput: {
			styleOverrides: {
				root: ({ theme }) => ({
					marginTop: theme.spacing(3),
				}),
			},
			defaultProps: {
				notched: false,
			},
		},
		MuiPaper: {
			styleOverrides: {
				root: ({ theme }) => ({
					borderRadius: theme.spacing(3),
					padding: theme.spacing(4),
				}),
			},
		},
		MuiSlider: {
			defaultProps: {
				track: false,
			},
			styleOverrides: {
				root: ({ theme }) => ({
					'& .MuiSlider-rail': {
						height: theme.spacing(4),
						borderRadius: theme.spacing(3),
						outline: 'none',
						opacity: 0.7,
						WebkitTransition: '0.2s',
						transition: 'opacity 0.2s',
						'&:focus, &:hover': {
							opacity: 1,
						},
					},
					'& .MuiSlider-thumb': {
						WebkitAppearance: 'none',
						appearance: 'none',
						width: theme.spacing(6),
						height: theme.spacing(6),
						borderRadius: '50%',
						border: `2px solid`,
						background: theme.palette.common.white,
						cursor: 'pointer',
					},
				}),
			},
		},
		MuiTab: {
			styleOverrides: {
				root: ({ theme }) => ({
					color: theme.palette.info.main,
					'&.Mui-selected': {
						fontWeight: 'bold',
						color: theme.palette.common.white,
						backgroundColor: theme.palette.info.main,
						borderRadius: theme.spacing(3),
					},
				}),
			},
		},
		MuiTabs: {
			defaultProps: {
				TabIndicatorProps: {
					sx: { display: 'none', transition: 'none' },
				},
			},
		},
	},
});

export default theme;
