import {StyleSheet} from 'react-native';
import Colors from '../../Constant/Colors';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  homeHeader: {
    height: 70,
    width: '100%',
    backgroundColor: Colors.PRIMARY_COLOR,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  searchButton: {
    height: 50,
    width: '95%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    alignSelf: 'center',
    marginVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.10,
    shadowRadius: 3.84,

    elevation: 5,
  },
});
export default styles;
