import { FlatList, Text , ActivityIndicator} from 'react-native';
import ProductListItem from '@/components/ProductListItem';
import { useProductList } from '@/api/product';

// made by charliedunno

export default function MenuScreen() {
  const {data: products, error, isLoading}  = useProductList();

  if(isLoading){
    return <ActivityIndicator />
  }
  
  if(error){
    return <Text> Can't bring it back, cannot fetch products</Text>
  }
  
  return (
      <FlatList
      data={products}
      renderItem = {({ item }) => <ProductListItem product = {item} />}
      numColumns = {2}
      contentContainerStyle ={ { gap: 10, padding: 10 }}
      columnWrapperStyle={{ gap: 10 }}
      />
  );
}


