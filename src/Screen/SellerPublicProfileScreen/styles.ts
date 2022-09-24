import Colors from "@constants/Colors";
import {StyleSheet, Dimensions} from "react-native";

const {width} = Dimensions.get("window");
const itemWidth = width / 2;

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 0.3,
    borderBottomColor: "#707070",
  },
  editText: {
    color: "#023047",
    fontFamily: "Inter-Medium",
    fontSize: 11,
    textDecorationLine: "underline",
  },
  offerButton: {
    width: 110,
    height: 35,
    backgroundColor: "#51B764",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  socialMediaContainer: {
    height: 35,
    width: 35,
    borderRadius: 40,
    backgroundColor: "#D0D0D0",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 3,
  },
  modalContainer: {
    flex: 1,

    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalView: {
    backgroundColor: "white",
    height: 370,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  modalInput: {
    height: 40,
    width: 280,
    borderWidth: 1,
    borderColor: "#C9C9C9",
    borderRadius: 8,
    textAlign: "center",
    marginVertical: 20,
  },
  updateButton: {
    width: 270,
    height: 50,
    backgroundColor: Colors.PRIMARY_COLOR,
    borderRadius: 50,
    justifyContent: "space-between",
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
  },
  tabButton: {
    height: 50,
    width: itemWidth,
    backgroundColor: "#191F2B",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default styles;
