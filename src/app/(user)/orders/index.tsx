import { Text, FlatList, ActivityIndicator } from "react-native"
import OrderListItem from "@/components/OrderListItem";
import { useMyOrderList } from "@/api/orders";

export default function OrdersScreen(){
  const {data: orders, isLoading, error} = useMyOrderList();

  if(isLoading){
    return <ActivityIndicator />
  }
  
  if(error){
    return <Text> Can't bring it back, cannot fetch products</Text>
  }
    return (
        <>
          <FlatList
            data= {orders}           
            renderItem={({ item }) => <OrderListItem order={item} />}
            contentContainerStyle={{ gap: 10, padding: 10 }}
          />
        </>
      );
}

