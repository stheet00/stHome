import { theme } from '@svelteuidev/core';

export const MyXlCardShadow = {
    '$$gray': theme.colors['gray200'].value,
    boxShadow: '0 1px 2px $$gray',
    transition: 'all 0.2s ease-in-out',
    width: '291px',
    '&:hover': {
        boxShadow: '0 1px 3px $$gray',
    }};