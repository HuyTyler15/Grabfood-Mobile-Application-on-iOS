import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { InsertTables } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useInsertOrderItems = () => {
    const queryClient = useQueryClient();
    const {session} = useAuth();
    const userId = session?.user.id;
  
    return useMutation({
      async mutationFn(items: InsertTables<'order_items'>){
        const {error, data: newProduct } =await supabase
        .from('order_items')
        .insert(items)
        .select()
        .single();
  
        if (error) {
          throw new Error(error.message);
        }
        return newProduct;
      },
      async onSuccess() {
        await queryClient.invalidateQueries({ queryKey: ['products']});
      },
    });
  };
  