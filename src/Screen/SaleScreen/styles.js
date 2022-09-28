import {StyleSheet, Dimensions} from 'react-native';
import Colors from '../../constants/Colors';

const {width} = Dimensions.get('window');
const itemWidth = width / 2;
const styles = StyleSheet.create({
  homeHeader: {
    height: 70,
    width: '100%',
    backgroundColor: Colors.PRIMARY_COLOR,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  tabButton: {
    height: 50,
    width: itemWidth,
    backgroundColor: '#191F2B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  postItemButton: {
    width: 270,
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.PRIMARY_COLOR,
    marginVertical: 20,
  },
});
export default styles;
