import { Text, View, Image, StyleSheet, Pressable } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { defaultPizzaImage } from '@/components/ProductListItem';
import { useState } from 'react';
import Button from '@/components/Button';
import { useCart } from '@/providers/CartProvider';
import { PizzaSize } from '@/types';
import { useProduct } from '@/api/product';
import { ActivityIndicator } from 'react-native';

const sizesPizza: PizzaSize[] = [ 'S', 'M', 'L', 'XL'];

const  ProductDetailsScreen =() => { 
  const { id: idString } = useLocalSearchParams();
  
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
    <View>
      <Stack.Screen options={{ title: product.name}}/>

      <Image source={{ uri: product.image || defaultPizzaImage }} style = {styles.image} />

      <Text style = {{ fontSize: 30}}>Select size</Text>

      <View style ={styles.sizesPizza}>
            {sizesPizza.map((size) => ( 
                <Pressable 
                onPress={() => {
                  setSelected(size)
                }} 
                    style ={[
                      styles.size,
                      {
                          backgroundColor: selectedSize == size ? 'gainsboro' : 'white',
                      }]}

                      key={size}
                      >
                        <Text style ={styles.sizeText}>{size}</Text>
                </Pressable>
            ))} 
      </View>

      <Text style={styles.price} >Price:${product.price}</Text>

      <Button onPress={addToCart} text="Add to cart" />
      
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
  price:  {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 'auto',
  },
  sizesPizza: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  size: {
    backgroundColor:'gainsboro',
    width: 50,
    aspectRatio: 1,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
})

export default ProductDetailsScreen;
