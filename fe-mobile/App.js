import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Start from './screens/Start';
import Login from './screens/Login';
import ForgotPassword from './screens/ForgotPassword';
import Signup from './screens/Signup';
import Main from './screens/Main';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import Chat from './screens/Chat';
import AddFriend from './screens/AddFriend';
import InforProfile from './screens/InforProfile';
import CreateGroup from './screens/CreateGroup';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import RequestFriend from './screens/RequestFriend';
import RightHeader from './components/RightHeader';
import ChatOption from './screens/ChatOption';
import ChangeProfile from './screens/ChangeProfile';
import ChangePassword from './screens/ChangePassword';
import GroupMember from './screens/GroupMember';
import AddMember from './screens/AddMember';
import Otp from './screens/Otp';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <PaperProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Start">
              <Stack.Screen options={{ headerShown: false }} name="Start" component={Start} />
              <Stack.Screen options={{ headerShown: false }} name="Main" component={Main} />
              <Stack.Screen
                options={{
                  title: 'Chat',
                  headerStyle: { backgroundColor: '#0091ff' },
                  headerTintColor: '#fff',
                  headerTitleStyle: { fontSize: 16 },
                  headerRight: () => {
                    return <RightHeader />;
                  },
                }}
                name="Chat"
                component={Chat}
              />
              <Stack.Screen
                name="ChatOption"
                options={{
                  title: 'Tùy Chọn',
                  headerStyle: { backgroundColor: '#0091ff' },
                  headerTintColor: '#fff',
                  headerTitleStyle: { fontSize: 16 },
                }}
                component={ChatOption}
              />
              <Stack.Screen
                name="GroupMember"
                options={{
                  title: 'Thành viên nhóm',
                  headerStyle: { backgroundColor: '#0091ff' },
                  headerTintColor: '#fff',
                  headerTitleStyle: { fontSize: 16 },
                }}
                component={GroupMember}
              />
              <Stack.Screen
                name="AddMember"
                options={{
                  title: 'Thêm thành viên',
                  headerStyle: { backgroundColor: '#0091ff' },
                  headerTintColor: '#fff',
                  headerTitleStyle: { fontSize: 16 },
                }}
                component={AddMember}
              />
              <Stack.Screen
                name="ChangeProfile"
                options={{
                  title: 'Đổi thông tin',
                  headerStyle: { backgroundColor: '#0091ff' },
                  headerTintColor: '#fff',
                  headerTitleStyle: { fontSize: 16 },
                }}
                component={ChangeProfile}
              />
              <Stack.Screen
                name="ChangePassword"
                options={{
                  title: 'Đổi mật khẩu',
                  headerStyle: { backgroundColor: '#0091ff' },
                  headerTintColor: '#fff',
                  headerTitleStyle: { fontSize: 16 },
                }}
                component={ChangePassword}
              />
              <Stack.Screen
                name="AddFriend"
                options={{
                  title: 'Thêm bạn',
                  headerStyle: { backgroundColor: '#0091ff' },
                  headerTintColor: '#fff',
                  headerTitleStyle: { fontSize: 16 },
                }}
                component={AddFriend}
              />
              <Stack.Screen
                name="CreateGroup"
                options={{
                  title: 'Tạo nhóm',
                  headerStyle: { backgroundColor: '#0091ff' },
                  headerTintColor: '#fff',
                  headerTitleStyle: { fontSize: 16 },
                }}
                component={CreateGroup}
              />
              <Stack.Screen
                name="RequestFriend"
                options={{
                  title: 'Lời mời kết bạn',
                  headerStyle: { backgroundColor: '#0091ff' },
                  headerTintColor: '#fff',
                  headerTitleStyle: { fontSize: 16 },
                }}
                component={RequestFriend}
              />
              <Stack.Screen
                name="InforProfile"
                options={{
                  title: 'Thông tin cá nhân',
                  headerStyle: { backgroundColor: '#0091ff' },
                  headerTintColor: '#fff',
                  headerTitleStyle: { fontSize: 16 },
                }}
                component={InforProfile}
              />
              <Stack.Screen
                name="Signup"
                options={{
                  title: 'Đăng ký',
                  headerStyle: { backgroundColor: '#0091ff' },
                  headerTintColor: '#fff',
                  headerTitleStyle: { fontSize: 16 },
                }}
                component={Signup}
              />
              <Stack.Screen
                name="Otp"
                options={{
                  title: 'Xác thực OTP',
                  headerStyle: { backgroundColor: '#0091ff' },
                  headerTintColor: '#fff',
                  headerTitleStyle: { fontSize: 16 },
                }}
                component={Otp}
              />
              <Stack.Screen
                name="Login"
                options={{
                  title: 'Đăng nhập',
                  headerStyle: { backgroundColor: '#0091ff' },
                  headerTintColor: '#fff',
                  headerTitleStyle: { fontSize: 16 },
                }}
                component={Login}
              />
              <Stack.Screen
                name="ForgotPassword"
                options={{
                  title: 'Lấy lại mật khẩu',
                  headerStyle: { backgroundColor: '#0091ff' },
                  headerTintColor: '#fff',
                  headerTitleStyle: { fontSize: 16 },
                }}
                component={ForgotPassword}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </SafeAreaProvider>
    </Provider>
  );
}
