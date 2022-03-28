import React, { useState, useEffect } from 'react';
import { getAuth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import firebaseConfig from '../util/Firebase';
import { initializeApp } from 'firebase/app';
import { child, getDatabase, push, ref, set, update } from "firebase/database";
import { Account } from '../types/Account';
import { FirebaseDatabase } from '../util/Constants';
import { ToastAndroid } from 'react-native';
import { Review } from '../types/Review';

export const FirebaseContext = React.createContext(undefined);

export const FirebaseProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getDatabase(app);

  let KEY_USERS = FirebaseDatabase.usersKey;
  let KEY_CART = FirebaseDatabase.cartKey

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return unsubscribe;
  }, [])

  const saveUserAccount = (email, password, username, uid) => {
    const account: Account = {
      email: email,
      username: username,
      password: password,
    };

    const USER_ID = uid
    const usersPath = KEY_USERS + USER_ID

    const updates = {};
    updates[usersPath] = account;

    return update(ref(db), updates);
  }

  const addItemToCart = async (selectedItem, selectedSize, selectedQuantity) => {
    try {
      const USER_ID = user.uid
      const ITEM_ID = selectedItem.id
      const cartPath = KEY_USERS + USER_ID + KEY_CART

      const db = getDatabase();
      set(ref(db, cartPath + ITEM_ID), {
        id: selectedItem.id,
        title: selectedItem.title,
        size: selectedSize,
        price: selectedItem.price,
        thumbnail: selectedItem.image,
        quantity: Number(selectedQuantity)
      });
      ToastAndroid.show(`${selectedItem.title} Added To Cart`, ToastAndroid.SHORT)
    } catch (e) {
      console.log(e);
    }
  }

  const updateCartItem = async (item) => {
    try {
      const USER_ID = user.uid;
      const ITEM_ID = item.id;
      const cartPath = KEY_USERS + USER_ID + KEY_CART

      const db = getDatabase();
      set(ref(db, cartPath + ITEM_ID),
        null
      );
    } catch (e) {
      console.log(e);
    }
  }

  const submitReview = async (item, inputText, rating) => {
    try {
      const KEY_INVENTORY = "/inventory/"
      let ITEM_ID = item.id.toString();
      let KEY_REVIEWS = '/reviews';
      const path = KEY_INVENTORY + ITEM_ID + KEY_REVIEWS

      const currentDate = new Date().toLocaleDateString('en-US');

      const review: Review = {
        id: ITEM_ID,
        comment: inputText,
        date: currentDate,
        rating: rating,
      };

      const newReviewKey = push(child(ref(db), path)).key;
      const updates = {};
      updates[path + '/' + newReviewKey] = review;

      return update(ref(db), updates);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <FirebaseContext.Provider
      value={{
        user,
        setUser,
        login: async (email, password, navigation) => {
          try {
            await signInWithEmailAndPassword(auth, email, password).then(() => {
              ToastAndroid.show("Welcome Back!", ToastAndroid.SHORT)
              navigation.navigate('Shop');
            })
              .catch((error) => {
                ToastAndroid.show("Incorrect Credentials", ToastAndroid.SHORT)
              });
          } catch (e) {
            console.log(e);
          }
        },

        signUp: async (email, password, username, navigation) => {
          try {
            await createUserWithEmailAndPassword(auth, email, password)
              .then(() => {
                saveUserAccount(email, password, username, auth.currentUser.uid)
                  .catch(error => {
                    console.log('Error encountered while saving account info to Firebase: ', error);
                  })
                ToastAndroid.show("Successfully Created Account", ToastAndroid.SHORT)
                navigation.navigate('Shop');
              })
              .catch(error => {
                console.log('Failed while creating new account: ', error);
              });
          } catch (e) {
            console.log(e);
          }
        },

        logout: async () => {
          try {
            await signOut(getAuth());
          } catch (e) {
            console.log(e);
          }
        },

        addToCart: async (selectedItem, selectedSize, selectedQuantity) => {
          try {
            await addItemToCart(selectedItem, selectedSize, selectedQuantity);
          } catch (e) {
            console.log(e);
          }
        },

        updateCart: async (item) => {
          try {
            await updateCartItem(item);
          } catch (e) {
            console.log(e);
          }
        },

        submitUserReview: async (item, inputText, rating) => {
          try {
            await submitReview(item, inputText, rating);
          } catch (e) {
            console.log(e);
          }
        },

      }}>
      {children}
    </FirebaseContext.Provider>
  );
};