import { makeAutoObservable } from "mobx";
import { makePersistable } from "mobx-persist-store";

import type { CartItem } from "./cart.mobx";

export interface Order {
  paymentMethod: string;
  deliveryType: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  note: string;
  isFreeShip: boolean;
  status: string;
  detail: CartItem[];
  cityId: number | null;
  districtId: number | null;
  wardId: number | null;
  cityName?: string;
  districtName?: string;
  wardName?: string;
  total: number;
  couponCampaignId: number; 
  promotionCampaignIds: [];
  couponCode: string;
}

export interface ProgressStep {
  current: number;
}

class OrderStore {
  order: Order = {
    paymentMethod: "",
    deliveryType: "",
    receiverName: "",
    receiverPhone: "",
    receiverAddress: "",
    note: "",
    isFreeShip: false,
    status: "pending",
    detail: [],
    cityId: null,
    districtId: null,
    wardId: null,
    cityName: "",
    districtName: "",
    wardName: "",
    total: 0,
    couponCampaignId: 0,
    promotionCampaignIds: [],
    couponCode: "",
  };

  progressStep: ProgressStep = { current: 0 };

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: "OrderStore",
      properties: ["order", "progressStep"],
      storage: window.localStorage,
    });
  }
  setOrder(orderData: Partial<Order>) {
    this.order = { ...this.order, ...orderData };
  }
  setProgressStep(step: number) {
    this.progressStep.current = step;
  }

  resetOrder() {
    this.order = {
      paymentMethod: "",
      deliveryType: "",
      receiverName: "",
      receiverPhone: "",
      receiverAddress: "",
      note: "",
      isFreeShip: false,
      status: "pending",
      detail: [],
      cityId: null,
      districtId: null,
      wardId: null,
      cityName: "",
      districtName: "",
      wardName: "",
      total: 0,
      couponCampaignId: 0,
      promotionCampaignIds: [],
      couponCode: "",
    };
    this.progressStep.current = 0;
  }
}

export const orderStore = new OrderStore();
