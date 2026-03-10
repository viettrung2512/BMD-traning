import api from "./api";

export interface Data {
  id: number
  createdAt: number
  updatedAt: number
  isDeleted: boolean
  deletedAt: number
  code: string
  no: number
  kvId: string
  kvName: string
  kvCode: string
  needNegotiate: boolean
  isVariantProduct: boolean
  syncId: string
  type: string
  deliveryType: string
  brandName: string
  name: string
  nameEn: string
  unitPrice: number
  finalPrice: number
  importPrice: number
  minPrice: number
  maxPrice: number
  length: number
  width: number
  height: number
  weight: number
  taxPercent: number
  image: string
  imageBackup: string
  pending: number
  description: string
  totalStar: number
  refPoint: number
  totalRate: number
  isHighlight: boolean
  isActive: boolean
  mode: string
  lifeCycleDay: number
  isPromotion: boolean
  productCategory: {
    name: string,
    id: number,
  }
}

const getDetail = async (id: number) => {
    const response = await api.get(`/v1/customer/product/${id}`);
    return response.data;
}

export { getDetail };
