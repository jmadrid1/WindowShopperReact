import React, { useState, useEffect } from 'react';
import { getAuth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import firebaseConfig from '../util/Firebase';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, update } from "firebase/database";
import { Account } from '../types/Account';
import { CartItem } from '../types/CartItem';
import { FirebaseDatabase } from '../util/Constants';

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

    let USER_ID = uid
    let usersPath = KEY_USERS + USER_ID
    console.log(usersPath)

    const updates = {};
    updates[usersPath] = account;

    return update(ref(db), updates);
  }

  const addToCart = (selectedItem, selectedSize, selectedQuantity) => {
    const cartItem: CartItem = {
      id: selectedItem.id,
      title: selectedItem.title,
      size: selectedSize,
      price: selectedItem.price,
      thumbnail: selectedItem.image,
      quantity: Number(selectedQuantity)
    };
    let USER_ID = user.uid
    let ITEM_ID = selectedItem.id
    let cartPath = KEY_USERS + USER_ID + KEY_CART + ITEM_ID

    const updates = {};
    updates[cartPath] = cartItem;

    return update(ref(db), updates);
  }

  return (
    <FirebaseContext.Provider
      value={{
        user,
        setUser,
        login: async (email, password) => {
          try {
            await signInWithEmailAndPassword(auth, email, password);
          } catch (e) {
            console.log(e);
          }
        },

        signUp: async (email, password, username) => {
          try {
            await createUserWithEmailAndPassword(auth, email, password)
              .then(() => {
                saveUserAccount(email, password, username, auth.currentUser.uid)
                  .catch(error => {
                    console.log('Error encountered while saving account info to Firebase: ', error);
                  })
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
            await addToCart(selectedItem, selectedSize, selectedQuantity);
          } catch (e) {
            console.log(e);
          }
        },

      }}>
      {children}
    </FirebaseContext.Provider>
  );
};