import React, { useState } from 'react';
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  Image,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';


export default function NewApp() {
  let downloadUri = null;
  const [ image, setImage ] = useState(null);
  const [ uploading, setUploading ] = useState(false);
  const [ transferred, setTransferred ] = useState(0);
  const [ downloadImg, setDownloadImg ] = useState(null);
  const [ downloading, setDownloading ] = useState(0);
  const [ urlList, setUrlList ] = useState([]);

  const selectImage = () => {
    const options = {
      maxWidth: 2000,
      maxHeight: 2000,
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };
        console.log(source);
        setImage(source);
      }
    });
  };

  const uploadImage = async () => {
    const { uri } = image;
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const uploadUri = Platform.OS === 'ios' ?  uri.replace('file://', '') : uri;

    setUploading(true);
    setTransferred(0);

    const task = storage()
      .ref(filename)
      .putFile(uploadUri);

    try {
      await task;
    } catch (e) {
      console.log(e);
    }

    setUploading(false);

    Alert.alert(
      'photo uploaded',
      'Your Photo has been uploaded to Firebase Cloud Stroage'
    );

    setImage(null);
  }

  const downloadImage = async () => {
    setDownloading(true);
    const download = storage()
      .ref('4008')
      .getDownloadURL();
    
    try {
      downloadUri = await download;
      console.log(downloadUri);
      setDownloadImg(downloadUri);
    } catch (e) {
      console.log(e);
    }
    
    setDownloading(false);
  }  

  // function listFilesAndDirectories(reference, pageToken) {
  //   return reference.list({ pageToken }).then(result => {
  //     result.items.forEach(ref => {
  //       console.log(ref.getDownloadURL());
  //     });
      
  //     if (result.nextPageToken) {
  //       return listFilesAndDirectories(reference, result.nextPageToken);
  //     }
  //     return Promise.resolve();
  //   });
  // }
  
  const reference = storage().ref('images');
  
  function listImages(storageRef) {
    storageRef.listAll().then(function(result) {
      result.items.forEach(function(imageRef) {
        displayImage(imageRef);
      });
    }).catch(function(error) {
       console.log(error);
    })
  }
  
  const tmpUrlList = [];
  function displayImage(imageRef) {  
    imageRef.getDownloadURL().then(function(url) {
      console.log(url)
      tmpUrlList.push(url)
      console.log("show tmpUrlList: "+tmpUrlList);
      setUrlList(tmpUrlList);
      console.log("check state: "+JSON.stringify(urlList));
    }).catch(function(error) {
      console.log(error)
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.selectButton} onPress={selectImage}>
        <Text style={styles.buttonText}>Pick an image</Text>
      </TouchableOpacity>
      <View style={styles.imageContainer}>
        { image !== null ? (
          <Image source={{ uri: image.uri }} style={styles.imageBox} />
        ) : null }
        { uploading ? (
          <Text>uploading...</Text>
        ) : (
          <TouchableOpacity style={styles.uploadButton} onPress={uploadImage}>
            <Text style={styles.buttonText}>Upload image</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.imageContainer}>
        { urlList !== null ? (
            //console.log(urlList) &&
            urlList.map(image => {
              <Image source={{ uri: image }} style={styles.imageBox} />  
            })
          ) : null 
        }
        {/* { urlList !== null ? (
          urlList.map(image => {
            <Image source={{ uri: downloadImg }} style={styles.imageBox} />
          })
        
         : null} */}
        { downloading ? (
          <Text>downloading...</Text>
        ) : (
          <TouchableOpacity style={styles.selectButton} onPress={() => {listImages(reference)}}>
            <Text style={styles.buttonText}>Download Image</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#bbded6'
  },
  selectButton: {
    borderRadius: 5,
    width: 150,
    height: 50,
    backgroundColor: '#8ac6d1',
    alignItems: 'center',
    justifyContent: 'center'
  },
  uploadButton: {
    borderRadius: 5,
    width: 150,
    height: 50,
    backgroundColor: '#ffb6b9',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  imageContainer: {
    marginTop: 30,
    marginBottom: 50,
    alignItems: 'center'
  },
  progressBarContainer: {
    marginTop: 20
  },
  imageBox: {
    width: 300,
    height: 300
  }
});