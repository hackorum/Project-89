import { createStackNavigator } from "react-navigation-stack";
import HomeScreen from "../screens/HomeScreen";
import UserDetailScreen from "../screens/UserDetailScreen";

export const StackNavigator = createStackNavigator(
  {
    HomeScreen: {
      screen: HomeScreen,
    },
    UserDetailScreen: {
      screen: UserDetailScreen,
    },
  },
  {
    defaultNavigationOptions: {
      headerShown: false,
    },
  }
);
