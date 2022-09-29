import {StyleSheet} from 'react-native';
import Colors from '../../constants/Colors';

const styles = StyleSheet.create({
  header: {
    width: '100%',
    paddingTop: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    backgroundColor: Colors.PRIMARY_COLOR,
  },
});

export default styles;
