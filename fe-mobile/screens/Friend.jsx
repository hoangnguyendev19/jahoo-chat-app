import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import ContactCover from '../components/ContactCover';

const Friend = ({ navigation }) => {
  const { user } = useSelector((state) => state.user);

  return (
    <View style={{ width: '100%', flex: 1 }}>
      <Pressable
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 15,
          paddingVertical: 10,
          backgroundColor: '#fff',
        }}
        onPress={() => navigation.navigate('RequestFriend')}
      >
        <FontAwesome5 name="users" size={24} color="#0091ff" />
        <Text style={{ marginLeft: 10, color: '#0091ff', fontSize: 16 }}>Lời mời kết bạn</Text>
      </Pressable>
      <Pressable
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 15,
          paddingVertical: 10,
          backgroundColor: '#fff',
        }}
      >
        <AntDesign name="contacts" size={24} color="#0091ff" />
        <Text style={{ marginLeft: 15, color: '#0091ff', fontSize: 16 }}>Danh bạ máy</Text>
      </Pressable>
      <ScrollView
        style={{
          borderTopWidth: 5,
          borderStyle: 'solid',
          borderColor: 'rgba(0,0,0,0.05)',
        }}
      >
        {user?.friendList?.length > 0 &&
          user?.friendList?.map((friend) => (
            <ContactCover key={friend.id} navigation={navigation} friend={friend} />
          ))}
      </ScrollView>
    </View>
  );
};

export default Friend;
