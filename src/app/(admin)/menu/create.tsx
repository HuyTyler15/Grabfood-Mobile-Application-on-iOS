import Button from '@/components/Button'
import { defaultPizzaImage } from '@/components/ProductListItem';
import { useState } from 'react'
import { View, Text, StyleSheet, TextInput, Image } from 'react-native'
import Colors from '@/constants/Colors';
import * as ImagePicker from 'expo-image-picker'; 
import { Stack } from 'expo-router';


const CreateProductScreen = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState<string | null>(null);

    const [errors, setErrors] = useState('');
    const resetScreen = () => {
        setName('');
        setPrice('');
    };

    const validateThoseTypes = () => {
        setErrors('');
        if(!name){
            setErrors('Gotta have name for it');
            return false;
        }
        if(!price){
            setErrors('You forgot the price ');
            return false;
        }
        if(isNaN(parseFloat(price))){
            setErrors('Not a number');
            return false;
        }
        return true;
    };

    const onCreate = () => {;
        if (!validateThoseTypes()) {
            return;
        };
        console.warn('Add the new product ', name);
        // going to save on database
        resetScreen();
    };

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        console.log(result);
    
        if (!result.canceled) {
          setImage(result.assets[0].uri);
        }
      };

  return (
    <View style={ styles.container}>
      <Stack.Screen options={{title: 'Add the new product here'}}/>
      <Image source={{ uri: image || defaultPizzaImage}} style={styles.image}/>
      <Text 
      onPress={pickImage}
      style={ styles.selectbutton}>Choose from library </Text>

      <Text style={ styles.label}>Name: </Text>
      <TextInput 
      onChangeText={setName}
      value = {name} 
      placeholder='Name of your product' 
      style={ styles.input}/>

      <Text style={ styles.label}>Price ($) </Text>
      <TextInput 
      value = {price}
      onChangeText={setPrice}
      placeholder='00.0' 
      style={ styles.input}
      keyboardType="numeric"
      />

      <Button onPress={onCreate} text='Add the new product'/>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    input:{
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 20,
        marginTop: 5,
        marginBottom: 5,
    },
    label:{
        color:'gray',
        fontSize: 40,
    },
    image:{
        width:'50%',
        aspectRatio: 1,
        alignSelf:'center',
    },
    selectbutton:{
        alignSelf:'center',
        fontWeight: 'bold',
        color: Colors.light.tint,
        marginVertical: 10,
    },
})

export default CreateProductScreen