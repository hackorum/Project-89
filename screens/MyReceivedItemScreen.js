import React, { Component } from "react";
import { Text, StyleSheet, View, FlatList, ScrollView } from "react-native";
import { ListItem } from "react-native-elements";
import AppHeader from "../components/AppHeader";
import firebase from "firebase";
import db from "../config";

export default class MyReceivedItemScreen extends Component {
  state = {
    uid: firebase.auth().currentUser.email,
    receivedItemList: [],
  };
  getExchangeRequests = () => {
    this.requestRef = db
      .collection("receivedItems")
      .where("uid", "==", this.state.uid)
      .where("status", "==", "received")
      .onSnapshot((snapshot) => {
        let list = [];
        snapshot.forEach((doc) => {
          let receivedItemList = doc.data();
          list.push(receivedItemList);
          this.setState({
            receivedItemList: list,
          });
        });
      });
  };
  renderItem = ({ item, i }) => {
    return (
      <ListItem key={i} bottomDivider>
        <ListItem.Content>
          <ListItem.Title>{item.itemName}</ListItem.Title>
          <ListItem.Subtitle>{item.status}</ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    );
  };
  keyExtractor = (item, index) => index.toString();
  componentDidMount() {
    this.getExchangeRequests();
  }
  render() {
    return (
      <>
        <AppHeader title="Received Items" navigation={this.props.navigation} />
        <View style={styles.container}>
          {this.state.receivedItemList.length === 0 ? (
            <View style={styles.subContainer}>
              <Text style={{ fontSize: 20 }}>No Received Items</Text>
            </View>
          ) : (
            <FlatList
              data={this.state.receivedItemList}
              renderItem={this.renderItem}
              keyExtractor={this.keyExtractor}
            />
          )}
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
