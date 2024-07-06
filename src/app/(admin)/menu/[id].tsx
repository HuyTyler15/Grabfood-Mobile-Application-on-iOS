import { Text, View, Image, StyleSheet, Pressable } from 'react-native';
import { Stack, useLocalSearchParams, useRouter,Link } from 'expo-router';
import { defaultPizzaImage } from '@/components/ProductListItem';
import { useState } from 'react';
import { useCart } from '@/providers/CartProvider';
import { PizzaSize } from '@/types';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useProduct } from '@/api/product';
import { ActivityIndicator } from 'react-native';

const sizesPizza: PizzaSize[] = [ 'S', 'M', 'L', 'XL'];

const  ProductDetailsScreen =() => { 

  let { id: idString } = useLocalSearchParams();
  
  const id = parseFloat(typeof idString === 'string' ? idString : Array.isArray(idString) && idString.length > 0 ? idString[0] : '');

  const { data: product, error, isLoading } = useProduct(id);


  const {addItem}  = useCart();
  const router = useRouter();
  const [selectedSize, setSelected] = useState<PizzaSize>('M');

  const addToCart = () => {
    if (!product) {
      return;
    }
    addItem ( product, selectedSize);
    router.push('/cart');
  };

  if(isLoading){
    return <ActivityIndicator />
  }
  
  if(error){
    return <Text> Can't bring it back, cannot fetch products, failed </Text>
  }

  return (
    <View >
      
      <Stack.Screen 
            options={{ 
            title: 'Menu',
            headerRight: () => (
            <Link href={`/(admin)/menu/create?id=${id}`} asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="pencil" // edit the product
                    size={25}
                    color={Colors.light.tint}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ), }}/>


      <Stack.Screen options={{ title: product.name}}/>

      <Image source={{ uri: product.image || defaultPizzaImage }} style = {styles.image} />

      <Text style={styles.title} >{product.name}</Text>

      <Text style={styles.price} >Price:${product.price}</Text>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 40,
    flex: 1,
    borderRadius: 40,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    alignSelf: 'center',
  },
  subtitle: {
    marginVertical: 10,
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  price:  {
    fontSize: 18,
    fontWeight: 'bold',

  },
})

export default ProductDetailsScreen;
