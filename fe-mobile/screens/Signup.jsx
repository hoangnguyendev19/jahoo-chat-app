import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Snackbar, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import UserAPI from '../api/UserAPI';

const Signup = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');

  const [visible, setVisible] = useState(false);
  const [err, setErr] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  const handleSignup = async () => {
    if (fullName.trim() === '') {
      setErr('Bạn chưa nhập họ và tên!');
      setVisible(true);
      return;
    }

    if (phoneNumber.trim() === '') {
      setErr('Bạn chưa nhập số điện thoại!');
      setVisible(true);
      return;
    }

    if (isNaN(phoneNumber)) {
      setErr('Số điện thoại không hợp lệ!');
      setVisible(true);
      return;
    }

    if (phoneNumber.length !== 10) {
      setErr('Số điện thoại phải có 10 chữ số!');
      setVisible(true);
      return;
    }

    if (email.trim() === '') {
      setErr('Bạn chưa nhập email!');
      setVisible(true);
      return;
    }

    if (!email.includes('@gmail.com')) {
      setErr('Email không hợp lệ!');
      setVisible(true);
      return;
    }

    if (password.trim() === '') {
      setErr('Bạn chưa nhập mật khẩu!');
      setVisible(true);
      return;
    }

    if (password.length < 10) {
      setErr('Mật khẩu có ít nhất 10 ký tự!');
      setVisible(true);
      return;
    }

    if (password !== rePassword) {
      setErr('Mật khẩu nhập lại không khớp với mật khẩu!');
      setVisible(true);
      return;
    }

    const data = await UserAPI.signup(email, phoneNumber);

    if (data) {
      navigation.navigate('Otp', { fullName, email, phoneNumber, password });
    } else {
      setErr('Số điện thoại hoặc email đã tồn tại!');
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
        <Text style={{ fontSize: 12 }}>
          Vui lòng nhập họ và tên, số điện thoại và mật khẩu để đăng ký
        </Text>
      </View>
      <TextInput
        label="Họ và tên"
        style={{
          marginHorizontal: 15,
          fontSize: 16,
          marginTop: 20,
          backgroundColor: '#fff',
          color: '#000',
        }}
        value={fullName}
        onChangeText={(text) => setFullName(text)}
      />
      <TextInput
        label="Số điện thoại"
        style={{
          marginHorizontal: 15,
          fontSize: 16,
          marginTop: 20,
          backgroundColor: '#fff',
          color: '#000',
        }}
        value={phoneNumber}
        onChangeText={(text) => setPhoneNumber(text)}
      />
      <TextInput
        label="Email"
        style={{
          marginHorizontal: 15,
          fontSize: 16,
          marginTop: 20,
          backgroundColor: '#fff',
          color: '#000',
        }}
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        label="Mật khẩu"
        secureTextEntry={!showPassword}
        style={{
          marginHorizontal: 15,
          fontSize: 16,
          marginTop: 20,
          backgroundColor: '#fff',
          color: '#000',
        }}
        right={
          <TextInput.Icon
            icon={showPassword ? 'eye-off' : 'eye'}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <TextInput
        label="Nhập lại mật khẩu"
        secureTextEntry={!showRePassword}
        style={{
          marginHorizontal: 15,
          fontSize: 16,
          marginTop: 20,
          backgroundColor: '#fff',
          color: '#000',
        }}
        right={
          <TextInput.Icon
            icon={showRePassword ? 'eye-off' : 'eye'}
            onPress={() => setShowRePassword(!showRePassword)}
          />
        }
        value={rePassword}
        onChangeText={(text) => setRePassword(text)}
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
          onPress={handleSignup}
        >
          <Text
            style={{ textAlign: 'center', fontSize: 16, color: '#fff', textTransform: 'uppercase' }}
          >
            Đăng ký
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

export default Signup;
