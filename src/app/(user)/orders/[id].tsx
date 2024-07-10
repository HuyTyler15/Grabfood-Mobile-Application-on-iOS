import { View, Text, StyleSheet, FlatList, ActivityIndicator} from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import OrderListItem from '@/components/OrderListItem';
import OrderItemListItem from '@/components/OrderItemListItem';
import { useOrderDetails } from '@/api/orders';

export default function OrderDetailsScreen() {
  
  const { id: idString } = useLocalSearchParams();
  
  const id = parseFloat(typeof idString === 'string' ? idString : Array.isArray(idString) && idString.length > 0 ? idString[0] : '');

  const {data: order, isLoading, error} = useOrderDetails(id);

  if(isLoading){
    return <ActivityIndicator />
  }

  if(!order){
    return <Text>Order Not found </Text>
  }


  return (
    <View style ={{ gap: 10, padding: 10, flex: 1 }}>

      <Stack.Screen options= {{ title: `Order #${id}` }} /> 

      <FlatList
        data={order.order_items}       
        renderItem={({ item }) => <OrderItemListItem item={item} />}
        contentContainerStyle={{ gap: 10, padding: 10 }}
        ListHeaderComponent={() => <OrderListItem order={order}/>}

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

