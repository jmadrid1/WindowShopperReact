
import React, { Dispatch, SetStateAction } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, TextInput, Dimensions } from 'react-native';
import pw_visible from '../../assets/password_visible.png';
import pw_private from '../../assets/password_private.png';

const { width } = Dimensions.get('screen')

type IProps = {
    isPasswordPrivate: boolean;
    placeholder: string;
    value: string;
    onChange: (text) => void;
    setPasswordPrivate: Dispatch<SetStateAction<boolean>>;
}

const PasswordForm = (props: IProps) => {
    const { isPasswordPrivate, placeholder, value, onChange, setPasswordPrivate } = props;

    return (
        <View style={styles.container} >
            <TextInput style={styles.textInput} secureTextEntry={!isPasswordPrivate} placeholder={placeholder} autoCapitalize='none' value={value} onChangeText={(text) => onChange(text)} />
            <TouchableOpacity style={styles.searchButton} onPress={() => setPasswordPrivate(!isPasswordPrivate)}>
                <Image style={styles.searchIcon} source={isPasswordPrivate ? pw_private : pw_visible}/>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flexDirection: 'row',
        height: 50,
        width: width - 110,
        backgroundColor: 'white',
        borderRadius: 25,
        alignItems: 'center'
    },

    searchIcon: {
        flexGrow: 1,
        height: 23,
        width: 23,
        resizeMode: 'contain',
        tintColor: '#b3b3b3',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 2
    },

    searchButton: {
        flexDirection: 'row',
        height: 50,
        width: 50,
        backgroundColor: 'white',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10
    },

    textInput: {
        color: '#414141',
        fontWeight: 'bold', 
        flex: 1,
        fontSize: 14,
        borderRadius: 25,
        paddingLeft: 25,
        justifyContent: 'center',
        alignItems: 'center'
    },

});

export default PasswordForm;
