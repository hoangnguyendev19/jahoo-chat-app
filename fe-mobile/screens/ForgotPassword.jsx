import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Snackbar, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import UserAPI from '../api/UserAPI';

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [visible, setVisible] = useState(false);
  const [err, setErr] = useState('');

  const handleSubmit = async () => {
    if (email.trim() === '') {
      setErr('Bạn chưa nhập email!');
      setVisible(true);
      return;
    }

    if (!email.match(/.+@gmail.com/)) {
      setErr('Email không hợp lệ!');
      setVisible(true);
      return;
    }

    const data = await UserAPI.forgotPassword(email);

    if (data) {
      setErr('Vui lòng kiểm tra email để lấy lại mật khẩu!');
      setVisible(true);
    } else {
      setErr('Email không tồn tại!');
      setVisible(true);
    }
  };

  return (
    <SafeAreaView style={{ width: '100%', flex: 1 }}>
      <View
        style={{
          paddingVertical: 10,
          paddingHorizontal: 10,
          backgroundColor: 'rgba(0,0,0,0.1)',
          marginTop: -30,
        }}
      >
        <Text style={{ fontSize: 12 }}>Nhập email để lấy lại mật khẩu</Text>
      </View>
      <TextInput
        label="Email"
        style={{
          marginHorizontal: 15,
          fontSize: 16,
          marginTop: 30,
          backgroundColor: '#fff',
          color: '#000',
        }}
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Pressable
          style={{
            marginTop: 50,
            paddingVertical: 15,
            width: '80%',
            backgroundColor: '#0091ff',
            borderRadius: 30,
            marginHorizontal: 'auto',
          }}
          onPress={handleSubmit}
        >
          <Text
            style={{ textAlign: 'center', fontSize: 16, color: '#fff', textTransform: 'uppercase' }}
          >
            Làm mới
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

export default ForgotPassword;
