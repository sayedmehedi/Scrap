import {store} from "@store/configureStore";
import rootReducer from "@store/reducers/rootReducer";
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import {
  HomeTabRoutes,
  AuthStackRoutes,
  HomeStackRoutes,
  RootStackRoutes,
  ProfileStackRoutes,
  PostItemStackRoutes,
} from "@constants/routes";
import {BottomTabScreenProps} from "@react-navigation/bottom-tabs";
import {NativeStackScreenProps} from "@react-navigation/native-stack";

export type HomeStackParamList = {
  [HomeStackRoutes.HOME]: undefined;
  [HomeStackRoutes.SHIPPING]: undefined;
  [HomeStackRoutes.LOCAL_PICKUP]: undefined;
  [HomeStackRoutes.ALL_CATEGORIES]: undefined;
  [HomeStackRoutes.INDIVIDUAL_CATEGORIES]: {
    categoryTitle: string;
    categoryId: string | number;
    location?: string;
    distance?: number;
    maxPrice?: number;
    minPrice?: number;
    condition?: Condition;
  };
};

export type HomeStackScreenProps<T extends keyof HomeStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<HomeStackParamList, T>,
    HomeTabScreenProps<keyof HomeTabParamList>
  >;

export type ProfileStackParamList = {
  [ProfileStackRoutes.PROFILE_SCREEN]: undefined;
  [ProfileStackRoutes.TRANSACTION]: undefined;
  [ProfileStackRoutes.OFFER_N_BID]: undefined;
  [ProfileStackRoutes.SAVE_PRODUCT]: undefined;
  [ProfileStackRoutes.PUBLIC_PROFILE]: undefined;
  [ProfileStackRoutes.ACCOUNT_SETTING]: undefined;
  [ProfileStackRoutes.PURCHASES]: undefined;
  [ProfileStackRoutes.ERROR]: undefined;
};
export type ChatStackParamList = {};
export type PostItemStackParamList = {
  [PostItemStackRoutes.SUCCESS]: undefined;
  [PostItemStackRoutes.ADD_PRICE]: undefined;
  [PostItemStackRoutes.ADD_DETAILS]: undefined;
  [PostItemStackRoutes.UPLOAD_PHOTO]: undefined;
  [PostItemStackRoutes.ADD_DELIVERY_METHOD]: undefined;
};

export type HomeTabParamList = {
  [HomeTabRoutes.SELLING]: undefined;
  [HomeTabRoutes.HOME]: NavigatorScreenParams<HomeStackParamList>;
  [HomeTabRoutes.CHAT]: NavigatorScreenParams<ChatStackParamList>;
  [HomeTabRoutes.PROFILE]: NavigatorScreenParams<ProfileStackParamList>;
  [HomeTabRoutes.POST_ITEM]: NavigatorScreenParams<PostItemStackParamList>;
};

export type HomeTabScreenProps<T extends keyof HomeTabParamList> =
  BottomTabScreenProps<HomeTabParamList, T>;

export type AuthStackParamList = {
  [AuthStackRoutes.LOGIN]: {
    nextScreen?: {
      name: string;
      params: Record<string, any>;
    };
  };
  [AuthStackRoutes.LOCATION]: undefined;
  [AuthStackRoutes.REGISTRATION]: undefined;
  [AuthStackRoutes.RESET_PASSWORD]: undefined;
  [AuthStackRoutes.CHOOSE_LOCATION]: undefined;
  [AuthStackRoutes.FORGOT_PASSWORD]: undefined;
};

export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<AuthStackParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type RootStackParamList = {
  [RootStackRoutes.AUTH]: NavigatorScreenParams<AuthStackParamList>;
  [RootStackRoutes.HOME]: NavigatorScreenParams<HomeTabParamList>;
  [RootStackRoutes.MAKE_OFFER]: {
    buyPrice: number;
    totalOffers: number;
    productName: string;
    shippingCost: number;
    productImage?: string;
    productId: string | number;
  };
  [RootStackRoutes.PLACE_BID]: {
    totalBids: number;
    productName: string;
    timeLeftToBid: string;
    productImage?: string;
    bidStartingPrice: number;
    productId: string | number;
  };
  [RootStackRoutes.REVIEW_OFFER]: {
    offerPrice: number;
    shippingCost: number;
    productId: string | number;
  };
  [RootStackRoutes.ASK_QUESTION]: undefined;
  [RootStackRoutes.NOTIFICATIONS]: undefined;
  [RootStackRoutes.SEARCH_PRODUCT]: undefined;
  [RootStackRoutes.PRODUCT_FILTER]: {
    categoryTitle?: string;
    categoryId?: string | number;
    location?: string;
    distance?: number;
    maxPrice?: number;
    minPrice?: number;
    condition?: Condition;
  };
  [RootStackRoutes.PRODUCT_DETAILS]: {
    productId: number | string;
  };
  [RootStackRoutes.SINGLE_CONVERSATION]: {
    conversationId: number;
  };
  [RootStackRoutes.CONFIRM_PURCHASE]: {
    productName: string;
    productImage: string;
    productId: string | number;
    productBuyNowPrice: number;
  };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type RtcStackParamList = {};

export type RtcStackScreenProps<T extends keyof RtcStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<RtcStackParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;

export type ServerNonFieldError = {
  status: "failed";
  message: string;
};

export type ResourceCreatedResponse = {
  code: 201;
  message: string;
};

export type ResourceUpdatedResponse = {
  code: 200;
  message: string;
};

export type ResourceDeletedResponse = {
  code: 200;
  message: string;
};

export type ServerValidationError = {
  message: string;
  error?: Record<string, string[]>;
  errors?: Record<string, string[]>;
};

export type ServerErrorType = ServerValidationError | ServerNonFieldError;

export type JoteyQueryError = {
  status: number | "FETCH_ERROR" | "PARSING_ERROR" | "CUSTOM_ERROR";
  data: {
    non_field_error: string;
    field_errors: Record<string, string>;
  };
};

export type PaginatedResponse<T> = {
  data: T[];
  total_rows: number;
  count: number;
  page_size: number;
  current_page: number;
  total_pages: number;
  last_page: number;
  next_page_url?: string;
  has_more_data: boolean;
};

export interface User {
  id: number;
  name: string;
  user_type: number;
  phone?: any;
  email: string;
  location?: any;
  latitude?: any;
  longitude?: any;
  status: number;
  profile_image: string;
  token: string;
}

export type LoginResponse = {
  success: string;
  user: User;
};

export type RegisterResponse = {
  success: string;
};

export interface HomeCategory {
  id: number;
  title: string;
  image: string;
  status: number;
  created_at: Date;
  updated_at: Date;
}

export type HomeCategoryResponse = {
  categories: HomeCategory[];
};

export interface FilterProduct {
  id: number;
  title: string;
  slug: string;
  image: string;
  location: string;
  price: string;
  is_locale: boolean;
  total_bids: number;
  is_favourite: boolean;
  total_offers: number;
}

export type FilterProductQueryParams = Partial<{
  is_locale: "1" | "0";
  is_shipping: "1" | "0";
  category_id: string | number;
  sub_category_id: string | number;
  user_id: string | number;
  title: string;
  location: string;
  condition_id: string | number;
  min_price: number;
  max_price: number;
  distance: number;
  sort_by: "random" | "oldest" | "low_price" | "high_price";
  paginate: number;
  page: number;
}>;

export type FilterProductsResponse = {
  products: PaginatedResponse<FilterProduct>;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export interface SubCategory {
  id: number;
  title: string;
}
export interface AllCategoryItem {
  id: number;
  title: string;
  sub_categories: SubCategory[];
}

export type AllCategoryResponse = {
  categories: AllCategoryItem[];
};

export interface MinimalCategory {
  id: number;
  title: string;
}

export interface Condition {
  id: number;
  title: string;
}

export interface Attribute {
  id: number;
  title: string;
  category: string;
}

export type FullTextSearchResponse = {
  categories: MinimalCategory[];
  conditions: Condition[];
  attributes: Attribute[];
  sub_categories: MinimalCategory[];
};

export interface Seller {
  id: number;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  join_date: string;
}

export interface BidOrOffer {
  id: number;
  price: string;
  is_winner: boolean;
}

export interface Metal {
  id: number;
  title: string;
}

export interface ProductDetails {
  id: number;
  distance: string;
  title: string;
  images: string[];
  is_locale: boolean;
  is_shipping: boolean;
  starting_price: string;
  buy_price: string;
  total_bids: number;
  total_offers: number;
  time_left: string;
  condition: string;
  category: string;
  sub_category: string;
  attributes: Record<string, string> | [];
  about: string;
  location: string;
  latitude: number;
  longitude: number;
  show_metal_price: boolean;
  metals: Metal[];
  quantity: number;
  related_products: PaginatedResponse<FilterProduct>;
  seller: Seller;
  has_bid: boolean;
  highest_bidder?: boolean;
  bid_out: boolean;
  highest_offerer?: boolean;
  has_offer: boolean;
  bid?: "" | BidOrOffer;
  offer?: "" | BidOrOffer;
  is_favourite: boolean;
  shipping_cost: string;
}

export interface PaginationQueryParams {
  page?: number;
  limit?: number;
}

export interface Condition {
  id: number;
  title: string;
}

export type ConditionResponse = {
  success: string;
  items: PaginatedResponse<Condition>;
};

export type CategoryListResponse = {
  success: string;
  items: PaginatedResponse<HomeCategory>;
};

export interface PaymentInfo {
  id: number;
  amount: number;
  product: number;
  trx_id: string;
  user: number;
}

export interface CreateCartRequest {
  product_id: number | string;
  offer_bid_id?: number;
}

export interface CreateCartResponse {
  success: string;
  payment_info: PaymentInfo;
}

export interface CartItem {
  id: number;
  product: number;
  quantity: number;
  sub_total: string;
}

export interface Calculations {
  sub_total: string;
  shipping_cost: string;
  discount: string;
  vat: string;
  total: string;
}

export interface GetCartsResponse {
  items: CartItem[];
  calculations: Calculations;
  success: string;
}

export interface Order {
  id: number;
  price: string;
  product_image: string;
  product_title: string;
  product_condition: string;
  product_category: string;
  product_sub_category: string;
  delivery_status: string;
}

export type GetPurchaseHistoryResponse = {
  success: string;
  orders: PaginatedResponse<Order>;
};

export interface ConfirmOrderRequest {
  postal_code: number;
  delivery_status: 0 | 1;
  payment_method: string;
  city_id: number | string;
  state_id: number | string;
  country_id: number | string;
}

export interface UserProfile {
  id: number;
  name: string;
  phone?: any;
  email: string;
  location?: any;
  latitude?: any;
  longitude?: any;
  status: number;
  profile_image: string;
  has_product: boolean;
  is_fb_connected: boolean;
  country: string;
  state: string;
  city: string;
  fb_details?: any;
  joined_date: string;
  total_purchased: number;
  is_email_verified: boolean;
  rating: number;
  reviews: number;
  total_sold: number;
}

export interface GetUserProfileReponse {
  success: string;
  user: UserProfile;
}

export interface OfferOrBid {
  id: number;
  price: string;
  status: number;
  user_name: string;
  user_image: string;
  type: "Bid" | "offer";
  product_id: string | number;
  product_title: string;
  product_price: string;
  product_image: string;
  product_location: string;
  product_category: string;
  product_condition: string;
  product_sub_category: string;
  time_left: string;
  is_bid_out: boolean;
  total_bids: number;
  total_offers: number;
}

export type GetOfferNBidsResponse = {
  items: PaginatedResponse<OfferOrBid>;
};

export type GetSavedProductsReponse = {
  success: string;
  items: PaginatedResponse<FilterProduct>;
};

export type GetSaleOrArchivedProductsReponse = {
  products: PaginatedResponse<FilterProduct>;
};

export interface Conversation {
  id: number;
  user_name: string;
  user_image: string;
  has_offer: boolean;
  has_msg: boolean;
  product: string;
  message: {
    title: string;
    created_at: string;
  };
}

export type GetConversationsResponse = {
  messages: PaginatedResponse<Conversation>;
};

export interface ConversationMessage {
  id: number;
  title: string;
  created_at: string;
  sender_name: string;
  sender_image: string;
  receiver_name: string;
  receiver_image: string;
}

export type GetConversationDetailsResponse = {
  messages: PaginatedResponse<ConversationMessage>;
};

export type SendMessageRequest = {
  receiver_id: number;
  message: string;
};

export interface AppNotification {
  date: Date;
  id: number;
  title: string;
  message: string;
}

export type GetNotificationsResponse = {
  notifications: PaginatedResponse<AppNotification>;
};

export interface Transaction {
  id: number;
  amount: string;
  payment_method: string;
  date: string;
}

export type GetTransactionsResponse = {
  transactions: PaginatedResponse<Transaction>;
};
