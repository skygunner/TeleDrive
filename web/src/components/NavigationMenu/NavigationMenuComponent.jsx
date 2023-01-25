import { Menu } from "antd";

const NavigationMenu = () => {
  return (
    <Menu
      mode="horizontal"
      defaultSelectedKeys={["2"]}
      items={new Array(3).fill(null).map((_, index) => ({
        key: String(index + 1),
        label: `nav ${index + 1}`,
      }))}
    />
  );
};

export default NavigationMenu;
