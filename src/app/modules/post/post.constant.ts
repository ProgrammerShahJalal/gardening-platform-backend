export const POST_CATEGORIES = {
  VEGETABLES: 'Vegetables',
  FLOWERS: 'Flowers',
  LANDSCAPING: 'Landscaping',
  FRUITS: 'Fruits',
} as const;

export type PostCategory =
  (typeof POST_CATEGORIES)[keyof typeof POST_CATEGORIES];
