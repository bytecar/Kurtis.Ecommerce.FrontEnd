export const API_ROUTES = {
    user: process.env.USERS_API_URL,
    auth: process.env.USERS_API_URL,

    inventory:process.env.INVENTORY_API_URL,
    order:process.env.INVENTORY_API_URL,
    wishlist:  process.env.INVENTORY_API_URL,
    review:  process.env.INVENTORY_API_URL,
    returns:  process.env.INVENTORY_API_URL,
    
    brand:  process.env.CATALOG_API_URL,
    category:  process.env.CATALOG_API_URL,
    collection:  process.env.CATALOG_API_URL,
    product:  process.env.CATALOG_API_URL,
    recentlyViewed:  process.env.CATALOG_API_URL,
    preferences:  process.env.CATALOG_API_URL,
    metadata: process.env.CATALOG_API_URL,
};