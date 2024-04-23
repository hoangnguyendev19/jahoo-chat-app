import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Avatar, Snackbar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../redux/conversationSlice';
import connectSocket from '../utils/socketConfig';

const AddMember = ({ navigation, route }) => {
  const { user } = useSelector((state) => state.user);
  const { conversation } = route.params;
  const dispatch = useDispatch();
  const socket = connectSocket();

  const [visible, setVisible] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (socket) {
      socket.on('send_add_member', (data) => {
        if (data.status === 'success') {
          dispatch(addUser(data.data));
          navigation.navigate('Chat', { conversationId: conversation.id, name: conversation.name });
        } else if (data.status === 'fail') {
          setErr('Thêm thành viên thất bại!');
          setVisible(true);
        }
      });
    }
  }, [socket]);

  const handleAddMember = async (id) => {
    if (socket) {
      socket.emit('send_add_member', {
        userId: id,
        conversationId: conversation.id,
        senderId: user.id,
      });
    }
  };

  return (
    <View style={{ flex: 1, width: '100%' }}>
      <ScrollView style={{ paddingHorizontal: 15 }}>
        {user &&
          user?.friendList?.map((friend) => {
            return (
              <View
                key={friend.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 10,
                }}
              >
                <Pressable
                  style={{ flexDirection: 'row', alignItems: 'center', marginRight: 'auto' }}
                  onPress={() => navigation.navigate('InforProfile', { userId: friend.id })}
                >
                  {friend.avatarUrl ? (
                    <Avatar.Image size={50} source={{ uri: friend.avatarUrl }} />
                  ) : (
                    <Avatar.Text size={50} label={friend.fullName.slice(0, 1)} />
                  )}
                  <Text style={{ fontSize: 16, fontWeight: 'bold', marginLeft: 10 }}>
                    {friend.fullName}
                  </Text>
                </Pressable>
                {!conversation?.members?.find((member) => member.id === friend.id) && (
                  <Pressable
                    style={{
                      paddingVertical: 10,
                      paddingHorizontal: 10,
                      backgroundColor: '#0091ff',
                      borderRadius: 10,
                    }}
                    onPress={() => handleAddMember(friend.id)}
                  >
                    <Text style={{ fontWeight: 'bold', color: 'white' }}>Thêm</Text>
                  </Pressable>
                )}
              </View>
            );
          })}
      </ScrollView>
      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        action={{
          label: 'OK',
          onPress: () => {
            setVisible(false);
          },
        }}
      >
        {err}
      </Snackbar>
    </View>
  );
};

export default AddMember;
