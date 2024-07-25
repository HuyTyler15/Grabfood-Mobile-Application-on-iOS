import Button from "@/components/Button";
import { defaultPizzaImage } from "@/components/ProductListItem";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, Image, Alert } from "react-native";
import Colors from "@/constants/Colors";
import * as ImagePicker from "expo-image-picker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  useInsertProduct,
  useProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "@/api/product";

import * as FileSystem from "expo-file-system";
import { randomUUID } from "expo-crypto";
import { supabase } from "@/lib/supabase";
import { decode } from "base64-arraybuffer";

const CreateProductScreen = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [errors, setErrors] = useState("");

  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(
    typeof idString === "string"
      ? idString
      : Array.isArray(idString) && idString.length > 0
      ? idString[0]
      : ""
  );

  const isUpdating = !!idString;
  // huy:double exclamation marks !! to make id become the Boolean Type here
  // because id is not a Boolean Type here

  const { mutate: insertProduct } = useInsertProduct();
  const { mutate: updateProduct } = useUpdateProduct();
  const { data: updatingProduct } = useProduct(id);
  const { mutate: deleteProduct } = useDeleteProduct();

  console.log(updatingProduct);

  const router = useRouter();

  useEffect(() => {
    if (updatingProduct) {
      setName(updatingProduct.name);
      setPrice(updatingProduct.price.toString());
      setImage(updatingProduct.image);
    }
  }, [updatingProduct]);

  const resetScreen = () => {
    setName("");
    setPrice("");
  };

  const validateThoseTypes = () => {
    setErrors("");
    if (!name) {
      setErrors("Gotta have name for it");
      return false;
    }
    if (!price) {
      setErrors("You forgot the price ");
      return false;
    }
    if (isNaN(parseFloat(price))) {
      setErrors("Not a number");
      return false;
    }
    return true;
  };

  const onSubmit = () => {
    if (isUpdating) {
      onUpdate();
      // update
    } else {
      onCreate();
    }
  };

  // Save to Database supabase
  const onCreate = async () => {
    if (!validateThoseTypes()) {
      return;
    }
    console.warn("Adding the new product ", name);

    const imagePath = await uploadImage();

    insertProduct(
      { id, name, price: parseFloat(price), image: imagePath },
      {
        onSuccess: () => {
          resetScreen();
          router.back(); // back to admin menu
        },
      }
    );
  };

  const onUpdate = async () => {
    if (!validateThoseTypes()) {
      return;
    }
    console.warn("Updating product . . . ");
    // going to update on database

    const imagePath = await uploadImage();
    updateProduct(
      { id, name, price: parseFloat(price), image: imagePath },
      {
        onSuccess: () => {
          resetScreen();
          router.back(); // back to admin menu
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

  const onDelete = () => {
    console.warn("Deleting product . . . ");
    deleteProduct(id, {
      onSuccess: () => {
        resetScreen();
        router.replace("/(admin)"); // back to admin menu
      },
    });
  };

  const confirmDelete = () => {
    Alert.alert("Delete Product?", "Are you sure to delete this one ?", [
      {
        text: "No, keep it",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: onDelete,
      },
    ]);
  };

  const uploadImage = async () => {
    if (!image?.startsWith("file://")) {
      return;
    }

    const base64 = await FileSystem.readAsStringAsync(image, {
      encoding: "base64",
    });
    const filePath = `${randomUUID()}.png`;
    const contentType = "image/png";
    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(filePath, decode(base64), { contentType });

    if (data) {
      return data.path;
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{ title: isUpdating ? "Update" : "Add the new one" }}
      />

      <Image
        source={{ uri: image || defaultPizzaImage }}
        style={styles.image}
      />
      <Text onPress={pickImage} style={styles.selectbutton}>
        Choose from library{" "}
      </Text>

      <Text style={styles.label}>Name: </Text>
      <TextInput
        onChangeText={setName}
        value={name}
        placeholder="Name of your product"
        style={styles.input}
      />

      <Text style={styles.label}>Price ($) </Text>
      <TextInput
        value={price}
        onChangeText={setPrice}
        placeholder="00.0"
        style={styles.input}
        keyboardType="numeric"
      />

      <Text style={{ color: "red" }}>{errors}</Text>
      <Button
        onPress={onSubmit}
        text={isUpdating ? "Update" : "Add this one"}
      />
      {isUpdating && (
        <Text onPress={confirmDelete} style={styles.selectbutton}>
          Delete
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
  },
  input: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 20,
  },
  label: {
    color: "gray",
    fontSize: 16,
  },
  image: {
    width: "50%",
    aspectRatio: 1,
    alignSelf: "center",
  },
  selectbutton: {
    alignSelf: "center",
    fontWeight: "bold",
    color: Colors.light.tint,
    marginVertical: 10,
  },
});

export default CreateProductScreen;
