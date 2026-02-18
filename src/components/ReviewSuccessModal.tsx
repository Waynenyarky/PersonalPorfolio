import { useEffect, useRef } from 'react';
import { CheckCircle, X, Star } from 'lucide-react';
import { useTheme } from '../theme/useTheme';
import { t, type Language } from '../i18n/translations';

type Props = {
	isOpen: boolean;
	onClose: () => void;
	language: Language;
	reviewerName?: string;
	rating?: number;
};

export default function ReviewSuccessModal({ isOpen, onClose, language, reviewerName, rating }: Props) {
	const { theme } = useTheme();
	const dialogRef = useRef<HTMLDivElement>(null);

	const textPrimary = theme === 'dark' ? 'text-white' : 'text-black';
	const textSecondary = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
	const bgCard = theme === 'dark' ? 'bg-gray-900' : 'bg-white';
	const borderBase = theme === 'dark' ? 'border-gray-800' : 'border-gray-200';

	useEffect(() => {
		if (!isOpen) return;
		const prevOverflow = document.body.style.overflow;
		const prevPaddingRight = document.body.style.paddingRight;
		const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
		document.body.style.overflow = 'hidden';
		document.body.style.paddingRight = scrollBarWidth ? `${scrollBarWidth}px` : '';
		const id = requestAnimationFrame(() => {
			dialogRef.current?.focus({ preventScroll: true });
		});
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
		};
		window.addEventListener('keydown', onKey);
		return () => {
			cancelAnimationFrame(id);
			window.removeEventListener('keydown', onKey);
			document.body.style.overflow = prevOverflow;
			document.body.style.paddingRight = prevPaddingRight;
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900';

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center px-3 sm:px-4 py-4 sm:py-8 overflow-y-auto"
			role="dialog"
			aria-modal="true"
			aria-labelledby="success-title"
			onClick={onClose}
		>
			{/* Backdrop */}
			<div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />
			
			{/* Modal Content */}
			<div
				ref={dialogRef}
				tabIndex={-1}
				role="document"
				className={`relative max-w-md w-full ${bgCard} border ${borderBase} rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden focus:outline-none animate-fade-in-up ${focusRing}`}
				onClick={(e) => e.stopPropagation()}
			>
				{/* Close Button */}
				<button
					aria-label="Close modal"
					className={`absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 sm:w-9 sm:h-9 rounded-lg border ${borderBase} hover:border-orange-500 flex items-center justify-center transition-all duration-200 ${textPrimary} hover:bg-orange-500/10 ${focusRing}`}
					onClick={onClose}
				>
					<X size={14} className="sm:w-4 sm:h-4" />
				</button>

				{/* Content */}
				<div className="p-6 sm:p-8 lg:p-10 text-center">
					{/* Success Icon */}
					<div className="mb-4 sm:mb-6 flex justify-center">
						<div className="relative">
							<div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 animate-scale-in">
								<CheckCircle className="text-white" size={32} strokeWidth={2.5} style={{ width: 'clamp(28px, 8vw, 40px)', height: 'clamp(28px, 8vw, 40px)' }} />
							</div>
							{/* Pulse animation rings */}
							<div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" />
							<div className="absolute inset-0 rounded-full bg-green-500/10 animate-ping" style={{ animationDelay: '0.5s' }} />
						</div>
					</div>

					{/* Title */}
					<h2 id="success-title" className={`text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 ${textPrimary}`}>
						{t(language, 'reviewSuccess.title') || 'Thank You!'}
					</h2>

					{/* Message */}
					<p className={`${textSecondary} text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 leading-relaxed`}>
						{reviewerName ? (
							<>
								<span className="font-semibold text-orange-500">{reviewerName}</span>, {t(language, 'reviewSuccess.message') || 'your review has been submitted successfully!'}
							</>
						) : (
							t(language, 'reviewSuccess.message') || 'Your review has been submitted successfully!'
						)}
					</p>

					{/* Rating Display */}
					{rating && (
						<div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-950/30 dark:via-amber-950/20 dark:to-yellow-950/30 rounded-xl border border-orange-200/50 dark:border-orange-900/30">
							<p className={`text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 ${textSecondary}`}>
								{t(language, 'reviewSuccess.ratingLabel') || 'Your Rating'}
							</p>
							<div className="flex items-center justify-center gap-0.5 sm:gap-1">
								{[...Array(5)].map((_, i) => (
									<Star
										key={i}
										className={i < rating ? 'text-orange-500 fill-orange-500' : 'text-gray-300 dark:text-gray-600'}
										size={20}
										style={{ width: 'clamp(18px, 5vw, 24px)', height: 'clamp(18px, 5vw, 24px)' }}
									/>
								))}
								<span className={`ml-1.5 sm:ml-2 text-base sm:text-lg font-bold ${textPrimary}`}>{rating}/5</span>
							</div>
						</div>
					)}

					{/* Additional Message */}
					<p className={`${textSecondary} text-xs sm:text-sm mb-4 sm:mb-6`}>
						{t(language, 'reviewSuccess.additional') || 'Your feedback helps us improve and serve you better.'}
					</p>

					{/* Action Button */}
					<button
						onClick={onClose}
						className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base"
					>
						{t(language, 'reviewSuccess.close') || 'Close'}
					</button>
				</div>
			</div>
		</div>
	);
}

