import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Avatar, RadioButton, Snackbar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import UploadAPI from '../api/UploadAPI';
import UserAPI from '../api/UserAPI';
import { setUser } from '../redux/userSlice';
import { convertToDate } from '../utils/handler';

const ChangeProfile = () => {
  const { user } = useSelector((state) => state.user);
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [dateOfBirth, setDateOfBirth] = useState(user?.dateOfBirth || new Date());
  const [gender, setGender] = useState(user?.gender ? 'male' : 'female');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [coverImage, setCoverImage] = useState(user?.coverImage || '');

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [animating, setAnimating] = useState(false);
  const [visible, setVisible] = useState(false);
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');

  const handlePickAvatar = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setAvatarUrl(result.assets[0].uri);
      }
    } catch (error) {
      console.log('Error: ', error.message);
    }
  };

  const handlePickCoverImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setCoverImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log('Error: ', error.message);
    }
  };

  const handleUpdateProfile = async () => {
    if (fullName === '') {
      setErr('Bạn chưa nhập họ và tên!');
      setVisible(true);
      return;
    }

    if (email.trim() === '') {
      setErr('Bạn chưa nhập email!');
      setVisible(true);
      return;
    }

    setAnimating(true);

    let newUser = {
      fullName,
      email,
      dateOfBirth,
      gender: gender === 'male' ? true : false,
      avatarUrl,
      coverImage,
    };

    if (!newUser.avatarUrl.includes('https')) {
      const formAvatarUrl = new FormData();
      formAvatarUrl.append('file', {
        uri: newUser.avatarUrl,
        name: 'file',
        type: 'image/jpeg',
      });

      const avatar = await UploadAPI.uploadFile(formAvatarUrl);
      if (avatar) {
        newUser = { ...newUser, avatarUrl: avatar };
      }
    }

    if (!newUser.coverImage.includes('https')) {
      const formCoverImage = new FormData();
      formCoverImage.append('file', {
        uri: newUser.coverImage,
        name: 'file',
        type: 'image/jpeg',
      });

      const coverImg = await UploadAPI.uploadFile(formCoverImage);

      if (coverImg) {
        newUser = { ...newUser, coverImage: coverImg };
      }
    }

    const data = await UserAPI.updateMe(newUser);
    if (data) {
      dispatch(setUser(data));
      navigation.navigate('Profile');
      setAnimating(false);
    }
  };

  const handleDateOfBirth = (event, selectedDate) => {
    const timestamp = event.nativeEvent.timestamp;
    setShow(false);
    setDateOfBirth(new Date(timestamp));
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        padding: 20,
      }}
    >
      <View>
        <Text
          style={{
            fontSize: 16,
            marginBottom: 5,
            fontWeight: 'bold',
          }}
        >
          Ảnh đại diện
        </Text>
        {avatarUrl ? (
          <Avatar.Image
            size={150}
            source={{ uri: avatarUrl }}
            style={{ alignSelf: 'center', marginBottom: 20 }}
          />
        ) : (
          <Text
            style={{
              alignSelf: 'center',
              marginVertical: 80,
              fontWeight: 'bold',
              fontSize: 20,
              color: 'rgba(0,0,0,0.5)',
            }}
          >
            Bạn chưa có ảnh đại diện
          </Text>
        )}
        <TouchableOpacity
          onPress={handlePickAvatar}
          style={{
            alignItems: 'center',
            marginBottom: 20,
            paddingVertical: 5,
            backgroundColor: '#0091ff',
            borderRadius: 5,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: 'white',
              textAlign: 'center',
              fontWeight: 'bold',
            }}
          >
            Chọn ảnh đại diện
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <Text
          style={{
            fontSize: 16,
            marginBottom: 5,
            fontWeight: 'bold',
          }}
        >
          Ảnh nền
        </Text>
        {coverImage ? (
          <Image
            source={{ uri: coverImage }}
            style={{ alignSelf: 'center', marginBottom: 20, width: '100%', height: 200 }}
          />
        ) : (
          <Text
            style={{
              alignSelf: 'center',
              marginVertical: 80,
              fontWeight: 'bold',
              fontSize: 20,
              color: 'rgba(0,0,0,0.5)',
            }}
          >
            Bạn chưa có ảnh nền
          </Text>
        )}
        <TouchableOpacity
          onPress={handlePickCoverImage}
          style={{
            alignItems: 'center',
            marginBottom: 20,
            paddingVertical: 5,
            backgroundColor: '#0091ff',
            borderRadius: 5,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: 'white',
              textAlign: 'center',
              fontWeight: 'bold',
            }}
          >
            Chọn ảnh nền
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            marginBottom: 5,
            fontWeight: 'bold',
          }}
        >
          Họ và tên
        </Text>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 5,
            paddingVertical: 5,
            paddingHorizontal: 10,
            fontSize: 16,
          }}
          value={fullName}
          onChangeText={(text) => setFullName(text)}
        />
      </View>
      <View
        style={{
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            marginBottom: 5,
            fontWeight: 'bold',
          }}
        >
          Email
        </Text>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 5,
            paddingVertical: 5,
            paddingHorizontal: 10,
            fontSize: 16,
          }}
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
      </View>
      <View
        style={{
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            marginBottom: 5,
            fontWeight: 'bold',
          }}
        >
          Ngày sinh
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text>{convertToDate(dateOfBirth)}</Text>
          <Pressable
            style={{
              backgroundColor: '#0091ff',
              paddingVertical: 5,
              paddingHorizontal: 10,
              borderRadius: 5,
              marginLeft: 20,
            }}
            onPress={() => setShow(true)}
          >
            <Text style={{ color: 'white', fontSize: 14 }}>Chọn ngày</Text>
          </Pressable>
        </View>
        {show && (
          <View style={{ flex: 1 }}>
            <DateTimePicker
              value={new Date()}
              mode="date"
              display="default"
              onChange={(val) => handleDateOfBirth(val)}
              style={{ flex: 1 }}
            />
          </View>
        )}
      </View>
      <View
        style={{
          marginBottom: 40,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            marginBottom: 5,
            fontWeight: 'bold',
          }}
        >
          Giới tính
        </Text>
        <RadioButton.Group onValueChange={(newValue) => setGender(newValue)} value={gender}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}>
              <Text>Nam</Text>
              <RadioButton value="male" />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text>Nữ</Text>
              <RadioButton value="female" />
            </View>
          </View>
        </RadioButton.Group>
      </View>
      <Pressable
        style={{
          backgroundColor: '#0091ff',
          paddingVertical: 10,
          borderRadius: 5,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={handleUpdateProfile}
      >
        <Text
          style={{
            fontSize: 16,
            color: '#fff',
            textAlign: 'center',
            fontWeight: 'bold',
            marginRight: 10,
          }}
        >
          Lưu thay đổi
        </Text>
        {animating && <ActivityIndicator size="small" color="#fff" />}
      </Pressable>
      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        style={{ width: '100%' }}
        action={{
          label: 'OK',
          onPress: () => setVisible(false),
        }}
      >
        {err}
      </Snackbar>
    </ScrollView>
  );
};

export default ChangeProfile;
