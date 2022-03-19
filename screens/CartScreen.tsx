import React, { useState, useEffect, useContext } from 'react';
import { StatusBar, View, FlatList, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import { CartItem } from '../types/CartItem';
import CartRow from '../components/cartRow/CartRow';
import 'firebase/database';
import { initializeApp } from 'firebase/app';
import { getDatabase, update, ref, onValue } from "firebase/database";
import firebaseConfig from '../util/Firebase';
import { FirebaseDatabase } from "../util/Constants";
import { FirebaseContext } from '../context/FirebaseProvider'

const { width } = Dimensions.get('screen')

interface IProps {
    navigation: any;
    route: any;
}

export const CartScreen = (props: IProps) => {
    const { navigation } = props;
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [totalItems, setTotalItems] = useState(0)
    const [totalPrice, setTotalPrice] = useState('0.00')
    const { user } = useContext(FirebaseContext);

    useEffect(() => {
        if(user){
            getCartItems();
        }else{
            navigation.navigate("Login")
        }
    }, [user])

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    const getCartItems = () => {
        let KEY_USERS = FirebaseDatabase.usersKey;
        let USER_ID = user.uid;
        let KEY_CART = FirebaseDatabase.cartKey;
        let cartPath = KEY_USERS + USER_ID + KEY_CART

        let cartRef = ref(db, cartPath)

        let cartList: CartItem[] = [];
        var totalPrice: number = 0.00;
        var totalItems: number = 0;

        onValue(cartRef, (snapshot) => {
            const data = snapshot.val();
            if (data != null) {
                for (const key of Object.keys(data)) {
                    const it: CartItem = data[key];

                    let item: CartItem = {
                        id: it.id,
                        title: it.title,
                        size: it.size,
                        price: it.price,
                        quantity: it.quantity,
                        thumbnail: it.thumbnail,
                    }
                    totalPrice += item.price * item.quantity
                    totalItems += item.quantity
                    cartList.push(item)
                }
            }
            setCartItems(cartList)
            setTotalPrice(String(totalPrice.toFixed(2)))
            setTotalItems(totalItems)
            setLoading(false)
        });
    }

    const removeFromCart = (id, quantity) => {
        let KEY_USERS = FirebaseDatabase.usersKey;
        let USER_ID = user.uid;
        let KEY_CART = FirebaseDatabase.cartKey;
        let ITEM_ID = id
        let ItemPath = KEY_USERS + USER_ID + KEY_CART + ITEM_ID

        const updates = {};
        updates[ItemPath] = null;

        setCartItems((prev) => {
            return prev.filter((item) => item.id !== id);
        });
        setTotalItems(totalItems - quantity)
        update(ref(db), updates);
    }

    return (
        <View style={styles.container}>
            {!isLoading ? (
                <>
                    <View style={styles.scrollViewContainer} >
                        {cartItems.length > 0 &&
                            <FlatList
                                data={cartItems}
                                renderItem={({ item, index }) => <CartRow item={item} navigation={navigation} removeFromCart={removeFromCart} />}
                            />
                        }
                    </View>
                    <View style={styles.checkoutContainer}>
                        <Text style={styles.checkOutText}>Items: {totalItems}</Text>
                        <Text style={styles.checkOutText}>Amount: ${totalPrice}</Text>

                        <View style={styles.checkOutButtonContainer} >
                            <TouchableOpacity style={styles.button} onPress={null} >
                                <Text style={styles.buttonText}>Checkout</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </>
            ) : (
                <View style={styles.container} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({

    button: {
        width: width - 40,
        height: 50,
        backgroundColor: 'black',
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
    },

    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 10,
        color: 'white',
    },

    container: {
        height: '100%',
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f2f2f2',
        paddingTop: StatusBar.currentHeight
    },

    checkoutContainer: {
        height: 190,
        width: '100%',
        flexDirection: 'column',
        elevation: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderTopWidth: 1.1,
        borderTopColor: '#999999',
        borderLeftWidth: 1.1,
        borderLeftColor: '#999999',
        borderRightWidth: 1.1,
        borderRightColor: '#999999',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        backgroundColor: 'white',
        paddingTop: StatusBar.currentHeight
    },

    checkOutButtonContainer: {
        flexDirection: 'column',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },

    checkOutInnerContainer: {
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: 'white'
    },

    checkOutText: {
        fontSize: 18,
        width: 190,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'right',
        marginBottom: 10,
        marginRight: 30
    },

    image: {
        flex: 1,
        minHeight: 220,
        maxHeight: 220,
        resizeMode: 'contain'
    },

    imageContainer: {
        height: 150,
        width: '100%',
        flexDirection: 'column',
        elevation: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderTopWidth: 1.1,
        borderTopColor: '#999999',
        borderLeftWidth: 1.1,
        borderLeftColor: '#999999',
        borderRightWidth: 1.1,
        borderRightColor: '#999999',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
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
    },

    toolBarContainer: {
        flexDirection: 'row',
        width: width,
        minHeight: 70,
        maxHeight: 70,
        elevation: 6,
        marginBottom: 10,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },

    title: {
        fontSize: 18,
        width: 190,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center',
        paddingTop: 3
    },

})

export default CartScreen;