import { createBottomTabNavigator } from "react-navigation-tabs";
import { StackNavigator } from "./StackNavigator";
import ExchangeScreen from "../screens/ExchangeScreen";

export const TabNavigator = createBottomTabNavigator({
  Home: {
    screen: StackNavigator,
  },
  Exchange: {
    screen: ExchangeScreen,
  },
});
