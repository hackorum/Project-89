import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  StatusBar,
  View,
} from "react-native";
import { DrawerItems } from "react-navigation-drawer";
import firebase from "firebase";
import { Avatar } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import db from "../config";
import { RFValue } from "react-native-responsive-fontsize";

export default class Sidebar extends Component {
  state = {
    uid: firebase.auth().currentUser.email,
    image: "#",
    name: "",
    docId: "",
  };
  logOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        this.props.navigation.navigate("LoginScreen");
      });
  };
  fetchImage = (uid) => {
    let storage = firebase
      .storage()
      .ref()
      .child("userProfiles/" + uid);
    storage
      .getDownloadURL()
      .then((url) => {
        this.setState({
          image: url,
        });
      })
      .catch((e) => {
        console.log(e);
        this.setState({ image: "#" });
      });
  };
  uploadImage = async (uri, uid) => {
    let response = await fetch(uri);
    let blob = await response.blob();
    let ref = firebase
      .storage()
      .ref()
      .child("user_profiles/" + uid);
    return ref.put(blob).then(() => {
      this.fetchImage(uid);
    });
  };
  selectPicture = async () => {
    const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!cancelled) {
      this.setState({
        image: uri,
      });
      this.uploadImage(uri, this.state.uid);
    }
  };
  getUserProfile = () => {
    db.collection("users")
      .where("email", "==", this.state.uid)
      .onSnapshot((snapshot) => {
        snapshot.forEach((doc) => {
          let data = doc.data();
          this.setState({
            name: data.firstName + " " + data.lastName,
            docId: doc.id,
            image: data.image,
          });
        });
      });
  };
  componentDidMount() {
    this.fetchImage(this.state.uid);
    this.getUserProfile();
  }
  render() {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        }}
      >
        <View style={styles.subView}>
          <Avatar
            rounded
            source={{ uri: this.state.image }}
            size="medium"
            containerStyle={styles.imageContainer}
            onPress={() => {
              this.selectPicture();
            }}
            showEditButton
          />
          <Text style={styles.text}>{this.state.name}</Text>
        </View>
        <View style={styles.drawerItemContainer}>
          <DrawerItems {...this.props} />
        </View>
        <View style={{ flex: 0.1 }}>
          <TouchableOpacity style={styles.button} onPress={this.logOut}>
            <Text style={styles.buttonText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    marginTop: 50,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    alignSelf: "center",
    fontSize: RFValue(25),
  },
  subView: {
    flex: 0.5,
    alignItems: "center",
  },
  imageContainer: {
    flex: 0.75,
    width: "40%",
    height: "20%",
    marginLeft: 20,
    marginTop: 30,
    borderRadius: 40,
  },
  text: {
    fontWeight: "bold",
    fontSize: RFValue(20),
    paddingTop: 20,
  },
  drawerItemContainer: {
    flex: 0.8,
    marginTop: 100,
  },
});
