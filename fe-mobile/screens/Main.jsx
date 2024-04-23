import { AntDesign, EvilIcons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { Pressable, TextInput, View } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useEffect, useState } from 'react';
import { Divider, Menu, Snackbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import ConversationAPI from '../api/ConversationAPI';
import UserAPI from '../api/UserAPI';
import {
  createConversation,
  deleteConversation,
  getAllConversations,
} from '../redux/conversationSlice';
import { setUser } from '../redux/userSlice';
import connectSocket from '../utils/socketConfig';
import Contact from './Contact';
import Messager from './Messager';
import Profile from './Profile';

const Tab = createBottomTabNavigator();

const Main = ({ navigation }) => {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const { user } = useSelector((state) => state.user);
  const socket = connectSocket();

  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const data = await UserAPI.getMe();
      if (data) {
        dispatch(setUser(data));
      }
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await ConversationAPI.getAllConversationForUser();
      if (data) {
        dispatch(getAllConversations(data));
      }
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (socket && socket.disconnected) {
      socket.connect();
    }
  }, [socket]);

  useEffect(() => {
    if (socket && user) {
      socket.on(user.id, (data) => {
        if (data.code === 'receive_request_friend') {
          dispatch(setUser(data.data));
          setMsg(`${data.sender} đã gửi lời mời kết bạn`);
          setShow(true);
          return;
        }

        if (data.code === 'receive_accept_friend') {
          dispatch(setUser(data.data));
          setMsg(`${data.sender} đã chấp nhận lời mời kết bạn`);
          setShow(true);
          return;
        }

        if (data.code === 'receive_revoke_friend') {
          dispatch(setUser(data.data));
          setMsg(`${data.sender} đã hủy yêu cầu kết bạn`);
          setShow(true);
          return;
        }

        if (data.code === 'receive_delete_accept_friend') {
          dispatch(setUser(data.data));
          setMsg(`${data.sender} đã từ chối lời mời kết bạn`);
          setShow(true);
          return;
        }

        if (data.code === 'receive_delete_friend') {
          dispatch(setUser(data.data));
          setMsg(`${data.sender} đã xóa bạn khỏi danh sách bạn bè`);
          setShow(true);
          return;
        }

        if (data.code === 'receive_create_conversation') {
          dispatch(createConversation(data.data));
          setMsg(`${data.sender} đã tạo cuộc hội thoại với bạn`);
          setShow(true);
          return;
        }

        if (data.code === 'receive_create_group') {
          dispatch(createConversation(data.data));
          setMsg(`${data.sender} đã tạo nhóm ${data.name} với bạn`);
          setShow(true);
          return;
        }

        if (data.code === 'receive_delete_conversation') {
          dispatch(deleteConversation(data.data));
          setMsg(`${data.sender} đã xoá cuộc hội thoại với bạn`);
          setShow(true);
          return;
        }

        if (data.code === 'receive_delete_group') {
          dispatch(deleteConversation(data.data));
          setMsg(`${data.sender} đã giải tán nhóm ${data.name} với bạn`);
          setShow(true);
          return;
        }

        if (data.code === 'receive_join_group') {
          dispatch(createConversation(data.data));
          setMsg(`${data.sender} đã mời bạn tham gia nhóm ${data.name}`);
          setShow(true);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off(user?.id);
      }
    };
  }, [socket, user]);

  const handleAddFriend = () => {
    closeMenu();
    navigation.navigate('AddFriend');
  };
  const handleCreateGroup = () => {
    closeMenu();
    navigation.navigate('CreateGroup');
  };
  return (
    <SafeAreaView style={{ width: '100%', height: '100%', flex: 1 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 10,
          paddingHorizontal: 15,
          backgroundColor: '#0091ff',
        }}
      >
        <EvilIcons name="search" size={26} color="white" />
        <TextInput
          placeholder="Tìm kiếm"
          placeholderTextColor="white"
          style={{ marginHorizontal: 5, width: '80%', fontSize: 16 }}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchorPosition="bottom"
            style={{ paddingLeft: 10, paddingTop: 10 }}
            anchor={
              <Pressable style={{}} onPress={openMenu}>
                <AntDesign name="plus" size={26} color="white" />
              </Pressable>
            }
          >
            <Menu.Item
              onPress={handleAddFriend}
              title="Thêm bạn"
              leadingIcon="account-plus-outline"
              titleStyle={{ fontSize: 14 }}
            />
            <Divider />
            <Menu.Item
              onPress={handleCreateGroup}
              title="Tạo nhóm"
              leadingIcon="account-multiple-plus-outline"
              titleStyle={{ fontSize: 14 }}
            />
          </Menu>
        </View>
      </View>
      <Tab.Navigator screenOptions={{ tabBarStyle: {} }}>
        <Tab.Screen
          name="Messager"
          options={{
            headerShown: false,
            title: 'Tin nhắn',
            tabBarIcon: ({ size, focused, color }) => {
              return <AntDesign name="message1" size={size} color={color} />;
            },
          }}
          component={Messager}
        />
        <Tab.Screen
          name="Contact"
          options={{
            headerShown: false,
            title: 'Danh bạ',
            tabBarIcon: ({ size, focused, color }) => {
              return <MaterialIcons name="contact-page" size={size} color={color} />;
            },
          }}
          component={Contact}
        />
        <Tab.Screen
          name="Profile"
          options={{
            headerShown: false,
            title: 'Cá nhân',
            tabBarIcon: ({ size, focused, color }) => {
              return <FontAwesome name="user" size={size} color={color} />;
            },
          }}
          component={Profile}
        />
      </Tab.Navigator>
      <Snackbar
        visible={show}
        onDismiss={() => setShow(false)}
        action={{
          label: 'OK',
          onPress: () => setShow(false),
        }}
      >
        {msg}
      </Snackbar>
    </SafeAreaView>
  );
};

export default Main;
