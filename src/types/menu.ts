export type ViewType = "menu" | "combo";
export type LangType = "arabic" | "eng";
export interface ItemTemplate{
    name: string;
    price: number;
    demoPrice: number;
    image: string;
    description: string;
    calories: string;
    likes?: string;
  }