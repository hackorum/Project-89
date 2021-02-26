import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import { ListItem } from "react-native-elements";
import firebase from "firebase";
import AppHeader from "../components/AppHeader";
import SwipableFlatlist from "../components/SwipableFlatlist";
import db from "../config";

export default class NotificationScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: firebase.auth().currentUser.email,
      allNotifications: [],
    };
    this.notificationRef = null;
  }
  getNotifications = () => {
    this.allNotifications = db
      .collection("allNotifications")
      .where("targetedUserId", "==", firebase.auth().currentUser.email)
      .where("notificationStatus", "==", "unread")
      .onSnapshot((snapshot) => {
        let allNotifications = [];
        snapshot.forEach((doc) => {
          let data = doc.data();
          data.docId = doc.id;
          allNotifications.push(data);
          this.setState({
            allNotifications: allNotifications,
          });
        });
      });
  };
  keyExtractor = (item, index) => index.toString();
  renderItem = ({ item, index }) => {
    return (
      <ListItem key={index} bottomDivider>
        <ListItem.Content>
          <ListItem.Title>{item.itemName}</ListItem.Title>
          <ListItem.Subtitle>{item.message}</ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    );
  };
  componentDidMount() {
    this.getNotifications();
  }
  componentWillUnmount() {
    this.notificationRef();
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 0.1 }}>
          <AppHeader
            title="Notifications"
            navigation={this.props.navigation}
            removeBell
          />
        </View>
        <View style={{ flex: 0.9 }}>
          {this.state.allNotifications.length === 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 25 }}>You have no notifications</Text>
            </View>
          ) : (
            <SwipableFlatlist allNotifications={this.state.allNotifications} />
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
