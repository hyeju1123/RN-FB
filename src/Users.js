import React, { useEffect, useReducer, useState } from 'react';
import { View, Text } from 'react-native';
import axios from 'axios';

function Users() {
    const [infos, setInfos] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setError(null);
                setInfos(null);
                setLoading(true);
                const response = await axios.get(
                    'http://openapi.foodsafetykorea.go.kr/api/8ebd00ab427244248f9e/I-0050/json/1/5'
                );
                setInfos(response.data)
            } catch (e) {
                setError(e);
            }
            setLoading(false);
        }

        fetchUsers();
    }, []);

    if(loading) return <Text>로딩중...</Text>
    if(error) return <Text>에러 발생</Text>
    if(!infos) return null;
    return (
        <View style={{flex: 1}}>
            {/* {
                infos['I-0050']['row'].map(info => (
                    <Text>
                        {info.RAWMTRL_NM}
                    </Text>
                ))
            } */}
            
        </View>
        
    )
}

export default Users;