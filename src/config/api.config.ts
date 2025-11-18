import { environment } from "../environment/environment";

export const API_ROUTES = {
    users: environment.USERS_API_URL,
    auth: environment.USERS_API_URL,

    inventories: environment.INVENTORY_API_URL,
    orders: environment.INVENTORY_API_URL,
    wishlist:  environment.INVENTORY_API_URL,
    reviews:  environment.INVENTORY_API_URL,
    returns:  environment.INVENTORY_API_URL,
    
    brands:  environment.CATALOG_API_URL,
    categories:  environment.CATALOG_API_URL,
    collections:  environment.CATALOG_API_URL,
    products:  environment.CATALOG_API_URL,
    recentlyViewed:  environment.CATALOG_API_URL,
    preferences:  environment.CATALOG_API_URL,
    metadata: environment.CATALOG_API_URL,
};