import '@mui/material/styles';

declare module '@mui/material/styles' {
	interface Palette {
		light: Palette['primary'];
		dark: Palette['primary'];
	}

	interface PaletteOptions {
		light?: PaletteOptions['primary'];
		dark?: PaletteOptions['primary'];
	}
}

declare module '@mui/material/AppBar' {
	interface AppBarPropsColorOverrides {
		light: true;
		dark: true;
	}
}

declare module '@mui/material/Button' {
	interface ButtonPropsColorOverrides {
		light: true;
		dark: true;
	}
}

declare module '@mui/material/IconButton' {
	interface IconButtonPropsColorOverrides {
		light: true;
		dark: true;
	}
}
