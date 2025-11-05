import type { HTMLAttributes } from 'react';

type Props = HTMLAttributes<HTMLSpanElement> & {
	color?: 'neutral' | 'orange' | 'blue' | 'green';
};

const colors = {
	neutral: 'bg-white/95 dark:bg-gray-900/95 text-gray-800 dark:text-gray-200',
	orange: 'bg-white/95 dark:bg-gray-900/95 text-orange-600 dark:text-orange-400',
	blue: 'bg-white/95 dark:bg-gray-900/95 text-blue-600 dark:text-blue-400',
	green: 'bg-white/95 dark:bg-gray-900/95 text-green-600 dark:text-green-400',
};

export default function Badge({ color = 'neutral', className = '', ...props }: Props) {
	return (
		<span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase backdrop-blur-sm shadow-lg ${colors[color]} ${className}`} {...props} />
	);
}


