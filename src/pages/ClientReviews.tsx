import { useEffect, useRef, useState } from 'react';
import { Star, Quote, Send, CheckCircle } from 'lucide-react';
import { useTheme } from '../theme/useTheme';
import { t, type Language } from '../i18n/translations';
import ReviewSuccessModal from '../components/ReviewSuccessModal';
import EmailServiceUnavailableModal from '../components/EmailServiceUnavailableModal';
import ReviewServiceUnavailableModal from '../components/ReviewServiceUnavailableModal';
import ReviewSentButNotDisplayedModal from '../components/ReviewSentButNotDisplayedModal';
import SectionHeader from '../components/SectionHeader';
import Card from '../components/Card';

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
    // Keeping prop for compatibility with parent, but not used locally anymore
    visibleSections?: Set<string>;
};

export default function ClientReviews({ language, visibleSections: _visibleSections }: Props) {
	const { theme } = useTheme();
	const [showReviewForm, setShowReviewForm] = useState(false);
	const [reviews, setReviews] = useState<Review[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const bcRef = useRef<BroadcastChannel | null>(null);
	const sectionRef = useRef<HTMLElement | null>(null);
	const [sectionVisible, setSectionVisible] = useState(false);
	const [showSuccessModal, setShowSuccessModal] = useState(false);
	const [showEmailUnavailableModal, setShowEmailUnavailableModal] = useState(false);
	const [showServiceUnavailableModal, setShowServiceUnavailableModal] = useState(false);
	const [showReviewSentModal, setShowReviewSentModal] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
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
				if (!resp.ok) {
					setIsLoading(false);
					return;
				}
				const data = await resp.json();
				if (Array.isArray(data)) setReviews(data as Review[]);
			} catch {
				// Silently fail - reviews will show empty state
			} finally {
				setIsLoading(false);
			}
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

	// Local visibility observer to ensure animations run even if parent didn't observe yet
	useEffect(() => {
		if (!sectionRef.current) return;
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setSectionVisible(true);
						observer.disconnect();
					}
				});
			},
			{ root: null, rootMargin: '0px', threshold: 0.1 }
		);
		observer.observe(sectionRef.current);
		return () => observer.disconnect();
	}, []);

	const textPrimary = theme === 'dark' ? 'text-white' : 'text-black';
	const textSecondary = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
	const bgSection = theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50';
	const bgCard = theme === 'dark' ? 'bg-gray-900' : 'bg-white';
	const borderBase = theme === 'dark' ? 'border-gray-800' : 'border-gray-200';
	const inputBg = theme === 'dark' ? 'bg-gray-900/50' : 'bg-white';

	return (
		<section id="reviews" data-section="reviews" ref={sectionRef} className={`py-12 sm:py-16 lg:py-20 ${bgSection}`}>
			<div className="max-w-7xl mx-auto px-4 sm:px-6">
			{/* Header Section - Fade in when visible */}
			<div className={`${sectionVisible ? 'animate-fade-in-up reviews-animate-delay-05' : ''}`}>
				<SectionHeader
					label={t(language, 'reviews.section')}
					title={<><span className={`${textPrimary}`}>{t(language, 'reviews.heading1')} </span><span className="text-orange-500">{t(language, 'reviews.heading2')}</span></>}
					subtitle={t(language, 'reviews.subtitle')}
					align="center"
					textPrimaryClass={textPrimary}
					textSecondaryClass={textSecondary}
				/>
			</div>
				<Card className={`mt-4 sm:mt-6 max-w-4xl mx-auto text-left mb-8 sm:mb-10 p-5 sm:p-6 lg:p-8 ${sectionVisible ? 'animate-fade-in-up' : ''}`} bgCardClass={bgCard} borderBaseClass={borderBase}>
                    <h3 className={`text-sm font-semibold mb-4 sm:mb-5 ${textPrimary}`}>{t(language, 'reviews.howItWorks')}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                        <div className={`flex items-start gap-3 p-5 sm:p-6 rounded-lg border ${borderBase} transition-all duration-300 hover:border-orange-500 hover:shadow-md`}>
                            <CheckCircle className="text-orange-500 shrink-0 mt-0.5" size={20} />
                            <p className={`${textSecondary} text-sm leading-relaxed`}>{t(language, 'reviews.point1')}</p>
                        </div>
                        <div className={`flex items-start gap-3 p-5 sm:p-6 rounded-lg border ${borderBase} transition-all duration-300 hover:border-orange-500 hover:shadow-md`}>
                            <CheckCircle className="text-orange-500 shrink-0 mt-0.5" size={20} />
                            <p className={`${textSecondary} text-sm leading-relaxed`}>{t(language, 'reviews.point2')}</p>
                        </div>
                        <div className={`flex items-start gap-3 p-5 sm:p-6 rounded-lg border ${borderBase} transition-all duration-300 hover:border-orange-500 hover:shadow-md`}>
                            <CheckCircle className="text-orange-500 shrink-0 mt-0.5" size={20} />
                            <p className={`${textSecondary} text-sm leading-relaxed`}>{t(language, 'reviews.point3')}</p>
                        </div>
                    </div>
                </Card>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8 mt-8 sm:mt-10">
					{isLoading && (
						<Card bgCardClass={bgCard} borderBaseClass={borderBase} className="p-6 col-span-1 sm:col-span-2 lg:col-span-3 text-center">
							<p className={`${textSecondary} text-sm`}>Loading reviews...</p>
						</Card>
					)}
					{!isLoading && reviews.length === 0 && (
						<Card bgCardClass={bgCard} borderBaseClass={borderBase} className="p-6 col-span-1 sm:col-span-2 lg:col-span-3 text-center">
							<p className={`${textSecondary} text-sm`}>No reviews yet. Be the first to share your experience.</p>
						</Card>
					)}
					{!isLoading && reviews.map((testimonial, index) => (
					<div
							key={`review-${testimonial.id || index}`}
						className={`${bgCard} rounded-lg p-6 border ${borderBase} transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${sectionVisible ? 'animate-fade-in-up' : ''} ${sectionVisible ? `reviews-card-delay-${Math.min(index, 19)}` : ''}`}
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

			<div className={`max-w-2xl mx-auto ${bgCard} border ${borderBase} rounded-lg p-4 sm:p-6 transition-all duration-300 hover:shadow-lg ${sectionVisible ? 'animate-fade-in-up reviews-animate-delay-12' : ''}`}>
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
								setIsSubmitting(true);
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
										
										// Check if email was sent successfully - email failure doesn't prevent saving
                                        if (json.email_sent === false) {
											setShowEmailUnavailableModal(true);
										} else {
											setShowSuccessModal(true);
                                            try {
                                                const bc = new BroadcastChannel('reviews');
                                                bc.postMessage({ type: 'submitted', rating: reviewData.rating });
                                                bc.close();
                                            } catch {}
										}
									}
								} catch (error: any) {
									// Check if it's a network/server error (server is down)
									const isNetworkError = 
										error?.message?.toLowerCase().includes('failed to fetch') ||
										error?.message?.toLowerCase().includes('networkerror') ||
										error?.message?.toLowerCase().includes('network error') ||
										error?.message?.toLowerCase().includes('load failed') ||
										error?.name === 'TypeError' ||
										error?.name === 'NetworkError' ||
										error?.code === 'ERR_NETWORK' ||
										error?.code === 'ECONNABORTED';
									
									if (isNetworkError) {
										// Server is down - show modal with option to send email
										setShowServiceUnavailableModal(true);
									} else {
										// Other error - show service unavailable
										setShowServiceUnavailableModal(true);
									}
								} finally {
									setIsSubmitting(false);
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
								disabled={isSubmitting}
								className={`w-full px-6 py-3 ${isSubmitting ? 'bg-orange-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'} text-white font-semibold rounded-lg transition-all duration-300 shadow-md ${isSubmitting ? '' : 'hover:shadow-lg hover:scale-105'} flex items-center justify-center gap-2`}
							>
								<Send size={18} className={isSubmitting ? 'animate-spin' : ''} />
								{isSubmitting ? 'Submitting Review...' : t(language, 'reviewForm.submit')}
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

			{/* Email Service Unavailable Modal */}
			<EmailServiceUnavailableModal
				isOpen={showEmailUnavailableModal}
				onClose={() => setShowEmailUnavailableModal(false)}
			/>

			{/* Review Service Unavailable Modal */}
			<ReviewServiceUnavailableModal
				isOpen={showServiceUnavailableModal}
				onClose={() => {
					setShowServiceUnavailableModal(false);
					setReviewData({ name: '', role: '', company: '', email: '', rating: 5, review: '' });
					setShowReviewForm(false);
				}}
				reviewData={reviewData}
				onEmailSent={() => {
					setSubmittedReviewerName(reviewData.name);
					setSubmittedRating(reviewData.rating);
					setReviewData({ name: '', role: '', company: '', email: '', rating: 5, review: '' });
					setShowReviewForm(false);
					setShowServiceUnavailableModal(false);
					setShowReviewSentModal(true);
                    try {
                        const bc = new BroadcastChannel('reviews');
                        bc.postMessage({ type: 'submitted', rating: reviewData.rating });
                        bc.close();
                    } catch {}
				}}
			/>

			{/* Review Sent But Not Displayed Modal (Server Down) */}
			<ReviewSentButNotDisplayedModal
				isOpen={showReviewSentModal}
				onClose={() => setShowReviewSentModal(false)}
				reviewerName={submittedReviewerName}
				rating={submittedRating}
			/>
		</section>
	);
}


