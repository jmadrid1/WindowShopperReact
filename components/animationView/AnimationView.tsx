import React from 'react';
import { StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { ScrollView } from 'react-native-gesture-handler';

const loading = require('../animations/loading.json');

type IProps = {
    option: number;
}

/**
 * @param {{ 
 * option: number,
 * }} props 
 * @returns
 */

/**
 * AnimationView creates a canvas for swapping animations.
 * This component receives an option prop as a number for selecting animations.
 * Currently, only one animation is available, but this component is designed include more options.
 */
const AnimationView = (props: IProps) => {
    const {option} = props;
    return (
        <ScrollView style={styles.container} enabled={false}>
            {option === 1 && <LottieView autoPlay loop style={{...styles.lottie, width: '100%', padding: 90, marginTop: 90}} source={loading}/>}
        </ScrollView>
    );
}

const styles = StyleSheet.create({

    container: {
        flexDirection: 'column',
        flex: 1,
    },

    lottie: {
        width: '100%',
        justifyContent: 'center',
        marginTop: 60
    },

});

export default AnimationView;
