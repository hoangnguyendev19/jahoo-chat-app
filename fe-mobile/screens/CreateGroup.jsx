import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Avatar, Checkbox, Snackbar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { createConversation } from '../redux/conversationSlice';
import connectSocket from '../utils/socketConfig';

const CreateGroup = ({ navigation }) => {
  const { user } = useSelector((state) => state.user);
  const [members, setMembers] = useState([]);
  const [name, setName] = useState('');
  const dispatch = useDispatch();
  const socket = connectSocket();

  const [visible, setVisible] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (socket) {
      socket.on('send_create_group', (data) => {
        if (data.status === 'success') {
          dispatch(createConversation(data.data));
          navigation.navigate('Chat', { conversationId: data.data.id, name: data.data.name });
        } else if (data.status === 'fail') {
          setErr('Tạo nhóm thất bại');
          setVisible(true);
        }
      });
    }
  }, [socket]);

  const [friends, setFriends] = useState(
    user &&
      user.friendList.map((fri) => {
        return { ...fri, isChecked: false };
      }),
  );

  const handleCheckBox = (id) => {
    let newMembers = [...members];
    const newFriends = friends.map((fri) => {
      if (fri.id === id) {
        if (fri.isChecked) {
          newMembers = newMembers.filter((mem) => mem !== id);
        } else {
          newMembers.push(id);
        }
        return { ...fri, isChecked: !fri.isChecked };
      }
      return fri;
    });

    setMembers(newMembers);
    setFriends(newFriends);
  };

  const handleCreateGroup = async () => {
    if (name.trim() === '') {
      setErr('Bạn chưa nhập tên nhóm!');
      setVisible(true);
      return;
    }

    if (members.length < 2) {
      setErr('Số lượng chọn ít nhất 2 thành viên!');
      setVisible(true);
      return;
    }

    const conversation = {
      name,
      members: [...members, user.id],
      admin: user.id,
      type: 'GROUP',
    };

    if (socket) {
      socket.emit('send_create_group', conversation);
    }
  };

  return (
    <View style={{ flex: 1, width: '100%' }}>
      <View
        style={{
          paddingVertical: 10,
          borderBottomWidth: 1,
          borderStyle: 'solid',
          borderBottomColor: 'rgba(0,0,0,0.2)',
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 15,
        }}
      >
        <TextInput
          placeholder="Nhập số điện thoại"
          placeholderTextColor="rgba(0,0,0,0.3)"
          style={{ width: '80%' }}
        />
        <Pressable style={{ marginLeft: 5 }}>
          <Text style={{ color: '#0091ff', fontSize: 14 }}>Tìm kiếm</Text>
        </Pressable>
      </View>
      <ScrollView style={{ paddingHorizontal: 15 }}>
        {friends &&
          friends.map((friend) => {
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
                  onPress={() => handleCheckBox(friend.id)}
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
                <Checkbox
                  color="#0091ff"
                  status={friend.isChecked ? 'checked' : 'unchecked'}
                  onPress={() => handleCheckBox(friend.id)}
                />
              </View>
            );
          })}
      </ScrollView>
      <View
        style={{
          paddingVertical: 10,
          paddingHorizontal: 15,
          marginTop: 'auto',
          borderTopWidth: 1,
          borderStyle: 'solid',
          borderTopColor: 'rgba(0,0,0,0.2)',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <TextInput
          placeholder="Nhập tên nhóm"
          placeholderTextColor="rgba(0,0,0,0.3)"
          style={{ width: '90%', fontSize: 16 }}
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <Pressable
          style={{
            paddingHorizontal: 5,
            paddingVertical: 5,
          }}
          onPress={handleCreateGroup}
        >
          <Text style={{ color: '#0091ff', fontSize: 16, fontWeight: 'bold' }}>Tạo</Text>
        </Pressable>
      </View>
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

export default CreateGroup;
