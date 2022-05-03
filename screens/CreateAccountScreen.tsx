import React, { useState, useContext, useEffect } from 'react';
import { StatusBar, View, Image, TouchableOpacity, Text, TextInput, StyleSheet, Dimensions, BackHandler, ToastAndroid } from 'react-native';
import { StackActions } from '@react-navigation/native';
import back from '../assets/ic_back.png'
import PasswordForm from '../components/passwordForm/PasswordForm';
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
 * CreateAccountScreen new users can use this screen to create accounts.
 * This screen is passed React's navigation & route as props for navigating between screens 
 * and passing data.
 */
export const CreateAccountScreen = (props: IProps) => {
    const { navigation } = props;
    const [username, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [isEmailValidated, setEmailAsValidated] = useState(false)
    const [password, setPassword] = useState('');
    const [isPasswordValidated, setPasswordAsValidated] = useState(false)
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isConfirmPasswordValidated, setConfirmPasswordAsValidated] = useState(false)
    const [isPasswordVisible, setPasswordAsVisible] = useState(false)
    const [isConfirmPasswordVisible, setConfirmPasswordAsVisible] = useState(false)
    const [isSignUpButtonEnabled, setSignUpButtonEnabled] = useState(false)
    const { signUp } = useContext(FirebaseContext);

    //popAction for backstepping 1 screen
    const popAction = StackActions.pop(1);

    useEffect(() => {
        const onBackPress = () => {
            navigation.dispatch(popAction)
            return true
        };
        BackHandler.addEventListener('hardwareBackPress', onBackPress);
        return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress)
    }, [])

    //Validates email address upon text change
    const onEmailTextChange = (text) => {
        let emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        if (emailReg.test(text)) {
            setEmailAsValidated(true)
            if(isPasswordValidated && isConfirmPasswordValidated){
                setSignUpButtonEnabled(true)
            }
        } else {
            setEmailAsValidated(false)
            setSignUpButtonEnabled(false)
        }
        setEmail(text)
    }

    //Validates password upon text change
    const onPasswordTextChange = (text) => {
        if (text.length < 6) {
            setSignUpButtonEnabled(false)
            setPasswordAsValidated(false)
        } else {
            setPasswordAsValidated(true)
            if(isEmailValidated && isConfirmPasswordValidated){
                setSignUpButtonEnabled(true)
            }
        }
        setPassword(text)
    }

    //Validates confirmPassword upon text change
    const onConfirmPasswordTextChange = (text) => {
        if (text.length < 6 || password.length < 6 ) {
            setSignUpButtonEnabled(false)
            setConfirmPasswordAsValidated(false)
        } else {
            setConfirmPasswordAsValidated(true)
            if(isEmailValidated && isPasswordValidated){
                setSignUpButtonEnabled(true)
            }
        }
        setConfirmPassword(text)
    }

    //Create a new account for user
    const createAccount = (email, password, navigate) => {
        signUp(email, password, username, navigate)
    }

    return (
        <View style={styles.container}>
            <View style={styles.toolBarContainer}  >
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.dispatch(popAction)}>
                    <Image style={styles.backIcon} source={back} />
                </TouchableOpacity>
            </View>
            <TextInput style={{ ...styles.textInput, marginBottom: 40, marginTop: 40 }} placeholder='Username' onChangeText={(text) => setUserName(text)} />
            <TextInput style={{ ...styles.textInput, marginBottom: 40 }} keyboardType='email-address' placeholder='Email' autoCapitalize='none' keyboardType='email-address' onChangeText={(text) => onEmailTextChange(text)} />
            <PasswordForm isPasswordVisible={isPasswordVisible} placeholder={'Password'} value={password} onChange={onPasswordTextChange} setPasswordAsVisible={setPasswordAsVisible} />
            <Text style={styles.passwordRequirementText}>Password must be 6 characters long</Text>
            <PasswordForm isPasswordVisible={isConfirmPasswordVisible} placeholder={'Confirm Password'} value={confirmPassword} onChange={onConfirmPasswordTextChange} setConfirmPasswordAsVisible={setConfirmPasswordAsVisible} />
            <TouchableOpacity style={isSignUpButtonEnabled ? styles.enabledButton : styles.disabledButton} disabled={!isSignUpButtonEnabled} onPress={() => createAccount(email, password, navigation)} >
                <Text style={isSignUpButtonEnabled ? styles.enabledButtonText : styles.disabledButtonText} >Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({

    backButton: {
        flexDirection: 'row',
        height: 50,
        width: 50,
        borderRadius: 25,
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginRight: 15
    },

    backIcon: {
        flexGrow: 1,
        height: 35,
        width: 35,
        tintColor: 'white',
        resizeMode: 'contain',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 0
    },

    buttonContainer: {
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        marginTop: 20,
    },

    container: {
        height: '100%',
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#8f21fe',
        paddingTop: StatusBar.currentHeight
    },

    
    disabledButton: {
        width: width - 120,
        height: 50,
        backgroundColor: '#8b8b8b',
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40
    },

    disabledButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 10,
        color: '#c7c7c7',
    },

    enabledButton: {
        width: width - 120,
        height: 50,
        backgroundColor: 'white',
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40
    },

    enabledButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 10,
        color: 'black',
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

    passwordRequirementText: {
        fontSize: 12,
        textAlign: 'left',
        margin: 10,
        color: 'white',
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

export default CreateAccountScreen;