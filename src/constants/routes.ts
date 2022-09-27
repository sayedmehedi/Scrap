export const AuthStackRoutes = {
  OTP: "otp",
  LOGIN: "login",
  REGISTRATION: "registration",
  RESET_PASSWORD: "resetPassword",
  FORGOT_PASSWORD: "forgotPassword",
} as const;

export const LocationStackRoutes = {
  LOCATION_PROMPT: "locationPrompt",
  CHOOSE_LOCATION: "chooseLocation",
} as const;

export const ChatStackRoutes = {
  AUTH: "auth",
  LOCATION: "location",

  CONVERSATION_LIST: "conversationList",
  SINGLE_CONVERSATION: "singleConversation",
} as const;

export const ProductActionsStackRoutes = {
  AUTH: "auth",
  LOCATION: "location",

  PLACE_BID: "placeBid",
  MAKE_OFFER: "makeOffer",
  REVIEW_OFFER: "reviewOffer",
  ASK_QUESTION: "askQuestion",
} as const;

export const RootStackRoutes = {
  HOME: "home",
  LOCATION_PROMPT: "locationPrompt",
  ADD_SHIPPING_ADDRESS: "addShippingAddress",
  SELLER_PUBLIC_PROFILE: "sellerPublicProfile",

  NOTIFICATIONS: "notifications",
  SEARCH_PRODUCT: "searchProduct",
  PRODUCT_FILTER: "productFilter",
  PRODUCT_ACTIONS: "productActions",
  PRODUCT_DETAILS: "productDetails",
  CONFIRM_PURCHASE: "confirmPurchase",
  SELLER_REVIEW: "sellerReviewScreen",
} as const;

export const PostItemStackRoutes = {
  AUTH: "auth",
  LOCATION: "location",

  SUCCESS: "success",
  ADD_PRICE: "addPrice",
  ADD_DETAILS: "addDetails",
  UPLOAD_PHOTO: "uploadPhoto",
  ADD_DELIVERY_METHOD: "addDeliveryMethod",
} as const;

export const SaleStackRoutes = {
  AUTH: "auth",
  LOCATION: "location",

  SALE_OR_ARCHIVE: "saleOrArchive",
} as const;

export const HomeTabRoutes = {
  HOME: "Home",
  CHAT: "chat",
  SALE: "sale",
  PROFILE: "profile",
  POST_ITEM: "postItem",
  EDIT_ITEM: "editItem",
} as const;

export const HomeStackRoutes = {
  HOME: "home",
  SHIPPING: "shipping",
  LOCAL_PICKUP: "localPickup",
  ALL_CATEGORIES: "allCategories",
  PRODUCT_LIST_BY_CRITERIA: "productListByCriteria",
} as const;

export const ProfileStackRoutes = {
  AUTH: "auth",
  LOCATION: "location",

  CONTACT: "contact",
  PURCHASES: "purchases",
  OFFER_N_BID: "offerAndBid",
  SAVE_PRODUCT: "saveProduct",
  PROFILE_SCREEN: "profileScreen",
  TRANSACTION: "transactionScreen",
  PUBLIC_PROFILE: "publicProfile",
  ACCOUNT_SETTING: "accountSetting",
} as const;
