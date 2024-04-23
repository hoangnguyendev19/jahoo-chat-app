import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Snackbar } from 'react-native-paper';
import Member from '../components/Member';
import connectSocket from '../utils/socketConfig';

const GroupMember = ({ navigation, route }) => {
  const { conversation } = route.params;
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');
  const socket = connectSocket();

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        {conversation?.members?.length > 0 &&
          conversation?.members?.map((mem) => (
            <Member
              key={mem.id}
              navigation={navigation}
              mem={mem}
              conversation={conversation}
              setShow={setShow}
              setErr={setErr}
              socket={socket}
            />
          ))}
      </ScrollView>
      <Snackbar
        visible={show}
        onDismiss={() => setShow(false)}
        action={{
          label: 'OK',
          onPress: () => {
            setShow(false);
          },
        }}
      >
        {err}
      </Snackbar>
    </View>
  );
};

export default GroupMember;
