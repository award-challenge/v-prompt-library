import { Star } from "lucide-react";

interface StarRatingProps {
  filled: number;
  size?: number;
}

export function StarRating({ filled, size = 14 }: StarRatingProps) {
  return (
    <span className="inline-flex gap-[2px]">
      {Array.from({ length: 5 }, (_, i) => {
        const isFilled = i < filled;
        return (
          <Star
            key={i}
            size={size}
            strokeWidth={isFilled ? 2 : 0}
            className={
              isFilled
                ? "fill-warning text-warning"
                : "fill-subtle/50 text-subtle/50"
            }
          />
        );
      })}
    </span>
  );
}
