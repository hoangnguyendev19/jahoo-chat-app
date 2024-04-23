import { ImageBackground, Pressable, Text, View } from 'react-native';
import { Avatar, Snackbar } from 'react-native-paper';

import { Entypo } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UserAPI from '../api/UserAPI';
import background from '../assets/images/img-banner-1.png';
import LineInfor from '../components/LineInfor';
import { setUser } from '../redux/userSlice';
import { convertToDate } from '../utils/handler';
import connectSocket from '../utils/socketConfig';

const InforProfile = ({ route, navigation }) => {
  const { userId } = route.params;
  const [currUser, setCurrUser] = useState({});
  const { user } = useSelector((state) => state.user);
  const [delFriend, setDelFriend] = useState(false);
  const socket = connectSocket();

  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const data = await UserAPI.getUserById(userId);
      if (data) {
        setCurrUser(data);
      }
    };
    fetchData();
  }, [userId]);

  useEffect(() => {
    if (user && currUser) {
      const flag = user.friendList.filter((friend) => friend.id === currUser.id);
      if (flag.length > 0) {
        setDelFriend(true);
      }
    }
  }, [user, currUser]);

  useEffect(() => {
    if (socket) {
      socket.on('send_delete_friend', (data) => {
        if (data.status === 'success') {
          dispatch(setUser(data.data));
          navigation.goBack();
        } else if (data.status === 'fail') {
          setErr('Xoá bạn bè thất bại!');
          setVisible(true);
        }
      });
    }
  }, [socket]);

  const handleDeleteFriend = async () => {
    if (socket) {
      socket.emit('send_delete_friend', {
        senderId: user.id,
        receiverId: currUser.id,
      });
    }
  };

  const itemsInfor = [
    {
      title: <Text style={{ fontWeight: 500 }}>Giới Tính</Text>,
      content: <Text>{user?.gender ? 'Nam' : 'Nữ'}</Text>,
    },
    {
      title: <Text style={{ fontWeight: 500 }}>Ngày sinh</Text>,
      content: <Text>{convertToDate(user?.dateOfBirth)}</Text>,
    },
    {
      title: <Text style={{ fontWeight: 500 }}>Email</Text>,
      content: <Text>{user?.email}</Text>,
    },
  ];

  const itemsChange = [
    {
      title: (
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
          <Entypo name="remove-user" size={20} color="red" />
        </View>
      ),
      content: <Text style={{ color: 'red' }}>Xoá bạn bè</Text>,
      action: handleDeleteFriend,
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: undefined, backgroundColor: 'white', marginBottom: 3 }}>
        <ImageBackground
          source={background}
          style={{
            width: '100%',
            height: 200,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'flex-end',
          }}
        >
          {currUser?.avatar ? (
            <Avatar.Image
              size={80}
              source={{ uri: currUser?.avatar }}
              style={{
                position: 'absolute',
                bottom: -30,
                left: '50%',
                transform: [{ translateX: -35 }],
              }}
            />
          ) : (
            <Avatar.Text
              size={80}
              label={currUser?.fullName?.slice(0, 1)}
              style={{
                position: 'absolute',
                bottom: -30,
                left: '50%',
                transform: [{ translateX: -35 }],
              }}
            />
          )}
        </ImageBackground>
        <View style={{ marginTop: 40, marginHorizontal: 8 }}>
          <View style={{ marginBottom: 6, flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={{ fontSize: 20, fontWeight: 500 }}>{currUser?.fullName}</Text>
          </View>

          {itemsInfor.map((item, index) => {
            return <LineInfor key={index} item={item} />;
          })}
        </View>
        {delFriend &&
          itemsChange.map((item, index) => (
            <Pressable key={index} onPress={item.action}>
              <LineInfor item={item} />
            </Pressable>
          ))}
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

export default InforProfile;
