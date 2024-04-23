import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Snackbar, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import UserAPI from '../api/UserAPI';
import { signup } from '../redux/userSlice';

const Otp = ({ navigation, route }) => {
  const [otp, setOtp] = useState('');
  const { fullName, email, phoneNumber, password } = route.params;
  const dispatch = useDispatch();

  const [visible, setVisible] = useState(false);
  const [err, setErr] = useState('');

  const handleVerifyOtp = async () => {
    if (otp.trim() === '') {
      setErr('Bạn chưa nhập mã OTP!');
      setVisible(true);
      return;
    }

    if (otp.length !== 6) {
      setErr('Mã OTP phải có 6 chữ số!');
      setVisible(true);
      return;
    }

    const data = await UserAPI.verifyOtp(fullName, email, phoneNumber, password, otp);

    if (data) {
      const socket = io(`${process.env.EXPO_PUBLIC_SOCKET_URL}`);
      socket.emit('login', data.user.id);
      dispatch(signup(data));
      setOtp('');
      navigation.navigate('Main');
    } else {
      setErr('Mã OTP không chính xác!');
      setVisible(true);
    }
  };

  const handleSendOtp = async () => {
    const data = await UserAPI.signup(email, phoneNumber);
    if (data) {
      setErr('Mã OTP đã được gửi. Vui lòng vào email để lấy!');
      setVisible(true);
    } else {
      setErr('Có lỗi xảy ra. Vui lòng thử lại!');
      setVisible(true);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, width: '100%' }}>
      <View
        style={{
          paddingVertical: 10,
          paddingHorizontal: 10,
          backgroundColor: 'rgba(0,0,0,0.1)',
          marginTop: -30,
        }}
      >
        <Text style={{ fontSize: 12 }}>
          Vui lòng vào email để lấy mã OTP và nhập vào ô bên dưới
        </Text>
      </View>
      <TextInput
        label="Nhập mã OTP"
        style={{
          marginHorizontal: 15,
          fontSize: 16,
          marginTop: 20,
          backgroundColor: '#fff',
          color: '#000',
        }}
        value={otp}
        onChangeText={(text) => setOtp(text)}
      />
      <View style={{ display: 'flex', alignItems: 'center' }}>
        <Pressable
          style={{
            marginTop: 40,
            paddingVertical: 15,
            width: '80%',
            backgroundColor: '#0091ff',
            borderRadius: 30,
          }}
          onPress={handleVerifyOtp}
        >
          <Text
            style={{ textAlign: 'center', fontSize: 16, color: '#fff', textTransform: 'uppercase' }}
          >
            Xác nhận
          </Text>
        </Pressable>
      </View>
      <View style={{ display: 'flex', alignItems: 'center' }}>
        <Pressable
          style={{
            marginTop: 20,
            paddingVertical: 15,
            width: '80%',
            backgroundColor: 'rgba(0,0,0,0.1)',
            borderRadius: 30,
          }}
          onPress={handleSendOtp}
        >
          <Text
            style={{ textAlign: 'center', fontSize: 16, color: '#000', textTransform: 'uppercase' }}
          >
            Gửi lại mã otp
          </Text>
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
    </SafeAreaView>
  );
};

export default Otp;
