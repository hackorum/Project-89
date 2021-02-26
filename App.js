import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { DrawerNavigator } from "./routes/DrawerNavigator";
import LoginScreen from "./screens/auth/LoginScreen";

import { LogBox } from "react-native";
import _ from "lodash";
LogBox.ignoreLogs(["Setting a timer"]);
const _console = _.clone(console);
console.warn = (message) => {
  if (message.indexOf("Setting a timer") <= -1) {
    _console.warn(message);
  }
};

const SwitchNavigator = createSwitchNavigator({
  LoginScreen: {
    screen: LoginScreen,
  },
  DrawerNavigator: {
    screen: DrawerNavigator,
  },
});

export default createAppContainer(SwitchNavigator);
