interface Recipe {
  id: string;
  title: string;
  "sub-title": string;
  "preparation-time": string;
  "price-per-serving": string;
  image: string;
  description: string;
  ingredients: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type { Recipe };
