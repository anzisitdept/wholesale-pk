'use client';

import React, { useEffect, useState } from 'react';
import { Review } from '@/types';
import {
  subscribeProductReviews,
  subscribeAllApprovedReviews,
  saveReviewToFirestore
} from '@/lib/firestoreServices';
import { useStoreData } from '@/context/StoreDataContext';
import { Star, MessageSquarePlus } from 'lucide-react';

interface CustomerReviewsSectionProps {
  productId?: string;
}

function formatReviewDate(createdAt: any): string {
  if (!createdAt) return new Date().toLocaleDateString('en-US');
  if (typeof createdAt === 'string') return createdAt;
  if (typeof createdAt === 'object') {
    if (typeof createdAt.toDate === 'function') {
      return createdAt.toDate().toLocaleDateString('en-US');
    }
    if (typeof createdAt.seconds === 'number') {
      return new Date(createdAt.seconds * 1000).toLocaleDateString('en-US');
    }
  }
  return String(createdAt);
}

export default function CustomerReviewsSection({ productId }: CustomerReviewsSectionProps) {
  const { products } = useStoreData();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [writeReviewOpen, setWriteReviewOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>(productId || 'store');
  const [reviewForm, setReviewForm] = useState({ author: '', rating: 5, title: '', body: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    let unsub: (() => void) | undefined;
    if (productId) {
      unsub = subscribeProductReviews(productId, (rs) => setReviews(rs));
    } else {
      unsub = subscribeAllApprovedReviews((rs) => setReviews(rs));
    }
    return () => { if (unsub) unsub(); };
  }, [productId]);

  const total = reviews.length;
  const avgRating = total > 0
    ? reviews.reduce((sum, r) => sum + (r.rating || 5), 0) / total
    : 0;

  const histogram = [5, 4, 3, 2, 1].map(star => {
    const count = reviews.filter(r => (r.rating || 5) === star).length;
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    return {
      stars: '★'.repeat(star) + '☆'.repeat(5 - star),
      count,
      pct
    };
  });

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.author.trim() || !reviewForm.title.trim() || !reviewForm.body.trim()) {
      alert('Please fill in all required fields.');
      return;
    }
    setIsSubmittingReview(true);
    const targetProductId = productId || selectedProductId || 'store';
    const res = await saveReviewToFirestore({
      productId: targetProductId,
      author: reviewForm.author.trim(),
      rating: reviewForm.rating,
      title: reviewForm.title.trim(),
      body: reviewForm.body.trim(),
      isVerified: true,
      status: 'pending' // Pending admin verification
    });
    setIsSubmittingReview(false);

    if (res.success) {
      setSubmitSuccessMsg('Shukriya! Your review has been submitted for verification. Once approved by our team, it will appear here automatically.');
      setReviewForm({ author: '', rating: 5, title: '', body: '' });
      setTimeout(() => {
        setSubmitSuccessMsg(null);
        setWriteReviewOpen(false);
      }, 5000);
    } else {
      alert('Error submitting review. Please try again.');
    }
  };

  return (
    <div className="px-4 md:px-6">
      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: 700, textAlign: 'center', marginBottom: '24px' }}>
        Customer Reviews
      </h2>

      {/* Breakdown bar box */}
      <div style={{ maxWidth: '600px', margin: '0 auto 30px auto', textAlign: 'center' }}>
        {total > 0 ? (
          <>
            <div style={{ color: '#000000', fontSize: '20px', marginBottom: '4px' }}>
              {'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5 - Math.round(avgRating))}
            </div>
            <p style={{ fontSize: '13px', color: '#333', fontWeight: 600, marginBottom: '16px' }}>
              {avgRating.toFixed(2)} out of 5 based on {total} {total === 1 ? 'review' : 'reviews'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '400px', margin: '0 auto' }}>
              {histogram.map((row, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px' }}>
                  <span style={{ color: '#000000', width: '60px', textAlign: 'right' }}>{row.stars}</span>
                  <div style={{ flex: 1, height: '10px', background: '#eee', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${row.pct}%`, height: '100%', background: '#000000' }} />
                  </div>
                  <span style={{ width: '20px', color: '#777', textAlign: 'left' }}>{row.count}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div style={{ color: '#d1d5db', fontSize: '20px', marginBottom: '4px' }}>☆☆☆☆☆</div>
            <p style={{ fontSize: '13px', color: '#666', fontWeight: 500, marginBottom: '16px' }}>
              No reviews yet
            </p>
          </>
        )}
      </div>

      {/* Dynamic Write a Review Button and Form */}
      <div style={{ maxWidth: '750px', margin: '0 auto 30px auto', textAlign: 'center' }}>
        {submitSuccessMsg && (
          <div style={{ background: '#d4edda', color: '#155724', padding: '12px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, marginBottom: '20px', border: '1px solid #c3e6cb' }}>
            {submitSuccessMsg}
          </div>
        )}

        {!writeReviewOpen ? (
          <button
            onClick={() => setWriteReviewOpen(true)}
            className="w-full sm:w-auto bg-[#000000] hover:bg-[#333333] active:scale-[0.98] text-white font-bold text-xs sm:text-sm tracking-wider px-6 py-3 rounded-md transition shadow uppercase cursor-pointer"
          >
            Write A Review (رائے لکھیں)
          </button>
        ) : (
          <form onSubmit={handleReviewSubmit} className="bg-[#fcfcfc] border border-gray-200 p-4 sm:p-6 rounded-lg text-left mt-5 shadow-xs">
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: '#111' }}>
              Write a Review
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-3.5">
              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-700">Your Name *</label>
                <input
                  type="text"
                  required
                  value={reviewForm.author}
                  onChange={(e) => setReviewForm({ ...reviewForm, author: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:border-[#000000]"
                  placeholder="Enter your name"
                />
              </div>

              {!productId && products && products.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-700">Select Product</label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:border-[#000000] bg-white"
                  >
                    <option value="store">General Store Review (Wholesaler PK)</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="mb-3.5">
              <label className="block text-xs font-semibold mb-1 text-gray-700">Rating *</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                    className="text-2xl text-[#000000] cursor-pointer hover:scale-110 transition-transform"
                  >
                    {star <= reviewForm.rating ? '★' : '☆'}
                  </button>
                ))}
                <span className="text-xs text-gray-500 font-semibold ml-2">({reviewForm.rating} of 5 Stars)</span>
              </div>
            </div>

            <div className="mb-3.5">
              <label className="block text-xs font-semibold mb-1 text-gray-700">Review Title *</label>
              <input
                type="text"
                required
                value={reviewForm.title}
                onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:border-[#000000]"
                placeholder="Give your review a headline"
              />
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold mb-1 text-gray-700">Body of Review *</label>
              <textarea
                required
                rows={4}
                value={reviewForm.body}
                onChange={(e) => setReviewForm({ ...reviewForm, body: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:border-[#000000]"
                placeholder="Write your comments here"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                type="submit"
                disabled={isSubmittingReview}
                className="w-full sm:w-auto bg-[#000000] hover:bg-[#333333] disabled:bg-gray-400 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-md transition cursor-pointer disabled:cursor-not-allowed shadow-sm active:scale-[0.98]"
              >
                {isSubmittingReview ? 'Submitting...' : 'Submit Review (رائے ارسال کریں)'}
              </button>
              <button
                type="button"
                onClick={() => setWriteReviewOpen(false)}
                className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-700 font-semibold text-xs sm:text-sm px-6 py-3 border border-gray-300 rounded-md transition cursor-pointer active:scale-[0.98]"
              >
                Cancel (منسوخ کریں)
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Real Reviews List or Empty State */}
      <div style={{ maxWidth: '750px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {total === 0 ? (
          <div className="text-center py-10 px-4 bg-gray-50/70 border border-dashed border-gray-300 rounded-xl my-2">
            <Star className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-800 mb-1">No reviews yet</p>
            <p className="text-xs text-gray-500 mb-4">Be the first to write a review and let others know about your experience!</p>
            {!writeReviewOpen && (
              <button
                onClick={() => setWriteReviewOpen(true)}
                className="inline-flex items-center gap-1.5 bg-black hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-md transition shadow-xs cursor-pointer"
              >
                <MessageSquarePlus size={14} />
                Write A Review
              </button>
            )}
          </div>
        ) : (
          reviews.map((rev) => (
            <div key={rev.id || rev.reviewId} style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ color: '#000000', fontSize: '14px' }}>
                  {'★'.repeat(rev.rating || 5)}{'☆'.repeat(5 - (rev.rating || 5))}
                </div>
                <span style={{ fontSize: '11px', color: '#999' }}>{formatReviewDate(rev.createdAt)}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontWeight: 700, fontSize: '13px', color: '#111' }}>{rev.author}</span>
                {rev.isVerified && (
                  <span style={{ background: '#000000', color: '#fff', fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: '2px' }}>
                    ✓ Verified
                  </span>
                )}
              </div>
              {rev.title && (
                <p style={{ fontWeight: 700, fontSize: '13px', color: '#222', marginBottom: '4px' }}>{rev.title}</p>
              )}
              <p style={{ fontSize: '12px', color: '#555', lineHeight: 1.5 }}>{rev.body}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}