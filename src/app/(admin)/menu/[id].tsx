import { Text, View, Image, StyleSheet, Pressable } from 'react-native';
import { Stack, useLocalSearchParams, useRouter,Link } from 'expo-router';
import products from '@assets/data/products';
import { defaultPizzaImage } from '@/components/ProductListItem';
import { useState } from 'react';
import Button from '@/components/Button';
import { useCart } from '@/providers/CartProvider';
import { PizzaSize } from '@/types';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

const sizesPizza: PizzaSize[] = [ 'S', 'M', 'L', 'XL'];

const  ProductDetailsScreen =() => { 

  const {id} = useLocalSearchParams();
  const {addItem}  = useCart();
  const router = useRouter();
  const [selectedSize, setSelected] = useState<PizzaSize>('M');
  const product = products.find((p) => p.id.toString() == id);
  const addToCart = () => {
    if (!product) {
      return;
    }
    addItem ( product, selectedSize);
    router.push('/cart');
  };

  if(!product){
    return <Text>Sorry,not Found </Text>;
  }

  return (
    <View style={styles.container}>
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
    marginTop: 'auto',
  },
})

export default ProductDetailsScreen;
