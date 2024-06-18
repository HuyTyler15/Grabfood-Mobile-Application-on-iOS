import { Text, View, Image, StyleSheet, Pressable } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import products from '@assets/data/products';
import { defaultPizzaImage } from '@/components/ProductListItem';
import { useState } from 'react';
import Button from '@/components/Button';
import { useCart } from '@/providers/CartProvider';
import { PizzaSize } from '@/types';

const sizesPizza: PizzaSize[] = [ 'S', 'M', 'L', 'XL'];

const  ProductDetailsScreen =() => { 

  const {id} = useLocalSearchParams();
  const {addItem}  = useCart();

  const [selectedSize, setSelected] = useState<PizzaSize>('M');

  const product = products.find((p) => p.id.toString() == id);
 
  const addToCart = () => {
    if (!product) {
      return;
    }
    addItem ( product, selectedSize);
  };

  if(!product){
    return <Text>Sorry,not Found </Text>;
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
