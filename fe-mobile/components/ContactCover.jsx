import { Pressable, Text, View } from 'react-native';
import { Avatar } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';
import ConversationAPI from '../api/ConversationAPI';
import { useDispatch, useSelector } from 'react-redux';
import { createConversation } from '../redux/conversationSlice';
import connectSocket from '../utils/socketConfig';
import { useEffect } from 'react';

const ContactCover = ({ navigation, friend }) => {
  const { fullName, avatarUrl, id } = friend;
  const { user } = useSelector((state) => state.user);
  const { conversations } = useSelector((state) => state.conversation);
  const dispatch = useDispatch();
  const socket = connectSocket();

  useEffect(() => {
    if (socket) {
      socket.on('send_create_conversation', (data) => {
        if (data.status === 'success') {
          dispatch(createConversation(data.data));
          navigation.navigate('Chat', { conversationId: data.data.conversationId, name: fullName });
        }
      });
    }
  }, [socket]);

  const handleCreateConversation = async () => {
    const flag = conversations?.filter(
      (conver) => conver.members.find((member) => member.id === id) && conver.type === 'FRIEND',
    );

    if (flag.length > 0) {
      navigation.navigate('Chat', { conversationId: flag[0].id, name: fullName });
      return;
    }

    const conversation = {
      admin: user.id,
      type: 'FRIEND',
      members: [user.id, id],
    };

    // const data = await ConversationAPI.createConversation(conversation);
    // if (data) {
    //   dispatch(createConversation(data));
    //   navigation.navigate('Chat', { conversationId: data.conversationId, name: fullName });
    // }

    if (socket) {
      socket.emit('send_create_conversation', conversation);
    }
  };
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
      }}
    >
      <Pressable
        style={{ flexDirection: 'row', alignItems: 'center', marginRight: 'auto' }}
        onPress={() => navigation.navigate('InforProfile', { userId: id })}
      >
        {avatarUrl ? (
          <Avatar.Image size={50} source={{ uri: avatarUrl }} />
        ) : (
          <Avatar.Text size={50} label={fullName.slice(0, 1)} />
        )}
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginLeft: 10 }}>{fullName}</Text>
      </Pressable>
      <Pressable style={{ marginRight: 25 }} onPress={handleCreateConversation}>
        <Feather name="message-circle" size={28} color="black" />
      </Pressable>
      <Pressable>
        <Feather name="phone" size={24} color="black" />
      </Pressable>
    </View>
  );
};

export default ContactCover;
