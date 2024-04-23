import { AntDesign, Feather } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const RightHeader = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { conversationId } = route.params;

  return (
    <View style={{ flexDirection: 'row' }}>
      <Pressable>
        <Feather name="phone" size={24} color="white" />
      </Pressable>
      <Pressable>
        <Feather name="video" size={24} color="white" style={{ marginLeft: 20 }} />
      </Pressable>
      <Pressable onPress={() => navigation.navigate('ChatOption', { conversationId })}>
        <AntDesign name="bars" size={24} color="white" style={{ marginLeft: 20 }} />
      </Pressable>
    </View>
  );
};

export default RightHeader;
