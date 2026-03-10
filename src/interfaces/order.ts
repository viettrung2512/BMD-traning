import type { CartItem } from "./item";


export interface Order {
    
    code: string;
    id: number;
    paymentMethod: string;
    deliveryType: string;
    receiverName: string;
    receiverPhone: string;
    receiverAddress: string;
    note: string;
    isFreeShip: boolean;
    status: string;
    details: CartItem[];
    cityId: number | null; 
    districtId: number | null;
    wardId: number | null;
    moneyFinal: number; 
    moneyDiscountCoupon: number;
    estimatedDeliveryAt?: string; 
    receiverCity: {
        name: string;
    };
    receiverDistrict: {
        name: string;
    };
    receiverWard: {
        name: string;
    };
    cancelBy?: string
}