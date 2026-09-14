'use client';

import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Star, MessageSquarePlus, X, CheckCircle2 } from 'lucide-react';
import { Review } from '@/types';
import { subscribeAllApprovedReviews, saveReviewToFirestore } from '@/lib/firestoreServices';
import { useStoreData } from '@/context/StoreDataContext';

export default function ReviewCarousel({ compact = false }: { compact?: boolean }) {
  const { products } = useStoreData();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [writeModalOpen, setWriteModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Review form state
  const [formRating, setFormRating] = useState(5);
  const [formAuthor, setFormAuthor] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formBody, setFormBody] = useState('');
  const [formProductId, setFormProductId] = useState('store');

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    loop: reviews.length > 2,
    slidesToScroll: 1
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  // Subscribe to real approved reviews from Firestore in real-time
  useEffect(() => {
    const unsub = subscribeAllApprovedReviews((rs) => {
      setReviews(rs);
      setLoaded(true);
    });
    return () => { if (unsub) unsub(); };
  }, []);

  const total = reviews.length;
  const avgRating = total > 0
    ? reviews.reduce((sum, r) => sum + (typeof r.rating === 'number' ? r.rating : 5), 0) / total
    : 0;

  const updateNav = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => updateNav();
    updateNav();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, updateNav, reviews.length]);

  useEffect(() => {
    if (emblaApi) emblaApi.reInit();
  }, [emblaApi, reviews.length]);

  // Handle Review Submission
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAuthor.trim() || !formTitle.trim() || !formBody.trim()) {
      alert('Please fill out your name, review title, and comments.');
      return;
    }

    setSubmitting(true);
    const res = await saveReviewToFirestore({
      productId: formProductId,
      author: formAuthor.trim(),
      rating: formRating,
      title: formTitle.trim(),
      body: formBody.trim(),
      isVerified: true,
      status: 'pending' // Submitted as pending; appears once approved by admin!
    });
    setSubmitting(false);

    if (res.success) {
      setSuccessMsg('Thank you! Your review has been submitted for verification and will appear here once approved by our team.');
      setFormAuthor('');
      setFormTitle('');
      setFormBody('');
      setFormRating(5);
      setFormProductId('store');
      setTimeout(() => {
        setWriteModalOpen(false);
        setSuccessMsg(null);
      }, 3500);
    } else {
      alert('Failed to submit review. Please try again.');
    }
  };

  return (
    <section className="border-b border-gray-200 bg-white overflow-hidden py-10 md:py-16">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-10">

          {/* ── Left Column: Heading, Dynamic Rating, Count, Actions ── */}
          <div className="lg:w-[320px] flex-shrink-0 text-center lg:text-left mb-8 lg:mb-0 lg:sticky lg:top-8">
            <p className="font-serif font-bold text-gray-900 leading-tight mb-3 text-2xl md:text-3xl">
              Customer Reviews
            </p>

            {total > 0 ? (
              <>
                <div className="flex items-center justify-center lg:justify-start gap-1 text-black mb-1 text-xl">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i}>
                      {i < Math.round(avgRating) ? '★' : '☆'}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-800 font-semibold mb-5">
                  {avgRating.toFixed(1)} out of 5 from {total} {total === 1 ? 'review' : 'reviews'}
                </p>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center lg:justify-start gap-1 text-gray-300 mb-1 text-xl">
                  {'☆☆☆☆☆'}
                </div>
                <p className="text-sm text-gray-500 font-medium mb-5">
                  No reviews yet
                </p>
              </>
            )}

            {/* Write a Review Trigger */}
            <div className="mb-6 flex justify-center lg:justify-start">
              <button
                type="button"
                onClick={() => setWriteModalOpen(true)}
                className="inline-flex items-center gap-2 bg-[#6f0c07] text-white hover:bg-[#580a06] px-5 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition shadow-sm cursor-pointer"
              >
                <MessageSquarePlus size={15} />
                Write a Review
              </button>
            </div>

            {/* Desktop navigation arrows (only if multiple reviews) */}
            {total > 1 && (
              <div className="hidden lg:flex items-center gap-3 justify-center lg:justify-start">
                <button
                  onClick={() => emblaApi?.scrollPrev()}
                  disabled={!canPrev}
                  className="bg-white border border-gray-300 hover:border-gray-400 shadow-sm rounded-full w-10 h-10 flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-default transition"
                  aria-label="Previous review"
                >
                  <ChevronLeft size={20} color="#6f0c07" />
                </button>
                <button
                  onClick={() => emblaApi?.scrollNext()}
                  disabled={!canNext}
                  className="bg-white border border-gray-300 hover:border-gray-400 shadow-sm rounded-full w-10 h-10 flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-default transition"
                  aria-label="Next review"
                >
                  <ChevronRight size={20} color="#6f0c07" />
                </button>
              </div>
            )}
          </div>

          {/* ── Right Column: Dynamic Reviews Carousel or "No Reviews Yet" ── */}
          <div className="flex-1 min-w-0 relative">
            {total === 0 ? (
              /* Empty State: No reviews yet */
              <div className="bg-gray-50/70 border border-dashed border-gray-300 rounded-2xl p-8 sm:p-12 text-center max-w-xl mx-auto lg:mx-0">
                <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center mx-auto mb-3.5 text-black">
                  <Star className="w-6 h-6 text-gray-700" />
                </div>
                <h3 className="font-serif text-lg font-bold text-gray-900 mb-2">
                  No Reviews Yet
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mb-6 leading-relaxed">
                  Be the first to share your thoughts! Verified customer reviews will appear here automatically once approved by our team.
                </p>
                <button
                  type="button"
                  onClick={() => setWriteModalOpen(true)}
                  className="inline-flex items-center gap-2 bg-[#6f0c07] hover:bg-[#580a06] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-md transition shadow-sm"
                >
                  <MessageSquarePlus size={14} />
                  Write the First Review
                </button>
              </div>
            ) : (
              /* Carousel with Real Approved Reviews */
              <>
                {/* Mobile/Tablet side arrows */}
                {total > 1 && (
                  <button
                    onClick={() => emblaApi?.scrollPrev()}
                    disabled={!canPrev}
                    className="lg:hidden absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 shadow-md rounded-full p-1.5 sm:p-2 flex-shrink-0 cursor-pointer disabled:opacity-30 disabled:cursor-default"
                    aria-label="Previous review"
                  >
                    <ChevronLeft size={22} color="#6f0c07" />
                  </button>
                )}

                {/* Embla viewport */}
                <div className="overflow-hidden px-2" ref={emblaRef}>
                  <div className="flex">
                    {reviews.map((r) => (
                      <div
                        key={r.id || r.reviewId}
                        className="flex-[0_0_100%] sm:flex-[0_0_50%] min-w-0 px-2 py-1"
                      >
                        <div className="h-full bg-[#fafafa] border border-gray-100 rounded-lg p-5 flex flex-col">
                          {/* Stars */}
                          <div className="text-black text-base mb-2">
                            {'★'.repeat(typeof r.rating === 'number' ? r.rating : 5)}
                            {'☆'.repeat(Math.max(0, 5 - (typeof r.rating === 'number' ? r.rating : 5)))}
                          </div>
                          {/* Title */}
                          {r.title && (
                            <p className="font-bold text-base text-gray-900 mb-2">{r.title}</p>
                          )}
                          {/* Body */}
                          <p className="text-sm text-gray-600 leading-relaxed mb-4 flex-1 line-clamp-4">
                            {r.body}
                          </p>
                          {/* Author + Verified */}
                          <div className="flex items-center justify-between gap-2 mt-auto pt-2 border-t border-gray-100">
                            <div className="flex items-center gap-2 min-w-0">
                              <p className="text-xs text-gray-900 font-semibold truncate">{r.author}</p>
                              {r.isVerified && (
                                <span className="bg-[#6f0c07] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-xs flex-shrink-0">
                                  ✓ Verified
                                </span>
                              )}
                            </div>
                            {r.createdAt && (
                              <span className="text-[10px] text-gray-400 flex-shrink-0">
                                {typeof r.createdAt === 'string' ? r.createdAt : ''}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mobile/Tablet right arrow */}
                {total > 1 && (
                  <button
                    onClick={() => emblaApi?.scrollNext()}
                    disabled={!canNext}
                    className="lg:hidden absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 shadow-md rounded-full p-1.5 sm:p-2 flex-shrink-0 cursor-pointer disabled:opacity-30 disabled:cursor-default"
                    aria-label="Next review"
                  >
                    <ChevronRight size={22} color="#6f0c07" />
                  </button>
                )}
              </>
            )}
          </div>

        </div>
      </div>

      {/* ── Write a Review Modal ── */}
      {writeModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 relative max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => {
                setWriteModalOpen(false);
                setSuccessMsg(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-black p-1 transition"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <h3 className="font-serif text-xl font-bold text-gray-900 mb-1">
              Write a Customer Review
            </h3>
            <p className="text-xs text-gray-500 mb-5">
              Share your genuine feedback with Wholesaler PK buyers.
            </p>

            {successMsg ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
                <p className="text-sm font-semibold text-gray-900">{successMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                {/* Rating Stars Picker */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Rating
                  </label>
                  <div className="flex items-center gap-1.5 cursor-pointer">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormRating(star)}
                        className={`text-2xl transition-transform hover:scale-110 ${
                          star <= formRating ? 'text-black' : 'text-gray-300'
                        }`}
                        title={`${star} star`}
                      >
                        ★
                      </button>
                    ))}
                    <span className="text-xs text-gray-500 font-semibold ml-2">
                      ({formRating} of 5 stars)
                    </span>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formAuthor}
                    onChange={(e) => setFormAuthor(e.target.value)}
                    placeholder="e.g. Tariq Mehmood"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-black"
                  />
                </div>

                {/* Product Reference (Optional) */}
                {products.length > 0 && (
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Reviewed Product (Optional)
                    </label>
                    <select
                      value={formProductId}
                      onChange={(e) => setFormProductId(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-black bg-white"
                    >
                      <option value="store">General Store Review (Wholesaler PK)</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Review Title */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Review Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Great quality product & fast delivery!"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-black"
                  />
                </div>

                {/* Review Body */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Review Body *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formBody}
                    onChange={(e) => setFormBody(e.target.value)}
                    placeholder="Write your detailed feedback here..."
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-black resize-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#6f0c07] hover:bg-[#580a06] disabled:opacity-60 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-md transition shadow-sm cursor-pointer"
                >
                  {submitting ? 'Submitting Review...' : 'Submit Review'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
