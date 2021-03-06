import React, { useState, useEffect, useContext } from 'react';
import { StatusBar, View, TouchableOpacity, Image, FlatList, StyleSheet, Dimensions } from 'react-native';
import { StackActions } from '@react-navigation/native';
import { Item } from '../types/Item';
import { Review } from '../types/Review';
import ReviewRow from '../components/reviewRow/ReviewRow';
import add from '../assets/ic_add.png';
import BackButton from '../components/backButton/BackButton';
import AnimationView from '../components/animationView/AnimationView';
import 'firebase/database';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, child } from "firebase/database";
import firebaseConfig from '../util/Firebase';
import { FirebaseContext } from '../context/FirebaseProvider'

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
 * ReviewsScreen displays the selected retail item's user submitted reviews.
 * This screen is passed React's navigation & route as props for navigating between screens 
 * and passing data. This screen is also passed the selectedItem from ItemDetailsScreen
 */
export const ReviewsScreen = (props: IProps) => {
    const { navigation } = props;
    const { selectedItem } = props.route.params
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true)
    const popAction = StackActions.pop(1);
    const { user } = useContext(FirebaseContext);

    useEffect(() => {
        setIsLoading(true)
        getReviews();
    }, [])

    initializeApp(firebaseConfig);

    //Fetches reviews for selectedItem from Firebase Database
    const getReviews = async () => {
        setIsLoading(true)
        const KEY_INVENTORY = '/inventory/';
        const ITEM_ID = String(selectedItem.id);
        const KEY_REVIEWS = '/reviews';
        const path = KEY_INVENTORY + ITEM_ID + KEY_REVIEWS
        let reviewList: Review[] = [];
        try {
            const reviewRef = ref(getDatabase());
            get(child(reviewRef, path)).then((snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    if (data != null) {
                        for (const key of Object.keys(data)) {
                            const it: Review = data[key];
                            let review: Review = {
                                id: key,
                                comment: it.comment,
                                date: it.date,
                                rating: it.rating,
                            }
                            reviewList.push(review)
                        }
                    }
                    setReviews(reviewList)
                }
            }).catch((error) => {
                console.error(error);
                setReviews(reviewList)
            });
            setIsLoading(false)
        } catch (e) {
            console.log(e);
            setReviews(reviewList)
            setIsLoading(false)
        }
    }

    const renderItem = ({ item }) => {
        return (
            <ReviewRow key={item.id} review={item} />
        );
    };

    return (
        <View style={styles.container}>
            {!isLoading ? (
                <>
                    <View style={styles.toolBarContainer}  >
                        <BackButton backArrowColor='black' onPress={() => navigation.dispatch(popAction)} />
                        <TouchableOpacity style={styles.addButton} onPress={user ? () => navigation.navigate('SubmitReview', { selectedItem: selectedItem }) : null}>
                            <Image style={styles.addIcon} source={user ? add : null} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.scrollViewContainer} >
                        {reviews.length > 0 &&
                            <FlatList
                                data={reviews}
                                renderItem={renderItem}
                            />
                        }
                    </View>
                </>
            ) : (
                <View style={styles.container}>
                    <View style={styles.innerContainer}>
                        <AnimationView option={1} />
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({

    addButton: {
        flexDirection: 'row',
        height: 50,
        width: 50,
        borderRadius: 25,
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginRight: 15
    },

    addIcon: {
        flexGrow: 1,
        height: 50,
        width: 50,
        tintColor: 'black',
        resizeMode: 'contain',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 0
    },

    container: {
        height: '100%',
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        paddingTop: StatusBar.currentHeight
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
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
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
        elevation: 6,
        marginBottom: 10,
        backgroundColor: 'white',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

})

export default ReviewsScreen;