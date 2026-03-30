import { Star } from 'lucide-react';

const StarRating = ({ rating, maxStars = 5, size = 16, interactive = false, onChange }) => {
  const stars = Array.from({ length: maxStars }, (_, i) => i + 1);

  return (
    <div className="flex items-center gap-0.5">
      {stars.map(star => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onChange && onChange(star)}
          className={interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}
        >
          <Star
            size={size}
            className={star <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
