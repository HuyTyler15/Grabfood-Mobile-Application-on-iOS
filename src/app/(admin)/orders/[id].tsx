import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator  } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import OrderListItem from '@/components/OrderListItem';
import OrderItemListItem from '@/components/OrderItemListItem';
import { OrderStatusList } from '@/types';
import Colors from '@/constants/Colors';
import { useOrderDetails } from '@/api/orders';


export default function OrderDetailsScreen() {
  const { id: idString } = useLocalSearchParams();
  
  const id = parseFloat(typeof idString === 'string' ? idString : Array.isArray(idString) && idString.length > 0 ? idString[0] : '');

  const {data: order, isLoading, error} = useOrderDetails(id);

  if(isLoading){
    return <ActivityIndicator />
  }
  if(!order){
    return <Text>Not found </Text>
  }


  return (
    <View style ={{ gap: 10, padding: 10, flex: 1 }}>

      <Stack.Screen options= {{ title: `Order #${id}` }} /> 

      <FlatList
        data={order.order_items}       
        renderItem={({ item }) => <OrderItemListItem item={item} />}
        contentContainerStyle={{ gap: 10, padding: 10 }}
        ListHeaderComponent={() => <OrderListItem order={order}/>}
        ListFooterComponent={() => (
          <>
            <Text style={{ fontWeight: 'bold' }}>Status</Text>
            <View style={{ flexDirection: 'row', gap: 5 }}>
              {OrderStatusList.map((status) => (
                <Pressable
                  key={status}
                  onPress={() => console.warn('Update status')}
                  style={{
                    borderColor: Colors.light.tint,
                    borderWidth: 1,
                    padding: 10,
                    borderRadius: 5,
                    marginVertical: 10,
                    backgroundColor:
                      order.status === status
                        ? Colors.light.tint
                        : 'transparent',
                  }}
                >
                  <Text
                    style={{
                      color:
                        order.status === status ? 'white' : Colors.light.tint,
                    }}
                  >
                    {status}
                  </Text>
                </Pressable>
              ))}
            </View>
          </>)
          }

      />

      {/* <Text> Order details: {id} </Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    gap: 10,
  },
});

