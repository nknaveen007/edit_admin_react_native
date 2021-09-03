import React,{useState,useEffect} from 'react'
import { StyleSheet, Text, View, ScrollView,Dimensions, useWindowDimensions, PlatformColor,Platform } from 'react-native'
import "@expo/match-media";
import { useMediaQuery } from "react-responsive";
import {LineChart,BarChart,PieChart,ProgressChart,ContributionGraph,StackedBarChart} from 'react-native-chart-kit';
import firebase from '../../firebase/firebase'
import { DataTable, Card, useTheme } from 'react-native-paper';
import { Poppins_400Regular, Poppins_500Medium, Poppins_500Medium_Italic, Poppins_600SemiBold } from '@expo-google-fonts/poppins';

const DashBoard = () => {
    const {width,height}=useWindowDimensions()
    const isDesktopOrLaptop = useMediaQuery({query: '(min-device-width: 1050px)'})
    const isTabOrLap = useMediaQuery({ query: '(min-device-width: 601px)' })
    const isMobile = useMediaQuery({ query: '(max-device-width: 600px)' })
    const isgraphWith = useMediaQuery({ query: '(max-device-width: 370px)' })
  
    const [quotesFullData, setquotesFullData] = useState([])
    const [totalQuotes, settotalQuotes] = useState(0)
    const [page, setPage] = useState(0);
    const [pngArray, setpngArray] = useState([])

    const {
        colors: { background },
      } = useTheme();

      

    useEffect(() => {
        (async() => {
            const data = await firebase.firestore().collection('url').get()
            const png = await firebase.firestore().collection('Png').doc('DhRQz6RCOuhpHdxej00O').get()
           
                
            let arrayId = []
            let arrayData = []
            let numberOfImage = []
            let overall=[]
        data.forEach((docs) => {
              
              let convertString=docs.id.toLowerCase()
              arrayId.push(convertString)
              arrayData.push(docs.data())
              
        })
            arrayData.map((value, index) => {
                let temIndex=[]
                value.image.map((value1, index1) => {
                    numberOfImage.push(index1)
                    temIndex.push(index1)

                })
                overall.push({
                    index:index,
                    title: value.title,
                    number:temIndex.length
                })
            })
            let total=0
            overall.map((value, index) => {
              total=total+value.number   
            })
            settotalQuotes(total)
            setquotesFullData(overall)

            setpngArray(png.data().image)
        })()
       
    }, [])

    const  sortedItems = quotesFullData
   
     const itemsPerPage=4
     const  from = page * itemsPerPage;
    const to = (page + 1) * itemsPerPage;
    
    const data = [
        {
          name: "Quotes",
          population: totalQuotes,
          color: "#3399ff",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15
        },
        {
          name: "Poster",
          population: 3,
          color: "#cdb99c",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15
        },
        {
            name: "Template",
            population: 1,
            color: "#3366cc",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
          },
      
      ];

return (
<ScrollView style={[styles.mainContainer, { marginVertical: isTabOrLap ? 10 : 10 }]} >
        
        <View style={styles.graphMainContainer}>
            
          
            <Card style={[styles.graphContainer]}>
                <Text style={{fontFamily:'Poppins_600SemiBold',fontSize:18,marginLeft:10}}>OverAll Images</Text>
            <PieChart
  data={data}
  width={300}
  height={170}
  chartConfig={{
    backgroundColor: "#e26a00",
    backgroundGradientFrom: "#fb8c00",
    backgroundGradientTo: "#ffa726",
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  
  }}
  bezier
  style={{alignSelf:isgraphWith?'flex-start':'center',borderRadius:16}}
  accessor={"population"}
  paddingLeft={"10"}
  backgroundColor="transparent"
  absolute
/>
    
            </Card>
                
                
            <Card style={styles.graphContainer}>
            <BarChart
        data={{
          labels: ['Quotes','Poster','Template'],
          datasets: [
            {
              data: [totalQuotes,3,pngArray.length],
            },
          ],
        }}
        width={300}
        height={180}
        yAxisLabel={'Img '}
        chartConfig={{
            backgroundColor: 'transparent',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
          decimalPlaces: 0,
          color: (opacity = 1) => Platform.OS=='web'?`rgba(255, 255, 255, ${opacity})`:`rgba(83, 109, 254, ${opacity})`,
          style: {
              borderRadius: 16,
              alignSelf:'center'
          }
        }}
        style={{
          marginVertical: 5,
            borderRadius: 16,
            alignSelf: 'center',
          backgroundColor:'transparent'
                    }}
                    
      />
            </Card>
    </View>
            

        <View style={{ marginTop: 10, marginHorizontal: 10 }}>
        <Text style={{fontFamily:'Poppins_600SemiBold',fontSize:18}}>Quotes</Text>
            <Card>
                
          <DataTable>
            <DataTable.Header  style={{backgroundColor:'#536DFE'}}>
                        <DataTable.Title
                            style={{color:'#fff'}}
              >
               <Text style={{color:'#fff',fontSize:16}}>No's</Text>
              </DataTable.Title>
              <DataTable.Title style={{flex:2}}> <Text style={{color:'#fff',fontSize:16}}>Category</Text></DataTable.Title>
              <DataTable.Title style={{flex:2,right:'5%'}} numeric> <Text style={{color:'#fff',fontSize:16}}>Images</Text></DataTable.Title>
    
            </DataTable.Header>
  
            {sortedItems.slice(from, to).map((item,index) => (
              <DataTable.Row key={index}>
                    <DataTable.Cell style={styles.first} > <Text style={{ fontFamily:'Poppins_400Regular' }}>{item.index+1}</Text></DataTable.Cell>
                    <Text style={{ alignSelf: 'center', flex: 2, left: '1%',textTransform:'capitalize',fontFamily:'Poppins_400Regular' }}>{item.title}</Text>
                    <DataTable.Cell style={{ flex: 2, right: '8%', }} numeric> <Text style={{fontFamily:'Poppins_400Regular' }}>{item.number}</Text></DataTable.Cell>
          
                
              </DataTable.Row>
            ))}
  
            <DataTable.Pagination
              page={page}
              numberOfPages={Math.round(sortedItems.length / itemsPerPage)}
              onPageChange={(page) => setPage(page)}
              label={`${from + 1}-${to} of ${sortedItems.length}`}
              
                        
            />
          </DataTable>
        </Card>
            </View>
        </ScrollView>
    )
}

export default DashBoard

const styles = StyleSheet.create({
    mainContainer: {
        flex:1,
        marginHorizontal: 5,
        
        
    },
    graphMainContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: 5,
        justifyContent: 'space-evenly'
    },
    graphContainer: {
        width: 300,
        height: 220,
        flexGrow: 1,
        marginVertical: 10,
        marginHorizontal: 10,
        paddingVertical: '2%',
        minWidth:300
        
    }
})
