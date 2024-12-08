import GroupButton from "./GroupButton";

interface NavigationProps {
  onViewChange: (view: "menu" | "combo") => void;
}

export default function HomeNavigation({ onViewChange }: NavigationProps) {
  return (
    <div>
      <div className="container ">
        <GroupButton
          padding="0px 32px"
          buttonTextOne="Menu"
          buttonTextTwo="Combo"
          buttonSize="large"
          groupClassName="w-[92dvw]"
          widthOne="50%"
          widthTwo="50%"
          borderRadius="8px"
          onViewChange={onViewChange}
          defaultPosition="menu"
        />
      </div>
    </div>
  );
}
