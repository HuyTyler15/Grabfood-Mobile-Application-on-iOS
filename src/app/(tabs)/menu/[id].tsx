import { Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const  ProductDetailsScreen =() => { 
const {id} = useLocalSearchParams();

    return (
      <View>
        <Text style={{ fontSize: 20}}> ProductDetailsScreen for id: {id} </Text>
      </View>
    );
};

export default ProductDetailsScreen;
