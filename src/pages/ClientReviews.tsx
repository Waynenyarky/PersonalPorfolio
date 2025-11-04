import { useEffect, useRef, useState } from 'react';
import { Star, Quote, Send } from 'lucide-react';
import { useTheme } from '../theme/useTheme';
import { t, type Language } from '../i18n/translations';
import ReviewSuccessModal from '../components/ReviewSuccessModal';

type Review = {
	id: number;
	created_at: string;
	name: string;
	role: string;
	company: string;
	email: string | null;
	rating: number;
	review: string;
};

type Props = {
	language: Language;
	visibleSections: Set<string>;
};

export default function ClientReviews({ language, visibleSections }: Props) {
	const { theme } = useTheme();
	const [showReviewForm, setShowReviewForm] = useState(false);
	const [reviews, setReviews] = useState<Review[]>([]);
	const bcRef = useRef<BroadcastChannel | null>(null);
	const [showSuccessModal, setShowSuccessModal] = useState(false);
	const [submittedReviewerName, setSubmittedReviewerName] = useState<string>('');
	const [submittedRating, setSubmittedRating] = useState<number>(5);
	const [reviewData, setReviewData] = useState({
		name: '',
		role: '',
		company: '',
		email: '',
		rating: 5,
		review: ''
	});

	useEffect(() => {
		const fetchReviews = async () => {
			try {
				const resp = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/reviews/`);
				if (!resp.ok) return;
				const data = await resp.json();
				if (Array.isArray(data)) setReviews(data as Review[]);
			} catch {}
		};
		fetchReviews();
	}, []);

	useEffect(() => {
		bcRef.current = new BroadcastChannel('reviews');
		bcRef.current.onmessage = (evt: MessageEvent) => {
			const msg = evt.data as { type?: string; id?: number };
			if (msg?.type === 'deleted' && typeof msg.id === 'number') {
				setReviews((prev) => prev.filter((r) => r.id !== msg.id));
			}
		};
		const onFocus = () => {
			// refresh on tab focus to stay in sync
			fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/reviews/`)
				.then((r) => (r.ok ? r.json() : null))
				.then((d) => { if (Array.isArray(d)) setReviews(d as Review[]); })
				.catch(() => {});
		};
		window.addEventListener('focus', onFocus);
		return () => {
			try { bcRef.current?.close(); } catch {}
			window.removeEventListener('focus', onFocus);
		};
	}, []);

	const textPrimary = theme === 'dark' ? 'text-white' : 'text-black';
	const textSecondary = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
	const bgSection = theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50';
	const bgCard = theme === 'dark' ? 'bg-gray-900' : 'bg-white';
	const borderBase = theme === 'dark' ? 'border-gray-800' : 'border-gray-200';
	const inputBg = theme === 'dark' ? 'bg-gray-900/50' : 'bg-white';

	return (
		<section id="reviews" data-section="reviews" className={`py-16 sm:py-24 lg:py-32 ${bgSection} ${visibleSections.has('reviews') ? 'animate-fade-in-up' : 'opacity-0'}`}>
			<div className="max-w-7xl mx-auto px-4 sm:px-6">
				<div className={`text-center mb-10 sm:mb-12 lg:mb-16 ${visibleSections.has('reviews') ? 'animate-fade-in-up' : 'opacity-0'}`}>
					<div className="inline-block mb-4">
						<span className={`text-xs font-semibold tracking-wider uppercase ${textSecondary}`}>{t(language, 'reviews.section')}</span>
						<div className="h-0.5 w-10 bg-orange-500 mt-2 mx-auto"></div>
					</div>
					<h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 ${textPrimary}`}>
						{t(language, 'reviews.heading1')} <span className="text-orange-500">{t(language, 'reviews.heading2')}</span>
					</h2>
					<p className={`${textSecondary} text-sm sm:text-base max-w-2xl mx-auto px-4 sm:px-0 mb-4 sm:mb-6`}>
						{t(language, 'reviews.subtitle')}
					</p>
					<div className={`mt-4 sm:mt-6 max-w-3xl mx-auto ${bgCard} border ${borderBase} rounded-lg p-4 sm:p-5 text-left transition-all duration-300 hover:shadow-lg ${visibleSections.has('reviews') ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
						<h3 className={`text-sm font-semibold mb-2 ${textPrimary}`}>{t(language, 'reviews.howItWorks')}</h3>
						<ul className={`text-sm list-disc pl-5 space-y-1 ${textSecondary}`}>
							<li>{t(language, 'reviews.point1')}</li>
							<li>{t(language, 'reviews.point2')}</li>
							<li>{t(language, 'reviews.point3')}</li>
						</ul>
					</div>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
					{reviews.map((testimonial, index) => (
						<div
							key={index}
							className={`${bgCard} rounded-lg p-6 border ${borderBase} transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${visibleSections.has('reviews') ? 'animate-fade-in-up' : 'opacity-0'}`}
							style={{ animationDelay: `${0.3 + index * 0.1}s` }}
						>
							<div className="flex items-center gap-1 mb-4">
								{[...Array(testimonial.rating)].map((_, i) => (
									<Star key={i} className="text-orange-500 fill-orange-500" size={16} />
								))}
							</div>
							<Quote className={`${textSecondary} mb-4 opacity-50`} size={24} />
							<p className={`${textSecondary} mb-4 leading-relaxed text-sm`}>{testimonial.review}</p>
							<div className="pt-4 border-t border-gray-200 dark:border-gray-800">
								<p className={`font-semibold ${textPrimary} text-sm`}>{testimonial.name}</p>
								<p className={`${textSecondary} text-xs`}>{testimonial.role} at {testimonial.company}</p>
							</div>
						</div>
					))}
				</div>

				<div className={`max-w-2xl mx-auto ${bgCard} border ${borderBase} rounded-lg p-4 sm:p-6 transition-all duration-300 hover:shadow-lg ${visibleSections.has('reviews') ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: `${0.5 + reviews.length * 0.1}s` }}>
					<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4">
						<h3 className={`text-lg sm:text-xl font-bold ${textPrimary}`}>{t(language, 'reviewForm.title')}</h3>
						<button
							onClick={() => setShowReviewForm(!showReviewForm)}
							className={`w-full sm:w-auto px-4 py-2 ${showReviewForm ? 'bg-gray-200 dark:bg-gray-700' : 'bg-orange-500 hover:bg-orange-600'} text-white rounded-lg transition-colors duration-200 text-sm font-semibold`}
						>
							{showReviewForm ? t(language, 'reviewForm.cancel') : t(language, 'reviewForm.leave')}
						</button>
					</div>
					{showReviewForm && (
						<form
							onSubmit={async (e) => {
								e.preventDefault();
								try {
									const resp = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/reviews/`, {
										method: 'POST',
										headers: { 'Content-Type': 'application/json' },
										body: JSON.stringify({
											name: reviewData.name,
											role: reviewData.role,
											company: reviewData.company,
											email: reviewData.email || undefined,
											rating: reviewData.rating,
											review: reviewData.review,
										})
									});
									const json = await resp.json();
									if (!resp.ok) throw new Error(json?.error || 'Failed to submit');
									if (json) {
										setReviews((prev) => [json as Review, ...prev]);
										setSubmittedReviewerName(reviewData.name);
										setSubmittedRating(reviewData.rating);
										setReviewData({ name: '', role: '', company: '', email: '', rating: 5, review: '' });
										setShowReviewForm(false);
										setShowSuccessModal(true);
									}
								} catch (error) {
									alert('There was an error submitting your review. Please try again.');
								}
							}}
							className="space-y-3 sm:space-y-4"
						>
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
								<input
									type="text"
									placeholder={t(language, 'reviewForm.name')}
									value={reviewData.name}
									onChange={(e) => setReviewData({ ...reviewData, name: e.target.value })}
									required
									className={`${inputBg} border ${borderBase} ${textPrimary} rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500`}
								/>
								<input
									type="text"
									placeholder={t(language, 'reviewForm.role')}
									value={reviewData.role}
									onChange={(e) => setReviewData({ ...reviewData, role: e.target.value })}
									required
									className={`${inputBg} border ${borderBase} ${textPrimary} rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500`}
								/>
								<input
									type="text"
									placeholder={t(language, 'reviewForm.company')}
									value={reviewData.company}
									onChange={(e) => setReviewData({ ...reviewData, company: e.target.value })}
									required
									className={`${inputBg} border ${borderBase} ${textPrimary} rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500`}
								/>
							</div>
							<div>
								<input
									type="email"
									placeholder={t(language, 'reviewForm.email')}
									value={reviewData.email}
									onChange={(e) => setReviewData({ ...reviewData, email: e.target.value })}
									className={`w-full ${inputBg} border ${borderBase} ${textPrimary} rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500`}
								/>
							</div>
							<div>
								<label className={`block mb-2 text-sm font-semibold ${textPrimary}`}>{t(language, 'reviewForm.rating')}</label>
								<div className="flex gap-2">
									{[1, 2, 3, 4, 5].map((rating) => (
										<button
											key={rating}
											type="button"
											onClick={() => setReviewData({ ...reviewData, rating })}
											className="transition-transform duration-200 hover:scale-110 rating-star"
											aria-label={`Set rating ${rating}`}
										>
											<Star
												className={reviewData.rating >= rating ? 'text-orange-500 fill-orange-500' : 'text-gray-300 dark:text-gray-600'}
												size={24}
												aria-hidden="true"
											/>
										</button>
									))}
								</div>
							</div>
							<div>
								<textarea
									placeholder={t(language, 'reviewForm.placeholder')}
									value={reviewData.review}
									onChange={(e) => setReviewData({ ...reviewData, review: e.target.value })}
									required
									rows={4}
									className={`w-full ${inputBg} border ${borderBase} ${textPrimary} rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none`}
								/>
							</div>
							<button
								type="submit"
								className="w-full px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2"
							>
								<Send size={18} />
								{t(language, 'reviewForm.submit')}
							</button>
						</form>
					)}
				</div>
			</div>

			{/* Success Modal */}
			<ReviewSuccessModal
				isOpen={showSuccessModal}
				onClose={() => setShowSuccessModal(false)}
				language={language}
				reviewerName={submittedReviewerName}
				rating={submittedRating}
			/>
		</section>
	);
}


