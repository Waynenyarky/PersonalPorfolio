import type { ReactNode } from 'react';

type Props = {
	label?: string;
	title?: ReactNode;
	subtitle?: ReactNode;
	align?: 'left' | 'center';
	textPrimaryClass?: string;
	textSecondaryClass?: string;
};

export default function SectionHeader({ label, title, subtitle, align = 'center', textPrimaryClass = '', textSecondaryClass = '' }: Props) {
	return (
		<div className={`${align === 'center' ? 'text-center' : ''} mb-10 sm:mb-12 lg:mb-16`}>
			{label && (
				<div className={`${align === 'center' ? 'inline-block' : ''} mb-4`}>
					<span className={`text-xs font-semibold tracking-wider uppercase ${textSecondaryClass}`}>{label}</span>
					<div className={`h-0.5 w-10 bg-orange-500 mt-2 ${align === 'center' ? 'mx-auto' : ''}`}></div>
				</div>
			)}
			{title && (
				<h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 ${textPrimaryClass}`}>{title}</h2>
			)}
			{subtitle && (
				<p className={`${textSecondaryClass} text-sm sm:text-base max-w-2xl ${align === 'center' ? 'mx-auto' : ''} px-4 sm:px-0`}>{subtitle}</p>
			)}
		</div>
	);
}


