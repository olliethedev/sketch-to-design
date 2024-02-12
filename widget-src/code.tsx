import { ApiKeyProtected } from "./conponents/ApiKeyProtected";
import { LayoutRouter } from "./conponents/LayoutRouter";
const { widget } = figma;

function Widget() {
  return (
    <ApiKeyProtected>
      <LayoutRouter initialRoute="home" />
    </ApiKeyProtected>
  );
}

widget.register(Widget);
