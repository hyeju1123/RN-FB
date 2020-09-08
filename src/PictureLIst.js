import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
} from 'react-native';
import storage from '@react-native-firebase/storage';

const PictureList = () => {
    const [ urlList, setUrlList ] = useState([]);
    const reference = storage().ref('images');
    const tempList = [];
    let test = 0;
    let id = 0;

    // function listImages(storageRef) {
    //     storageRef.listAll().then(function(result) {
    //         new Promise(resolve => {
    //             let tempList = result.items.map(async function(imageRef) {
    //                 await imageRef.getDownloadURL()
    //                 .then(url => url)
    //             })
    //             console.log("see tempList: "+JSON.stringify(tempList));
    //             resolve(tempList)
    //         })
    //         //.then((tempList) => setUrlList([...tempList]))
    //     })
    // }


    function listImages(storageRef) {
        storageRef.listAll().then(function(result) {
            result.items.forEach(async function(imageRef) {
                await displayImage(imageRef)
                console.log("tempLIst: "+tempList)
                setUrlList([...tempList])
            })
        })
    }

    async function displayImage(imageRef) {
        try {
            let url = await imageRef.getDownloadURL();
            tempList.push(url);
        } catch (e) {
            console.log(e);
        }
    }


    const Images = urlList.map(
        image => (
            <Image 
                key={id++}
                source={{ uri: image }}
                style={styles.imageBox}
            />
        )
    )

    return (
        <View style={styles.container}>
            {/* {Images} */}
            
            { urlList.length !== 0 ? (
                // console.log(urlList) &&
                // console.log("flldfl") &&
                //<Image source={{ uri: urlList[1] }} style={styles.imageBox} />
                //console.log(urlList) &&
                urlList.map(image => (
                    <Image source={{ uri: image }} style={styles.imageBox} key={id++} />
                ))
                
            ) : (
                    null
                )
            }
            
            <TouchableOpacity style={styles.selectButton} onPress={() => {listImages(reference)}}>
                        <Text style={styles.buttonText}>download</Text>
            </TouchableOpacity>
        </View>
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
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    },
    imageBox: {
        width: 300,
        height: 300
    }
})

export default PictureList;