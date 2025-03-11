import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontFamily: {
				zen: ['"Zen Antique"', 'serif'], 
				ubuntu:[ '"Ubuntu"', 'serif'],
				aboreto:['"Aboreto"','serif'],
				cool: ['"ZCOOL XiaoWei"', 'sans-serif'], 
			  },
		}
	},

	plugins: [typography, forms, containerQueries]
} satisfies Config;
