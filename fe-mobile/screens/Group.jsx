import { AntDesign } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import MessageCover from '../components/MessageCover';

const Group = ({ navigation }) => {
  const { conversations } = useSelector((state) => state.conversation);
  const groups =
    conversations?.length > 0 && conversations?.filter((conver) => conver.type === 'GROUP');

  return (
    <View style={{ width: '100%', flex: 1 }}>
      <Pressable
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 10,
          paddingHorizontal: 15,
          backgroundColor: '#fff',
        }}
        onPress={() => navigation.navigate('CreateGroup')}
      >
        <AntDesign name="addusergroup" size={24} color="#0091ff" />
        <Text style={{ marginLeft: 10, fontSize: 16, color: '#0091ff' }}>Tạo nhóm mới</Text>
      </Pressable>
      <ScrollView
        style={{
          borderTopWidth: 5,
          borderStyle: 'solid',
          borderColor: 'rgba(0,0,0,0.05)',
        }}
      >
        {groups.length > 0 &&
          groups.map((group) => (
            <MessageCover key={group.id} navigation={navigation} conver={group} />
          ))}
      </ScrollView>
    </View>
  );
};

export default Group;
