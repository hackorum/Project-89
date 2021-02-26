import React, { Component } from "react";
import { StyleSheet, View, Platform, StatusBar } from "react-native";
import { Header, Icon, Badge } from "react-native-elements";
import db from "../config";
import firebase from "firebase";
import { RFValue } from "react-native-responsive-fontsize";

export default class AppHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: firebase.auth().currentUser.email,
      value: "",
    };
  }
  getNumberOfUnreadNotifications = () => {
    db.collection("allNotifications")
      .where("targetedUserId", "==", this.state.uid)
      .where("notificationStatus", "==", "unread")
      .onSnapshot((snapshot) => {
        let unreadNotifications = snapshot.docs.map((doc) => doc.data());
        this.setState({
          value: unreadNotifications.length,
        });
      });
  };
  bellIconWithBage = () => {
    return (
      <View>
        <Icon
          name="bell"
          type="font-awesome"
          color="#ffff00"
          onPress={() => this.props.navigation.navigate("Notifications")}
        />
        <Badge value={this.state.value} containerStyle={styles.badge} />
      </View>
    );
  };
  componentDidMount() {
    this.getNumberOfUnreadNotifications();
  }
  render() {
    if (!this.props.removeBell) {
      return (
        <Header
          backgroundColor="#2d4059"
          leftComponent={
            <Icon
              name="bars"
              type="font-awesome"
              color="#fff"
              onPress={() => this.props.navigation.toggleDrawer()}
            />
          }
          centerComponent={{
            text: this.props.title,
            style: { color: "#fff", fontSize: RFValue(20), fontWeight: "bold" },
          }}
          rightComponent={<this.bellIconWithBage {...this.props} />}
        />
      );
    } else {
      return (
        <Header
          backgroundColor="#2d4059"
          leftComponent={
            <Icon
              name="bars"
              type="font-awesome"
              color="#fff"
              onPress={() => this.props.navigation.toggleDrawer()}
            />
          }
          centerComponent={{
            text: this.props.title,
            style: { color: "#fff", fontSize: RFValue(20), fontWeight: "bold" },
          }}
        />
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ff5722",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    justifyContent: "center",
    alignItems: "center",
  },
  titleText: {
    color: "#fff",
    fontSize: RFValue(25),
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
  },
});
