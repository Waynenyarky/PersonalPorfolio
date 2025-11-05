import { HTMLAttributes } from 'react';

type Props = HTMLAttributes<HTMLDivElement> & {
	interactive?: boolean;
	borderBaseClass?: string;
	bgCardClass?: string;
};

export default function Card({ interactive = false, borderBaseClass = 'border-gray-200 dark:border-gray-800', bgCardClass = 'bg-white dark:bg-gray-900', className = '', ...props }: Props) {
	return (
		<div
			className={`${bgCardClass} rounded-lg border ${borderBaseClass} ${interactive ? 'transition-all duration-300 hover:border-orange-500 hover:shadow-xl hover:-translate-y-1' : ''} ${className}`}
			{...props}
		/>
	);
}


