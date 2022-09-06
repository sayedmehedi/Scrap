import {StyleSheet} from 'react-native';
import Colors from '../../constants/Colors';

const styles = StyleSheet.create({
  timeContainer: {
    height: 35,
    width: 35,
    borderRadius: 5,
    backgroundColor: '#FFE5EB',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    margin: 5,
  },
  placeBidButton: {
    width: 270,
    height: 50,
    backgroundColor: Colors.PRIMARY_COLOR,
    borderRadius: 50,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  makeofferButton: {
    width: 270,
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    borderColor: '#023047',
    borderWidth: 1,
  },
  askButton: {
    height: 60,
    width: '100%',
    backgroundColor: '#191F2B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
