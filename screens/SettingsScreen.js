import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import firebase from "firebase";
import db from "../config";
import { RFValue } from "react-native-responsive-fontsize";

export default class SettingsScreen extends Component {
  state = {
    firstName: "",
    lastName: "",
    address: "",
    contact: "",
    docId: "",
  };
  getData = async () => {
    const email = firebase.auth().currentUser.email;
    await db
      .collection("users")
      .where("email", "==", email)
      .get()
      .then((response) => {
        response.forEach((doc) => {
          const data = doc.data();
          this.setState({
            firstName: data.firstName,
            lastName: data.lastName,
            address: data.address,
            contact: data.contact,
            docId: doc.id,
          });
        });
      });
  };
  updateData = () => {
    db.collection("users")
      .doc(this.state.docId)
      .update({
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        address: this.state.address,
        contact: this.state.contact,
      })
      .then(() => {
        Alert.alert("Profile Updated Successfully");
      });
  };
  componentDidMount() {
    this.getData();
  }
  render() {
    return (
      <View style={styles.container}>
        <MaterialIcons
          style={{ bottom: 50 }}
          name="update"
          size={150}
          color="#2d4059"
        />
        <TextInput
          style={styles.form}
          placeholder="First Name"
          onChangeText={(text) => {
            this.setState({
              firstName: text,
            });
          }}
          value={this.state.firstName}
        />
        <TextInput
          style={styles.form}
          placeholder="Last Name"
          onChangeText={(text) => {
            this.setState({
              lastName: text,
            });
          }}
          value={this.state.lastName}
        />
        <TextInput
          style={styles.form}
          placeholder="Contact"
          maxLength={10}
          onChangeText={(text) => {
            this.setState({
              contact: text,
            });
          }}
          value={this.state.contact}
        />
        <TextInput
          style={styles.form}
          placeholder="Address"
          multiline
          onChangeText={(text) => {
            this.setState({
              address: text,
            });
          }}
          value={this.state.address}
        />
        <TouchableOpacity onPress={this.updateData} style={styles.addButton}>
          <Text style={styles.buttonText}>Update Profile</Text>
        </TouchableOpacity>
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
});
