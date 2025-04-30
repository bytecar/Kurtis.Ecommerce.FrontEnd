import session from "express-session";
import createMemoryStore from "memorystore";
import { 
  users, products, inventory, reviews, orders, orderItems, wishlists, recentlyViewed, returns,
  type User, type InsertUser, 
  type Product, type InsertProduct,
  type Inventory, type InsertInventory,
  type Review, type InsertReview,
  type Order, type InsertOrder,
  type OrderItem, type InsertOrderItem,
  type Wishlist, type InsertWishlist,
  type RecentlyViewed, type InsertRecentlyViewed,
  type Return, type InsertReturn
} from "@shared/schema";

// Session store
const MemoryStore = createMemoryStore(session);

// modify the interface with any CRUD methods
// you might need

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
  
  // Session store
  sessionStore: session.SessionStore;
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
  
  sessionStore: session.SessionStore;
  
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
    
    this.currentUserId = 1;
    this.currentProductId = 1;
    this.currentInventoryId = 1;
    this.currentReviewId = 1;
    this.currentOrderId = 1;
    this.currentOrderItemId = 1;
    this.currentWishlistId = 1;
    this.currentRecentlyViewedId = 1;
    this.currentReturnId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
    
    // Initialize with some products
    this.initializeProducts();
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
    const wishlistItems = Array.from(this.wishlists.values()).filter(
      (item) => item.userId === userId
    );
    
    // Get product details for each wishlist item
    const products: Product[] = [];
    for (const item of wishlistItems) {
      const product = this.products.get(item.productId);
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
  
  // Recently viewed methods
  async getRecentlyViewedByUser(userId: number): Promise<Product[]> {
    const recentItems = Array.from(this.recentlyViewed.values())
      .filter((item) => item.userId === userId)
      .sort((a, b) => new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime())
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
  
  // Initialize with demo products
  private initializeProducts() {
    const categories = ['sarees', 'kurtis', 'lehengas', 'dresses', 'tops', 'pants', 'skirts'];
    const brands = ['Fabindia', 'Biba', 'W', 'Global Desi', 'Anokhi', 'Aurelia', 'Manyavar'];
    const genders = ['women', 'men'];
    const imageUrls = [
      'https://images.unsplash.com/photo-1610030469668-ad73b5f315fa?auto=format&fit=crop&q=80&w=500',
      'https://images.unsplash.com/photo-1612722432474-b971cdcea546?auto=format&fit=crop&q=80&w=500',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=500',
      'https://images.unsplash.com/photo-1611404332938-92111acded8f?auto=format&fit=crop&q=80&w=500',
      'https://images.unsplash.com/photo-1583392522145-6536faa2ded3?auto=format&fit=crop&q=80&w=500'
    ];
    
    // Create 20 products
    for (let i = 0; i < 20; i++) {
      const price = Math.floor(Math.random() * 4000) + 1000;
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
