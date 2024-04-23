import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Avatar, Snackbar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import UserAPI from '../api/UserAPI';
import { setUser } from '../redux/userSlice';
import connectSocket from '../utils/socketConfig';

const AddFriend = ({ navigation }) => {
  const dispatch = useDispatch();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [friend, setFriend] = useState(null);

  const [visible, setVisible] = useState(false);
  const [err, setErr] = useState('');
  const [status, setStatus] = useState('request');
  const { user } = useSelector((state) => state.user);
  const socket = connectSocket();

  useEffect(() => {
    if (socket) {
      socket.on('send_request_friend', (data) => {
        if (data.status === 'success') {
          dispatch(setUser(data.data));
          setStatus('revoke');
        } else if (data.status === 'fail') {
          // toast.error(data.message);
          setErr(data.message);
          setVisible(true);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('send_request_friend');
      }
    };
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on('send_accept_friend', (data) => {
        if (data.status === 'success') {
          dispatch(setUser(data.data));
          setStatus('friend');
        } else if (data.status === 'fail') {
          // toast.error(data.message);
          setErr(data.message);
          setVisible(true);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('send_accept_friend');
      }
    };
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on('send_revoke_friend', (data) => {
        if (data.status === 'success') {
          dispatch(setUser(data.data));
          setStatus('request');
        } else if (data.status === 'fail') {
          // toast.error(data.message);
          setErr(data.message);
          setVisible(true);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('send_revoke_friend');
      }
    };
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on('send_delete_accept_friend', (data) => {
        if (data.status === 'success') {
          dispatch(setUser(data.data));
          setStatus('request');
        } else if (data.status === 'fail') {
          // toast.error(data.message);
          setErr(data.message);
          setVisible(true);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('send_delete_accept_friend');
      }
    };
  }, [socket]);

  const handleSearch = async () => {
    const data = await UserAPI.getUserByPhoneNumber(phoneNumber);
    if (data) {
      setFriend(data);
      if (user.friendList.find((friend) => friend.id === data.id)) {
        setStatus('friend');
      } else if (user.sendedRequestList.find((friend) => friend.id === data.id)) {
        setStatus('revoke');
      } else if (user.receivedRequestList.find((friend) => friend.id === data.id)) {
        setStatus('accept');
      } else {
        setStatus('request');
      }
    } else {
      setErr('Không tìm thấy người dùng với số điện thoại này!');
      setVisible(true);
    }
  };

  const handleRequestFriend = async () => {
    if (socket) {
      socket.emit('send_request_friend', {
        senderId: user.id,
        receiverId: friend.id,
      });
    }
  };

  const handleRevokeFriend = async () => {
    if (socket) {
      socket.emit('send_revoke_friend', {
        senderId: user.id,
        receiverId: friend.id,
      });
    }
  };

  const handleAcceptFriend = async () => {
    if (socket) {
      socket.emit('send_accept_friend', {
        senderId: user.id,
        receiverId: friend.id,
      });
    }
  };

  const handleDeleteAcceptFriend = async () => {
    if (socket) {
      socket.emit('send_delete_accept_friend', {
        senderId: user.id,
        receiverId: friend.id,
      });
    }
  };

  return (
    <View style={{ flex: 1, width: '100%' }}>
      <View
        style={{
          paddingVertical: 10,
          paddingHorizontal: 15,
          marginBottom: 10,
          borderBottomWidth: 1,
          borderStyle: 'solid',
          borderBottomColor: 'rgba(0,0,0,0.2)',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <TextInput
          placeholder="Nhập số điện thoại"
          placeholderTextColor="rgba(0,0,0,0.3)"
          style={{ width: '80%' }}
          value={phoneNumber}
          onChangeText={(text) => setPhoneNumber(text)}
        />
        <Pressable style={{ marginLeft: 5 }} onPress={handleSearch}>
          <Text style={{ color: '#0091ff', fontSize: 14 }}>Tìm kiếm</Text>
        </Pressable>
      </View>
      {friend && (
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'flex-start',
            paddingVertical: 10,
            paddingHorizontal: 15,
          }}
        >
          <Pressable
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
            }}
            onPress={() => navigation.navigate('InforProfile', { userId: friend.id })}
          >
            {friend.avatarUrl ? (
              <Avatar.Image size={40} source={friend.avatarUrl} />
            ) : (
              <Avatar.Text size={40} label={friend.fullName.slice(0, 1)} />
            )}
            <Text
              numberOfLines={2}
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                marginLeft: 10,
                maxWidth: 140,
              }}
            >
              {friend.fullName}
            </Text>
          </Pressable>
          {status === 'revoke' && (
            <Pressable
              style={{
                paddingHorizontal: 10,
                paddingVertical: 10,
                borderRadius: 5,
                backgroundColor: 'rgba(0,0,0,0.1)',
              }}
              onPress={handleRevokeFriend}
            >
              <Text style={{ color: '#000', fontSize: 12 }}>Thu hồi</Text>
            </Pressable>
          )}
          {status === 'request' && (
            <Pressable
              style={{
                paddingHorizontal: 10,
                paddingVertical: 10,
                borderRadius: 5,
                backgroundColor: '#0091ff',
              }}
              onPress={handleRequestFriend}
            >
              <Text style={{ color: '#fff', fontSize: 12 }}>Gửi lời mời</Text>
            </Pressable>
          )}
          {status === 'accept' && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Pressable
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                  borderRadius: 5,
                  backgroundColor: '#0091ff',
                  marginRight: 5,
                }}
                onPress={handleAcceptFriend}
              >
                <Text style={{ color: '#fff', fontSize: 12 }}>Chấp nhận</Text>
              </Pressable>
              <Pressable
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                  borderRadius: 5,
                  backgroundColor: 'rgba(0,0,0,0.1)',
                }}
                onPress={handleDeleteAcceptFriend}
              >
                <Text style={{ color: '#000', fontSize: 12 }}>Xoá</Text>
              </Pressable>
            </View>
          )}

          {status === 'friend' && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Pressable style={{ marginRight: 25 }}>
                <Feather name="message-circle" size={24} color="black" />
              </Pressable>
              <Pressable>
                <Feather name="phone" size={24} color="black" />
              </Pressable>
            </View>
          )}
        </View>
      )}
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

export default AddFriend;
