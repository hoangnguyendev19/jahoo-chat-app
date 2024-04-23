import AsyncStorage from '@react-native-async-storage/async-storage';

const getAccessToken = async () => {
  try {
    const token = await AsyncStorage.getItem('access_token');

    return token;
  } catch (error) {
    console.log(error);
  }
};

const setAccessToken = async (token) => {
  try {
    await AsyncStorage.setItem('access_token', token);
  } catch (error) {
    console.log(error);
  }
};

const getRefreshToken = async () => {
  try {
    const token = await AsyncStorage.getItem('refresh_token');

    return token;
  } catch (error) {
    console.log(error);
  }
};

const setRefreshToken = async (token) => {
  try {
    await AsyncStorage.setItem('refresh_token', token);
  } catch (error) {
    console.log(error);
  }
};

const removeTokens = async () => {
  try {
    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('refresh_token');
  } catch (error) {
    console.log(error);
  }
};

const TokenAPI = { getAccessToken, setAccessToken, getRefreshToken, setRefreshToken, removeTokens };

export default TokenAPI;
