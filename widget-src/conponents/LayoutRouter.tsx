import { HomeLayout } from "./HomeLayout";
import { SettingsLayout } from "./SettingsLayout";

const { widget } = figma;
const { AutoLayout, Text, useSyncedState, usePropertyMenu } = widget;

interface LayoutRouterProps {
  initialRoute: string;
}

export interface ChildRouteProps {
  setRoute: (route: string) => void;
}

export const LayoutRouter = ({ initialRoute }: LayoutRouterProps) => {
  const [currentRoute, setCurrentRoute] = useSyncedState<string>(
    "currentRoute",
    initialRoute
  );
  let propertyMenu: WidgetPropertyMenuItem[] = [];
  if (currentRoute === "home") {
    propertyMenu.push({
      tooltip: "Settings",
      propertyName: "settings",
      itemType: "action",
    });
  } else if (currentRoute === "settings") {
    propertyMenu.push({
      tooltip: "Cancel",
      propertyName: "cancel",
      itemType: "action",
    });
  }

  usePropertyMenu(propertyMenu, ({ propertyName }) => {
    if (propertyName === "settings") {
      setCurrentRoute("settings");
    } else if (propertyName === "cancel") {
      setCurrentRoute("home");
    }
  });

  return (
    <AutoLayout>
      {{
        home: <HomeLayout setRoute={setCurrentRoute} />,
        settings: <SettingsLayout setRoute={setCurrentRoute} />,
      }[currentRoute] || <DefaultRoute />}
    </AutoLayout>
  );
};

const DefaultRoute = () => {
  return (
    <AutoLayout>
      <Text>404: Route Not Found</Text>
    </AutoLayout>
  );
};
