import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { ListItem } from "react-native-elements";
import AppHeader from "../components/AppHeader";
import db from "../config";
import { RFValue } from "react-native-responsive-fontsize";

export default class HomeScreen extends Component {
  constructor() {
    super();
    this.state = {
      requestedItems: [],
    };
    this.requestRef = null;
  }

  getRequestedItemList = () => {
    this.requestRef = db.collection("requestedItems").onSnapshot((snapshot) => {
      let requestedItems = snapshot.docs.map((document) => document.data());
      this.setState({
        requestedItems: requestedItems,
      });
    });
  };

  componentDidMount() {
    this.getRequestedItemList();
  }

  componentWillUnmount() {
    this.requestRef();
  }

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, i }) => {
    return (
      <ListItem key={i} bottomDivider>
        <ListItem.Content>
          <ListItem.Title style={{ color: "black", fontWeight: "bold" }}>
            {item.itemName}
          </ListItem.Title>
          <ListItem.Subtitle style={{ color: "green" }}>
            {item.itemDescription}
          </ListItem.Subtitle>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate("UserDetailScreen", {
                details: item,
              });
            }}
            style={styles.button}
          >
            <Text style={{ color: "#ffff" }}>Exchange</Text>
          </TouchableOpacity>
        </ListItem.Content>
      </ListItem>
    );
  };

  render() {
    return (
      <>
        <AppHeader title="Items" navigation={this.props.navigation} />
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            {this.state.requestedItems.length === 0 ? (
              <View style={styles.subContainer}>
                <Text>No Requested Items</Text>
              </View>
            ) : (
              <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.requestedItems}
                renderItem={this.renderItem}
              />
            )}
          </View>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  subContainer: {
    flex: 1,
    fontSize: RFValue(20),
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 100,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2d4059",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
  },
});
