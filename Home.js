import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Modal, { ModalContent, SlideAnimation } from 'react-native-modals'
import { formatDistance } from 'date-fns'

export default function Home() {
    const [loaded, setLoaded] = useState(false)
    const [err, setErr] = useState('')
    const [total, setTotal] = useState({})
    const [tested, setTested] = useState({})
    const [statesData, setStatesData] = useState([])
    useEffect(() => {
        fetch('https://api.covid19india.org/data.json')
            .then(response => response.json())
            .then(response => {
                fetch('https://api.covid19india.org/v2/state_district_wise.json')
                    .then(response2 => response2.json())
                    .then(response2 => {
                        setTotal(response.statewise[0])
                        setTested(response.tested[response.tested.length - 1])
                        var states = []
                        for(var i = 1; i < response.statewise.length; i++) {
                            var state = response2.find(x => x.state === response.statewise[i].state)   
                            if(typeof state !== 'undefined') {
                                state['confirmed'] = response.statewise[i].confirmed
                                state['deaths'] = response.statewise[i].deaths
                                state['active'] = response.statewise[i].active
                                state['recovered'] = response.statewise[i].recovered
                                state['lastupdatedtime'] = response.statewise[i].lastupdatedtime
                                state['visible'] = false
                                states.push(state)
                            }  
                        }
                        setStatesData(states)
                        setLoaded(true)
                    })
                .catch(err => setErr(err))
            })
        .catch(err => setErr(err))
    }, [])

    const formatDate = (unformattedDate) => {
        const day = unformattedDate.slice(0, 2);
        const month = unformattedDate.slice(3, 5);
        const year = unformattedDate.slice(6, 10);
        const time = unformattedDate.slice(11);
        return `${year}-${month}-${day}T${time}+05:30`;
    };

    const handleTouch = (index) => {
        var temp = [...statesData]
        temp[index].visible = !temp[index].visible
        setStatesData(temp)
    }

    if(err) {
        return (
            <View style={{flex : 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontFamily:'Teko-Regular',fontSize: 15,color:'#ff3d3d'}}>{err}</Text>
            </View>
        )
    }
    else if(!loaded) {
        return (
            <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontFamily: 'Teko-Regular',fontSize: 15}}>LOADING...</Text>
            </View>
        ) 
    }
    else {
        return (
            <ScrollView>
                <View>
                    <Text style={styles.header}>COVID-19 INDIA</Text>
                    <View style={styles.cardContainer}>
                        <LinearGradient colors={['#ff7878','#ff6b61']} style={styles.card}>
                            <Text style={styles.cardHead}>CONFIRMED</Text>
                            <Text style={styles.cardNumber}>{total.confirmed}</Text>
                            <Text style={{color:'white',fontFamily:'Teko-Regular', fontSize: 15, textAlign: 'center', position: 'relative', bottom: 20}}>{ total.deltaconfirmed > 0 ? '+'+total.deltaconfirmed.toString() : total.deltaconfirmed }</Text>
                        </LinearGradient>
                        <LinearGradient colors={['#2b2b2b','#616161']} style={styles.card}>
                            <Text style={styles.cardHead}>DEATHS</Text>
                            <Text style={styles.cardNumber}>{total.deaths}</Text>
                            <Text style={{color:'white',fontFamily:'Teko-Regular', fontSize: 15, textAlign: 'center', position: 'relative', bottom: 20}}>{ total.deltadeaths > 0 ? '+'+total.deltadeaths.toString() : total.deltadeaths }</Text>
                        </LinearGradient>
                    </View>
                    <View style={styles.cardContainer}>
                        <LinearGradient colors={['#4287f5','#75aaff']} style={styles.card}>
                            <Text style={styles.cardHead}>ACTIVE</Text>
                            <Text style={styles.cardNumber}>{total.active}</Text>
                        </LinearGradient>
                        <LinearGradient colors={['#26e600','#4fff56']} style={styles.card}>
                            <Text style={styles.cardHead}>RECOVERED</Text>
                            <Text style={styles.cardNumber}>{total.recovered}</Text>
                            <Text style={{color:'white',fontFamily:'Teko-Regular', fontSize: 15, textAlign: 'center', position: 'relative', bottom: 20}}>{ total.deltarecovered > 0 ? '+'+total.deltarecovered.toString() : total.deltarecovered }</Text>
                        </LinearGradient>
                    </View>
                    <View>
                        <Text style={styles.tests}>{tested.totalindividualstested} TESTED AS OF {tested.updatetimestamp.slice(0,10)}</Text>
                        <Text style={styles.updated}>
                            { isNaN(Date.parse(formatDate(total.lastupdatedtime))) ? '' : 'Last Updated '+formatDistance(new Date(formatDate(total.lastupdatedtime)), new Date()) + ' Ago'}
                        </Text>
                        <Text style={{fontSize: 10, textAlign: 'center', opacity: 0.5, fontFamily: 'Teko-Regular'}}>TAP ON STATE NAME FOR MORE INFO</Text>
                    </View>
                    <View style={{ marginTop: 10, paddingTop: 10, marginBottom: 20}}>
                        <View style={{flexDirection: 'row', height: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 10}}>
                            <Text style={styles.tableHead}>STATE/UT</Text>
                            <View style={{height: 15, borderRadius: 4, backgroundColor: '#ff695e', flex: 1, marginRight: 10, elevation: 1}}></View>
                            <View style={{height: 15, borderRadius: 4, backgroundColor: '#2e2e2e', flex: 1, marginRight: 10, elevation: 1}}></View>
                            <View style={{height: 15, borderRadius: 4, backgroundColor: '#42a7ff', flex: 1, marginRight: 10, elevation: 1}}></View>
                            <View style={{height: 15, borderRadius: 4, backgroundColor: '#47ff72', flex: 1, marginRight: 10, elevation: 1}}></View>
                        </View>
                        {
                            statesData.map((item,i) => {
                                return (
                                    <View style={{flexDirection: 'row', height: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 5}} key={i}>     
                                        <Text style={styles.tableCont} onPress={() => handleTouch(i)}>{item.state == 'Andaman and Nicobar Islands' ? 'Andaman & Nicobar' : item.state}</Text>
                                            <Modal visible={item.visible} onTouchOutside={() => handleTouch(i)} animationDuration={100} modalAnimation={new SlideAnimation({useNativeDriver: true})}>
                                                <ModalContent style={{height:500, elevation: 10}}>
                                                    <ScrollView>
                                                    <Text style={{fontFamily:'Teko-Bold', textAlign:'center'}}>{item.state.toUpperCase()}</Text>
                                                    <Text style={{opacity: 0.5, fontFamily:'Teko-Regular', fontSize:12, textAlign: 'center'}}>{ isNaN(Date.parse(formatDate(item.lastupdatedtime))) ? '' : 'Last Updated '+formatDistance(new Date(formatDate(item.lastupdatedtime)), new Date()) + ' Ago'}</Text>
                                                    <View style={{flexDirection:'row', height: 20}}>
                                                        <Text style={{fontFamily:'Teko-Bold', marginRight: 10, marginLeft: 10,fontSize: 20}}>DISTRICT</Text>
                                                        <Text style={{fontFamily:'Teko-Bold', marginRight: 10, marginLeft: 10,fontSize: 20}}>CONFIRMED</Text>
                                                    </View>
                                                    {
                                                        item.districtData.map(item2 => (
                                                            <View style={{flexDirection:'row', height: 20}}>
                                                                <Text style={{fontFamily:'Teko-Regular', marginRight: 10, marginLeft: 10, flex: 1, textAlign:'center',fontSize: 20}}>{item2.district}</Text>
                                                                <Text style={{fontFamily:'Teko-Regular', marginRight: 10, marginLeft: 10, flex: 1, textAlign:'center',fontSize: 20}}>{item2.confirmed}</Text>
                                                            </View> 
                                                        ))
                                                    }  
                                                    </ScrollView> 
                                                </ModalContent>
                                            </Modal>
                                        <View style={{height: 20, flex: 1, marginRight: 10}}><Text style={{textAlign: 'center', fontFamily: 'Teko-Regular',fontSize: 20}}>{item.confirmed}</Text></View>
                                        <View style={{height: 20, flex: 1, marginRight: 10}}><Text style={{textAlign: 'center', fontFamily: 'Teko-Regular',fontSize: 20}}>{item.deaths}</Text></View>
                                        <View style={{height: 20, flex: 1, marginRight: 10}}><Text style={{textAlign: 'center', fontFamily: 'Teko-Regular',fontSize: 20}}>{item.active}</Text></View>
                                        <View style={{height: 20, flex: 1, marginRight: 10}}><Text style={{textAlign: 'center', fontFamily: 'Teko-Regular',fontSize: 20}}>{item.recovered}</Text></View>
                                    </View>
                                )
                            })
                        }                
                    </View>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    header : {
        fontFamily : 'Teko-Bold',
        fontSize: 30,
        paddingTop: 15,
        textAlign: 'center'
    },
    card : {
        padding: 15,
        width: 150,
        borderRadius: 8,
        height: 90,
        margin: 10,
        elevation: 7
    },
    cardContainer : {
        flexDirection: 'row',
        height: 110,
        alignItems: 'center',
        justifyContent: 'center'
    },
    cardHead : {
        color: 'white',
        fontFamily: 'Teko-Regular',
        textAlign: 'center',
        fontSize: 16
    },
    cardNumber : {
        color: 'white',
        fontFamily: 'Teko-Bold',
        textAlign: 'center',
        fontSize: 35,
        position : 'relative',
        bottom: 8
    },
    updated : {
        fontFamily: 'Teko-Regular',
        opacity: 0.5,
        textAlign: 'center',
        fontSize: 15
    },
    tests : {
        fontFamily: 'Teko-Regular',
        textAlign: 'center',
        opacity: 0.5,
        fontSize: 20,
        marginTop: 10
    },
    tableHead : {
        fontFamily : 'Teko-Bold',
        textAlign: 'center',
        fontSize: 20,
        flex: 3
    },
    tableCont : {
        fontFamily: 'Teko-Regular',
        textAlign: 'center',
        fontSize: 20,
        flex: 3
    }
})