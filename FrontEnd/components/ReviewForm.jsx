import { useState } from 'react';
import { reviewAPI } from '../services/api';

const StarInput = ({ rating, setRating }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <span
            key={starValue}
            className={`cursor-pointer text-3xl ${starValue <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            onClick={() => setRating(starValue)}
            onMouseOver={() => setRating(starValue)}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};

const ReviewForm = ({ orderId, revieweeId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a star rating.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      await reviewAPI.createReview({
        order_id: orderId,
        reviewee_id: revieweeId,
        rating: rating,
        comment: comment,
      });
      // Notify parent component that the review was submitted
      onReviewSubmitted();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
      <h2 className="text-2xl font-semibold text-charcoal mb-4">Leave a Review</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-red-500 bg-red-100 p-3 rounded-md">{error}</div>}
        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">Your Rating</label>
          <StarInput rating={rating} setRating={setRating} />
        </div>
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-charcoal mb-2">Your Comments</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="4"
            className="w-full p-2 border-2 border-lightgray-dark rounded-md focus:ring-mint focus:border-mint"
            placeholder="Share your experience with this user..."
          ></textarea>
        </div>
        <div className="text-right">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-mint text-white px-6 py-2 rounded-md hover:bg-mint-dark transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;