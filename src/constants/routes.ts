export const AuthStackRoutes = {
  LOGIN: "login",
  REGISTRATION: "registration",
  RESET_PASSWORD: "resetPassword",
  FORGOT_PASSWORD: "forgotPassword",
} as const;

export const RootStackRoutes = {
  AUTH: "auth",
  HOME: "home",
  PLACE_BID: "placeBid",
  MAKE_OFFER: "makeOffer",
  LOCATION_PROMPT: "locationPrompt",
  ADD_SHIPPING_ADDRESS: "addShippingAddress",

  REVIEW_OFFER: "reviewOffer",
  ASK_QUESTION: "askQuestion",
  NOTIFICATIONS: "notifications",
  SINGLE_CONVERSATION: "message",
  SEARCH_PRODUCT: "searchProduct",
  PRODUCT_FILTER: "productFilter",
  PRODUCT_DETAILS: "productDetails",
  CONFIRM_PURCHASE: "confirmPurchase",
  SELLER_REVIEW: "sellerReviewScreen",

  CHOOSE_LOCATION: "chooseLocation",
  CHOOSE_STATE: "chooseState",
  CHOOSE_COUNTRY: "chooseCountry",
} as const;

export const PostItemStackRoutes = {
  SUCCESS: "success",
  ADD_PRICE: "addPrice",
  ADD_DETAILS: "addDetails",
  UPLOAD_PHOTO: "uploadPhoto",
  ADD_DELIVERY_METHOD: "addDeliveryMethod",
} as const;

export const HomeTabRoutes = {
  HOME: "Home",
  CHAT: "chat",
  SELLING: "selling",
  PROFILE: "profile",
  POST_ITEM: "postItem",
} as const;

export const HomeStackRoutes = {
  HOME: "home",
  SHIPPING: "shipping",
  LOCAL_PICKUP: "localPickup",
  ALL_CATEGORIES: "allCategories",
  PRODUCT_LIST_BY_CRITERIA: "productListByCriteria",
} as const;

export const ProfileStackRoutes = {
  PROFILE_SCREEN: "profileScreen",
  TRANSACTION: "transactionScreen",
  OFFER_N_BID: "offerAndBid",
  SAVE_PRODUCT: "saveProduct",
  PUBLIC_PROFILE: "publicProfile",
  ACCOUNT_SETTING: "accountSetting",
  PURCHASES: "purchases",
  CONTACT: "contact",
} as const;
