import firebase from "firebase";
import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import AppHeader from "../components/AppHeader";
import { ListItem } from "react-native-elements";
import db from "../config";
import { RFValue } from "react-native-responsive-fontsize";

export default class MyBarterScreen extends Component {
  state = {
    allBarters: [],
    name: "",
  };
  getAllBarters = () => {
    this.allBarters = db
      .collection("allBarters")
      .where("email", "==", firebase.auth().currentUser.email)
      .onSnapshot((snapshot) => {
        let allBarters = [];
        snapshot.forEach((doc) => {
          let data = doc.data();
          data.docId = doc.id;
          allBarters.push(data);
          this.setState({
            allBarters: allBarters,
          });
        });
      });
  };
  sendNotification = (itemDetails, exchangeStatus) => {
    let exchangeId = itemDetails.exchangeId;
    let exchangerId = itemDetails.email;
    db.collection("allNotifications")
      .where("exchangeId", "==", exchangeId)
      .where("exchangerId", "==", exchangerId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          console.log(doc.data());
          let message = "";
          if (exchangeStatus === "Item Sent") {
            message = this.state.name + " Sent An Item";
          } else {
            message =
              this.state.name + " Has Shown Interest In Exchanging The Item";
          }
          db.collection("allNotifications").doc(doc.id).update({
            message: message,
            notificationStatus: "unread",
            date: firebase.firestore.FieldValue.serverTimestamp(),
          });
        });
      });
  };
  sendItem = (itemDetails) => {
    if (itemDetails.exchangeStatus === "Item Sent") {
      let exchangeStatus = "Exchanger Interested";
      db.collection("allBarters")
        .doc(itemDetails.docId)
        .update({
          exchangeStatus: exchangeStatus,
        })
        .then(() => {
          this.sendNotification(itemDetails, exchangeStatus);
        });
    } else {
      let exchangeStatus = "Item Sent";
      db.collection("allBarters")
        .doc(itemDetails.docId)
        .update({
          exchangeStatus: exchangeStatus,
        })
        .then(() => {
          this.sendNotification(itemDetails, exchangeStatus);
        });
    }
  };
  getName = () => {
    db.collection("users")
      .where("email", "==", firebase.auth().currentUser.email)
      .get()
      .then((response) => {
        response.docs.map((doc) => {
          let data = doc.data();
          let name = data.firstName + " " + data.lastName;
          this.setState({
            name: name,
          });
        });
      });
  };
  componentDidMount() {
    this.getAllBarters();
    this.getName();
  }
  componentWillUnmount() {
    this.allBarters();
  }
  render() {
    return (
      <View>
        <AppHeader title="My Barters" navigation={this.props.navigation} />
        <FlatList
          data={this.state.allBarters}
          renderItem={({ item, i }) => (
            <ListItem key={i} bottomDivider>
              <ListItem.Content>
                <ListItem.Title style={{ color: "black", fontWeight: "bold" }}>
                  {item.itemName}
                </ListItem.Title>
                <ListItem.Subtitle style={{ color: "green" }}>
                  Requested by: {item.receiverName}
                </ListItem.Subtitle>
                <ListItem.Subtitle style={{ color: "green" }}>
                  Status: {item.exchangeStatus}
                </ListItem.Subtitle>
                <TouchableOpacity
                  style={[
                    styles.button,
                    {
                      backgroundColor:
                        item.exchangeStatus === "Item Sent"
                          ? "green"
                          : "#ff5722",
                    },
                  ]}
                  onPress={() => this.sendItem(item)}
                >
                  <Text style={{ color: "#fff" }}>
                    {item.exchangeStatus === "Item Sent"
                      ? "Item Sent"
                      : "Exchange"}
                  </Text>
                </TouchableOpacity>
              </ListItem.Content>
            </ListItem>
          )}
          keyExtractor={(item) => item.exchangeId}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 100,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 16,
  },
  subtitle: {
    flex: 1,
    fontSize: RFValue(20),
    justifyContent: "center",
    alignItems: "center",
  },
});
