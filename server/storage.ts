import express from "express";
import session from "express-session";
import createMemoryStore from "memorystore";
import { 
  User, InsertUser, 
  Product, InsertProduct, 
  Inventory, InsertInventory, 
  Review, InsertReview, 
  Order, InsertOrder, 
  OrderItem, InsertOrderItem, 
  Wishlist, InsertWishlist, 
  Return, InsertReturn, 
  RecentlyViewed, InsertRecentlyViewed 
} from "@shared/schema";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
  updateUserPassword(id: number, password: string): Promise<boolean>;
  
  // Product management
  getAllProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, productData: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Inventory management
  getInventoryByProduct(productId: number): Promise<Inventory[]>;
  createInventory(inventory: InsertInventory): Promise<Inventory>;
  updateInventory(id: number, inventoryData: Partial<Inventory>): Promise<Inventory | undefined>;
  
  // Review management
  getAllReviews(): Promise<Review[]>;
  getReviewsByProduct(productId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  deleteReview(id: number): Promise<boolean>;
  
  // Order management
  getAllOrders(): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  getOrdersByUser(userId: number): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  
  // Order items
  getOrderItemsByOrder(orderId: number): Promise<OrderItem[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  
  // Wishlist management
  getWishlistByUser(userId: number): Promise<Product[]>;
  addToWishlist(wishlist: InsertWishlist): Promise<Wishlist>;
  removeFromWishlist(userId: number, productId: number): Promise<boolean>;
  
  // Recently viewed
  getRecentlyViewedByUser(userId: number): Promise<Product[]>;
  addToRecentlyViewed(recentlyViewed: InsertRecentlyViewed): Promise<RecentlyViewed>;
  
  // Return management
  getAllReturns(): Promise<Return[]>;
  getReturnsByUser(userId: number): Promise<Return[]>;
  createReturn(returnData: InsertReturn): Promise<Return>;
  updateReturnStatus(id: number, status: string): Promise<Return | undefined>;
  
  // User preferences
  getUserPreferences(userId: number): Promise<UserPreferences | undefined>;
  createUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences>;
  updateUserPreferences(userId: number, preferencesData: Partial<UserPreferences>): Promise<UserPreferences | undefined>;
  
  // Session store
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private inventory: Map<number, Inventory>;
  private reviews: Map<number, Review>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private wishlists: Map<number, Wishlist>;
  private recentlyViewed: Map<number, RecentlyViewed>;
  private returns: Map<number, Return>;
  private userPreferences: Map<number, UserPreferences>;
  
  sessionStore: session.Store;
  
  // IDs for auto-increment
  currentUserId: number;
  currentProductId: number;
  currentInventoryId: number;
  currentReviewId: number;
  currentOrderId: number;
  currentOrderItemId: number;
  currentWishlistId: number;
  currentRecentlyViewedId: number;
  currentReturnId: number;
  currentUserPreferencesId: number;
  
  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.inventory = new Map();
    this.reviews = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.wishlists = new Map();
    this.recentlyViewed = new Map();
    this.returns = new Map();
    this.userPreferences = new Map();
    
    this.currentUserId = 1;
    this.currentProductId = 1;
    this.currentInventoryId = 1;
    this.currentReviewId = 1;
    this.currentOrderId = 1;
    this.currentOrderItemId = 1;
    this.currentWishlistId = 1;
    this.currentRecentlyViewedId = 1;
    this.currentReturnId = 1;
    this.currentUserPreferencesId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
    
    // Initialize with users, products, and preferences
    this.initializeUsers();
    this.initializeProducts();
    this.initializeUserPreferences();
  }
  
  // User management methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id,
      role: insertUser.role || "user",
      createdAt: now,
      updatedAt: now
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { 
      ...user, 
      ...userData,
      updatedAt: new Date()
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async updateUserPassword(id: number, password: string): Promise<boolean> {
    const user = this.users.get(id);
    if (!user) return false;
    
    user.password = password;
    user.updatedAt = new Date();
    this.users.set(id, user);
    return true;
  }
  
  // Product management methods
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }
  
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const now = new Date();
    const newProduct: Product = {
      ...product,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.products.set(id, newProduct);
    return newProduct;
  }
  
  async updateProduct(id: number, productData: Partial<Product>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct = {
      ...product,
      ...productData,
      updatedAt: new Date()
    };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }
  
  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }
  
  // Inventory management methods
  async getInventoryByProduct(productId: number): Promise<Inventory[]> {
    return Array.from(this.inventory.values()).filter(
      (inv) => inv.productId === productId
    );
  }
  
  async createInventory(inventory: InsertInventory): Promise<Inventory> {
    const id = this.currentInventoryId++;
    const now = new Date();
    const newInventory: Inventory = {
      ...inventory,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.inventory.set(id, newInventory);
    return newInventory;
  }
  
  async updateInventory(id: number, inventoryData: Partial<Inventory>): Promise<Inventory | undefined> {
    const inventory = this.inventory.get(id);
    if (!inventory) return undefined;
    
    const updatedInventory = {
      ...inventory,
      ...inventoryData,
      updatedAt: new Date()
    };
    this.inventory.set(id, updatedInventory);
    return updatedInventory;
  }
  
  // Review management methods
  async getAllReviews(): Promise<Review[]> {
    return Array.from(this.reviews.values());
  }
  
  async getReviewsByProduct(productId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      (review) => review.productId === productId
    );
  }
  
  async createReview(review: InsertReview): Promise<Review> {
    const id = this.currentReviewId++;
    const now = new Date();
    const newReview: Review = {
      ...review,
      id,
      createdAt: now
    };
    this.reviews.set(id, newReview);
    return newReview;
  }
  
  async deleteReview(id: number): Promise<boolean> {
    return this.reviews.delete(id);
  }
  
  // Order management methods
  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }
  
  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }
  
  async getOrdersByUser(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.userId === userId
    );
  }
  
  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const now = new Date();
    const newOrder: Order = {
      ...order,
      id,
      status: order.status || "pending",
      createdAt: now,
      updatedAt: now
    };
    this.orders.set(id, newOrder);
    return newOrder;
  }
  
  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = {
      ...order,
      status,
      updatedAt: new Date()
    };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }
  
  // Order items methods
  async getOrderItemsByOrder(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(
      (item) => item.orderId === orderId
    );
  }
  
  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const id = this.currentOrderItemId++;
    const newOrderItem: OrderItem = {
      ...orderItem,
      id
    };
    this.orderItems.set(id, newOrderItem);
    return newOrderItem;
  }
  
  // Wishlist methods
  async getWishlistByUser(userId: number): Promise<Product[]> {
    console.log("Getting wishlist for user", userId);
    console.log("All wishlists:", Array.from(this.wishlists.values()));
    
    const wishlistItems = Array.from(this.wishlists.values()).filter(
      (item) => item.userId === userId
    );
    
    console.log("Filtered wishlist items:", wishlistItems);
    
    // Get product details for each wishlist item
    const products: Product[] = [];
    for (const item of wishlistItems) {
      console.log("Getting product for wishlist item:", item);
      const product = this.products.get(item.productId);
      console.log("Product found:", product);
      if (product) {
        products.push(product);
      }
    }
    return products;
  }
  
  async addToWishlist(wishlist: InsertWishlist): Promise<Wishlist> {
    // Check if item already exists
    const existing = Array.from(this.wishlists.values()).find(
      (item) => item.userId === wishlist.userId && item.productId === wishlist.productId
    );
    
    if (existing) {
      return existing;
    }
    
    const id = this.currentWishlistId++;
    const now = new Date();
    const newWishlist: Wishlist = {
      ...wishlist,
      id,
      addedAt: now
    };
    this.wishlists.set(id, newWishlist);
    return newWishlist;
  }
  
  // Alias for addToWishlist to match route usage
  async createWishlist(wishlist: InsertWishlist): Promise<Wishlist> {
    return this.addToWishlist(wishlist);
  }
  
  async removeFromWishlist(userId: number, productId: number): Promise<boolean> {
    const wishlistItem = Array.from(this.wishlists.values()).find(
      (item) => item.userId === userId && item.productId === productId
    );
    
    if (!wishlistItem) return false;
    return this.wishlists.delete(wishlistItem.id);
  }
  
  // Alias for removeFromWishlist to match route usage
  async deleteWishlistItem(userId: number, productId: number): Promise<boolean> {
    return this.removeFromWishlist(userId, productId);
  }
  
  // Recently viewed methods
  async getRecentlyViewedByUser(userId: number): Promise<Product[]> {
    const recentItems = Array.from(this.recentlyViewed.values())
      .filter((item) => item.userId === userId)
      .sort((a, b) => b.viewedAt.getTime() - a.viewedAt.getTime())
      .slice(0, 10); // Limit to 10 items
    
    // Get product details for each item
    const products: Product[] = [];
    for (const item of recentItems) {
      const product = this.products.get(item.productId);
      if (product) {
        products.push(product);
      }
    }
    return products;
  }
  
  async addToRecentlyViewed(recentlyViewed: InsertRecentlyViewed): Promise<RecentlyViewed> {
    // Remove existing entry for the same product and user
    const existing = Array.from(this.recentlyViewed.values()).find(
      (item) => item.userId === recentlyViewed.userId && item.productId === recentlyViewed.productId
    );
    
    if (existing) {
      this.recentlyViewed.delete(existing.id);
    }
    
    const id = this.currentRecentlyViewedId++;
    const now = new Date();
    const newRecentlyViewed: RecentlyViewed = {
      ...recentlyViewed,
      id,
      viewedAt: now
    };
    this.recentlyViewed.set(id, newRecentlyViewed);
    return newRecentlyViewed;
  }
  
  // Alias for addToRecentlyViewed to match route usage
  async createRecentlyViewed(recentlyViewed: InsertRecentlyViewed): Promise<RecentlyViewed> {
    return this.addToRecentlyViewed(recentlyViewed);
  }
  
  // Return management methods
  async getAllReturns(): Promise<Return[]> {
    return Array.from(this.returns.values());
  }
  
  async getReturnsByUser(userId: number): Promise<Return[]> {
    return Array.from(this.returns.values()).filter(
      (returnItem) => returnItem.userId === userId
    );
  }
  
  async createReturn(returnData: InsertReturn): Promise<Return> {
    const id = this.currentReturnId++;
    const now = new Date();
    const newReturn: Return = {
      ...returnData,
      id,
      status: returnData.status || "pending",
      createdAt: now,
      updatedAt: now
    };
    this.returns.set(id, newReturn);
    return newReturn;
  }
  
  async updateReturnStatus(id: number, status: string): Promise<Return | undefined> {
    const returnItem = this.returns.get(id);
    if (!returnItem) return undefined;
    
    const updatedReturn = {
      ...returnItem,
      status,
      updatedAt: new Date()
    };
    this.returns.set(id, updatedReturn);
    return updatedReturn;
  }
  
  // User preferences methods
  async getUserPreferences(userId: number): Promise<UserPreferences | undefined> {
    return Array.from(this.userPreferences.values()).find(
      (pref) => pref.userId === userId
    );
  }
  
  async createUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences> {
    // Remove existing preferences for the user if they exist
    const existing = await this.getUserPreferences(preferences.userId);
    if (existing) {
      this.userPreferences.delete(existing.id);
    }
    
    const id = this.currentUserPreferencesId++;
    const now = new Date();
    const newPreferences: UserPreferences = {
      ...preferences,
      id,
      updatedAt: now
    };
    this.userPreferences.set(id, newPreferences);
    return newPreferences;
  }
  
  async updateUserPreferences(userId: number, preferencesData: Partial<UserPreferences>): Promise<UserPreferences | undefined> {
    const existing = await this.getUserPreferences(userId);
    if (!existing) return undefined;
    
    const updatedPreferences = {
      ...existing,
      ...preferencesData,
      updatedAt: new Date()
    };
    this.userPreferences.set(existing.id, updatedPreferences);
    return updatedPreferences;
  }
  
  // Initialize with 15 users with random profiles
  private initializeUsers() {
    const roles = ['admin', 'user', 'content_manager'];
    const fullNames = [
      'Aditya Sharma', 'Priya Patel', 'Rahul Singh', 'Neha Gupta', 'Vikram Mehta',
      'Anjali Desai', 'Rajesh Kumar', 'Meera Joshi', 'Sanjay Verma', 'Divya Kapoor',
      'Arjun Malhotra', 'Pooja Reddy', 'Kiran Rao', 'Shweta Bansal', 'Deepak Nair'
    ];
    
    // Generate 15 users with random roles
    for (let i = 0; i < 15; i++) {
      const username = `user${i + 1}`;
      const email = `user${i + 1}@example.com`;
      const fullName = fullNames[i];
      const role = roles[i % 3]; // Distribute roles evenly
      
      // Simple password hash for demonstration (not secure for production)
      const password = `d6531055b2ded682b68092a73ed224053e4150c2a8b12a0b5348a408f6ac0d8138e4a9af6096ad85deb1919a1b3e7d0d6e9131c6d1b022bca815079b2bcce539.fae8c366301e57c4b2e9ffe22587818c`;
      
      const insertUser: InsertUser = {
        username,
        email,
        password,
        fullName,
        role
      };
      
      const id = this.currentUserId++;
      const now = new Date();
      const user: User = { 
        ...insertUser, 
        id,
        createdAt: now,
        updatedAt: now
      };
      this.users.set(id, user);
    }
  }

  // Initialize with 100 ethnic clothing products organized by genres
  private initializeUserPreferences() {
    // Create preferences for a few sample users
    const colors = [
      'Red', 'Blue', 'Green', 'Yellow', 'Black', 'White', 'Pink', 'Purple', 
      'Orange', 'Brown', 'Gold', 'Silver', 'Maroon', 'Navy', 'Beige', 'Turquoise'
    ];
    
    const occasions = [
      'Casual', 'Festive', 'Wedding', 'Party', 'Office', 'Evening', 'Bridal', 
      'Traditional', 'Diwali', 'Holi'
    ];
    
    // Add preferences for 5 users (more can be added via the API)
    for (let userId = 1; userId <= 5; userId++) {
      // Randomize favorite categories
      const allCategories = [
        'sarees', 'kurtis', 'lehengas', 'salwar_kameez', 'anarkali_suits', 'palazzo_suits', 
        'kurtas', 'sherwanis', 'nehru_jackets', 'dhoti_sets', 'indo_western'
      ];
      
      // Select 3-5 random categories
      const numCategories = Math.floor(Math.random() * 3) + 3;
      const shuffledCategories = [...allCategories].sort(() => 0.5 - Math.random());
      const favoriteCategories = shuffledCategories.slice(0, numCategories);
      
      // Select 3-5 random colors
      const numColors = Math.floor(Math.random() * 3) + 3;
      const shuffledColors = [...colors].sort(() => 0.5 - Math.random());
      const favoriteColors = shuffledColors.slice(0, numColors);
      
      // Select 2-4 random occasions
      const numOccasions = Math.floor(Math.random() * 3) + 2;
      const shuffledOccasions = [...occasions].sort(() => 0.5 - Math.random());
      const favoriteOccasions = shuffledOccasions.slice(0, numOccasions);
      
      // Random price range
      const priceRangeMin = Math.floor(Math.random() * 1000) + 500;
      const priceRangeMax = priceRangeMin + Math.floor(Math.random() * 4000) + 2000;
      
      // Create preference object
      const preferences: InsertUserPreferences = {
        userId,
        favoriteCategories,
        favoriteColors,
        favoriteOccasions,
        priceRangeMin,
        priceRangeMax
      };
      
      const id = this.currentUserPreferencesId++;
      const now = new Date();
      
      const userPreference: UserPreferences = {
        ...preferences,
        id,
        updatedAt: now
      };
      
      this.userPreferences.set(id, userPreference);
    }
  }
  
  private initializeProducts() {
    const categories = [
      // Women's ethnic wear
      'sarees', 'kurtis', 'lehengas', 'salwar_kameez', 'anarkali_suits', 'palazzo_suits', 
      'gowns', 'dupattas', 'blouses', 'skirts', 'dresses',
      // Men's ethnic wear
      'kurtas', 'sherwanis', 'nehru_jackets', 'dhoti_sets', 'indo_western',
      // Accessories
      'jewelry', 'footwear', 'bags', 'scarves'
    ];
    
    const brands = [
      'Fabindia', 'Biba', 'W', 'Global Desi', 'Anokhi', 'Aurelia', 'Manyavar', 
      'Ritu Kumar', 'Soch', 'Khaadi', 'Jaypore', 'House of Masaba', 'Sabyasachi',
      'Tarun Tahiliani', 'Anita Dongre', 'Raymond', 'Rangriti', 'Ethnic Basket',
      'Libas', 'Neerus', 'Meena Bazaar', 'Chhabra 555', 'Tikhi Imli', 'Sangria'
    ];
    
    const fabrics = [
      'Cotton', 'Silk', 'Linen', 'Chiffon', 'Georgette', 'Chanderi', 'Banarasi', 
      'Khadi', 'Rayon', 'Crepe', 'Organza', 'Velvet', 'Brocade', 'Kota', 'Tussar',
      'Patola', 'Pashmina', 'Kanjeevaram', 'Maheshwari', 'Ikat', 'Pochampally', 'Bandhani'
    ];
    
    const occasions = [
      'Casual', 'Festive', 'Wedding', 'Party', 'Office', 'Evening', 'Bridal', 
      'Reception', 'Engagement', 'Cocktail', 'Traditional', 'Mehendi', 'Diwali',
      'Holi', 'Pongal', 'Onam', 'Navratri', 'Durga Puja', 'Eid'
    ];
    
    const genders = ['women', 'men'];
    
    const imageUrls = [
      'https://images.unsplash.com/photo-1610030469668-ad73b5f315fa?auto=format&fit=crop&q=80&w=500',
      'https://images.unsplash.com/photo-1612722432474-b971cdcea546?auto=format&fit=crop&q=80&w=500',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=500',
      'https://images.unsplash.com/photo-1611404332938-92111acded8f?auto=format&fit=crop&q=80&w=500',
      'https://images.unsplash.com/photo-1583392522145-6536faa2ded3?auto=format&fit=crop&q=80&w=500',
      'https://images.unsplash.com/photo-1604507410202-99a234ed767e?auto=format&fit=crop&q=80&w=500',
      'https://images.unsplash.com/photo-1586423702505-b13505519074?auto=format&fit=crop&q=80&w=500',
      'https://images.unsplash.com/photo-1585428126359-117dfe284ddb?auto=format&fit=crop&q=80&w=500',
      'https://images.unsplash.com/photo-1561795823-9a97d6b30cfc?auto=format&fit=crop&q=80&w=500',
      'https://images.unsplash.com/photo-1610099733390-47bb77acbbbf?auto=format&fit=crop&q=80&w=500'
    ];
    
    // Create 100 products
    for (let i = 0; i < 100; i++) {
      const price = Math.floor(Math.random() * 5000) + 1000;
      const discountRate = Math.random() < 0.3 ? 0 : Math.floor(Math.random() * 30) + 5;
      const discountedPrice = discountRate > 0 ? Math.floor(price * (100 - discountRate) / 100) : null;
      
      const product: InsertProduct = {
        name: `${brands[i % brands.length]} ${categories[i % categories.length].slice(0, -1)}`,
        description: `Beautiful ethnic ${categories[i % categories.length].slice(0, -1)} from ${brands[i % brands.length]}. Perfect for festive occasions.`,
        price,
        discountedPrice,
        brand: brands[i % brands.length],
        category: categories[i % categories.length],
        gender: genders[i % 2],
        imageUrls: [imageUrls[i % imageUrls.length]],
      };
      
      const createdProduct = {
        ...product,
        id: this.currentProductId++,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      this.products.set(createdProduct.id, createdProduct);
      
      // Add inventory for this product
      const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
      for (const size of sizes) {
        const inventory: InsertInventory = {
          productId: createdProduct.id,
          size,
          quantity: Math.floor(Math.random() * 50) + 5,
        };
        
        const createdInventory = {
          ...inventory,
          id: this.currentInventoryId++,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        this.inventory.set(createdInventory.id, createdInventory);
      }
    }
  }
}

export const storage = new MemStorage();