import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native'
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit'

export default function Charts() {
    const [err, setErr] = useState('')
    const [loaded, setLoaded] = useState(false)
    const [age, setAge] = useState([])
    const [gender, setGender] = useState([])
    const [glabels, setgLabels] = useState([])
    const [graphData, setGraphData] = useState([])
    const [RgraphData, setRgraphData] = useState([])
    const [DgraphData, setDgraphData] = useState([])

    useEffect(() => {
        fetch('https://api.covid19india.org/raw_data.json')
            .then(response => response.json())
            .then(response => {
                fetch('https://api.covid19india.org/data.json')
                    .then(response2 => response2.json())
                    .then(response2 => {
                        var tempGender = [0, 0, 0]
                        var tempAge = [0, 0, 0, 0, 0, 0, 0]
                        for(var i = 0; i < response.raw_data.length; i++) {
                            if(response.raw_data[i].gender == 'M')
                                tempGender[0]++
                            else if(response.raw_data[i].gender == 'F')
                                tempGender[1]++
                            else
                                tempGender[2]++
                            if(response.raw_data[i].agebracket > 0 && response.raw_data[i].agebracket <= 10) {
                                tempAge[0]++
                                tempAge[6]++
                            }      
                            else if(response.raw_data[i].agebracket >= 11 && response.raw_data[i].agebracket <= 25) {
                                tempAge[1]++
                                tempAge[6]++
                            }         
                            else if(response.raw_data[i].agebracket >= 26 && response.raw_data[i].agebracket <= 40) {
                                tempAge[2]++
                                tempAge[6]++
                            }
                                
                            else if(response.raw_data[i].agebracket >= 41 && response.raw_data[i].agebracket <= 60) {
                                tempAge[3]++
                                tempAge[6]++
                            }
                            else if(response.raw_data[i].agebracket >= 61 && response.raw_data[i].agebracket <= 80) {
                                tempAge[4]++
                                tempAge[6]++
                            }
                            else if(response.raw_data[i].agebracket > 80) {
                                tempAge[5]++
                                tempAge[6]++
                            }
                        }
                        setAge(tempAge)
                        setGender(tempGender)
                        // for line chart
                        var labels = [], Cdata = [], Rdata = [], Ddata = []
                        for(var i = 0; i < response2.cases_time_series.length; i++) {
                            if(response2.cases_time_series[i].date.slice(0,2) == '01') {
                                labels.push(response2.cases_time_series[i].date.slice(0, 2)+' '+response2.cases_time_series[i].date.slice(3,6))
                                Cdata.push(response2.cases_time_series[i].totalconfirmed)
                                Rdata.push(response2.cases_time_series[i].totalrecovered)
                                Ddata.push(response2.cases_time_series[i].totaldeceased)
                            }
                        }
                        if(response2.cases_time_series[response2.cases_time_series.length - 1].date.slice(0, 2) != '01') {
                            labels.push(response2.cases_time_series[response2.cases_time_series.length - 1].date.slice(0, 2)+' '+response2.cases_time_series[response2.cases_time_series.length - 1].date.slice(3, 6))
                            Cdata.push(response2.cases_time_series[response2.cases_time_series.length - 1].totalconfirmed)
                            Rdata.push(response2.cases_time_series[response2.cases_time_series.length - 1].totalrecovered)
                            Ddata.push(response2.cases_time_series[response2.cases_time_series.length - 1].totaldeceased)
                        }
                        setgLabels(labels)
                        setGraphData(Cdata)
                        setRgraphData(Rdata)
                        setDgraphData(Ddata)
                        setLoaded(true)
                    })
                    .catch(err => setErr(err))
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
                <View>
                    <Text style={styles.header}>INFOGRAPHICS</Text>
                    <Text style={{fontFamily:'Teko-Regular', fontSize: 20, textAlign: 'center'}}>TOTAL CASES IN INDIA</Text>
                    <View style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center'}}>
                        <View style={{height:10,width:10,backgroundColor:'#e80202', borderRadius: 5}}></View>
                        <Text style={{fontFamily: 'Teko-Regular', margin: 5}}>CONFIRMED</Text>
                        <View style={{height:10,width:10,backgroundColor:'#00b515', borderRadius: 5}}></View>
                        <Text style={{fontFamily: 'Teko-Regular', margin: 5}}>RECOVERED</Text>
                        <View style={{height:10,width:10,backgroundColor:'#3b3b3b', borderRadius: 5}}></View>
                        <Text style={{fontFamily: 'Teko-Regular', margin: 5}}>DEATHS</Text>
                    </View>
                    <LineChart
                        data={{
                            labels: glabels,
                            datasets: [
                                {
                                    data: graphData,
                                    color: (opacity = 1) => `rgba(212, 14, 0, ${opacity})`,
                            },
                                {
                                    data: RgraphData,
                                    color: (opacity = 1) => `rgba(0, 250, 13, ${opacity})`,
                            },
                            {
                                data: DgraphData,
                                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            }
                        ]
                        }}
                        width={Dimensions.get("window").width} // from react-native
                        height={240}
                        chartConfig={{
                            backgroundGradientFrom: "#f2f2f2",
                            backgroundGradientTo: "#f2f2f2",
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            style: {
                                borderRadius: 16,
                            },
                            propsForDots: {
                                r: "4",
                                strokeWidth: "1",
                                stroke: "#000000"
                            },
                            fillShadowGradient : '#000000',
                            fillShadowGradientOpacity : 0.05
                        }}
                        style={{
                            marginVertical: 8,
                        }}
                    />
                    <Text style={{fontFamily:'Teko-Regular', fontSize: 20, textAlign: 'center'}}>AGE</Text>
                    <Text style={{fontSize: 10, opacity: 0.5, fontFamily: 'Teko-Regular', textAlign: 'center'}}>BASED ON {age[6]} CASES</Text>
                    <BarChart 
                        data = {{
                            labels : ['1-10','11-25','26-40','41-60','61-80','80+'],
                            datasets : [
                                {
                                    data : [age[0],age[1],age[2],age[3],age[4],age[5]]
                                }
                            ]
                        }}
                        width={Dimensions.get("window").width}
                        height={240}
                        fromZero
                        chartConfig={{
                            backgroundGradientFrom: "#f2f2f2",
                            backgroundGradientTo: "#f2f2f2",
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            barPercentage: 1,
                        }}
                    />
                    <Text style={{fontFamily:'Teko-Regular', fontSize: 20, textAlign: 'center'}}>GENDER</Text>
                    <Text style={{fontSize: 10, opacity: 0.5, fontFamily: 'Teko-Regular', textAlign: 'center'}}>AWAITING DETAILS FOR {gender[2]} PATIENTS</Text>
                    <View style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center'}}>
                        <View style={{height:10,width:10,backgroundColor:'#ff9d00', borderRadius: 5}}></View>
                        <Text style={{fontFamily: 'Teko-Regular', margin: 5}}>Male({gender[0]})</Text>
                        <View style={{height:10,width:10,backgroundColor:'#00c7e6', borderRadius: 5}}></View>
                        <Text style={{fontFamily: 'Teko-Regular', margin: 5}}>Female({gender[1]})</Text>
                        <View style={{height:10,width:10,backgroundColor:'#424242', borderRadius: 5}}></View>
                        <Text style={{fontFamily: 'Teko-Regular', margin: 5}}>Unknown({gender[2]})</Text>
                    </View>
                    <PieChart 
                        data={[
                            {
                                name: 'Male',
                                cases : gender[0],
                                color : '#ff9d00',
                                legendFontColor: "#7F7F7F",
                                legendFontSize: 15
                            },
                            {
                                name: 'Female',
                                cases : gender[1],
                                color : '#00c7e6',
                                legendFontColor: "#7F7F7F",
                                legendFontSize: 15
                            },
                            {
                                name: 'Unknown',
                                cases : gender[2],
                                color : '#424242',
                                legendFontColor: "#7F7F7F",
                                legendFontSize: 15
                            }
                        ]}
                        width={Dimensions.get("window").width}
                        height={230}
                        accessor="cases"
                        absolute
                        backgroundColor="transparent"
                        chartConfig = {{
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        }}
                        hasLegend = {false}
                        paddingLeft = {Dimensions.get("window").width/4}
                    />
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
    }
})