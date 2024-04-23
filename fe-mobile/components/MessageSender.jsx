import { Image, Linking, Pressable, Text, View } from 'react-native';
import { Menu } from 'react-native-paper';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { convertToTime } from '../utils/handler';
import { Video, ResizeMode } from 'expo-av';

const MessageSender = ({ message, handleZoomImage, handleRevokeMessage }) => {
  const [visible, setVisible] = useState(false);
  const { content, createdAt, updatedAt, type, isRevoked, id, likes } = message;
  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);
  const [status, setStatus] = useState({});
  const video = useRef(null);

  return (
    <View
      style={{
        flex: 1,
        marginBottom: 30,
        flexDirection: 'row',
        marginRight: 10,
        alignItems: 'center',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: 'auto',
        }}
      >
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
            }}
          >
            <Text style={{ color: 'black', fontStyle: 'italic' }}>Tin nhắn đã được thu hồi</Text>
          </View>
        ) : (
          <>
            <Menu
              visible={visible}
              onDismiss={closeMenu}
              anchorPosition="bottom"
              style={{ paddingLeft: 10, paddingTop: 10 }}
              anchor={
                <Pressable style={{}} onPress={openMenu}>
                  <Ionicons name="ellipsis-vertical" size={24} color="white" />
                </Pressable>
              }
            >
              <Menu.Item
                onPress={() => handleRevokeMessage(id)}
                title="Thu hồi"
                leadingIcon="undo"
                titleStyle={{ fontSize: 14 }}
              />
            </Menu>
            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 10,
                borderRadius: 20,
                backgroundColor: '#fff',
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
                  {content.includes('docx') && (
                    <AntDesign name="wordfile1" size={40} color="black" />
                  )}
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
              <Text
                style={{ color: 'rgba(0,0,0,0.2)', fontSize: 12, marginTop: 5, marginBottom: 10 }}
              >
                {convertToTime(createdAt)}
              </Text>
              <View
                style={{
                  position: 'absolute',
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  right: 20,
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
            </View>
          </>
        )}
      </View>
    </View>
  );
};

export default MessageSender;
