
export type ViewType = "menu" | "combo" | "category";
export type LangType = "arabic" | "eng";
export interface ItemTemplate {
  id: number;
  name: string;
  price: number;
  demoPrice?: number;
  image: string;
  description: string;
  calories: string;
  likes?: string;
}

type MenuItem = {
  id: number;
  name: string;
  description?: string;
  calories: string;
  price: number;
  demoPrice?: number;
  discountPercentage?: number;
  likes?: string;
  image: string;
};

type Category = {
  id: number;
  title: string;
  itemCount?: number;
  likes?: number;
  imageUrl: string;
  items: MenuItem[];
};

type Menu = Category[];

export type { Category, Menu, MenuItem };
