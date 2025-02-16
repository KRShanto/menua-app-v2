export type ViewType = "menu" | "combo" | "category";
export type LangType = "arabic" | "eng";
export interface ItemTemplate {
  id: number;
  name: string;
  price: number;
  demoPrice?: number;
  // image: string;
  description: string;
  calories: string;
  likes?: string;
}

type MenuItem = {
  id: string;
  name: string;
  name_arab: string;
  category: string;
  category_arab: string;
  calories: string;
  price: number;
  description: string;
  description_arab: string;
  discountedPrice: number;
  discountPercentage: number;
  likes: string;
  imageURL: string;
};

type Category = {
  id: number;
  title: string;
  title_arab: string;
  itemCount?: number;
  likes?: number;
  imageUrl: string;
  items: MenuItem[];
};

type Menu = Category[];

export type { Category, Menu, MenuItem };
