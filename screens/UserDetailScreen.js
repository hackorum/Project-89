import React, { Component } from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import { Card, Header, Icon } from "react-native-elements";
import firebase from "firebase";
import db from "../config";
import { RFValue } from "react-native-responsive-fontsize";

export default class UserDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: firebase.auth().currentUser.email,
      receiverId: this.props.navigation.getParam("details")["uid"],
      exchangeId: this.props.navigation.getParam("details")["exchangeId"],
      itemName: this.props.navigation.getParam("details")["itemName"],
      description: this.props.navigation.getParam("details")["itemDescription"],
      receiverName: "",
      receiverContact: "",
      receiverAddress: "",
      exchangeDocId: "",
      data: null,
    };
  }
  getUserDetails = () => {
    db.collection("users")
      .where("email", "==", this.state.receiverId)
      .get()
      .then((snapshot) => {
        snapshot.docs.map((doc) => {
          let data = doc.data();
          this.setState({
            receiverName: data.firstName + " " + data.lastName,
            receiverContact: data.contact,
            receiverAddress: data.address,
          });
        });
      });
  };
  getExchangeId = () => {
    db.collection("requestedItems")
      .where("exchangeId", "==", this.state.exchangeId)
      .get()
      .then((snapshot) => {
        snapshot.docs.map((doc) => {
          this.setState({
            exchangeDocId: doc.id,
          });
        });
      });
  };
  getMyDetails = () => {
    let data = null;
    db.collection("users")
      .where("email", "==", this.state.uid)
      .onSnapshot((snapshot) => {
        snapshot.forEach((doc) => {
          data = doc.data();
          this.setState({
            data: data,
          });
        });
      });
  };
  addBarter = () => {
    db.collection("allBarters")
      .add({
        exchangerName:
          this.state.data.firstName + " " + this.state.data.lastName,
        exchangerContact: this.state.data.contact,
        exchangerAddress: this.state.data.address,
        exchangeId: this.state.exchangeId,
        exchangeStatus: "Exchanger Interested",
        receiverName: this.state.receiverName,
        receiverContact: this.state.receiverContact,
        receiverAddress: this.state.receiverAddress,
        email: firebase.auth().currentUser.email,
        itemName: this.state.itemName,
      })
      .then(() => {
        this.props.navigation.navigate("MyBarters");
      });
  };
  addNotification = () => {
    let message =
      this.state.data.firstName +
      " " +
      this.state.data.lastName +
      " Has Shown Interest In Exchanging The Item";
    db.collection("allNotifications").add({
      targetedUserId: this.state.receiverId,
      exchangerId: this.state.uid,
      exchangeId: this.state.exchangeId,
      itemName: this.state.itemName,
      date: firebase.firestore.FieldValue.serverTimestamp(),
      notificationStatus: "unread",
      message: message,
    });
  };
  componentDidMount() {
    this.getUserDetails();
    this.getExchangeId();
    this.getMyDetails();
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 0.1 }}>
          <Header
            leftComponent={
              <Icon
                name="arrow-left"
                type="feather"
                color="#eee"
                onPress={() => this.props.navigation.goBack()}
              />
            }
            centerComponent={{
              text: "Exchange Items",
              style: {
                color: "#ddd",
                fontSize: RFValue(20),
                fontWeight: "bold",
                paddingBottom: 25,
              },
            }}
            backgroundColor="#2d4059"
          />
        </View>
        <View style={{ flex: 0.3 }}>
          <Card
            title={"Item Information"}
            titleStyle={{ fontSize: RFValue(20) }}
          >
            <Card>
              <Text style={{ fontWeight: "bold" }}>
                Name : {this.state.itemName}
              </Text>
            </Card>
            <Card>
              <Text style={{ fontWeight: "bold" }}>
                Reason : {this.state.description}
              </Text>
            </Card>
          </Card>
        </View>
        <View style={{ flex: 0.3 }}>
          <Card
            title={"Reciever Information"}
            titleStyle={{ fontSize: RFValue(20) }}
          >
            <Card>
              <Text style={{ fontWeight: "bold" }}>
                Name: {this.state.receiverName}
              </Text>
            </Card>
            <Card>
              <Text style={{ fontWeight: "bold" }}>
                Contact: {this.state.receiverContact}
              </Text>
            </Card>
            <Card>
              <Text style={{ fontWeight: "bold" }}>
                Address: {this.state.receiverAddress}
              </Text>
            </Card>
          </Card>
        </View>
        <View style={styles.buttonContainer}>
          {this.state.receiverId != this.state.uid ? (
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.addBarter();
                this.addNotification();
                this.props.navigation.navigate("MyBarters");
              }}
            >
              <Text>I want to Barter</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 200,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "orange",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 16,
  },
});
