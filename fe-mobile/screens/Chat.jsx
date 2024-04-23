import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Modal, Snackbar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import MessageAPI from '../api/MessageAPI';
import UploadAPI from '../api/UploadAPI';
import MessageReceiver from '../components/MessageReceiver';
import MessageSender from '../components/MessageSender';
import { addUser, assignAdmin, deleteConversation, removeUser } from '../redux/conversationSlice';
import connectSocket from '../utils/socketConfig';

const TYPING_DELAY = 5000;

const Chat = ({ navigation, route }) => {
  const [content, setContent] = useState('');
  const [messages, setMessages] = useState([]);
  const socket = connectSocket();
  const dispatch = useDispatch();

  const { conversationId, name } = route.params;
  const { user } = useSelector((state) => state.user);
  const [visible, setVisible] = useState(false);
  const [image, setImage] = useState('');

  const [typing, setTyping] = useState(false);
  const [userTyping, setUserTyping] = useState('');
  let typingTimer = null;

  const [err, setErr] = useState('');
  const [show, setShow] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: name,
    });

    const fetchData = async () => {
      const data = await MessageAPI.getAllMessageForConversation(conversationId);

      if (data) {
        setMessages(data);
      }
    };

    fetchData();
  }, [navigation, conversationId]);

  useEffect(() => {
    if (socket && user) {
      socket.on(user.id, (data) => {
        if (data.code === 'receive_remove_yourself') {
          dispatch(removeUser(data.data));
          setErr(`${data.sender} đã rời khỏi nhóm ${data.name}`);
          setShow(true);
          return;
        }

        if (data.code === 'receive_assign_admin') {
          dispatch(assignAdmin(data.data));
          setErr(`Trưởng nhóm đã trao cho ${data.member} làm trưởng nhóm của nhóm ${data.name}`);
          setShow(true);
          return;
        }

        if (data.code === 'receive_remove_member') {
          dispatch(removeUser(data.data));
          setErr(`Trưởng nhóm đã xóa ${data.member} khỏi nhóm ${data.name}`);
          setShow(true);
        }

        if (data.code === 'receive_leave_group') {
          dispatch(deleteConversation(data.data));
          setErr(`Trưởng nhóm đã xoá bạn khỏi nhóm ${data.name}`);
          setShow(true);
        }

        if (data.code === 'receive_add_member') {
          dispatch(addUser(data.data));
          setErr(`${data.sender} đã thêm ${data.member} vào nhóm ${data.name}`);
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

  useEffect(() => {
    if (socket) {
      socket.emit('join_room', {
        conversationId: conversationId,
        userId: user.id,
      });
    }

    return () => {
      if (socket) {
        socket.off('join_room');
      }
    };
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on('typing', (fullName) => {
        setTyping(fullName !== '');
        if (fullName !== '') {
          setUserTyping(fullName);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('typing');
      }
    };
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on('receive_message', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      return () => {
        socket.off('receive_message');
      };
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on('revoke_message', (messageId) => {
        setMessages((prevMessages) => {
          return prevMessages.map((msg) => {
            if (msg.id === messageId) {
              return { ...msg, isRevoked: true };
            }
            return msg;
          });
        });
      });

      return () => {
        socket.off('revoke_message');
      };
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on('like_message', (messageId) => {
        setMessages((prevMessages) => {
          return prevMessages.map((msg) => {
            if (msg.id === messageId) {
              return { ...msg, likes: [...msg.likes, user.id] };
            }
            return msg;
          });
        });
      });

      return () => {
        socket.off('like_message');
      };
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on('unlike_message', (messageId) => {
        setMessages((prevMessages) => {
          return prevMessages.map((msg) => {
            if (msg.id === messageId) {
              const newLikes = msg.likes.filter((uid) => uid !== user.id);
              return { ...msg, likes: [...newLikes] };
            }
            return msg;
          });
        });
      });

      return () => {
        socket.off('unlike_message');
      };
    }
  }, [socket]);

  const handleSendMessage = () => {
    const message = {
      content,
      type: 'TEXT',
      conversationId,
      senderId: user.id,
    };
    if (socket) {
      socket.emit('send_message', message);
      setContent('');
    }
  };

  const handleRevokeMessage = (messageId) => {
    if (socket) {
      socket.emit('revoke_message', { messageId, userId: user.id });
    }
  };

  const handleLikeMessage = (messageId) => {
    if (socket) {
      socket.emit('like_message', { messageId, userId: user.id });
    }
  };

  const handleUnlikeMessage = (messageId) => {
    if (socket) {
      socket.emit('unlike_message', { messageId, userId: user.id });
    }
  };

  const handleZoomImage = (img) => {
    setImage(img);
    setVisible(true);
  };

  const handlePickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        // limit file size
        if (result.assets[0].size > 2097152) {
          setErr('File quá lớn, vui lòng chọn file dưới 2MB!');
          setShow(true);
          return;
        }

        const formData = new FormData();
        formData.append('image', {
          uri: result.assets[0].uri,
          name: result.assets[0].type === 'image' ? 'image' : 'video',
          type: result.assets[0].mimeType,
        });

        const data = await UploadAPI.uploadImage(formData);

        if (data) {
          const message = {
            content: data,
            type: result.assets[0].type === 'image' ? 'IMAGE' : 'VIDEO',
            conversationId,
            senderId: user.id,
          };
          if (socket) {
            socket.emit('send_message', message);
          }
        }
      }
    } catch (error) {
      console.log('Error: ', error.message);
    }
  };

  const handlePickFile = async () => {
    try {
      let result = await DocumentPicker.getDocumentAsync();
      if (!result.canceled) {
        // limit file size
        if (result.assets[0].size > 2097152) {
          setErr('File quá lớn, vui lòng chọn file dưới 2MB!');
          setShow(true);
          return;
        }

        const formData = new FormData();
        formData.append('file', {
          uri: result.assets[0].uri,
          name: result.assets[0].name,
          type: result.assets[0].mimeType,
        });

        const data = await UploadAPI.uploadFile(formData);
        if (data) {
          const message = {
            content: data,
            type: 'FILE',
            conversationId,
            senderId: user.id,
          };
          if (socket) {
            socket.emit('send_message', message);
          }
        }
      }
    } catch (error) {
      console.log('Error: ', error.message);
    }
  };

  const handleChange = (text) => {
    setContent(text);
    if (!typing) {
      handleTypingStart();
    }

    handleTypingEnd();
  };

  const handleTypingStart = () => {
    socket.emit('typing_start', {
      conversationId: conversationId,
      userId: user?.id,
    });
    clearTimeout(typingTimer); // Clear any existing timer
  };

  const handleTypingEnd = () => {
    typingTimer = setTimeout(() => {
      socket.emit('typing_end', {
        conversationId: conversationId,
        userId: user?.id,
      });
      setTyping(false);
    }, TYPING_DELAY);
  };

  return (
    <View
      style={{
        flex: 1,
        width: '100%',
      }}
    >
      <ScrollView style={{ paddingTop: 10, backgroundColor: 'rgba(0,0,0,0.1)' }}>
        {messages.length > 0 &&
          messages.map((message) => {
            if (message.senderId.id === user?.id) {
              return (
                <MessageSender
                  key={message.id}
                  message={message}
                  handleZoomImage={handleZoomImage}
                  handleRevokeMessage={handleRevokeMessage}
                />
              );
            } else {
              return (
                <MessageReceiver
                  key={message.id}
                  message={message}
                  handleZoomImage={handleZoomImage}
                  handleLikeMessage={handleLikeMessage}
                  handleUnlikeMessage={handleUnlikeMessage}
                />
              );
            }
          })}
      </ScrollView>
      <View style={{ marginTop: 'auto', position: 'relative' }}>
        <View
          style={{
            backgroundColor: 'transparent',
            position: 'absolute',
            top: -20,
            left: 0,
            right: 0,
          }}
        >
          {typing && (
            <Text style={{ color: '#0091ff', paddingHorizontal: 15, fontSize: 14 }}>
              {`${userTyping} đang nhập tin nhắn...`}
            </Text>
          )}
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 15,
            paddingVertical: 10,
            borderTopWidth: 1,
            borderStyle: 'solid',
            borderColor: '#ccc',
          }}
        >
          <TextInput
            placeholder="Tin nhắn"
            placeholderTextColor="rgba(0,0,0,0.2)"
            style={{ width: '60%' }}
            value={content}
            onChangeText={(text) => handleChange(text)}
          />
          <Pressable onPress={handlePickFile}>
            <Ionicons name="attach" size={24} color="#0091ff" />
          </Pressable>
          <Pressable style={{ marginLeft: 20 }} onPress={handlePickImage}>
            <Ionicons name="image-outline" size={24} color="#0091ff" />
          </Pressable>
          <Pressable style={{ marginLeft: 20 }} onPress={handleSendMessage}>
            <Text style={{ color: '#0091ff', fontSize: 16, fontWeight: 'bold' }}>Gửi</Text>
          </Pressable>
        </View>
      </View>
      <Snackbar
        visible={show}
        onDismiss={() => setShow(false)}
        action={{
          label: 'OK',
          onPress: () => {
            setShow(false);
          },
        }}
      >
        {err}
      </Snackbar>
      <Modal
        visible={visible}
        onDismiss={() => setVisible(false)}
        contentContainerStyle={{
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image source={{ uri: image }} style={{ width: 300, height: 300 }} />
      </Modal>
    </View>
  );
};

export default Chat;
