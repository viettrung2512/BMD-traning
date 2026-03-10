import api from "./api";
import type { Order } from "../store/order.mobx";
import type { CartItem } from "../store/cart.mobx";


const estimateOrder = async ({ orderDetails, cart, couponCampaignId }: { orderDetails: Order, cart: CartItem[], couponCampaignId?: number }) => {

    const detail = cart.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        name: item.name,
    }));

    console.log("Detail for estimation:", detail);

    try {
        const response = await api.post("/v1/customer/order/estimate", {
            order: {
                paymentMethod: orderDetails.paymentMethod || "cod",
                receiverName: orderDetails.receiverName || "base",
                receiverPhone: orderDetails.receiverPhone || "0000000000",
                receiverAddress: orderDetails.receiverAddress || "base",
                isFreeShip: orderDetails.isFreeShip || false,
                note: orderDetails.note || "",
            },
            details: detail,
            cityId: orderDetails.cityId || null,
            districtId: orderDetails.districtId || null,
            wardId: orderDetails.wardId || null,
            storeId: 50,
            couponCampaignId: couponCampaignId || null,
            promotionCampaignIds: [],
        });
        return response.data;
    } catch (error) {
        console.error("Error estimating order:", error);
        throw error;
    }
}

export { estimateOrder };