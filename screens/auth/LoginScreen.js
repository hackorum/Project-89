import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  SafeAreaView,
  Picker,
  StatusBar,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import firebase from "firebase";
import db from "../../config";
import { RFValue } from "react-native-responsive-fontsize";

export default class LoginScreen extends Component {
  state = {
    email: "",
    password: "",
    modalVisible: false,
    firstName: "",
    lastName: "",
    contact: "",
    address: "",
    password: "",
    confirmPassword: "",
    selectedValue: "INR",
  };
  userSignup = () => {
    if (
      this.state.firstName &&
      this.state.lastName &&
      this.state.contact &&
      this.state.address &&
      this.state.email &&
      this.state.password &&
      this.state.confirmPassword
    ) {
      if (this.state.password === this.state.confirmPassword) {
        firebase
          .auth()
          .createUserWithEmailAndPassword(this.state.email, this.state.password)
          .then(() => {
            db.collection("users").add({
              firstName: this.state.firstName,
              lastName: this.state.lastName,
              contact: this.state.contact,
              address: this.state.address,
              email: this.state.email.toLowerCase(),
              isExchangeRequestActive: false,
              currencyCode: this.state.selectedValue,
            });
            Alert.alert("User Has Been Created");
            this.setState({
              email: "",
              password: "",
              modalVisible: false,
            });
          })
          .catch(function (error) {
            Alert.alert(error.message);
          });
      } else {
        Alert.alert("Passwords Do Not Match");
      }
    } else {
      Alert.alert("Please Fill All Fields");
    }
  };
  userLogin = () => {
    if (this.state.email && this.state.password) {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(() => this.props.navigation.navigate("TabNavigator"))
        .catch(function (error) {
          switch (error.code) {
            case "auth/user-disabled":
              Alert.alert("Your Account Has Been Disabled");
              break;
            case "auth/user-not-found":
              Alert.alert("User Not Found");
              break;
            case "auth/invalid-email":
              Alert.alert("Please Enter A Valid Email Address");
              break;
            case "auth/wrong-password":
              Alert.alert("Incorrect Password");
          }
          console.log(error.code);
          console.log(error);
        });
    } else {
      Alert.alert("Please Fill All Fields");
    }
  };
  showModal = () => {
    return (
      <Modal visible={this.state.modalVisible} animationType="fade">
        <View style={styles.container}>
          <View
            style={[styles.mainContainer, { height: "100%", width: "100%" }]}
          >
            <MaterialIcons
              onPress={() => this.setState({ modalVisible: false })}
              style={styles.closeModal}
              name="close"
              size={30}
            />
            <Text style={styles.title}>Sign Up</Text>
            <TextInput
              style={[styles.form, { height: 50 }]}
              maxLength={8}
              placeholder="First Name"
              placeholderTextColor="#e5e5e5"
              onChangeText={(text) => this.setState({ firstName: text })}
              value={this.state.firstName}
            />
            <TextInput
              style={[styles.form, { height: 50 }]}
              maxLength={10}
              placeholder="Last Name"
              placeholderTextColor="#e5e5e5"
              onChangeText={(text) => this.setState({ lastName: text })}
              value={this.state.lastName}
            />
            <TextInput
              style={[styles.form, { height: 50 }]}
              maxLength={10}
              keyboardType="numeric"
              placeholder="Contact No."
              placeholderTextColor="#e5e5e5"
              onChangeText={(text) => this.setState({ contact: text })}
              value={this.state.contact}
            />
            <TextInput
              style={[styles.form, { height: 50 }]}
              placeholder="Address"
              placeholderTextColor="#e5e5e5"
              onChangeText={(text) => this.setState({ address: text })}
              value={this.state.address}
            />
            <TextInput
              style={[styles.form, { height: 50 }]}
              keyboardType="email-address"
              placeholder="Email ID"
              placeholderTextColor="#e5e5e5"
              onChangeText={(text) => this.setState({ email: text })}
              value={this.state.email}
            />
            <TextInput
              style={[styles.form, { height: 50 }]}
              secureTextEntry
              placeholder="Password"
              placeholderTextColor="#e5e5e5"
              onChangeText={(text) => this.setState({ password: text })}
              value={this.state.password}
            />
            <TextInput
              style={[styles.form, { height: 50 }]}
              secureTextEntry
              placeholder="Re-Type Password"
              placeholderTextColor="#e5e5e5"
              onChangeText={(text) => this.setState({ confirmPassword: text })}
              value={this.state.confirmPassword}
            />
            <Picker
              selectedValue={this.state.selectedValue}
              style={{ height: 50, width: 150, bottom: 80 }}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ selectedValue: itemValue })
              }
              prompt="Select your currency format"
            >
              <Picker.Item label="INR" value="inr" />
              <Picker.Item label="EUR" value="eur" />
              <Picker.Item label="CAD" value="cad" />
              <Picker.Item label="HKD" value="hkd" />
              <Picker.Item label="ISK" value="isk" />
              <Picker.Item label="PHP" value="php" />
              <Picker.Item label="DKK" value="dkk" />
              <Picker.Item label="HUF" value="huf" />
              <Picker.Item label="CZK" value="czk" />
              <Picker.Item label="AUD" value="aud" />
              <Picker.Item label="RON" value="ron" />
              <Picker.Item label="SEK" value="sek" />
              <Picker.Item label="IDR" value="idr" />
              <Picker.Item label="BRL" value="brl" />
              <Picker.Item label="RUB" value="rub" />
              <Picker.Item label="HRK" value="hrk" />
              <Picker.Item label="JPY" value="jpy" />
              <Picker.Item label="CTB" value="ctb" />
              <Picker.Item label="CHG" value="chg" />
              <Picker.Item label="SGD" value="sgd" />
              <Picker.Item label="PLN" value="pln" />
              <Picker.Item label="BGN" value="bgn" />
              <Picker.Item label="TRY" value="try" />
              <Picker.Item label="CNY" value="cny" />
              <Picker.Item label="NOK" value="nok" />
              <Picker.Item label="NZD" value="nzd" />
              <Picker.Item label="ZAR" value="zar" />
              <Picker.Item label="USD" value="usd" />
              <Picker.Item label="MXN" value="mxn" />
              <Picker.Item label="ILS" value="ils" />
              <Picker.Item label="GBP" value="gbp" />
              <Picker.Item label="KRW" value="krw" />
              <Picker.Item label="MYR" value="myr" />
            </Picker>
            <TouchableOpacity
              style={styles.signUpButton}
              onPress={this.userSignup}
            >
              <Text style={{ color: "#e5e5e5" }}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };
  render() {
    return (
      <View style={styles.container}>
        {this.showModal()}
        <View style={styles.mainContainer}>
          <Text style={styles.title}>BARTER</Text>
          <TextInput
            style={[styles.form, { marginTop: 50 }]}
            placeholder="Enter your email-id here"
            placeholderTextColor="#e5e5e5"
            keyboardType="email-address"
            onChangeText={(text) => this.setState({ email: text })}
            value={this.state.email}
          />
          <TextInput
            style={styles.form}
            placeholder="Enter your password here"
            placeholderTextColor="#e5e5e5"
            secureTextEntry
            onChangeText={(text) => this.setState({ password: text })}
            value={this.state.password}
          />
          <TouchableOpacity style={styles.button} onPress={this.userLogin}>
            <Text style={styles.text}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.setState({ modalVisible: true })}
          >
            <Text style={styles.text}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e5e5e5",
  },
  title: {
    fontSize: RFValue(45),
    color: "#ea5455",
    position: "absolute",
    top: "10%",
  },
  mainContainer: {
    backgroundColor: "#2d4059",
    width: "80%",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    borderWidth: 0.7,
    borderRadius: 10,
    borderColor: "#e5e5e5",
    color: "#e5e5e5",
    width: "75%",
    marginBottom: 20,
    height: "13%",
    paddingLeft: 7,
  },
  button: {
    padding: 15,
    alignItems: "center",
    borderRadius: 15,
    width: "70%",
    backgroundColor: "#decdc3",
    marginTop: 20,
  },
  text: {
    fontSize: RFValue(15),
    color: "#333",
  },
  signUpButton: {
    backgroundColor: "#ea5455",
    top: 70,
    width: 100,
    height: 30,
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
  },
  closeModal: {
    position: "absolute",
    right: "7%",
    alignSelf: "flex-end",
    color: "#e5e5e5",
    top: 50,
  },
});
