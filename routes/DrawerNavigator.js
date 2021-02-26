import React from "react";
import { createDrawerNavigator } from "react-navigation-drawer";
import { TabNavigator } from "./TabNavigator";
import SettingsScreen from "../screens/SettingsScreen";
import Sidebar from "../components/Sidebar";
import MyBarterScreen from "../screens/MyBarterScreen";
import MyReceivedItemScreen from "../screens/MyReceivedItemScreen";
import NotificationScreen from "../screens/NotificationScreen";
import { Icon } from "react-native-elements";

export const DrawerNavigator = createDrawerNavigator(
  {
    TabNavigator: {
      screen: TabNavigator,
      navigationOptions: {
        title: "Home",
        drawerIcon: <Icon name="home" type="fontawesome5" />,
      },
    },
    Settings: {
      screen: SettingsScreen,
      navigationOptions: {
        drawerIcon: <Icon name="gear" type="font-awesome" />,
      },
    },
    MyBarters: {
      screen: MyBarterScreen,
      navigationOptions: {
        title: "My Barters",
        drawerIcon: <Icon name="gift" type="font-awesome" />,
      },
    },
    MyReceivedItemScreen: {
      screen: MyReceivedItemScreen,
      navigationOptions: {
        title: "Received Items",
        drawerIcon: <Icon name="book" type="font-awesome" />,
      },
    },
    Notifications: {
      screen: NotificationScreen,
      navigationOptions: {
        title: "Notifications",
        drawerIcon: <Icon name="bell" type="font-awesome" />,
      },
    },
  },
  {
    contentComponent: Sidebar,
  },
  {
    initialRouteName: "Home",
  }
);
