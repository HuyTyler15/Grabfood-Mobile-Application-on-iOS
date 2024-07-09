import { Text, FlatList } from "react-native"
import OrderListItem from "@/components/OrderListItem";
import { useAdminOrderList } from "@/api/orders";
import { ActivityIndicator } from "react-native";

export default function OrdersScreen(){

  const {data: orders, isLoading, error} = useAdminOrderList({archived: false});

  if(isLoading){
    return <ActivityIndicator />
  }
  
  if(error){
    return <Text> Can't bring it back, cannot fetch products</Text>
  }
    return (
        <>
          {/* <Stack.Screen options={{ title: 'Orders' }} /> */}
          <FlatList
            data= {orders}           
            renderItem={({ item }) => <OrderListItem order={item} />}
            contentContainerStyle={{ gap: 10, padding: 10 }}
          />

        </>
      );
}

