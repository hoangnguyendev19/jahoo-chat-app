import { View } from 'react-native';

const LineInfor = ({ item }) => {
  return (
    <View
      style={{
        height: 50,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: '#e1dfd5',
      }}
    >
      <View
        style={{
          width: '20%',
          height: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: 15,
        }}
      >
        {item && item.title}
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        {item && item.content}
      </View>
      {item && item.orther}
    </View>
  );
};

export default LineInfor;
