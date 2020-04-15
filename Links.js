import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, Linking, StyleSheet } from 'react-native'
import RNPickerSelect from 'react-native-picker-select'

export default function Links() {
    const [err, setErr] = useState('')
    const [loaded, setLoaded] = useState(true)
    const [services, setServices] = useState([])
    const [selectedServices, setSelectedServices] = useState([])

    const handleChange = (val) => {
        var tempServices = []
        for(var i = 0; i < services.length; i++) {
            if(services[i].state == val)
                tempServices.push(services[i])
        }
        setSelectedServices(tempServices)
    }

    useEffect(() => {
        fetch('https://api.covid19india.org/resources/resources.json')
            .then(response => response.json())
            .then(response => {
                setServices(response.resources)
                setLoaded(true)
            })
            .catch(err => setErr(err))
    }, [])

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
                <Text style={styles.header}>RESOURCES</Text>
                <Text style={{fontFamily: 'Teko-Regular', textAlign: 'center', fontSize: 20}}>OFFICIAL UPDATES BY GOVT. OF INDIA</Text>
                <Text style={{fontFamily: 'Teko-Regular', textAlign: 'center', fontSize: 20, color: '#0377fc', padding: 5}} onPress={() => Linking.openURL('https://www.mygov.in/covid-19')}>https://www.mygov.in/covid-19</Text>
                <Text style={{fontFamily: 'Teko-Regular', textAlign: 'center', fontSize: 20}}>WORLD HEALTH ORGANIZATION WEBSITE</Text>
                <Text style={{fontFamily: 'Teko-Regular', textAlign: 'center', fontSize: 20, color: '#0377fc', padding: 5}} onPress={() => Linking.openURL('https://www.who.int/emergencies/diseases/novel-coronavirus-2019')}>https://www.who.int/emergencies/diseases/novel-coronavirus-2019</Text>
                <Text style={{fontFamily: 'Teko-Bold', textAlign: 'center', marginTop: 20, fontSize: 20}}>SERVICES</Text>
                <RNPickerSelect 
                    items={[
                        { label : 'Andaman & Nicobar', value : 'Andaman & Nicobar'},
                        { label : 'Andhra Pradesh', value : 'Andhra Pradesh'},
                        { label : 'Arunachal Pradesh', value : 'Arunachal Pradesh'},
                        { label : 'Assam', value : 'Assam'},
                        { label : 'Bihar', value : 'Bihar'},
                        { label : 'Chandigarh', value : 'Chandigarh'},
                        { label : 'Chhattisgarh', value : 'Chhattisgarh'},
                        { label : 'Delhi', value : 'Delhi'},
                        { label : 'Goa', value : 'Goa'},
                        { label : 'Gujarat', value : 'Gujarat'},
                        { label : 'Haryana', value : 'Haryana'},
                        { label : 'Himachal Pradesh', value : 'Himachal Pradesh'},
                        { label : 'Jammu & Kashmir', value : 'Jammu & Kashmir'},
                        { label : 'Jharkhand', value : 'Jharkhand'},
                        { label : 'Karnataka', value: 'Karnataka'},
                        { label : 'Kerala', value : 'Kerala'},
                        { label : 'Madhya Pradesh', value: 'Madhya Pradesh'},
                        { label : 'Maharashtra', value: 'Maharashtra'},
                        { label : 'Manipur', value: 'Manipur'},
                        { label : 'Meghalaya', value:'Meghalaya'},
                        { label : 'Mizoram', value : 'Mizoram'},
                        { label : 'Nagaland', value : 'Nagaland'},
                        { label : 'Odisha', value: 'Odisha'},
                        { label : 'Puducherry', value: 'Puducherry'},
                        { label : 'Punjab', value : 'Punjab'},
                        { label : 'Rajasthan', value: 'Rajasthan'},
                        { label : 'Sikkim', value : 'Sikkim'},
                        { label : 'Tamil Nadu', value : 'Tamil Nadu'},
                        { label : 'Telangana', value : 'Telangana'},
                        { label : 'Tripura', value: 'Tripura'},
                        { label : 'Uttar Pradesh', value: 'Uttar Pradesh'},
                        { label : 'Uttarakhand', value: 'Uttarakhand'},
                        { label : 'West Bengal', value: 'West Bengal'}
                    ]}
                    placeholder={{label:'Select State/UT', value : null}}
                    onValueChange={(value) => handleChange(value)}
                />
                {
                    selectedServices.map((item,i) => (
                        <View style={{margin: 10, elevation: 3, backgroundColor: 'white', paddingTop: 20, paddingBottom: 20, borderRadius: 7}} key={i}>
                            <Text style={{fontFamily: 'Teko-Bold', textAlign: 'center', fontSize: 15}}>{item.nameoftheorganisation}</Text>
                            <Text style={{fontFamily: 'Teko-Regular', textAlign: 'center', fontSize: 15}}>{item.city} | {item.category}</Text>
                            <Text style={{fontFamily: 'Teko-Regular', textAlign: 'center', fontSize: 15}}>{item.descriptionandorserviceprovided}</Text>
                            <Text style={{fontFamily: 'Teko-Regular', textAlign: 'center', color: '#0377fc', fontSize: 15}} onPress={() => Linking.openURL('tel:${'+item.phonenumber+'}')}>{item.phonenumber}</Text>
                            <Text style={{fontFamily: 'Teko-Regular', textAlign: 'center', color: '#0377fc', fontSize: 15}} onPress={() => Linking.openURL(item.contact)}>{item.contact}</Text>
                        </View>
                    ))
                }
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
    }
})