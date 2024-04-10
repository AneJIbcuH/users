export type User = {
  birthdate: string;
  email: string;
  favorite_food_ids: string[];
  id: number;
  photo_id: number | null;
  username: string;
};

export type FoodList = {
  [key: string]: string;
};
