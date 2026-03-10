import { makeAutoObservable } from "mobx";
import { makePersistable } from "mobx-persist-store";

export interface User {
    id: number
    createdAt: number
    updatedAt: number
    isDeleted: boolean
    deletedAt: number
    code: string
    email: string
    balance: number
    totalBalance: number
    firstName: string
    lastName: string
    fullName: string
    avatar: string
    bio: string
    isAllowChangeDob: boolean
    fcmToken: string
    fcmTokenExpired: number
    dob: string
    isActive: boolean
    isVerified: boolean
    //   gender: any
    address: string
    phone: string
    notificationBadgeCount: number
    isBlocked: boolean
    facebookId: string
    googleId: string
    appleId: string
    zaloId: string
    zaloIdByOA: string
    source: string
    cycleBuy: number
    lastOrderAt: number
    numOfOrders: number
    isFollowZaloOA: boolean
    isFirstCouponRegister: boolean
    countRemind: number
    lastRemindAt: number
    totalOrderSignal: number
    //   city: any
    //   district: any
    //   ward: any
}


class UserStore {

    user: null | User = null;
    isLoggedIn: boolean = false;
    //biến state thành observable 
    constructor() {
        //-> dữ liệu thay đổi tự cập nhật UI
        makeAutoObservable(this);
        makePersistable(this,
            { name: 'UserStore', properties: ['user', 'isLoggedIn'], storage: window.localStorage }
        )
    }

    setUser(user: User) {
        this.user = user
        this.isLoggedIn = true;
    }

    clearUser() {
        this.user = null;
        this.isLoggedIn = false;;
    }
}

export const userStore = new UserStore();