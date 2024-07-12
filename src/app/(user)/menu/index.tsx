import { FlatList, ActivityIndicator, Text } from 'react-native';
import ProductListItem from '@/components/ProductListItem';
import { useProductList } from '@/api/product';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

// made by charliedunno

export default function MenuScreen() {

  const {
    data: products,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const {data, error} = await supabase.from('products').select('*');
      if (error){
        throw new Error(error.message);
      }
      return data;
    },
  });

  if(isLoading){
    return <ActivityIndicator />
  }
  
  if(error){
    return <Text> Can't bring it back, cannot fetch products</Text>
  }

  return (
      <FlatList
      data={products}
      renderItem={({item }) => <ProductListItem product = {item} />}
      numColumns={2}
      contentContainerStyle={{ gap: 10, padding: 10 }}
      columnWrapperStyle={{ gap: 10 }}
      />
  );
}


