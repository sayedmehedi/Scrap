export const AuthStackRoutes = {
  LOGIN: 'login',
  LOCATION: 'location',
  REGISTRATION: 'registration',
  RESET_PASSWORD: 'resetPassword',
  CHOOSE_LOCATION: 'chooseLocation',
  FORGOT_PASSWORD: 'forgotPassword',
} as const;

export const RootStackRoutes = {
  AUTH: 'auth',
  HOME: 'home',
  MAKE_BID: 'makeBid',
  PLACE_BID: 'placeBid',
  REVIEW_OFFER: 'reviewOffer',
  ASK_QUESTION: 'askQuestion',
  NOTIFICATIONS: 'notifications',
  SINGLE_CONVERSATION: 'message',
  SEARCH_PRODUCT: 'searchProduct',
  PRODUCT_FILTER: 'productFilter',
  PRODUCT_DETAILS: 'productDetails',
} as const;

export const PostItemStackRoutes = {
  SUCCESS: 'success',
  ADD_PRICE: 'addPrice',
  ADD_DETAILS: 'addDetails',
  UPLOAD_PHOTO: 'uploadPhoto',
  ADD_DELIVERY_METHOD: 'addDeliveryMethod',
};

export const HomeTabRoutes = {
  HOME: 'Home',
  CHAT: 'chat',
  POST_ITEM: 'postItem',
  SELLING: 'selling',
  PROFILE: 'profile',
} as const;

export const HomeStackRoutes = {
  HOME: 'home',
  SHIPPING: 'shipping',
  LOCAL_PICKUP: 'localPickup',
  INDIVIDUAL_CATEGORIES: 'individualCategories',
  ALL_CATEGORIES: 'allCategories',
} as const;
