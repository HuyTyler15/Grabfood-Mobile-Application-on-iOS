import Button from '@/components/Button'
import { defaultPizzaImage } from '@/components/ProductListItem';
import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TextInput, Image, Alert } from 'react-native'
import Colors from '@/constants/Colors';
import * as ImagePicker from 'expo-image-picker'; 
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useInsertProduct, useProduct,useUpdateProduct ,useDeleteProduct } from '@/api/product';


const CreateProductScreen = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [errors, setErrors] = useState('');

    const {id: idString} = useLocalSearchParams();
    const id = parseFloat(typeof idString === 'string' ? idString : Array.isArray(idString) && idString.length > 0 ? idString[0] : '');

    const isUpdating = !!id;
    // huy:double exclamation marks !! to make id become the Boolean Type here
    // because id is not a Boolean Type here

    const { mutate: insertProduct } = useInsertProduct();
    const { mutate: updateProduct } = useUpdateProduct();
    const { data: updatingProduct} = useProduct(id);
    const { mutate: deleteProduct } = useDeleteProduct();


    console.log(updatingProduct);

    const router = useRouter();

    useEffect(() => {
        if(updatingProduct){
            setName(updatingProduct.name);
            setPrice(updatingProduct.price.toString());
            setImage(updatingProduct.image);
        }
    },[updatingProduct]);

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

    const onSubmit = () => {;
        if (isUpdating) {
            onUpdate();
            // update
        } else{
            onCreate();
        }      
    };

    // Save to Database supabase
    const onCreate = () => {;
        if (!validateThoseTypes()) {
            return;
        };
        console.warn('Adding the new product ', name);

        insertProduct(
            {id, name, price: parseFloat(price), image },
            {
                onSuccess: () => {
                    resetScreen();
                    router.back();       // back to admin menu  
                },
            }
        );

    };
    
    const onUpdate = () => {;
        if (!validateThoseTypes()) {
            return;
        };
        console.warn('Updating product . . . ');
        // going to update on database
        updateProduct(
            { id, name, price: parseFloat(price), image },
            {
                onSuccess: () => {
                    resetScreen();
                    router.back();       // back to admin menu  
                },
            }
        );
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
    
        if (!result.canceled) {
          setImage(result.assets[0].uri);
        }
      };

      const onDelete =() => {
        console.warn('Deleting product . . . ');
                deleteProduct(id, {
                    onSuccess:() =>{
                    resetScreen();
                    router.replace('/(admin)');      // back to admin menu  
                },
            });
      };

      const confirmDelete = () => {
        Alert.alert('Delete Product?', 'Are you sure to delete this one ?',[
            {
                text: 'No, keep it',
            },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: onDelete,
            },
        ]);
      };

  return (
    <View style={ styles.container}>

      <Stack.Screen options={{title: isUpdating ? 'Update' : 'Add the new one'}}/>

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

      <Text style = {{color: 'red'}}>{errors}</Text>
      <Button onPress={onSubmit} text={ isUpdating ? 'Update' : 'Add this one'}/>{
        isUpdating && (
            <Text onPress={confirmDelete} style = {styles.selectbutton}>
                Delete
            </Text>
        )
      }
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