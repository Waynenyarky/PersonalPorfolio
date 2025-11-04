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
		dialogRef.current?.focus();
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900';

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 overflow-y-auto"
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
				className={`relative max-w-md w-full ${bgCard} border ${borderBase} rounded-2xl shadow-2xl overflow-hidden focus:outline-none animate-fade-in-up ${focusRing}`}
				onClick={(e) => e.stopPropagation()}
			>
				{/* Close Button */}
				<button
					aria-label="Close modal"
					className={`absolute top-4 right-4 w-8 h-8 rounded-lg border ${borderBase} hover:border-orange-500 flex items-center justify-center transition-all duration-200 ${textPrimary} hover:bg-orange-500/10 ${focusRing}`}
					onClick={onClose}
				>
					<X size={16} />
				</button>

				{/* Content */}
				<div className="p-8 sm:p-10 text-center">
					{/* Success Icon */}
					<div className="mb-6 flex justify-center">
						<div className="relative">
							<div className="w-20 h-20 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 animate-scale-in">
								<CheckCircle className="text-white" size={40} strokeWidth={2.5} />
							</div>
							{/* Pulse animation rings */}
							<div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" />
							<div className="absolute inset-0 rounded-full bg-green-500/10 animate-ping" style={{ animationDelay: '0.5s' }} />
						</div>
					</div>

					{/* Title */}
					<h2 id="success-title" className={`text-2xl sm:text-3xl font-bold mb-3 ${textPrimary}`}>
						{t(language, 'reviewSuccess.title') || 'Thank You!'}
					</h2>

					{/* Message */}
					<p className={`${textSecondary} text-base sm:text-lg mb-6 leading-relaxed`}>
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
						<div className="mb-6 p-4 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-950/30 dark:via-amber-950/20 dark:to-yellow-950/30 rounded-xl border border-orange-200/50 dark:border-orange-900/30">
							<p className={`text-sm font-semibold mb-2 ${textSecondary}`}>
								{t(language, 'reviewSuccess.ratingLabel') || 'Your Rating'}
							</p>
							<div className="flex items-center justify-center gap-1">
								{[...Array(5)].map((_, i) => (
									<Star
										key={i}
										className={i < rating ? 'text-orange-500 fill-orange-500' : 'text-gray-300 dark:text-gray-600'}
										size={24}
									/>
								))}
								<span className={`ml-2 text-lg font-bold ${textPrimary}`}>{rating}/5</span>
							</div>
						</div>
					)}

					{/* Additional Message */}
					<p className={`${textSecondary} text-sm mb-6`}>
						{t(language, 'reviewSuccess.additional') || 'Your feedback helps us improve and serve you better.'}
					</p>

					{/* Action Button */}
					<button
						onClick={onClose}
						className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
					>
						{t(language, 'reviewSuccess.close') || 'Close'}
					</button>
				</div>
			</div>
		</div>
	);
}

