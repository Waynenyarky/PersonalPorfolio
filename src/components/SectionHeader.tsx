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
		<div className={`${align === 'center' ? 'text-center' : ''} mb-12 sm:mb-14 lg:mb-20`}>
			{label && (
				<div className={`${align === 'center' ? 'inline-block' : ''} mb-5`}>
					<span className={`text-xs font-semibold tracking-[0.2em] uppercase ${textSecondaryClass}`}>{label}</span>
					<div className={`h-0.5 w-12 bg-orange-500 mt-2.5 ${align === 'center' ? 'mx-auto' : ''}`}></div>
				</div>
			)}
			{title && (
				<h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-5 tracking-tight leading-tight ${textPrimaryClass}`}>{title}</h2>
			)}
			{subtitle && (
				<p className={`${textSecondaryClass} text-sm sm:text-base max-w-2xl leading-relaxed ${align === 'center' ? 'mx-auto' : ''} px-4 sm:px-0`}>{subtitle}</p>
			)}
		</div>
	);
}


