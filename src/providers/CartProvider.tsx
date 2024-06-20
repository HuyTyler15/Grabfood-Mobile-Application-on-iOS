import { CartItem, Product } from "@/types";
import { PropsWithChildren, createContext,useContext, useState  } from "react";
import { randomUUID } from "expo-crypto"; 

type CartType = {
    items: CartItem[],
    addItem: (product: Product, size: CartItem['size']) => void; 
    updateQuantity: (itemId: string, amount: -1 | 1) => void;
}
const CartContext = createContext<CartType>({
    items: [],
    addItem: () => {},
    updateQuantity: () => {},
});

const CartProvider = ({ children }: PropsWithChildren) =>{ 
    const [items, setItems] = useState<CartItem[]>([]);

    const addItem = (product: Product, size: CartItem['size'])=>{

        const existingItem = items.find(item => item.product == product && item.size == size );

        // if the shopping cart got the product already(same name.size), it will be plus 1 more. that's why Huy use the updateQuantity.

        if (existingItem){
            updateQuantity(existingItem.id,1 );
            return;
        }
        // the same => return, no need to add more

        const newCartItem: CartItem ={
            id: randomUUID(), //generate
            product,
            product_id: product.id,
            size,
            quantity: 1,
            };    
            setItems([newCartItem, ...items]);
    };
    // update the quantity by Huy
    const updateQuantity = (itemId: string, amount: -1 | 1) => {
        const updateItems = items.map((item) => 
            item.id !== itemId ? 
            item : 
            { ...item, quantity: item.quantity + amount}
        ).filter((item) => item.quantity > 0);

        // filter((item) => item.quantity > 0); Huy said remove it if the quantity is zero on the cart.

        
    setItems(updateItems);   
    };
    

     return(
        <CartContext.Provider value = {{ items , addItem , updateQuantity  }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartProvider;

export const useCart = () => useContext(CartContext);