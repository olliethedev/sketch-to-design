const { widget } = figma;
const { AutoLayout, Text, SVG } = widget;

interface ButtonProps extends AutoLayoutProps {
  text?: string;
  icon?: string;
}

export const Button = ({ text, icon, ...rest }: ButtonProps) => {
  return (
    <AutoLayout
      verticalAlignItems="center"
      height="hug-contents"
      padding={{ left: 24, right: 24, top: 12, bottom: 12 }}
      fill="#E6E6E6"
      cornerRadius={8}
      spacing={2}
      hoverStyle={{
        fill: "#D9D9D9",
      }}
      {...rest}
    >
      {icon && <SVG width={14} height={14} src={icon} />}
      {text && <Text>{text}</Text>}
    </AutoLayout>
  );
};
