import { useLanguageStore } from "../stores/language";

export const useLang = () => {
  const language = useLanguageStore((state) => state.language);

  return (eng: any, arab: any) => {
    return language === "eng" ? eng : arab;
  };
};
