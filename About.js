import React from 'react'
import { View, Text, ScrollView, StyleSheet, Linking, Image } from 'react-native'

export default function About() {
    return (
        <ScrollView>
            <Text style={styles.header}>ABOUT</Text>
            <Text style={styles.para}>This is not an official app. This app uses API provided by <Text style={{color:'#0377fc'}} onPress={() => Linking.openURL('https://github.com/covid19india')}>covid19india.org</Text> which uses crowdsourced patient database. The database is updated more frequently than MoHFW.</Text>

            <Text style={styles.para}>This app was made using React Native and it is open source. Feel free to contribute.</Text>
            <Text style={{fontSize: 25, color:'#0377fc', fontFamily:'Teko-Bold', textAlign: 'center'}} onPress={() => Linking.openURL('https://github.com/slxsh/covid19india-app')}>GITHUB</Text>
            <Text style={{textAlign: 'center', fontFamily: 'Teko-Bold', fontSize: 30,}}>Stay Safe!</Text>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Image source={require('./corona.png')} style={{width:300, height: 300}} />
            </View>  
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    header : {
        fontFamily : 'Teko-Bold',
        fontSize: 30,
        paddingTop: 15,
        textAlign: 'center'
    },
    para : {
        fontFamily : 'Teko-Regular',
        padding: 10,
        textAlign: 'center',
        fontSize: 20
    }
})
