import { useEffect } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TokenAPI from '../api/TokenAPI';

const Start = ({ navigation }) => {
  useEffect(() => {
    if (TokenAPI.getAccessToken() && TokenAPI.getRefreshToken()) {
      navigation.navigate('Main');
    }
  }, []);

  return (
    <SafeAreaView style={{ width: '100%', alignItems: 'center', flex: 1 }}>
      <View style={{ marginTop: 100 }}>
        <Image
          source={{
            uri: 'https://res.cloudinary.com/dthusmigo/image/upload/v1713187622/Chat_App_Logo_g4fw7f.png',
          }}
          style={{ width: 260, height: 260 }}
        />
      </View>
      <Pressable
        style={{
          marginTop: 'auto',
          paddingVertical: 15,
          width: '80%',
          backgroundColor: '#0091ff',
          borderRadius: 30,
        }}
        onPress={() => navigation.navigate('Login')}
      >
        <Text
          style={{ textAlign: 'center', fontSize: 18, color: '#fff', textTransform: 'uppercase' }}
        >
          Đăng nhập
        </Text>
      </Pressable>
      <Pressable
        style={{
          marginTop: 20,
          paddingVertical: 15,
          width: '80%',
          backgroundColor: 'rgba(0,0,0,0.1)',
          borderRadius: 30,
        }}
        onPress={() => navigation.navigate('Signup')}
      >
        <Text
          style={{ textAlign: 'center', fontSize: 18, color: '#000', textTransform: 'uppercase' }}
        >
          Đăng ký
        </Text>
      </Pressable>
      <Text
        style={{
          color: '#000',
          fontSize: 20,
          fontWeight: 'bold',
          marginTop: 'auto',
          marginBottom: 50,
        }}
      >
        Tiếng Việt
      </Text>
    </SafeAreaView>
  );
};

export default Start;
