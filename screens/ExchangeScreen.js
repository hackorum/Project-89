import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import firebase from "firebase";
import db from "../config";
import AppHeader from "../components/AppHeader";
import { RFValue } from "react-native-responsive-fontsize";

export default class ExchangeScreen extends Component {
  state = {
    name: "",
    description: "",
    isExchangeRequestActive: null,
    uid: firebase.auth().currentUser.email,
    docId: "",
    id: "",
    price: "",
    euroPrice: 0,
  };
  addItem = (name, description) => {
    db.collection("requestedItems")
      .add({
        itemName: name,
        itemDescription: description,
        exchangeId: this.createUniqueId(),
        uid: firebase.auth().currentUser.email,
        status: "requested",
      })
      .then(() => {
        this.setState({
          name: "",
          description: "",
        });
        this.getItemDetails();
      })
      .catch((error) => {
        console.log(error);
      });
    db.collection("users")
      .where("email", "==", firebase.auth().currentUser.email)
      .get()
      .then((response) => {
        response.forEach((doc) => {
          db.collection("users")
            .doc(doc.id)
            .update({
              isExchangeRequestActive: true,
            })
            .then(() => {
              this.props.changeState;
            });
        });
      });
  };
  createUniqueId = () => {
    let uniqueId = Math.random().toString(36).substring(7);
    this.setState({
      exchangeId: uniqueId,
    });
    return uniqueId;
  };
  getItemDetails = () => {
    db.collection("requestedItems")
      .where("uid", "==", this.state.uid)
      .get()
      .then((response) => {
        response.forEach((doc) => {
          let data = doc.data();
          this.setState({
            itemName: data.itemName,
            status: data.status,
          });
        });
      });
  };
  getIsExchangeRequestActive = () => {
    db.collection("users")
      .where("email", "==", this.state.uid)
      .onSnapshot((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            isExchangeRequestActive: doc.data().isExchangeRequestActive,
            docId: doc.id,
            currencyCode: doc.data().currencyCode.toUpperCase(),
          });
        });
      });
  };
  updateItemRequestStatus = () => {
    db.collection("requestedItems")
      .where("exchangeId", "==", this.state.exchangeId)
      .get()
      .then((response) => {
        response.forEach((doc) => {
          let docId = doc.id;
          db.collection("requestedItems").doc(docId).update({
            status: "received",
          });
        });
      });
    db.collection("users")
      .where("email", "==", this.state.uid)
      .get()
      .then((response) => {
        response.forEach((doc) => {
          db.collection("users").doc(doc.id).update({
            isExchangeRequestActive: false,
          });
        });
      });
  };
  sendNotification = () => {
    db.collection("users")
      .where("email", "==", this.state.uid)
      .get()
      .then((response) => {
        response.forEach((doc) => {
          let data = doc.data();
          let firstName = data.firstName;
          let lastName = data.lastName;
          db.collection("allNotifications")
            .where("exchangeId", "==", this.state.exchangeId)
            .get()
            .then((response) => {
              response.forEach((doc) => {
                let data = doc.data();
                let exchangerId = data.exchangerId;
                let itemName = data.itemName;
                db.collection("allNotifications").add({
                  targetedUserId: exchangerId,
                  message:
                    firstName +
                    " " +
                    lastName +
                    " Received The Item " +
                    itemName,
                  notificationStatus: "unread",
                  itemName: itemName,
                });
              });
            });
        });
      });
  };
  receivedItems = () => {
    let { uid, exchangeId, itemName } = this.state;
    db.collection("receivedItems").add({
      uid: uid,
      itemName: itemName,
      exchangeId: exchangeId,
      status: "received",
    });
  };
  getData = () => {
    fetch("https://api.exchangeratesapi.io/latest").then((response) =>
      response
        .json()
        .then((json) =>
          this.setState({ euroPrice: json.rates[this.state.currencyCode] })
        )
    );
  };
  getPriceInEuros = () => {
    let priceInEuros = this.state.price * this.state.euroPrice;
    return priceInEuros.toFixed(2);
  };
  componentDidMount() {
    this.getIsExchangeRequestActive();
    this.getData();
  }
  render() {
    return (
      <>
        <AppHeader title="Request Items" navigation={this.props.navigation} />
        {!this.state.isExchangeRequestActive ? (
          <View style={styles.container}>
            <MaterialIcons
              style={styles.icon}
              name="add-circle-outline"
              size={150}
              color="#2d4059"
            />
            <TextInput
              style={styles.form}
              placeholder="Item Name"
              onChangeText={(text) => this.setState({ name: text })}
              value={this.state.name}
            />
            <TextInput
              style={styles.form}
              placeholder="Item Description"
              onChangeText={(text) => this.setState({ description: text })}
              value={this.state.description}
            />
            <TextInput
              style={styles.form}
              placeholder="Item Price"
              onChangeText={(text) => this.setState({ price: text })}
              value={this.state.price}
            />
            <TouchableOpacity
              onPress={() =>
                this.addItem(this.state.name, this.state.description)
              }
              style={styles.addButton}
            >
              <MaterialIcons name="add" size={17} color="#e5e5e5" />
              <Text style={styles.buttonText}>Add Item</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ flex: 1, justifyContent: "center" }}>
            <View
              style={{
                borderColor: "#2d4059",
                borderWidth: 0.7,
                justifyContent: "center",
                padding: 10,
                margin: 10,
                height: 100,
              }}
            >
              <Text style={{ fontSize: RFValue(17) }}>
                Item Name: {this.state.itemName}
              </Text>
              <Text style={{ fontSize: RFValue(17) }}>
                Status: {this.state.status}
              </Text>
              <Text style={{ fontSize: RFValue(17) }}>
                Price in Euros: {this.state.price * this.state.euroPrice}
              </Text>
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: "#2d4059",
                width: 300,
                alignSelf: "center",
                justifyContent: "center",
                alignItems: "center",
                height: 40,
                marginTop: 30,
                borderRadius: 5,
              }}
              onPress={() => {
                this.sendNotification();
                this.updateItemRequestStatus();
                this.receivedItems(this.state.itemName);
              }}
            >
              <Text style={{ color: "white" }}>I have received the item </Text>
            </TouchableOpacity>
          </View>
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    bottom: 50,
  },
  form: {
    borderWidth: 0.7,
    borderRadius: 10,
    borderColor: "#2d4059",
    color: "#2d4059",
    width: "75%",
    marginBottom: 20,
    height: 50,
    paddingLeft: 7,
  },
  addButton: {
    backgroundColor: "#2d4059",
    width: "75%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    borderRadius: 7,
  },
  buttonText: {
    color: "#e5e5e5",
    fontSize: RFValue(17),
  },
  keyBoardStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  formTextInput: {
    width: "75%",
    height: 35,
    alignSelf: "center",
    borderColor: "#ffab91",
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 20,
    padding: 10,
  },
  button: {
    width: "75%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#ff5722",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop: 20,
  },
});
