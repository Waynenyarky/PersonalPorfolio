import { useEffect, useMemo, useRef, useState } from 'react';
import { Trash2, LockKeyhole, KeyRound, ShieldCheck, Calendar, Star, Mail, Phone, Building2, Briefcase, Clock, DollarSign, MessageSquare, User, CalendarDays } from 'lucide-react';

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

type Booking = {
  id: number;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  project_type: string;
  project_description: string;
  timeline: string;
  budget: string | null;
  preferred_contact: string;
  preferred_date: string | null;
  preferred_time: string | null;
  additional_notes: string | null;
};

export default function AdminReviews() {
  const [adminKey, setAdminKey] = useState<string>('');
  const [enteredKey, setEnteredKey] = useState<string>('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingBookings, setLoadingBookings] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'reviews' | 'bookings'>('reviews');

  const apiBase = useMemo(() => import.meta.env.VITE_API_BASE_URL || '', []);
  const bcRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    bcRef.current = new BroadcastChannel('reviews');
    return () => {
      try { bcRef.current?.close(); } catch {}
    };
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const resp = await fetch(`${apiBase}/api/reviews/`);
        if (!resp.ok) throw new Error('Failed to load reviews');
        const data = await resp.json();
        setReviews(Array.isArray(data) ? data : []);
      } catch (e: any) {
        setError(e?.message || 'Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [apiBase]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoadingBookings(true);
        const resp = await fetch(`${apiBase}/api/bookings/`);
        if (!resp.ok) throw new Error('Failed to load bookings');
        const data = await resp.json();
        setBookings(Array.isArray(data) ? data : []);
      } catch (e: any) {
        // Silently handle booking errors
      } finally {
        setLoadingBookings(false);
      }
    };
    fetchBookings();
  }, [apiBase]);

  const confirmAndDeleteReview = async (id: number) => {
    if (!adminKey) {
      alert('Admin key required.');
      return;
    }
    const ok = confirm('Delete this review? This cannot be undone.');
    if (!ok) return;
    try {
      const resp = await fetch(`${apiBase}/api/reviews/${id}/`, {
        method: 'DELETE',
        headers: { 'X-Admin-Key': adminKey },
      });
      if (resp.status === 204) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
        try { bcRef.current?.postMessage({ type: 'deleted', id }); } catch {}
      } else if (resp.status === 403) {
        alert('Unauthorized: invalid admin key.');
      } else if (resp.status === 404) {
        alert('Review not found.');
      } else {
        alert('Failed to delete review.');
      }
    } catch {
      alert('Network error.');
    }
  };

  const confirmAndDeleteBooking = async (id: number) => {
    if (!adminKey) {
      alert('Admin key required.');
      return;
    }
    const ok = confirm('Delete this booking? This cannot be undone.');
    if (!ok) return;
    try {
      const resp = await fetch(`${apiBase}/api/bookings/${id}/`, {
        method: 'DELETE',
        headers: { 'X-Admin-Key': adminKey },
      });
      if (resp.status === 204) {
        setBookings((prev) => prev.filter((b) => b.id !== id));
      } else if (resp.status === 403) {
        alert('Unauthorized: invalid admin key.');
      } else if (resp.status === 404) {
        alert('Booking not found.');
      } else {
        alert('Failed to delete booking.');
      }
    } catch {
      alert('Network error.');
    }
  };

  const formatProjectType = (type: string) => {
    const map: Record<string, string> = {
      'web-app': 'Web Application',
      'mobile-app': 'Mobile Application',
      'e-commerce': 'E-Commerce Platform',
      'landing-page': 'Landing Page',
      'api-development': 'API Development',
      'database-design': 'Database Design',
      'ui-ux-design': 'UI/UX Design',
      'full-stack': 'Full-Stack Development',
      'maintenance': 'Maintenance & Support',
      'consulting': 'Consulting',
      'other': 'Other'
    };
    return map[type] || type;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-3 mb-6">
          <ShieldCheck className="text-orange-500" size={24} />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin • Reviews & Bookings</h1>
        </div>

        {/* Admin Gate */}
        {!adminKey && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2 text-gray-700 dark:text-gray-200">
              <LockKeyhole size={18} />
              <span className="font-semibold">Admin Access Required</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Enter the Admin Key to manage reviews. Do not share this key.
            </p>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2">
                <KeyRound size={16} className="text-gray-500" />
                <input
                  value={enteredKey}
                  onChange={(e) => setEnteredKey(e.target.value)}
                  placeholder="Enter Admin Key"
                  type="password"
                  className="w-full bg-transparent outline-none text-sm text-gray-900 dark:text-white"
                />
              </div>
              <button
                onClick={() => setAdminKey(enteredKey.trim())}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-sm font-semibold"
              >
                Unlock
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 font-semibold text-sm transition-colors flex items-center gap-2 ${
              activeTab === 'reviews'
                ? 'text-orange-500 border-b-2 border-orange-500'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <Star size={16} />
            Reviews ({reviews.length})
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 font-semibold text-sm transition-colors flex items-center gap-2 ${
              activeTab === 'bookings'
                ? 'text-orange-500 border-b-2 border-orange-500'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <Calendar size={16} />
            Appointments ({bookings.length})
          </button>
        </div>

        {/* Reviews Table */}
        {activeTab === 'reviews' && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
            {/* Professional Header */}
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-950/30 dark:via-amber-950/30 dark:to-yellow-950/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                      <Star className="text-white" size={22} />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                      {loading ? 'Loading Reviews…' : `${reviews.length} Review${reviews.length !== 1 ? 's' : ''}`}
                    </h2>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-medium">
                      Client testimonials and feedback submissions
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              {reviews.map((r, index) => (
                <div key={r.id}>
                  {index > 0 && (
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <div className="bg-white dark:bg-gray-900 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-orange-400 dark:bg-orange-500 rounded-full"></div>
                            <div className="w-8 h-0.5 bg-gradient-to-r from-transparent via-orange-400 dark:via-orange-500 to-transparent"></div>
                            <Star size={12} className="text-orange-400 dark:text-orange-500" />
                            <div className="w-8 h-0.5 bg-gradient-to-r from-transparent via-orange-400 dark:via-orange-500 to-transparent"></div>
                            <div className="w-2 h-2 bg-orange-400 dark:bg-orange-500 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="p-6 hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-all duration-200 border-l-4 border-l-transparent hover:border-l-orange-500">
                  {/* Review Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-md">
                            <User className="text-white" size={20} />
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-orange-500 border-2 border-white dark:border-gray-900 rounded-full flex items-center justify-center">
                            <span className="text-[10px] font-bold text-white">{index + 1}</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{r.name}</h3>
                            {/* Rating Badge */}
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-lg shadow-sm">
                              <Star size={14} className="fill-white" />
                              <span className="text-sm font-bold">{r.rating}</span>
                              <span className="text-xs opacity-90">/ 5</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1.5">
                              <Briefcase size={12} />
                              <span className="font-medium">{r.role}</span>
                            </div>
                            <span className="text-gray-300 dark:text-gray-600">•</span>
                            <div className="flex items-center gap-1.5">
                              <Building2 size={12} />
                              <span className="font-medium">{r.company}</span>
                            </div>
                            <span className="text-gray-300 dark:text-gray-600">•</span>
                            <div className="flex items-center gap-1.5">
                              <Clock size={12} />
                              <span>{new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      disabled={!adminKey}
                      title={adminKey ? 'Delete review' : 'Enter Admin Key to enable'}
                      onClick={() => confirmAndDeleteReview(r.id)}
                      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold border transition-all shadow-sm ${
                        adminKey
                          ? 'border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 hover:shadow-md hover:border-red-300'
                          : 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed bg-gray-50 dark:bg-gray-800'
                      }`}
                    >
                      <Trash2 size={16} />
                      <span className="hidden sm:inline">Remove</span>
                    </button>
                  </div>

                  {/* Client Information Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
                    <div className="group relative overflow-hidden p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10 rounded-xl border border-blue-200/50 dark:border-blue-900/30 hover:border-blue-300 dark:hover:border-blue-800 transition-all">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                          <User className="text-white" size={16} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[10px] font-bold text-blue-700 dark:text-blue-300 mb-1.5 uppercase tracking-wider">Client Name</div>
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">{r.name}</div>
                        </div>
                      </div>
                    </div>
                    <div className="group relative overflow-hidden p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/10 rounded-xl border border-purple-200/50 dark:border-purple-900/30 hover:border-purple-300 dark:hover:border-purple-800 transition-all">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                          <Briefcase className="text-white" size={16} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[10px] font-bold text-purple-700 dark:text-purple-300 mb-1.5 uppercase tracking-wider">Role</div>
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">{r.role}</div>
                        </div>
                      </div>
                    </div>
                    <div className="group relative overflow-hidden p-4 bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/20 dark:to-orange-900/10 rounded-xl border border-orange-200/50 dark:border-orange-900/30 hover:border-orange-300 dark:hover:border-orange-800 transition-all">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                          <Building2 className="text-white" size={16} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[10px] font-bold text-orange-700 dark:text-orange-300 mb-1.5 uppercase tracking-wider">Company</div>
                          <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">{r.company}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rating Display */}
                  <div className="mb-5 p-4 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950/30 dark:via-yellow-950/20 dark:to-orange-950/30 rounded-xl border-2 border-amber-200/60 dark:border-amber-900/40 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
                          <Star className="text-white fill-white" size={18} />
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-amber-900 dark:text-amber-200 mb-1 uppercase tracking-wider">Client Rating</div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={16}
                                  className={i < r.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300 dark:text-gray-600'}
                                />
                              ))}
                            </div>
                            <span className="text-lg font-bold text-amber-900 dark:text-amber-100">
                              {r.rating}.0 / 5.0
                            </span>
                          </div>
                        </div>
                      </div>
                      {r.email && (
                        <div className="text-right">
                          <div className="text-[10px] font-bold text-amber-700 dark:text-amber-300 mb-1 uppercase tracking-wider">Contact</div>
                          <div className="flex items-center gap-1.5 text-xs text-amber-900 dark:text-amber-100">
                            <Mail size={12} />
                            <span className="truncate max-w-[150px]">{r.email}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Review Content */}
                  <div>
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-7 h-7 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                        <MessageSquare className="text-gray-600 dark:text-gray-400" size={14} />
                      </div>
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Client Testimonial</span>
                    </div>
                    <div className="p-5 bg-gradient-to-br from-gray-50 via-slate-50 to-gray-50 dark:from-gray-800/50 dark:via-slate-900/30 dark:to-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 shadow-sm">
                      <div className="relative">
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-500 to-amber-600 rounded-full"></div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap font-medium pl-4 italic">
                          "{r.review}"
                        </p>
                      </div>
                    </div>
                  </div>
                  </div>
                </div>
              ))}
              {!loading && reviews.length === 0 && (
                <div className="p-16 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                    <Star className="text-gray-400 dark:text-gray-500" size={28} />
                  </div>
                  <h3 className="text-base font-bold text-gray-700 dark:text-gray-300 mb-2">No Reviews Found</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-500 max-w-md mx-auto">
                    Client reviews and testimonials will appear here once they submit feedback through the portfolio review system.
                  </p>
                </div>
              )}
              {error && (
                <div className="p-6 mx-6 my-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-xl">
                  <div className="text-sm font-semibold text-red-600 dark:text-red-400">{error}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bookings Table */}
        {activeTab === 'bookings' && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
            {/* Professional Header */}
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-950/30 dark:via-green-950/30 dark:to-teal-950/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                      <CalendarDays className="text-white" size={22} />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                      {loadingBookings ? 'Loading Appointments…' : `${bookings.length} Appointment${bookings.length !== 1 ? 's' : ''}`}
                    </h2>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-medium">
                      Client booking requests and project consultation inquiries
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              {bookings.map((b, index) => (
                <div key={b.id}>
                  {index > 0 && (
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <div className="bg-white dark:bg-gray-900 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-400 dark:bg-emerald-500 rounded-full"></div>
                            <div className="w-8 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 dark:via-emerald-500 to-transparent"></div>
                            <CalendarDays size={12} className="text-emerald-400 dark:text-emerald-500" />
                            <div className="w-8 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 dark:via-emerald-500 to-transparent"></div>
                            <div className="w-2 h-2 bg-emerald-400 dark:bg-emerald-500 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="p-6 hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-all duration-200 border-l-4 border-l-transparent hover:border-l-emerald-500">
                  {/* Client Header with Badge */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md">
                            <User className="text-white" size={20} />
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white dark:border-gray-900 rounded-full flex items-center justify-center">
                            <span className="text-[10px] font-bold text-white">{index + 1}</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{b.name}</h3>
                            <span className="px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-md uppercase tracking-wide">
                              New
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <Clock size={12} />
                            <span>Submitted {new Date(b.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} at {new Date(b.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      disabled={!adminKey}
                      title={adminKey ? 'Delete appointment' : 'Enter Admin Key to enable'}
                      onClick={() => confirmAndDeleteBooking(b.id)}
                      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold border transition-all shadow-sm ${
                        adminKey
                          ? 'border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 hover:shadow-md hover:border-red-300'
                          : 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed bg-gray-50 dark:bg-gray-800'
                      }`}
                    >
                      <Trash2 size={16} />
                      <span className="hidden sm:inline">Remove</span>
                    </button>
                  </div>

                  {/* Contact Information Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
                    <div className="group relative overflow-hidden p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10 rounded-xl border border-blue-200/50 dark:border-blue-900/30 hover:border-blue-300 dark:hover:border-blue-800 transition-all">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                          <Mail className="text-white" size={16} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[10px] font-bold text-blue-700 dark:text-blue-300 mb-1.5 uppercase tracking-wider">Email Address</div>
                          <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">{b.email}</div>
                        </div>
                      </div>
                    </div>
                    <div className="group relative overflow-hidden p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/10 rounded-xl border border-purple-200/50 dark:border-purple-900/30 hover:border-purple-300 dark:hover:border-purple-800 transition-all">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                          <Phone className="text-white" size={16} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[10px] font-bold text-purple-700 dark:text-purple-300 mb-1.5 uppercase tracking-wider">Phone Number</div>
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">{b.phone}</div>
                        </div>
                      </div>
                    </div>
                    {b.company ? (
                      <div className="group relative overflow-hidden p-4 bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/20 dark:to-orange-900/10 rounded-xl border border-orange-200/50 dark:border-orange-900/30 hover:border-orange-300 dark:hover:border-orange-800 transition-all">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                            <Building2 className="text-white" size={16} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-[10px] font-bold text-orange-700 dark:text-orange-300 mb-1.5 uppercase tracking-wider">Company</div>
                            <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">{b.company}</div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-700/50">
                        <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5">Company</div>
                        <div className="text-sm text-gray-400 dark:text-gray-600 italic">Not provided</div>
                      </div>
                    )}
                    <div className="group relative overflow-hidden p-4 bg-gradient-to-br from-teal-50 to-teal-100/50 dark:from-teal-950/20 dark:to-teal-900/10 rounded-xl border border-teal-200/50 dark:border-teal-900/30 hover:border-teal-300 dark:hover:border-teal-800 transition-all">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                          <Calendar className="text-white" size={16} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[10px] font-bold text-teal-700 dark:text-teal-300 mb-1.5 uppercase tracking-wider">Contact Method</div>
                          <div className="text-sm font-semibold text-gray-900 dark:text-white capitalize">{b.preferred_contact.replace('-', ' ')}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Project Details Section */}
                  <div className="mb-5 p-5 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900/50 dark:via-blue-950/30 dark:to-indigo-950/30 rounded-xl border-2 border-blue-200/60 dark:border-blue-900/40 shadow-sm">
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-blue-200/50 dark:border-blue-900/30">
                      <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                        <Briefcase className="text-white" size={18} />
                      </div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Project Information</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-3 bg-white/60 dark:bg-gray-800/40 rounded-lg border border-blue-200/50 dark:border-blue-900/30">
                        <div className="text-[10px] font-bold text-blue-700 dark:text-blue-300 mb-2 uppercase tracking-wider">Project Type</div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-sm">
                          <span className="text-sm font-bold">{formatProjectType(b.project_type)}</span>
                        </div>
                      </div>
                      <div className="p-3 bg-white/60 dark:bg-gray-800/40 rounded-lg border border-blue-200/50 dark:border-blue-900/30">
                        <div className="text-[10px] font-bold text-blue-700 dark:text-blue-300 mb-2 uppercase tracking-wider">Timeline</div>
                        <div className="flex items-center gap-2">
                          <Clock className="text-blue-600 dark:text-blue-400" size={16} />
                          <span className="text-sm font-bold text-gray-900 dark:text-white">{b.timeline.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}</span>
                        </div>
                      </div>
                      {b.budget ? (
                        <div className="p-3 bg-white/60 dark:bg-gray-800/40 rounded-lg border border-blue-200/50 dark:border-blue-900/30">
                          <div className="text-[10px] font-bold text-blue-700 dark:text-blue-300 mb-2 uppercase tracking-wider">Budget Range</div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="text-blue-600 dark:text-blue-400" size={16} />
                            <span className="text-sm font-bold text-gray-900 dark:text-white">{b.budget.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-white/60 dark:bg-gray-800/40 rounded-lg border border-blue-200/50 dark:border-blue-900/30">
                          <div className="text-[10px] font-bold text-blue-700 dark:text-blue-300 mb-2 uppercase tracking-wider">Budget Range</div>
                          <div className="text-sm text-gray-400 dark:text-gray-600 italic">Not specified</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Preferred Schedule - Highlighted */}
                  {(b.preferred_date || b.preferred_time) && (
                    <div className="mb-5 p-4 bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 dark:from-amber-950/30 dark:via-yellow-950/20 dark:to-amber-950/30 rounded-xl border-2 border-amber-300/60 dark:border-amber-800/40 shadow-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg flex items-center justify-center shadow-md">
                          <CalendarDays className="text-white" size={16} />
                        </div>
                        <span className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider">Preferred Consultation Schedule</span>
                      </div>
                      <div className="text-base font-bold text-amber-900 dark:text-amber-100">
                        {b.preferred_date && new Date(b.preferred_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        {b.preferred_date && b.preferred_time && <span className="mx-2 text-amber-600 dark:text-amber-400">•</span>}
                        {b.preferred_time && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 dark:bg-amber-900/40 rounded-md">
                            <Clock size={12} />
                            {new Date(`2000-01-01T${b.preferred_time}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Project Description */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-7 h-7 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                        <MessageSquare className="text-gray-600 dark:text-gray-400" size={14} />
                      </div>
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Project Description</span>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 shadow-sm">
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap font-medium">{b.project_description}</p>
                    </div>
                  </div>

                  {/* Additional Notes */}
                  {b.additional_notes && (
                    <div>
                      <div className="flex items-center gap-2.5 mb-3">
                        <div className="w-7 h-7 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                          <MessageSquare className="text-gray-600 dark:text-gray-400" size={14} />
                        </div>
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Additional Notes & Requirements</span>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 shadow-sm">
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap font-medium">{b.additional_notes}</p>
                      </div>
                    </div>
                  )}
                  </div>
                </div>
              ))}
              {!loadingBookings && bookings.length === 0 && (
                <div className="p-16 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                    <Calendar className="text-gray-400 dark:text-gray-500" size={28} />
                  </div>
                  <h3 className="text-base font-bold text-gray-700 dark:text-gray-300 mb-2">No Appointments Found</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-500 max-w-md mx-auto">
                    Client booking requests will appear here once they submit appointment inquiries through the portfolio booking system.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
