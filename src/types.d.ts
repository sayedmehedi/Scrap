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
} from "@constants/routes";
import {BottomTabScreenProps} from "@react-navigation/bottom-tabs";
import {NativeStackScreenProps} from "@react-navigation/native-stack";

export type HomeStackParamList = {
  [HomeStackRoutes.HOME]: undefined;
  [HomeStackRoutes.SHIPPING]: undefined;
  [HomeStackRoutes.LOCAL_PICKUP]: undefined;
  [HomeStackRoutes.ALL_CATEGORIES]: undefined;
  [HomeStackRoutes.INDIVIDUAL_CATEGORIES]: {
    categoryId: string | number;
  };
};

export type HomeStackScreenProps<T extends keyof HomeStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<HomeStackParamList, T>,
    HomeTabScreenProps<keyof HomeTabParamList>
  >;

export type ProfileStackParamList = {};
export type ChatStackParamList = {};
export type PostItemStackParamList = {};

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
  [AuthStackRoutes.LOGIN]: undefined;
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
  [RootStackRoutes.PRODUCT_FILTER]: undefined;
  [RootStackRoutes.PRODUCT_DETAILS]: {
    productId: number | string;
  };
  [RootStackRoutes.SINGLE_CONVERSATION]: undefined;
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

export interface Category {
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
  categories: Category[];
  conditions: Condition[];
  attributes: Attribute[];
  sub_categories: Category[];
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
  is_favorite: boolean;
  shipping_cost: string;
}
