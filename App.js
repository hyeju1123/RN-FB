import React,{ useState, useEffect } from 'react';
import { FlatList, Text } from 'react-native';
import Todo from './Todo';
import { utils } from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { Appbar, TextInput, Button } from 'react-native-paper';

function App() {
  const [ todo, setTodo ] = useState('');
  const [ loading, setLoading ] = useState(true);
  const [ todos, setTodos ] = useState([]);
  const ref = firestore().collection('words');
  const picRef = storage().ref('night.jpg');

  async function addTodo() {
    await ref.add({
      title: todo,
      complete: false,
    });
    setTodo('');
  }

  async function uploadPic() {
    try {
      const pathToFile = `${utils.FilePath.PICTURES_DIRECTORY}/Everytime/night.jpg`;
      await picRef.putFile(pathToFile)
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    console.log('utils.FilePath.PICTURES_DIRECTORY: '+utils.FilePath.PICTURES_DIRECTORY);
    const unsubscribe = ref.onSnapshot(querySnapshot => {
      const list = [];
      querySnapshot.forEach(doc => {
        const { title, complete } = doc.data();
        list.push({
          id: doc.id,
          title,
          complete,
        });
      });

      setTodos(list);

      if (loading) {
        setLoading(false);
      }
    });

    return () => unsubscribe()
  }, []);

  if (loading) return <Text>로딩중...</Text>

  return (
    <>
      {console.log("mount")}
      <Appbar>
        <Appbar.Content title={'TODOs List'} />
      </Appbar>
      <FlatList
        style={{flex: 1}}
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Todo {...item} />}
      />
      <TextInput label={'New Todo'} value={todo} onChangeText={setTodo} />
      <Button onPress={() => addTodo()}>Add TODO</Button>
      <Button onPress={() => uploadPic()}>Add Pitcture</Button>
    </>
  )
}

export default App;