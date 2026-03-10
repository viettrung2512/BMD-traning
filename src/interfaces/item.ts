export interface CartItem {
    id: number;
    name: string;
    finalPrice: number;
    quantity: number;
    imageUrl: string;
    product:{
        image: string;
    }
}