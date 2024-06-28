import { View, Text, StyleSheet, FlatList} from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import orders from '../../../../assets/data/orders';
import OrderListItem from '@/components/OrderListItem';
import OrderItemListItem from '@/components/OrderItemListItem';



export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams();

  const order = orders.find((o) => o.id.toString() === id);

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

