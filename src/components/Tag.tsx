import { HTMLAttributes } from 'react';

type Props = HTMLAttributes<HTMLSpanElement> & {
	borderBaseClass?: string;
	textSecondaryClass?: string;
};

export default function Tag({ borderBaseClass = 'border-gray-200 dark:border-gray-800', textSecondaryClass = 'text-gray-600 dark:text-gray-300', className = '', ...props }: Props) {
	return (
		<span className={`px-3 py-1 rounded-lg text-[11px] font-medium tracking-wide border ${borderBaseClass} ${textSecondaryClass} bg-gray-50 dark:bg-gray-800/50 hover:border-orange-500/50 transition-colors ${className}`} {...props} />
	);
}


