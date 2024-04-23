import { Image, Linking, Pressable, Text, View } from 'react-native';
import { Avatar } from 'react-native-paper';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { convertToTime } from '../utils/handler';
import { useSelector } from 'react-redux';
import { Video, ResizeMode } from 'expo-av';

const MessageReceiver = ({ message, handleZoomImage, handleLikeMessage, handleUnlikeMessage }) => {
  const { content, createdAt, updatedAt, senderId, type, isRevoked, likes, id } = message;
  const { user } = useSelector((state) => state.user);
  const statusLike = likes && likes.includes(user?.id);

  const [status, setStatus] = useState({});
  const video = useRef(null);

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        marginLeft: 10,
        alignItems: 'center',
        marginBottom: 30,
      }}
    >
      {senderId.avatarUrl ? (
        <Avatar.Image size={30} source={{ uri: senderId.avatarUrl }} />
      ) : (
        <Avatar.Text size={30} label={senderId.fullName.slice(0, 1)} />
      )}
      {isRevoked ? (
        <View
          style={{
            width: 200,
            paddingHorizontal: 10,
            paddingVertical: 10,
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: 'black',
            borderRadius: 20,
            backgroundColor: 'rgba(0,0,0,0.3)',
            marginLeft: 10,
          }}
        >
          <Text style={{ color: 'black', fontStyle: 'italic' }}>Tin nhắn đã được thu hồi</Text>
        </View>
      ) : (
        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 10,
            borderRadius: 20,
            backgroundColor: '#fff',
            marginLeft: 10,
          }}
        >
          {type === 'TEXT' && <Text>{content}</Text>}
          {type === 'FILE' && (
            <Pressable
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.1)',
                padding: 10,
                borderRadius: 10,
              }}
              onPress={() => {
                Linking.openURL(content);
              }}
            >
              {content.includes('pdf') && <AntDesign name="pdffile1" size={40} color="black" />}
              {content.includes('docx') && <AntDesign name="wordfile1" size={40} color="black" />}
              <Text style={{ marginLeft: 5, color: 'black' }}>
                {content.split('/').pop().split('%')[0]}
              </Text>
            </Pressable>
          )}
          {type === 'VIDEO' && (
            <View>
              <Video
                ref={video}
                style={{ width: 250, height: 180 }}
                source={{
                  uri: content,
                }}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                isLooping
                onPlaybackStatusUpdate={(status) => setStatus(() => status)}
              />
              <View style={{ position: 'absolute', top: '45%', left: '45%' }}>
                <Pressable
                  onPress={() =>
                    status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()
                  }
                >
                  {status.isPlaying ? (
                    <AntDesign name="pause" size={30} color="black" />
                  ) : (
                    <AntDesign name="play" size={30} color="black" />
                  )}
                </Pressable>
              </View>
              <Pressable
                style={{
                  paddingVertical: 10,
                  backgroundColor: 'rgba(0,0,0,0.1)',
                  marginTop: 5,
                }}
                onPress={() => Linking.openURL(content)}
              >
                <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>
                  Tải xuống
                </Text>
              </Pressable>
            </View>
          )}
          {type === 'IMAGE' && (
            <View>
              <Pressable
                style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                onPress={() => handleZoomImage(content)}
              >
                <Image source={{ uri: content }} style={{ width: 220, height: 220 }} />
              </Pressable>
              <Pressable
                style={{
                  paddingVertical: 10,
                  backgroundColor: 'rgba(0,0,0,0.1)',
                  marginTop: 5,
                }}
                onPress={() => Linking.openURL(content)}
              >
                <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>
                  Tải xuống
                </Text>
              </Pressable>
            </View>
          )}
          <Text style={{ color: 'rgba(0,0,0,0.2)', fontSize: 12, marginTop: 5, marginBottom: 10 }}>
            {convertToTime(createdAt)}
          </Text>
          <View
            style={{
              position: 'absolute',
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              right: 50,
              bottom: -15,
              borderWidth: 1,
              borderStyle: 'solid',
              borderRadius: 20,
              paddingVertical: 5,
              paddingHorizontal: 5,
              backgroundColor: '#fff',
            }}
          >
            <Ionicons name="heart" size={16} color="red" />
            <Text style={{ fontWeight: 'bold', marginLeft: 3 }}>{likes.length}</Text>
          </View>
          <Pressable
            style={{
              position: 'absolute',
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              right: 10,
              bottom: -15,
              borderWidth: 1,
              borderStyle: 'solid',
              borderRadius: 15,
              paddingVertical: 5,
              paddingHorizontal: 5,
              backgroundColor: '#fff',
            }}
            onPress={statusLike ? () => handleUnlikeMessage(id) : () => handleLikeMessage(id)}
          >
            <Ionicons name="heart" size={16} color={statusLike ? 'red' : 'gray'} />
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default MessageReceiver;
