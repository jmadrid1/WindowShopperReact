import React, { useState, useContext, useEffect } from 'react';
import {
    StatusBar, View, TouchableOpacity, Image, Text, TextInput,
    StyleSheet, Dimensions, BackHandler
} from 'react-native';
import logo from '../assets/ic_windowshopper_transparent.png';
import BackButton from '../components/backButton/BackButton';
import PasswordForm from '../components/passwordForm/PasswordForm';
import RoundedButton from '../components/roundedButton/RoundedButton';
import { FirebaseContext } from '../context/FirebaseProvider'

const { width } = Dimensions.get('screen')

interface IProps {
    navigation: any;
    route: any;
}

/**
 * @param {{ 
 * navigation: any,
 * route: any,
 * }} props 
 * @returns
 */

/**
 * LoginScreen existing users can use this screen to log back their accounts. Additionally,
 * new users can be directed to CreateAccountScreen to create an account.
 * This screen is passed React's navigation & route as props for navigating between screens 
 * and passing data.
 */
export const LoginScreen = (props: IProps) => {
    const { navigation } = props;
    const [email, setEmail] = useState('');
    const [isEmailValidated, setEmailAsValidated] = useState(false)
    const [password, setPassword] = useState('');
    const [isPasswordValidated, setPasswordAsValidated] = useState(false)
    const [isPasswordVisible, setPasswordAsVisible] = useState(false)
    const [isLoginButtonEnabled, setLoginButtonAsEnabled] = useState(false)
    const { login } = useContext(FirebaseContext);

    useEffect(() => {
        const onBackPress = () => {
            navigation.navigate('Shop');
            return true
        };
        BackHandler.addEventListener('hardwareBackPress', onBackPress);
        return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress)
    }, [])

    //Signs user in
    const signIn = (email, password) => {
        login(email, password, navigation)
    }

    //Validates email address on text change
    const onEmailTextChange = (text) => {
        let emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        if (emailReg.test(text)) {
            setEmailAsValidated(true)
            if (isPasswordValidated) {
                setLoginButtonAsEnabled(true)
            }
        } else {
            setEmailAsValidated(false)
            setLoginButtonAsEnabled(false)
        }
        setEmail(text)
    }

    //Validates password on text change
    const onPasswordTextChange = (text) => {
        if (text.length < 5) {
            setLoginButtonAsEnabled(false)
            setPasswordAsValidated(false)
        } else {
            setPasswordAsValidated(true)
            if (isEmailValidated) {
                setLoginButtonAsEnabled(true)
            }
        }
        setPassword(text)
    }

    return (
        <View style={styles.container}>
            <View style={styles.toolBarContainer}  >
                <BackButton backArrowColor='white' onPress={() => navigation.navigate('Shop')} />
            </View>
            <View style={styles.innerContainer}>
                <View style={styles.logoContainer}>
                    <Image style={styles.logo} source={logo} />
                </View>
                <TextInput style={styles.textInput} keyboardType='email-address' placeholder='Email' autoCapitalize='none' keyboardType='email-address' onChangeText={(text) => onEmailTextChange(text)} />
                <PasswordForm isPasswordVisible={isPasswordVisible} placeholder={'Password'} value={password} onChange={onPasswordTextChange} setPasswordAsVisible={setPasswordAsVisible} />
                <RoundedButton enabled={isLoginButtonEnabled} buttonText='Sign In' buttonTextColor='black' buttonColor='white' onPress={() => signIn(email, password)} />
                <TouchableOpacity style={styles.createAccountButton} onPress={() => navigation.navigate('CreateAccount')} >
                    <Text style={styles.createAccountButtonText}>Create Account</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        height: '100%',
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#8f21fe',
        paddingTop: StatusBar.currentHeight
    },

    createAccountButton: {
        width: width - 120,
        height: 50,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 90
    },

    createAccountButtonText: {
        fontSize: 12,
        textAlign: 'center',
        margin: 10,
        color: 'white',
    },

    innerContainer: {
        height: 600,
        width: width - 25,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'black',
        borderRadius: 30,
    },

    logo: {
        flex: 1,
        minHeight: 80,
        maxHeight: 80,
        resizeMode: 'contain'
    },

    logoContainer: {
        height: 180,
        width: 180,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },

    textInput: {
        color: '#414141',
        fontWeight: 'bold',
        width: width - 110,
        height: 50,
        fontSize: 14,
        borderRadius: 30,
        paddingLeft: 25,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
    },

    toolBarContainer: {
        flexDirection: 'row',
        display: 'flex',
        width: width,
        minHeight: 70,
        maxHeight: 70,
        marginLeft: 20,
        marginBottom: 10,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },


});

export default LoginScreen;