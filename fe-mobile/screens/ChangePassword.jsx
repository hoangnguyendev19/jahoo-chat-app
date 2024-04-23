import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput } from 'react-native';
import { Snackbar } from 'react-native-paper';
import UserAPI from '../api/UserAPI';

const ChangePassword = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [err, setErr] = useState('');
  const [visible, setVisible] = useState(false);

  const handleChangePassword = async () => {
    if (
      currentPassword.trim() === '' ||
      newPassword.trim() === '' ||
      confirmPassword.trim() === '' ||
      (currentPassword.trim() === '' && newPassword.trim() === '' && confirmPassword.trim() === '')
    ) {
      setErr('Vui lòng nhập đầy đủ thông tin');
      setVisible(true);
      return;
    }

    if (currentPassword.length < 10 || newPassword.length < 10 || confirmPassword.length < 10) {
      setErr('Mật khẩu phải có ít nhất 10 ký tự');
      setVisible(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErr('Mật khẩu mới và nhập lại mật khẩu mới không khớp');
      setVisible(true);
      return;
    }

    const data = await UserAPI.updatePassword(currentPassword, newPassword);
    if (data) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      navigation.navigate('Profile');
    } else {
      setErr('Mật khẩu hiện tại không đúng');
      setVisible(true);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        alignItems: 'center',
        padding: 15,
      }}
    >
      <TextInput
        style={{
          width: '100%',
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 5,
          paddingHorizontal: 10,
          paddingVertical: 5,
          marginBottom: 15,
        }}
        placeholder="Mật khẩu hiện tại"
        secureTextEntry={true}
        value={currentPassword}
        onChangeText={(text) => setCurrentPassword(text)}
      />
      <TextInput
        style={{
          width: '100%',
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 5,
          paddingHorizontal: 10,
          paddingVertical: 5,
          marginBottom: 15,
        }}
        placeholder="Mật khẩu mới"
        secureTextEntry={true}
        value={newPassword}
        onChangeText={(text) => setNewPassword(text)}
      />
      <TextInput
        style={{
          width: '100%',
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 5,
          paddingHorizontal: 10,
          paddingVertical: 5,
          marginBottom: 40,
        }}
        placeholder="Nhập lại mật khẩu mới"
        secureTextEntry={true}
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
      />
      <Pressable
        style={{
          width: '100%',
          backgroundColor: '#0091ff',
          padding: 10,
          borderRadius: 5,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 15,
        }}
        onPress={handleChangePassword}
      >
        <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>Thay đổi mật khẩu</Text>
      </Pressable>
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
    </ScrollView>
  );
};

export default ChangePassword;
