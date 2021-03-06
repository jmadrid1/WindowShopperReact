import React, { useContext, useState } from 'react';
import { StatusBar, View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { StackActions } from '@react-navigation/native';
import icon from '../assets/ic_add_review.png'
import { TextInput } from 'react-native-gesture-handler';
import { Item } from '../types/Item';
import RoundedButton from '../components/roundedButton/RoundedButton';
import BackButton from '../components/backButton/BackButton';
import { Rating } from 'react-native-ratings';
import { initializeApp } from 'firebase/app';
import 'firebase/database';
import firebaseConfig from '../util/Firebase';
import { FirebaseContext } from '../context/FirebaseProvider';

const { width } = Dimensions.get('screen')

interface IProps {
    navigation: any;
    route: any;
    selectedItem?: Item;
}

/**
 * @param {{ 
 * navigation: any,
 * route: any,
 * selectedItem: Item
 * }} props 
 * @returns
 */

/**
 * SubmitReviewScreen allows the user if signed in, to submit reviews on the selectedItem.
 * This screen is passed React's navigation & route as props for navigating between screens 
 * and passing data. This screen is also passed the selectedItem from ShopScreen 
 */
export const SubmitReviewScreen = (props: IProps) => {
    const { navigation } = props;
    const { selectedItem } = props.route.params
    const [inputText, setInputText] = useState('')
    const [isSubmitButtonEnabled, setSubmitButtonAsEnabled] = useState(false)
    const [rating, setRating] = useState(3)
    const { submitUserReview } = useContext(FirebaseContext);

    const popAction = StackActions.pop(1);
    const popBackToDetails = StackActions.pop(2);

    initializeApp(firebaseConfig);

    //Validates text input on text change
    const onInputTextChange = (text) => {
        if (text.length < 1) {
            setSubmitButtonAsEnabled(false)
        } else {
            setSubmitButtonAsEnabled(true)
        }
        setInputText(text)
    }

    //Handles the ratingValue changes
    const ratingCompleted = (rating) => {
        setRating(rating)
    }

    //Posts reviews for selectedItem to Firebase Database
    const submitReview = async (selectedItem, inputText, rating, navigation) => {
        submitUserReview(selectedItem, inputText, rating, navigation)
        navigation.dispatch(popBackToDetails)
    }

    return (
        <View style={styles.container}>
            <View style={styles.toolBarContainer}  >
                <BackButton backArrowColor='white' onPress={() => navigation.dispatch(popAction)} />
            </View>
            <View style={styles.scrollViewContainer} >
                <Image style={styles.image} source={icon} />
                <Rating
                    type='custom'
                    ratingCount={5}
                    startingValue={3}
                    imageSize={25}
                    ratingColor='black'
                    tintColor='#8f21fe'
                    ratingBackgroundColor='white'
                    showRating={false}
                    onFinishRating={ratingCompleted}
                />
                <View style={styles.characterCountContainer}>
                    <Text style={styles.characterCount}>{inputText.length}/125</Text>
                </View>
                <TextInput style={styles.textInput} placeholder='What are your thoughts?' onChangeText={(text) => onInputTextChange(text)} />
                <RoundedButton enabled={isSubmitButtonEnabled} buttonText='Submit' buttonTextColor='white' buttonColor='black' onPress={() => submitReview(selectedItem, inputText, rating, navigation)} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({

    characterCountContainer: {
        flex: 1,
        flexDirection: 'row',
        width: width,
        minHeight: 20,
        maxHeight: 20,
    },

    characterCount: {
        flex: 1,
        color: 'white',
        minHeight: 20,
        maxHeight: 20,
        fontSize: 14,
        marginLeft: 50,
    },

    container: {
        height: '100%',
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#8f21fe',
        paddingTop: StatusBar.currentHeight
    },

    image: {
        flex: 1,
        minHeight: 200,
        maxHeight: 200,
        resizeMode: 'contain'
    },

    innerContainer: {
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: 'white'
    },

    scrollViewContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 90
    },

    textInput: {
        color: 'black',
        fontWeight: 'bold',
        flex: 1,
        width: width - 50,
        minHeight: 220,
        maxHeight: 220,
        backgroundColor: 'white',
        fontSize: 14,
        borderRadius: 25,
        paddingLeft: 15,
        paddingTop: 15,
        textAlignVertical: 'top',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginTop: 10
    },

    textCount: {
        fontSize: 18,
        width: width,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'right',
        marginRight: 30
    },

    title: {
        fontSize: 18,
        width: 190,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center',
        paddingTop: 3
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

})

export default SubmitReviewScreen;