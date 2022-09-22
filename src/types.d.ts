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
import {Asset} from "react-native-image-picker";

export type HomeStackParamList = {
  [HomeStackRoutes.HOME]: undefined;
  [HomeStackRoutes.SHIPPING]: undefined;
  [HomeStackRoutes.LOCAL_PICKUP]: undefined;
  [HomeStackRoutes.ALL_CATEGORIES]: undefined;
  [HomeStackRoutes.PRODUCT_LIST_BY_CRITERIA]: {
    screenTitle?: string;
    categoryId?: number;
    subcategoryId?: number;
    location?: string;
    distance?: number;
    maxPrice?: number;
    minPrice?: number;
    isLocale?: boolean;
    isShipping?: boolean;
    condition?: Condition;
    hideFilterActions?: boolean;
    attributes?: Record<number, number>;
  };
};

export type HomeStackScreenProps<T extends keyof HomeStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<HomeStackParamList, T>,
    HomeTabScreenProps<keyof HomeTabParamList>
  >;

export type ProfileStackParamList = {
  [ProfileStackRoutes.CONTACT]: undefined;
  [ProfileStackRoutes.PURCHASES]: undefined;
  [ProfileStackRoutes.TRANSACTION]: undefined;
  [ProfileStackRoutes.OFFER_N_BID]: undefined;
  [ProfileStackRoutes.SAVE_PRODUCT]: undefined;
  [ProfileStackRoutes.PROFILE_SCREEN]: undefined;
  [ProfileStackRoutes.PUBLIC_PROFILE]: undefined;
  [ProfileStackRoutes.ACCOUNT_SETTING]: undefined;
};
export type ChatStackParamList = {};
export type PostItemStackParamList = {
  [PostItemStackRoutes.SUCCESS]: undefined;
  [PostItemStackRoutes.ADD_PRICE]: {
    categoryId: number;
    conditionId: number;
    description: string;
    subCategoryId: number;
    attributes: Record<number, string | number>;
    productTitle: string;
    productCoverImage: Asset;
    productGalleryImages: Asset[];
  };
  [PostItemStackRoutes.ADD_DETAILS]: {
    productTitle: string;
    productCoverImage: Asset;
    productGalleryImages: Asset[];
  };
  [PostItemStackRoutes.UPLOAD_PHOTO]: undefined;
  [PostItemStackRoutes.ADD_DELIVERY_METHOD]: {
    duration?: number;
    metals: number[];
    quantity: number;
    isListNow: boolean;
    categoryId: number;
    conditionId: number;
    description: string;
    productTitle: string;
    startingPrice?: number;
    buynowprice: number;
    subCategoryId: number;
    showMetalPrice: boolean;
    productCoverImage: Asset;
    expectedDateForList: string;
    productGalleryImages: Asset[];
    attributes: Record<number, string | number>;
  };
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
    backScreen?: {
      name: string;
      params: Record<string, any>;
    };
  };
  [AuthStackRoutes.REGISTRATION]: undefined;
  [AuthStackRoutes.RESET_PASSWORD]: {
    email: string;
  };
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
    productId: number;
  };
  [RootStackRoutes.PLACE_BID]: {
    totalBids: number;
    productName: string;
    timeLeftToBid: string;
    productImage?: string;
    bidStartingPrice: number;
    productId: number;
  };
  [RootStackRoutes.REVIEW_OFFER]: {
    offerPrice: number;
    shippingCost: number;
    productId: number;
  };
  [RootStackRoutes.ASK_QUESTION]: {
    sellerId: number | string;
    sellerName: string;
    sellerImage: string;

    productId: number | string;
    productImage: string;
    productName: string;
  };
  [RootStackRoutes.NOTIFICATIONS]: undefined;
  [RootStackRoutes.SEARCH_PRODUCT]: undefined;
  [RootStackRoutes.SELLER_REVIEW]: {
    sellerId: number;
  };
  [RootStackRoutes.PRODUCT_FILTER]: {
    categoryTitle?: string;
    categoryId?: number;
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
    userName: string;
    productId: number;
    userImage: string;
    productPrice: number;
    productImage: string;
  };
  [RootStackRoutes.CONFIRM_PURCHASE]: {
    productName: string;
    productImage: string;
    productId: number;
    productBuyNowPrice: number;
  };
  [RootStackRoutes.LOCATION_PROMPT]: {
    nextScreen?: {
      name: string;
      params: Record<string, any>;
    };
  };
  [RootStackRoutes.CHOOSE_LOCATION]: {
    nextScreen?: {
      name: string;
      params: Record<string, any>;
    };
  };
  [RootStackRoutes.ADD_SHIPPING_ADDRESS]: undefined;
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
  error: string;
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

export type SimplePaginatedResponse<T> = {
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

export type PaginatedResponse<T> = {
  data: T[];
  from: number;
  last_page: number;
  current_page: number;
  last_page_url: string;
  first_page_url: string;
  links: Array<{
    label: string;
    active: boolean;
    url: null | string;
  }>;
  to: number;
  path: string;
  total: number;
  per_page: number;
  next_page_url: null | string;
  prev_page_url: null | string;
};

export interface User {
  id: number;
  name: string;
  user_type: number;
  phone?: string;
  email: string;
  status: number;
  token: string;
  profile_image: string;
  location?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export type LoginResponse =
  | {
      success: string;
      user: User;
    }
  | {error: string};

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
  categories: SimplePaginatedResponse<HomeCategory>;
};

export interface FilterProduct {
  id: number;
  title: string;
  slug: string;
  images: {
    small: string;
    medium: string;
    large: string;
  };
  location: string;
  price: string;
  is_locale: boolean;
  is_shipping: boolean;
  total_bids: number;
  is_favourite: boolean;
  total_offers: number;
}

export type FilterProductQueryParams = Partial<{
  page: number;
  title: string;
  user_id: number;
  location: string;
  paginate: number;
  distance: number;
  max_price: number;
  min_price: number;
  category_id: number;
  attribute_id: number;
  condition_id: number;
  is_locale: "1" | "0";
  is_shipping: "1" | "0";
  sub_category_id: number;
  attributes: Record<number, number>;
  sort_by: "random" | "oldest" | "low_price" | "high_price";
}>;

export type FilterProductsResponse = {
  products: SimplePaginatedResponse<FilterProduct>;
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
  terms: {
    id: number;
    title: string;
  }[];
}

export type FullTextSearchResponse = {
  conditions: Condition[];
  attributes: Attribute[];
  categories: MinimalCategory[];
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
  images: {
    small: string[];
    medium: string[];
    large: string[];
  };
  is_locale: boolean;
  is_shipping: boolean;
  starting_price: string;
  buy_price: string;
  total_bids: number;
  total_offers: number;
  time_left: string;
  condition: string;
  category: string;
  about: string;
  location: string;
  latitude: number;
  seller: Seller;
  metals: Metal[];
  quantity: number;
  longitude: number;
  has_bid: boolean;
  bid_out: boolean;
  has_offer: boolean;
  sub_category: string;
  is_favourite: boolean;
  shipping_cost: string;
  bid?: "" | BidOrOffer;
  offer?: "" | BidOrOffer;
  highest_bidder?: boolean;
  show_metal_price: boolean;
  highest_offerer?: boolean;
  attributes: Record<string, string> | [];
  related_products: SimplePaginatedResponse<FilterProduct>;
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
  items: SimplePaginatedResponse<Condition>;
};

export type CategoryListResponse = {
  success: string;
  items: SimplePaginatedResponse<HomeCategory>;
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
  product_id: number;
  product_image: string;
  product_title: string;
  delivery_status: string;
  product_condition: string;
  product_category: string;
  product_sub_category: string;
}

export type GetPurchaseHistoryResponse = {
  success: string;
  orders: SimplePaginatedResponse<Order>;
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
  country: {
    id: number;
    name: string;
  };
  state: {
    id: number;
    name: string;
  };
  city: {
    id: number;
    name: string;
  };
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
  product_id: number;
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
  items: SimplePaginatedResponse<OfferOrBid>;
};

export type GetSavedProductsReponse = {
  success: string;
  items: SimplePaginatedResponse<FilterProduct>;
};

export type GetSaleOrArchivedProductsReponse = {
  products: SimplePaginatedResponse<FilterProduct>;
};

export interface Conversation {
  id: number;
  date: string;
  has_msg: boolean;
  user_name: string;
  user_image: string;
  product: {
    title: string;
    image: string;
    price: number;
    product_id: number;
  };
  message: {
    title: string;
    created_at: string;
  };
}

export type GetConversationsResponse = {
  messages: SimplePaginatedResponse<Conversation>;
};

export interface ConversationMessage {
  id: number;
  title: string;
  created_at: string;
  product_id: number;
  receiver_id: number;
  sender_name: string;
  sender_image: string;
  receiver_name: string;
  receiver_image: string;
}

export type GetConversationDetailsResponse = {
  messages: SimplePaginatedResponse<ConversationMessage>;
  user: {
    id: number;
    name: string;
    image: string;
    location?: string;
  };
  seller: {
    id: number;
    name: string;
    image: string;
    rating: number;
    reviews: number;
    location: string;
  };
  product: {
    id: number;
    title: string;
    price: number;
    image: string;
    package_id: number;
    package_name: string;
    package_price: number;
  };
};

export type SendMessageRequest = {
  message: string;
  product_id: number;
  receiver_id: number;
};

export interface AppNotification {
  date: Date;
  id: number;
  title: string;
  message: string;
  style: "success" | "danger";
}

export type GetNotificationsResponse = {
  notifications: SimplePaginatedResponse<AppNotification>;
};

export interface Transaction {
  id: number;
  amount: string;
  payment_method: string;
  date: string;
  product_name: string;
  product_id: number;
  status: number;
}

export type GetTransactionsResponse = {
  transactions: SimplePaginatedResponse<Transaction>;
};

export type UpdateProfileRequest = {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  latitude?: string;
  longitude?: string;
  image?: Asset;
  country_id?: string;
  state_id?: string;
  city_id?: string;
};

export interface SellerReview {
  id: number;
  rating: number;
  review: string;
  user_name: string;
  created_at: string;
  user_image: string;
}

export type GetSellerReviewsResponse = {
  reviews: SimplePaginatedResponse<SellerReview>;
};

export type CreateSellerReview = {
  seller_id: number;
  rating: number;
  review: string;
};

export interface Question {
  id: number;
  question: string;
  created_at: Date;
  updated_at: Date;
}

export type GetQuestionsResponse = {
  items: PaginatedResponse<Question>;
};

export interface Country {
  id: number;
  name: string;
  code: string;
  flag?: any;
  phonecode: string;
  created_at?: string;
  updated_at?: string;
}

export interface State {
  id: number;
  name: string;
  short_name?: string;
  country_id: number;
  created_at?: string;
  updated_at?: string;
}

export interface City {
  id: number;
  name: string;
  state_id: number;
  created_at?: string;
  updated_at?: string;
}

export type GetCountriesResponse = {
  countries: PaginatedResponse<Country>;
};

export type GetCitiesResponse = {
  cities: PaginatedResponse<City>;
};

export type GetStatesResponse = {
  states: PaginatedResponse<State>;
};

export type MetalCode =
  | "XAU"
  | "XAG"
  | "XPT"
  | "XCU"
  | "ALU"
  | "ZNC"
  | "TIN"
  | "IRON";

export type GetProductMetalsLivePriceResponse =
  | {
      success: true;
      fluctuation: boolean;
      start_date: string;
      end_date: string;
      base: string;
      rates: Record<
        MetalCode,
        {
          change: number;
          end_rate: number;
          start_rate: number;
          change_pct: number;
        }
      >;
      unit: string;
    }
  | {
      success: false;
      error: {
        code: number;
        type: string;
        info: string;
      };
    };

export type GetProductMetalsLivePriceRequest = {
  base: string;
  end_date: string;
  start_date: string;
  symbols: MetalCode[];
};

export type GetSubcategoriesByCatIdResponse = {
  sub_categories: Array<{
    id: number;
    title: string;
  }>;
};

export type GetSubcategoriesByCatIdRequest = {
  categoryId: number;
};

export type GetAttributesByCatIdResponse = {
  attributes: Array<{
    id: number;
    title: string;
    terms: Array<{
      id: number;
      attribute_id: number;
      title: string;
    }>;
  }>;
};

export type GetAttributesByCatIdRequest = {
  categoryId: number;
};

export type GetMetalsResponse = {
  items: SimplePaginatedResponse<
    Metal & {
      days: string;
    }
  >;
};

export interface Package {
  id: number;
  name: string;
  size: string;
  price: number;
  weight: number;
}

export type GetPackagesResponse = {
  items: SimplePaginatedResponse<Package>;
};

export type CreateProductRequest = {
  title: string;
  category_id: number;
  sub_category_id: number;
  condition_id: number;
  details: string;
  is_list_now: "1" | "0";
  expected_date_for_list: null | string;
  show_metal_price: "1" | "0";
  location: string;
  package_id: number;
  is_locale: "1" | "0";
  is_shipping: "1" | "0";
  latitude: number;
  longitude: number;
  selected_metals: number[];
  attributes: Record<number, number | string>;
  starting_price?: number;
  buy_price: number;
  duration?: number;
  quantity: number;
  images: Asset[];
};

export interface Duration {
  id: number;
  days: string;
}

export type GetDurationsResponse = {
  success: string;
  items: SimplePaginatedResponse<Duration>;
};

export type ChangePasswordRequest = {
  password: string;
  old_password: string;
  password_confirmation: string;
};

export type ResetPasswordRequest = {
  password: string;
  password_confirmation: string;
  email: string;
  otp: string;
};

export type ContactUsRequest = {
  name: string;
  email: string;
  subject: string;
  description: string;
};
