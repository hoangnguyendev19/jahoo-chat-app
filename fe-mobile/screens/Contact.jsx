import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View } from 'react-native';
import Friend from './Friend';
import Group from './Group';

const Tab = createMaterialTopTabNavigator();

const Contact = () => {
  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator>
        <Tab.Screen
          name="Friend"
          options={{ title: 'Bạn bè', tabBarLabelStyle: { fontSize: 16, fontWeight: 'bold' } }}
          component={Friend}
        />
        <Tab.Screen
          name="Group"
          options={{ title: 'Nhóm', tabBarLabelStyle: { fontSize: 16, fontWeight: 'bold' } }}
          component={Group}
        />
      </Tab.Navigator>
    </View>
  );
};

export default Contact;
