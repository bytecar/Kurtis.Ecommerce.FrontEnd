import express from "express";
import session from "express-session";
import createMemoryStore from "memorystore";
import {
  User,
  InsertUser,
  Product,
  InsertProduct,
  Inventory,
  InsertInventory,
  Review,
  InsertReview,
  Order,
  InsertOrder,
  OrderItem,
  InsertOrderItem,
  Wishlist,
  InsertWishlist,
  Return,
  InsertReturn,
  RecentlyViewed,
  InsertRecentlyViewed,
  UserPreferences,
  InsertUserPreferences,
  Collection,
  InsertCollection,
  ProductCollection,
  InsertProductCollection,
  Category,
  InsertCategory,
  Brand,
  InsertBrand,
} from "@shared/schema";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
  updateUserPassword(id: number, password: string): Promise<boolean>;
  deleteUser(id: number): Promise<boolean>;

  // Category management
  getAllCategoriesData(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryByName(name: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, categoryData: Partial<Category>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;

  // Brand management
  getAllBrandsData(): Promise<Brand[]>;
  getBrand(id: number): Promise<Brand | undefined>;
  getBrandByName(name: string): Promise<Brand | undefined>;
  createBrand(brand: InsertBrand): Promise<Brand>;
  updateBrand(id: number, brandData: Partial<Brand>): Promise<Brand | undefined>;
  deleteBrand(id: number): Promise<boolean>;

  // Product management
  getAllProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(
    id: number,
    productData: Partial<Product>,
  ): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;

  // Inventory management
  getInventoryByProduct(productId: number): Promise<Inventory[]>;
  createInventory(inventory: InsertInventory): Promise<Inventory>;
  updateInventory(
    id: number,
    inventoryData: Partial<Inventory>,
  ): Promise<Inventory | undefined>;
  
  // Collections management
  getAllCollections(): Promise<Collection[]>;
  getCollection(id: number): Promise<Collection | undefined>;
  createCollection(collection: InsertCollection): Promise<Collection>;
  updateCollection(
    id: number,
    collectionData: Partial<Collection>,
  ): Promise<Collection | undefined>;
  deleteCollection(id: number): Promise<boolean>;
  
  // Product Collections (many-to-many relationship)
  getProductsByCollection(collectionId: number): Promise<Product[]>;
  getCollectionsByProduct(productId: number): Promise<Collection[]>;
  addProductToCollection(productCollection: InsertProductCollection): Promise<ProductCollection>;
  removeProductFromCollection(productId: number, collectionId: number): Promise<boolean>;
  
  // Metadata for filtering and UI
  getAllCategories(): Promise<{id: number, name: string, label: string, gender: string}[]>;
  getAllBrands(): Promise<{id: number, name: string, label: string}[]>;
  getAllSizes(): Promise<{id: number, name: string, label: string}[]>;
  getAllRatingOptions(): Promise<{id: string, label: string}[]>;

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
  addToRecentlyViewed(
    recentlyViewed: InsertRecentlyViewed,
  ): Promise<RecentlyViewed>;

  // Return management
  getAllReturns(): Promise<Return[]>;
  getReturnsByUser(userId: number): Promise<Return[]>;
  createReturn(returnData: InsertReturn): Promise<Return>;
  updateReturnStatus(id: number, status: string): Promise<Return | undefined>;

  // User preferences
  getUserPreferences(userId: number): Promise<UserPreferences | undefined>;
  createUserPreferences(
    preferences: InsertUserPreferences,
  ): Promise<UserPreferences>;
  updateUserPreferences(
    userId: number,
    preferencesData: Partial<UserPreferences>,
  ): Promise<UserPreferences | undefined>;

  // Session store
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private brands: Map<number, Brand>;
  private products: Map<number, Product>;
  private inventory: Map<number, Inventory>;
  private reviews: Map<number, Review>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private wishlists: Map<number, Wishlist>;
  private recentlyViewed: Map<number, RecentlyViewed>;
  private returns: Map<number, Return>;
  private userPreferences: Map<number, UserPreferences>;
  private collections: Map<number, Collection>;
  private productCollections: Map<number, ProductCollection>;
  
  // Metadata for the UI filters - implementing the new interfaces
  async getAllCategories(): Promise<{id: number, name: string, label: string, gender: string}[]> {
    return this.categoryData;
  }
  
  async getAllBrands(): Promise<{id: number, name: string, label: string}[]> {
    return this.brandData;
  }
  
  async getAllSizes(): Promise<{id: number, name: string, label: string}[]> {
    return this.sizeData;
  }
  
  async getAllRatingOptions(): Promise<{id: string, label: string}[]> {
    return this.ratingData;
  }

  sessionStore: session.Store;

  // IDs for auto-increment
  currentUserId: number;
  currentCategoryId: number;
  currentBrandId: number;
  currentProductId: number;
  currentInventoryId: number;
  currentReviewId: number;
  currentOrderId: number;
  currentOrderItemId: number;
  currentWishlistId: number;
  currentRecentlyViewedId: number;
  currentReturnId: number;
  currentUserPreferencesId: number;
  currentCollectionId: number;
  currentProductCollectionId: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.brands = new Map();
    this.products = new Map();
    this.inventory = new Map();
    this.reviews = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.wishlists = new Map();
    this.recentlyViewed = new Map();
    this.returns = new Map();
    this.userPreferences = new Map();
    this.collections = new Map();
    this.productCollections = new Map();

    this.currentUserId = 1;
    this.currentCategoryId = 1;
    this.currentBrandId = 1;
    this.currentProductId = 1;
    this.currentInventoryId = 1;
    this.currentReviewId = 1;
    this.currentOrderId = 1;
    this.currentOrderItemId = 1;
    this.currentWishlistId = 1;
    this.currentRecentlyViewedId = 1;
    this.currentReturnId = 1;
    this.currentUserPreferencesId = 1;
    this.currentCollectionId = 1;
    this.currentProductCollectionId = 1;

    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });

    // Initialize categories and brands first
    this.initializeCategories();
    this.initializeBrands();
    
    // Initialize with products, preferences, and reviews (non-async)
    this.initializeProducts();
    this.initializeUserPreferences();
    this.initializeReviews();
    this.initializeCollections();
    
    // Start async initialization for users
    this.initializeUsersAsync();
  }
  
  // Category management methods
  async getAllCategoriesData(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async getCategoryByName(name: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      (category) => category.name.toLowerCase() === name.toLowerCase()
    );
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const now = new Date();
    const newCategory: Category = {
      ...category,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  async updateCategory(
    id: number,
    categoryData: Partial<Category>
  ): Promise<Category | undefined> {
    const category = this.categories.get(id);
    if (!category) return undefined;

    const updatedCategory = {
      ...category,
      ...categoryData,
      updatedAt: new Date(),
    };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<boolean> {
    // Check if any products are using this category
    const productsUsingCategory = Array.from(this.products.values()).filter(
      product => product.categoryId === id
    );
    
    if (productsUsingCategory.length > 0) {
      throw new Error(`Cannot delete category with ID ${id} because it's still being used by ${productsUsingCategory.length} product(s).`);
    }
    
    return this.categories.delete(id);
  }

  // Brand management methods
  async getAllBrandsData(): Promise<Brand[]> {
    return Array.from(this.brands.values());
  }

  async getBrand(id: number): Promise<Brand | undefined> {
    return this.brands.get(id);
  }

  async getBrandByName(name: string): Promise<Brand | undefined> {
    return Array.from(this.brands.values()).find(
      (brand) => brand.name.toLowerCase() === name.toLowerCase()
    );
  }

  async createBrand(brand: InsertBrand): Promise<Brand> {
    const id = this.currentBrandId++;
    const now = new Date();
    const newBrand: Brand = {
      ...brand,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.brands.set(id, newBrand);
    return newBrand;
  }

  async updateBrand(
    id: number,
    brandData: Partial<Brand>
  ): Promise<Brand | undefined> {
    const brand = this.brands.get(id);
    if (!brand) return undefined;

    const updatedBrand = {
      ...brand,
      ...brandData,
      updatedAt: new Date(),
    };
    this.brands.set(id, updatedBrand);
    return updatedBrand;
  }

  async deleteBrand(id: number): Promise<boolean> {
    // Check if any products are using this brand
    const productsUsingBrand = Array.from(this.products.values()).filter(
      product => product.brandId === id
    );
    
    if (productsUsingBrand.length > 0) {
      throw new Error(`Cannot delete brand with ID ${id} because it's still being used by ${productsUsingBrand.length} product(s).`);
    }
    
    return this.brands.delete(id);
  }

  // Collections management methods
  async getAllCollections(): Promise<Collection[]> {
    return Array.from(this.collections.values());
  }

  async getCollection(id: number): Promise<Collection | undefined> {
    return this.collections.get(id);
  }

  async createCollection(collection: InsertCollection): Promise<Collection> {
    const id = this.currentCollectionId++;
    const now = new Date();
    const newCollection: Collection = {
      ...collection,
      id,
      createdAt: now,
      updatedAt: now,
      active: collection.active !== undefined ? collection.active : true,
    };
    this.collections.set(id, newCollection);
    return newCollection;
  }

  async updateCollection(
    id: number,
    collectionData: Partial<Collection>,
  ): Promise<Collection | undefined> {
    const collection = this.collections.get(id);
    if (!collection) return undefined;

    const updatedCollection = {
      ...collection,
      ...collectionData,
      updatedAt: new Date(),
    };
    this.collections.set(id, updatedCollection);
    return updatedCollection;
  }

  async deleteCollection(id: number): Promise<boolean> {
    // First remove all product-collection associations for this collection
    const productCollections = Array.from(this.productCollections.values())
      .filter(pc => pc.collectionId === id);
    
    for (const pc of productCollections) {
      this.productCollections.delete(pc.id);
    }
    
    return this.collections.delete(id);
  }

  // Product Collections methods
  async getProductsByCollection(collectionId: number): Promise<Product[]> {
    const productIds = Array.from(this.productCollections.values())
      .filter(pc => pc.collectionId === collectionId)
      .map(pc => pc.productId);
    
    return Array.from(this.products.values())
      .filter(product => productIds.includes(product.id));
  }

  async getCollectionsByProduct(productId: number): Promise<Collection[]> {
    const collectionIds = Array.from(this.productCollections.values())
      .filter(pc => pc.productId === productId)
      .map(pc => pc.collectionId);
    
    return Array.from(this.collections.values())
      .filter(collection => collectionIds.includes(collection.id));
  }

  async addProductToCollection(productCollection: InsertProductCollection): Promise<ProductCollection> {
    // Check if the association already exists
    const existing = Array.from(this.productCollections.values()).find(
      pc => pc.productId === productCollection.productId && 
            pc.collectionId === productCollection.collectionId
    );
    
    if (existing) {
      return existing;
    }
    
    const id = this.currentProductCollectionId++;
    const now = new Date();
    const newProductCollection: ProductCollection = {
      ...productCollection,
      id,
      createdAt: now,
    };
    this.productCollections.set(id, newProductCollection);
    return newProductCollection;
  }

  async removeProductFromCollection(productId: number, collectionId: number): Promise<boolean> {
    const productCollection = Array.from(this.productCollections.values()).find(
      pc => pc.productId === productId && pc.collectionId === collectionId
    );
    
    if (!productCollection) return false;
    return this.productCollections.delete(productCollection.id);
  }
  
  // Sample data initialization
  private initializeCollections() {
    const collections = [
      {
        name: "New Arrivals",
        description: "Recently added products to our collection",
        imageUrl: "https://images.unsplash.com/photo-1590077428593-a33c3fb61d63?q=80&w=2080",
        active: true
      },
      {
        name: "Summer Collection",
        description: "Light and colorful ethnic wear for summer",
        imageUrl: "https://images.unsplash.com/photo-1607006344380-b6775a0824ce?q=80&w=2080",
        active: true
      },
      {
        name: "Wedding Collection",
        description: "Elegant and traditional wear for wedding ceremonies",
        imageUrl: "https://images.unsplash.com/photo-1630271358016-61a86089853a?q=80&w=2080",
        active: true
      },
      {
        name: "Festival Collection",
        description: "Vibrant and celebratory ethnic wear for festivals",
        imageUrl: "https://images.unsplash.com/photo-1604422759792-36b2c104ac18?q=80&w=2080",
        active: true
      },
      {
        name: "Men's Ethnic",
        description: "Traditional and contemporary ethnic wear for men",
        imageUrl: "https://images.unsplash.com/photo-1614886137091-45232bd9c70e?q=80&w=2080",
        active: true
      },
      {
        name: "Women's Ethnic",
        description: "Elegant ethnic wear for women of all ages",
        imageUrl: "https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?q=80&w=2080",
        active: true
      },
      {
        name: "Designer Collection",
        description: "Premium designer ethnic wear for special occasions",
        imageUrl: "https://images.unsplash.com/photo-1638364826277-dbb2c1fed33c?q=80&w=2080",
        active: true
      },
      {
        name: "Trending Now",
        description: "Most popular ethnic wear items this season",
        imageUrl: "https://images.unsplash.com/photo-1623244727304-b46c0e20c83b?q=80&w=2080",
        active: true
      }
    ];
    
    collections.forEach(collection => {
      const id = this.currentCollectionId++;
      const now = new Date();
      this.collections.set(id, {
        ...collection,
        id,
        createdAt: now,
        updatedAt: now,
        startDate: null,
        endDate: null
      });
      
      // Associate some products with collections
      if (id === 1) { // New Arrivals Collection
        // Products 1-10 go into New Arrivals
        for (let productId = 1; productId <= 10; productId++) {
          this.addProductToCollection({ productId, collectionId: id });
        }
      } else if (id === 2) { // Summer Collection
        // Random summer products (lightweight materials)
        [1, 3, 5, 7, 9, 11, 13, 15, 17, 19].forEach(productId => {
          this.addProductToCollection({ productId, collectionId: id });
        });
      } else if (id === 3) { // Wedding Collection
        // Fancier items
        [2, 6, 8, 12, 16, 20, 24, 28, 32, 36].forEach(productId => {
          this.addProductToCollection({ productId, collectionId: id });
        });
      } else if (id === 4) { // Festival Collection
        // Colorful festival items
        [4, 7, 9, 14, 18, 22, 26, 30, 34, 38].forEach(productId => {
          this.addProductToCollection({ productId, collectionId: id });
        });
      } else if (id === 5) { // Men's Ethnic
        // Filter men's products
        for (let productId = 1; productId <= 100; productId++) {
          const product = this.products.get(productId);
          if (product && product.gender === 'men') {
            this.addProductToCollection({ productId, collectionId: id });
          }
        }
      } else if (id === 6) { // Women's Ethnic
        // Filter women's products
        for (let productId = 1; productId <= 100; productId++) {
          const product = this.products.get(productId);
          if (product && product.gender === 'women') {
            this.addProductToCollection({ productId, collectionId: id });
          }
        }
      } else if (id === 7) { // Designer Collection
        // Higher priced items go into Designer Collection
        for (let productId = 1; productId <= 100; productId++) {
          const product = this.products.get(productId);
          if (product && product.price > 3000) {
            this.addProductToCollection({ productId, collectionId: id });
          }
        }
      } else if (id === 8) { // Trending Now
        // Products with high ratings go into Trending
        for (let productId = 1; productId <= 100; productId++) {
          const product = this.products.get(productId);
          if (product && product.averageRating > 4.5) {
            this.addProductToCollection({ productId, collectionId: id });
          }
        }
      }
    });
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
    return Array.from(this.users.values()).find((user) => user.email === email);
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
      updatedAt: now,
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(
    id: number,
    userData: Partial<User>,
  ): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = {
      ...user,
      ...userData,
      updatedAt: new Date(),
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

  async deleteUser(id: number): Promise<boolean> {
    return this.users.delete(id);
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
      updatedAt: now,
    };
    this.products.set(id, newProduct);
    
    // Automatically add new products to the "New Arrivals" collection
    const newArrivalsCollection = Array.from(this.collections.values()).find(
      collection => collection.name === "New Arrivals"
    );
    
    if (newArrivalsCollection) {
      // Add the product to the "New Arrivals" collection
      this.addProductToCollection({
        productId: id,
        collectionId: newArrivalsCollection.id
      });
    }
    
    return newProduct;
  }

  async updateProduct(
    id: number,
    productData: Partial<Product>,
  ): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;

    const updatedProduct = {
      ...product,
      ...productData,
      updatedAt: new Date(),
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
      (inv) => inv.productId === productId,
    );
  }

  async createInventory(inventory: InsertInventory): Promise<Inventory> {
    const id = this.currentInventoryId++;
    const now = new Date();
    const newInventory: Inventory = {
      ...inventory,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.inventory.set(id, newInventory);
    return newInventory;
  }

  async updateInventory(
    id: number,
    inventoryData: Partial<Inventory>,
  ): Promise<Inventory | undefined> {
    const inventory = this.inventory.get(id);
    if (!inventory) return undefined;

    const updatedInventory = {
      ...inventory,
      ...inventoryData,
      updatedAt: new Date(),
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
      (review) => review.productId === productId,
    );
  }

  async createReview(review: InsertReview): Promise<Review> {
    const id = this.currentReviewId++;
    const now = new Date();
    const newReview: Review = {
      ...review,
      id,
      createdAt: now,
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
      (order) => order.userId === userId,
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
      updatedAt: now,
    };
    this.orders.set(id, newOrder);
    return newOrder;
  }

  async updateOrderStatus(
    id: number,
    status: string,
  ): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;

    const updatedOrder = {
      ...order,
      status,
      updatedAt: new Date(),
    };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Order items methods
  async getOrderItemsByOrder(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(
      (item) => item.orderId === orderId,
    );
  }

  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const id = this.currentOrderItemId++;
    const newOrderItem: OrderItem = {
      ...orderItem,
      id,
    };
    this.orderItems.set(id, newOrderItem);
    return newOrderItem;
  }

  // Wishlist methods
  async getWishlistByUser(userId: number): Promise<Product[]> {
    // Get wishlist items for the user
    const wishlistItems = Array.from(this.wishlists.values()).filter(
      (item) => item.userId === userId,
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
      (item) =>
        item.userId === wishlist.userId &&
        item.productId === wishlist.productId,
    );

    if (existing) {
      return existing;
    }

    const id = this.currentWishlistId++;
    const now = new Date();
    const newWishlist: Wishlist = {
      ...wishlist,
      id,
      addedAt: now,
    };
    this.wishlists.set(id, newWishlist);
    return newWishlist;
  }

  // Alias for addToWishlist to match route usage
  async createWishlist(wishlist: InsertWishlist): Promise<Wishlist> {
    return this.addToWishlist(wishlist);
  }

  async removeFromWishlist(
    userId: number,
    productId: number,
  ): Promise<boolean> {
    const wishlistItem = Array.from(this.wishlists.values()).find(
      (item) => item.userId === userId && item.productId === productId,
    );

    if (!wishlistItem) return false;
    return this.wishlists.delete(wishlistItem.id);
  }

  // Alias for removeFromWishlist to match route usage
  async deleteWishlistItem(
    userId: number,
    productId: number,
  ): Promise<boolean> {
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

  async addToRecentlyViewed(
    recentlyViewed: InsertRecentlyViewed,
  ): Promise<RecentlyViewed> {
    // Remove existing entry for the same product and user
    const existing = Array.from(this.recentlyViewed.values()).find(
      (item) =>
        item.userId === recentlyViewed.userId &&
        item.productId === recentlyViewed.productId,
    );

    if (existing) {
      this.recentlyViewed.delete(existing.id);
    }

    const id = this.currentRecentlyViewedId++;
    const now = new Date();
    const newRecentlyViewed: RecentlyViewed = {
      ...recentlyViewed,
      id,
      viewedAt: now,
    };
    this.recentlyViewed.set(id, newRecentlyViewed);
    return newRecentlyViewed;
  }

  // Alias for addToRecentlyViewed to match route usage
  async createRecentlyViewed(
    recentlyViewed: InsertRecentlyViewed,
  ): Promise<RecentlyViewed> {
    return this.addToRecentlyViewed(recentlyViewed);
  }

  // Return management methods
  async getAllReturns(): Promise<Return[]> {
    return Array.from(this.returns.values());
  }

  async getReturnsByUser(userId: number): Promise<Return[]> {
    return Array.from(this.returns.values()).filter(
      (returnItem) => returnItem.userId === userId,
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
      updatedAt: now,
    };
    this.returns.set(id, newReturn);
    return newReturn;
  }

  async updateReturnStatus(
    id: number,
    status: string,
  ): Promise<Return | undefined> {
    const returnItem = this.returns.get(id);
    if (!returnItem) return undefined;

    const updatedReturn = {
      ...returnItem,
      status,
      updatedAt: new Date(),
    };
    this.returns.set(id, updatedReturn);
    return updatedReturn;
  }

  // User preferences methods
  async getUserPreferences(
    userId: number,
  ): Promise<UserPreferences | undefined> {
    return Array.from(this.userPreferences.values()).find(
      (pref) => pref.userId === userId,
    );
  }

  async createUserPreferences(
    preferences: InsertUserPreferences,
  ): Promise<UserPreferences> {
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
      updatedAt: now,
    };
    this.userPreferences.set(id, newPreferences);
    return newPreferences;
  }

  async updateUserPreferences(
    userId: number,
    preferencesData: Partial<UserPreferences>,
  ): Promise<UserPreferences | undefined> {
    const existing = await this.getUserPreferences(userId);
    if (!existing) return undefined;

    const updatedPreferences = {
      ...existing,
      ...preferencesData,
      updatedAt: new Date(),
    };
    this.userPreferences.set(existing.id, updatedPreferences);
    return updatedPreferences;
  }

  // Method to handle async user initialization
  private async initializeUsersAsync() {
    try {
      await this.initializeUsers();
      console.log("User initialization complete with test credentials");
    } catch (error) {
      console.error("Failed to initialize users:", error);
    }
  }
  
  // Initialize with sample reviews
  private initializeReviews() {
    // Sample reviews for different products
    const reviewComments = [
      "Love this product! The quality is amazing and the fit is perfect.",
      "Beautiful design and comfortable to wear. Will definitely buy more colors.",
      "The color is exactly as shown in the pictures. Very happy with my purchase.",
      "Received many compliments when I wore this. Highly recommended!",
      "Good product but the size runs a bit large. Consider ordering a size down.",
      "The material is so soft and the embroidery detail is exquisite.",
      "Perfect for festive occasions. The embellishments are beautifully done.",
      "Shipping was fast and the product looks even better in person.",
      "Great value for money. The quality exceeds what I expected at this price.",
      "The design is unique and stands out. Love the traditional elements."
    ];
    
    // Add some sample reviews for the first 5 products
    for (let productId = 1; productId <= 5; productId++) {
      // Add 3-5 reviews per product
      const reviewCount = 3 + Math.floor(Math.random() * 3);
      
      for (let j = 0; j < reviewCount; j++) {
        // Randomize which user left the review (from user1 to user5)
        const userId = Math.floor(Math.random() * 5) + 1;
        
        // Randomize rating (weighted towards positive ratings)
        const ratings = [3, 4, 4, 5, 5, 5];
        const rating = ratings[Math.floor(Math.random() * ratings.length)];
        
        // Pick a random comment
        const comment = reviewComments[Math.floor(Math.random() * reviewComments.length)];
        
        const reviewId = this.currentReviewId++;
        const createdAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000); // Random date within last 30 days
        
        const review: Review = {
          id: reviewId,
          userId,
          productId,
          rating,
          comment,
          createdAt
        };
        
        this.reviews.set(reviewId, review);
      }
    }
  }

  // Initialize with 15 users with random profiles
  private async initializeUsers() {
    const roles = ["admin", "user", "content_manager"];
    const fullNames = [
      "Aditya Sharma",
      "Priya Patel",
      "Rahul Singh",
      "Neha Gupta",
      "Vikram Mehta",
      "Anjali Desai",
      "Rajesh Kumar",
      "Meera Joshi",
      "Sanjay Verma",
      "Divya Kapoor",
      "Arjun Malhotra",
      "Pooja Reddy",
      "Kiran Rao",
      "Shweta Bansal",
      "Deepak Nair",
    ];
    
    // High-resolution profile pictures from Unsplash
    const profilePictures = [
      // Male profile pictures
      "https://images.unsplash.com/photo-1618641986557-1ecd230959aa?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIG1hbGUgcG9ydHJhaXR8fHx8fHwxNzE4NTYwMDUw&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=500",
      "https://images.unsplash.com/photo-1629385697093-57be2cc97fa6?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIG1hbGUgcG9ydHJhaXR8fHx8fHwxNzE4NTYwMDc4&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=500",
      "https://images.unsplash.com/photo-1624562563808-158a972f5271?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIG1hbGUgcG9ydHJhaXR8fHx8fHwxNzE4NTYwMTgw&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=500",
      "https://images.unsplash.com/photo-1631022987486-9f88b357647f?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIG1hbGUgcG9ydHJhaXR8fHx8fHwxNzE4NTYwMjA0&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=500",
      "https://images.unsplash.com/photo-1570158268183-d296b2892211?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIG1hbGUgcG9ydHJhaXR8fHx8fHwxNzE4NTYwMjIz&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=500",
      "https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIG1hbGUgcG9ydHJhaXR8fHx8fHwxNzE4NTYwMjQw&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=500",
      "https://images.unsplash.com/photo-1595152452543-e5fc28ebc2b8?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIG1hbGUgcG9ydHJhaXR8fHx8fHwxNzE4NTYwMjY2&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=500",
      
      // Female profile pictures
      "https://images.unsplash.com/photo-1609214071001-16a7d908071b?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIHdvbWFuIHBvcnRyYWl0fHx8fHx8MTcxODU2MDI4NA&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=500",
      "https://images.unsplash.com/photo-1611813002647-47661c65223f?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIHdvbWFuIHBvcnRyYWl0fHx8fHx8MTcxODU2MDI5OQ&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=500",
      "https://images.unsplash.com/photo-1590490359683-658d3d23cdf0?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIHdvbWFuIHBvcnRyYWl0fHx8fHx8MTcxODU2MDMxNQ&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=500",
      "https://images.unsplash.com/photo-1626193082211-85ee9a9705a7?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIHdvbWFuIHBvcnRyYWl0fHx8fHx8MTcxODU2MDMzMQ&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=500",
      "https://images.unsplash.com/photo-1624623806877-9e1e3d2eeeb5?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIHdvbWFuIHBvcnRyYWl0fHx8fHx8MTcxODU2MDM0OA&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=500",
      "https://images.unsplash.com/photo-1607273177117-0d0f1f9c4efc?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIHdvbWFuIHBvcnRyYWl0fHx8fHx8MTcxODU2MDM3Mw&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=500",
      "https://images.unsplash.com/photo-1592124549776-a7f0cc973b24?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIHdvbWFuIHBvcnRyYWl0fHx8fHx8MTcxODU2MDM4OA&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=500",
      "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIHdvbWFuIHBvcnRyYWl0fHx8fHx8MTcxODU2MDQwMw&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=500",
    ];

    // Gender distribution (alternating male/female)
    const genders = ["male", "female"];

    // Import the hashPassword function
    const { hashPassword } = await import('./auth');
    
    console.log("User initialization complete with test credentials");

    // Generate 15 users with random roles
    for (let i = 0; i < 15; i++) {
      const username = `user${i + 1}`;
      const email = `user${i + 1}@example.com`;
      const fullName = fullNames[i];
      const role = roles[i % 3]; // Distribute roles evenly
      const gender = genders[i % 2]; // Alternating genders
      
      // Assign profile picture based on gender
      let profilePictureIndex;
      if (gender === "male") {
        profilePictureIndex = Math.floor(i / 2) % 7; // Use male pictures (first 7)
      } else {
        profilePictureIndex = 7 + Math.floor(i / 2) % 8; // Use female pictures (last 8)
      }
      
      // Use a simple password for all users (with hashing)
      const password = await hashPassword("password123");

      const insertUser: InsertUser = {
        username,
        email,
        password,
        fullName,
        role,
        gender,
        profilePicture: profilePictures[profilePictureIndex],
        status: "active" // Ensure users are active
      };

      const id = this.currentUserId++;
      const now = new Date();
      const user: User = {
        ...insertUser,
        id,
        createdAt: now,
        updatedAt: now,
      };
      this.users.set(id, user);
    }
  }

  // Initialize with 100 ethnic clothing products organized by genres
  private initializeUserPreferences() {
    // Create preferences for a few sample users
    const colors = [
      "Red",
      "Blue",
      "Green",
      "Yellow",
      "Black",
      "White",
      "Pink",
      "Purple",
      "Orange",
      "Brown",
      "Gold",
      "Silver",
      "Maroon",
      "Navy",
      "Beige",
      "Turquoise",
    ];

    const occasions = [
      "Casual",
      "Festive",
      "Wedding",
      "Party",
      "Office",
      "Evening",
      "Bridal",
      "Traditional",
      "Diwali",
      "Holi",
    ];

    // Add preferences for 5 users (more can be added via the API)
    for (let userId = 1; userId <= 5; userId++) {
      // Randomize favorite categories
      const allCategories = [
        "sarees",
        "kurtis",
        "lehengas",
        "salwar_kameez",
        "anarkali_suits",
        "palazzo_suits",
        "kurtas",
        "sherwanis",
        "nehru_jackets",
        "dhoti_sets",
        "indo_western",
      ];

      // Select 3-5 random categories
      const numCategories = Math.floor(Math.random() * 3) + 3;
      const shuffledCategories = [...allCategories].sort(
        () => 0.5 - Math.random(),
      );
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
      const priceRangeMax =
        priceRangeMin + Math.floor(Math.random() * 4000) + 2000;

      // Create preference object
      const preferences: InsertUserPreferences = {
        userId,
        favoriteCategories,
        favoriteColors,
        favoriteOccasions,
        priceRangeMin,
        priceRangeMax,
      };

      const id = this.currentUserPreferencesId++;
      const now = new Date();

      const userPreference: UserPreferences = {
        ...preferences,
        id,
        updatedAt: now,
      };

      this.userPreferences.set(id, userPreference);
    }
  }

  // Define category data structure with IDs for normalization
  private categoryData = [
    // Women's ethnic wear
    { id: 1, name: "sarees", label: "Sarees", gender: "women" },
    { id: 2, name: "kurtis", label: "Kurtis", gender: "women" },
    { id: 3, name: "lehengas", label: "Lehengas", gender: "women" },
    { id: 4, name: "salwar_kameez", label: "Salwar Kameez", gender: "women" },
    { id: 5, name: "anarkali_suits", label: "Anarkali Suits", gender: "women" },
    { id: 6, name: "palazzo_suits", label: "Palazzo Suits", gender: "women" },
    { id: 7, name: "gowns", label: "Gowns", gender: "women" },
    { id: 8, name: "dupattas", label: "Dupattas", gender: "women" },
    { id: 9, name: "blouses", label: "Blouses", gender: "women" },
    { id: 10, name: "skirts", label: "Skirts", gender: "women" },
    { id: 11, name: "dresses", label: "Dresses", gender: "women" },
    // Men's ethnic wear
    { id: 12, name: "kurtas", label: "Kurtas", gender: "men" },
    { id: 13, name: "sherwanis", label: "Sherwanis", gender: "men" },
    { id: 14, name: "nehru_jackets", label: "Nehru Jackets", gender: "men" },
    { id: 15, name: "dhoti_sets", label: "Dhoti Sets", gender: "men" },
    { id: 16, name: "indo_western", label: "Indo Western", gender: "men" },
    // Accessories (unisex)
    { id: 17, name: "jewelry", label: "Jewelry", gender: "unisex" },
    { id: 18, name: "footwear", label: "Footwear", gender: "unisex" },
    { id: 19, name: "bags", label: "Bags", gender: "unisex" },
    { id: 20, name: "scarves", label: "Scarves", gender: "unisex" },
  ];

  // Define brand data structure with IDs for normalization
  private brandData = [
    { id: 1, name: "Fabindia", label: "Fabindia" },
    { id: 2, name: "Biba", label: "Biba" },
    { id: 3, name: "W", label: "W" },
    { id: 4, name: "Global Desi", label: "Global Desi" },
    { id: 5, name: "Anokhi", label: "Anokhi" },
    { id: 6, name: "Aurelia", label: "Aurelia" },
    { id: 7, name: "Manyavar", label: "Manyavar" },
    { id: 8, name: "Ritu Kumar", label: "Ritu Kumar" },
    { id: 9, name: "Soch", label: "Soch" },
    { id: 10, name: "Khaadi", label: "Khaadi" },
    { id: 11, name: "Jaypore", label: "Jaypore" },
    { id: 12, name: "House of Masaba", label: "House of Masaba" },
    { id: 13, name: "Sabyasachi", label: "Sabyasachi" },
    { id: 14, name: "Tarun Tahiliani", label: "Tarun Tahiliani" },
    { id: 15, name: "Anita Dongre", label: "Anita Dongre" },
    { id: 16, name: "Raymond", label: "Raymond" },
    { id: 17, name: "Rangriti", label: "Rangriti" },
    { id: 18, name: "Ethnic Basket", label: "Ethnic Basket" },
    { id: 19, name: "Libas", label: "Libas" },
    { id: 20, name: "Neerus", label: "Neerus" },
    { id: 21, name: "Meena Bazaar", label: "Meena Bazaar" },
    { id: 22, name: "Chhabra 555", label: "Chhabra 555" },
    { id: 23, name: "Tikhi Imli", label: "Tikhi Imli" },
    { id: 24, name: "Sangria", label: "Sangria" },
  ];

  // Define size data structure with IDs for normalization
  private sizeData = [
    { id: 1, name: "xs", label: "XS (Extra Small)" },
    { id: 2, name: "s", label: "S (Small)" },
    { id: 3, name: "m", label: "M (Medium)" },
    { id: 4, name: "l", label: "L (Large)" },
    { id: 5, name: "xl", label: "XL (Extra Large)" },
    { id: 6, name: "xxl", label: "XXL (Double Extra Large)" },
  ];

  // Define rating data structure for consistent filtering
  private ratingData = [
    { id: "4-up", label: "4★ & Above" },
    { id: "3-up", label: "3★ & Above" },
    { id: "2-up", label: "2★ & Above" },
    { id: "1-up", label: "1★ & Above" },
  ];

  // Initialize the categories
  private initializeCategories() {
    const categories = [
      // Women's ethnic wear
      { name: "sarees", label: "Sarees", gender: "women", description: "Traditional Indian drape with blouse, typically 5-9 yards in length" },
      { name: "kurtis", label: "Kurtis", gender: "women", description: "Traditional upper garment for women in various designs" },
      { name: "lehengas", label: "Lehengas", gender: "women", description: "Traditional skirt with choli and dupatta for special occasions" },
      { name: "salwar_kameez", label: "Salwar Kameez", gender: "women", description: "Complete traditional outfit with top, bottom and dupatta" },
      { name: "anarkali_suits", label: "Anarkali Suits", gender: "women", description: "Floor length suits with fitted bodice and flared bottom" },
      { name: "palazzo_suits", label: "Palazzo Suits", gender: "women", description: "Modern ethnic outfit with wide-legged pants" },
      { name: "gowns", label: "Gowns", gender: "women", description: "Full-length formal dress in Indian styles" },
      { name: "dupattas", label: "Dupattas", gender: "women", description: "Long scarf worn with suits and lehengas" },
      { name: "blouses", label: "Blouses", gender: "women", description: "Upper garment worn with sarees" },
      { name: "skirts", label: "Skirts", gender: "women", description: "Traditional Indian long skirts" },
      { name: "dresses", label: "Dresses", gender: "women", description: "Indo-western fusion dresses" },
      // Men's ethnic wear
      { name: "kurtas", label: "Kurtas", gender: "men", description: "Traditional Indian upper garment for men" },
      { name: "sherwanis", label: "Sherwanis", gender: "men", description: "Long coat-like garment for formal occasions" },
      { name: "nehru_jackets", label: "Nehru Jackets", gender: "men", description: "Traditional embellished jackets worn over kurtas" },
      { name: "dhoti_sets", label: "Dhoti Sets", gender: "men", description: "Traditional lower garment with matching kurta" },
      { name: "indo_western", label: "Indo Western", gender: "men", description: "Fusion of Indian and Western styles" },
      // Accessories (unisex)
      { name: "jewelry", label: "Jewelry", gender: "unisex", description: "Traditional Indian jewelry for various occasions" },
      { name: "footwear", label: "Footwear", gender: "unisex", description: "Traditional footwear to complement ethnic outfits" },
      { name: "bags", label: "Bags", gender: "unisex", description: "Traditional and modern bags to match ethnic wear" },
    ];

    categories.forEach(category => {
      const id = this.currentCategoryId++;
      const now = new Date();
      this.categories.set(id, {
        ...category,
        id,
        createdAt: now,
        updatedAt: now,
      });
    });
  }

  // Initialize the brands
  private initializeBrands() {
    const brands = [
      { name: "Fabindia", label: "Fabindia", description: "India's largest private platform for products that are made from traditional techniques, skills and hand-based processes", logo: "https://example.com/fabindia_logo.png" },
      { name: "Biba", label: "Biba", description: "Leading ethnic wear brand offering salwar suits, kurtas, dresses and bottom wear for women and girls", logo: "https://example.com/biba_logo.png" },
      { name: "W", label: "W", description: "Contemporary Indian wear brand focusing on modern silhouettes with traditional aesthetics", logo: "https://example.com/w_logo.png" },
      { name: "Global Desi", label: "Global Desi", description: "Bohemian-inspired ethnic wear with global influences", logo: "https://example.com/global_desi_logo.png" },
      { name: "Anokhi", label: "Anokhi", description: "Known for hand-block printed garments using traditional techniques", logo: "https://example.com/anokhi_logo.png" },
      { name: "Aurelia", label: "Aurelia", description: "Contemporary ethnic wear brand for the modern woman", logo: "https://example.com/aurelia_logo.png" },
      { name: "Manyavar", label: "Manyavar", description: "India's leading celebration wear brand offering ethnic wear for men and their families", logo: "https://example.com/manyavar_logo.png" },
      { name: "Ritu Kumar", label: "Ritu Kumar", description: "Luxury designer brand known for traditional craftsmanship", logo: "https://example.com/ritu_kumar_logo.png" },
      { name: "Soch", label: "Soch", description: "Quality ethnic wear brand offering sarees, salwar suits, kurtas and fusion wear", logo: "https://example.com/soch_logo.png" },
      { name: "Khaadi", label: "Khaadi", description: "Known for hand-woven fabrics and vibrant prints", logo: "https://example.com/khaadi_logo.png" },
      { name: "Jaypore", label: "Jaypore", description: "Curated marketplace for handmade, handwoven and hand-crafted apparel", logo: "https://example.com/jaypore_logo.png" },
      { name: "House of Masaba", label: "House of Masaba", description: "Contemporary and quirky prints on traditional Indian silhouettes", logo: "https://example.com/house_of_masaba_logo.png" },
      { name: "Sabyasachi", label: "Sabyasachi", description: "Luxury designer brand known for traditional bridal wear", logo: "https://example.com/sabyasachi_logo.png" },
      { name: "Tarun Tahiliani", label: "Tarun Tahiliani", description: "Luxury designer brand known for draping and construction", logo: "https://example.com/tarun_tahiliani_logo.png" },
      { name: "Anita Dongre", label: "Anita Dongre", description: "Sustainable luxury brand with focus on Rajasthani crafts", logo: "https://example.com/anita_dongre_logo.png" },
      { name: "Raymond", label: "Raymond", description: "Known for quality fabrics and men's ethnic wear", logo: "https://example.com/raymond_logo.png" },
      { name: "Rangriti", label: "Rangriti", description: "Affordable ethnic wear with vibrant colors and prints", logo: "https://example.com/rangriti_logo.png" },
      { name: "Ethnic Basket", label: "Ethnic Basket", description: "Offering a wide range of traditional and contemporary ethnic wear", logo: "https://example.com/ethnic_basket_logo.png" },
      { name: "Libas", label: "Libas", description: "Contemporary ethnic wear with focus on comfort and style", logo: "https://example.com/libas_logo.png" },
      { name: "Neerus", label: "Neerus", description: "Known for sarees and ethnic wear with traditional craftsmanship", logo: "https://example.com/neerus_logo.png" },
      { name: "Meena Bazaar", label: "Meena Bazaar", description: "Traditional ethnic wear with contemporary touches", logo: "https://example.com/meena_bazaar_logo.png" },
      { name: "Chhabra 555", label: "Chhabra 555", description: "Known for bridal and festive ethnic wear collections", logo: "https://example.com/chhabra_555_logo.png" },
      { name: "Tikhi Imli", label: "Tikhi Imli", description: "Eclectic fusion of Indian and Western styles", logo: "https://example.com/tikhi_imli_logo.png" },
      { name: "Sangria", label: "Sangria", description: "Modern interpretations of traditional Indian wear", logo: "https://example.com/sangria_logo.png" },
    ];

    brands.forEach(brand => {
      const id = this.currentBrandId++;
      const now = new Date();
      this.brands.set(id, {
        ...brand,
        id,
        createdAt: now,
        updatedAt: now,
      });
    });
  }

  private fabricData = [
    "Cotton",
    "Silk",
    "Linen",
    "Chiffon",
    "Georgette",
    "Chanderi",
    "Banarasi",
    "Khadi",
    "Rayon",
    "Crepe",
    "Organza",
    "Velvet",
    "Brocade",
    "Kota",
    "Tussar",
    "Patola",
    "Pashmina",
    "Kanjeevaram",
    "Maheshwari",
    "Ikat",
    "Pochampally",
    "Bandhani",
  ];
  
  private initializeProducts() {
    // Get categories and brands from our normalized data structures
    const categoryMap = Array.from(this.categories.values());
    const brandMap = Array.from(this.brands.values());
    
    // Create arrays of category and brand names for easier random selection
    const categories = categoryMap.map(cat => cat.name);
    const brands = brandMap.map(brand => brand.name);

    const occasions = [
      "Casual",
      "Festive",
      "Wedding",
      "Party",
      "Office",
      "Evening",
      "Bridal",
      "Reception",
      "Engagement",
      "Cocktail",
      "Traditional",
      "Mehendi",
      "Diwali",
      "Holi",
      "Pongal",
      "Onam",
      "Navratri",
      "Durga Puja",
      "Eid",
    ];

    const genders = ["women", "men"];

    const imageUrls = [
      // Sarees - High-quality vibrant images
      "https://images.unsplash.com/photo-1606902168692-BF5954ba5a5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIHNhcmVlfHx8fHx8MTcxODU2MDcyOQ&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
      "https://images.unsplash.com/photo-1623504769538-6b0dc3f2db2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIHNhcmVlfHx8fHx8MTcxODU2MDg3OQ&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
      "https://images.unsplash.com/photo-1610030473192-f4bac2c6124f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIHNhcmVlfHx8fHx8MTcxODU2MDkwMA&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
      "https://images.unsplash.com/photo-1610030473192-f4bac2c6124f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIHNhcmVlfHx8fHx8MTcxODU2MDkwMA&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
      "https://images.unsplash.com/photo-1594387903898-7d1235079332?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIHNhcmVlfHx8fHx8MTcxODU2MDkyMg&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
      "https://images.unsplash.com/photo-1665077722106-51388e8d9f3c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIHNhcmVlfHx8fHx8MTcxODU2MDk2NA&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
      "https://images.unsplash.com/photo-1609559540661-df12ac42bad3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIHNhcmVlfHx8fHx8MTcxODU2MDk4NQ&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
      "https://images.unsplash.com/photo-1611404332938-92111acded8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIHdlZGRpbmcgc2FyZWV8fHx8fHwxNzE4NTYxMDA3&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
      "https://images.unsplash.com/photo-1610030469668-ad73b5f315fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIHdlZGRpbmcgc2FyZWV8fHx8fHwxNzE4NTYxMDI3&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
      "https://images.unsplash.com/photo-1620642439157-09e8ea9b0e90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIHdlZGRpbmcgc2FyZWV8fHx8fHwxNzE4NTYxMDQ4&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
      
      // Kurtis and Suits - High-quality fashion images
      "https://images.unsplash.com/photo-1636628266722-d5448ca44f5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIGt1cnRpfHx8fHx8MTcxODU2MTA3Mg&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
      "https://images.unsplash.com/photo-1610189025554-708a149676b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIGt1cnRpfHx8fHx8MTcxODU2MTA5NA&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
      "https://images.unsplash.com/photo-1606751071446-d3343720dedf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIGt1cnRpfHx8fHx8MTcxODU2MTExMg&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
      "https://images.unsplash.com/photo-1606751071446-d3343720dedf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIGt1cnRpfHx8fHx8MTcxODU2MTExMg&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
      "https://images.unsplash.com/photo-1612722432474-b971cdcea546?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIGt1cnRpfHx8fHx8MTcxODU2MTEzMA&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
      "https://images.unsplash.com/photo-1591908824904-5f40c14c0b2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIGt1cnRpfHx8fHx8MTcxODU2MTE1MA&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
      "https://images.unsplash.com/photo-1622564637927-efc33081cad2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIGt1cnRpfHx8fHx8MTcxODU2MTE2OQ&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
      "https://images.unsplash.com/photo-1588771930296-88c2cb03f2ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIGt1cnRpfHx8fHx8MTcxODU2MTE4OA&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIGt1cnRpfHx8fHx8MTcxODU2MTIwOQ&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
      "https://images.unsplash.com/photo-1581222375407-e19e9f791fff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIGt1cnRpfHx8fHx8MTcxODU2MTIyOA&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
      
      // Lehengas and Bridal Wear - High-quality festive images
      "https://images.unsplash.com/photo-1623000963328-6eb604d3f15f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIGxlaGVuZ2F8fHx8fHwxNzE4NTYxMjUw&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
      "https://images.unsplash.com/photo-1596387451750-8a6c93efcdab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIGxlaGVuZ2F8fHx8fHwxNzE4NTYxMjcx&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
      "https://images.unsplash.com/photo-1639680254855-3073add7fa54?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIGxlaGVuZ2F8fHx8fHwxNzE4NTYxMjk1&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
      "https://images.unsplash.com/photo-1652384046585-15d13c0b750c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIGxlaGVuZ2F8fHx8fHwxNzE4NTYxMzEy&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
      "https://images.unsplash.com/photo-1612803155742-9a19b9567b02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIGJyaWRhbHx8fHx8fDE3MTg1NjEzMzc&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
      "https://images.unsplash.com/photo-1609529499375-e74de223b7d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIGJyaWRhbHx8fHx8fDE3MTg1NjEzNTY&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
      "https://images.unsplash.com/photo-1611244420753-5336ba916776?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIGJyaWRhbHx8fHx8fDE3MTg1NjEzNzk&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
      "https://images.unsplash.com/photo-1610710608685-2a8afbf46c79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIGJyaWRhbHx8fHx8fDE3MTg1NjEzOTU&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
      "https://images.unsplash.com/photo-1604145559206-e3bce0040e2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIGJyaWRhbHx8fHx8fDE3MTg1NjE0MDc&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
      "https://images.unsplash.com/photo-1610725664285-7c64405d57e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIGJyaWRhbHx8fHx8fDE3MTg1NjE0Mjc&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
      
      // Accessories for Women - High-quality jewelry and accessories
      "https://images.unsplash.com/photo-1610271340738-726e199f0258?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIGpld2Vscnl8fHx8fHwxNzE4NTYxNDQ3&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
      "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIGpld2Vscnl8fHx8fHwxNzE4NTYxNDY2&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
      "https://images.unsplash.com/photo-1601971905324-c6c5061ff885?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIGpld2Vscnl8fHx8fHwxNzE4NTYxNDg2&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIGpld2Vscnl8fHx8fHwxNzE4NTYxNTAz&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
      "https://images.unsplash.com/photo-1571816757173-0a06d2bce150?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIGpld2Vscnl8fHx8fHwxNzE4NTYxNTIx&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
      
      // Men's Ethnic Wear - High-quality kurtas and sherwanis
      "https://images.unsplash.com/photo-1625301840055-7c4d6f04b5d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIG1lbiB3ZWFyfHx8fHx8MTcxODU2MTU0MA&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
      "https://images.unsplash.com/photo-1624032786592-2ade942c727f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIG1lbiB3ZWFyfHx8fHx8MTcxODU2MTU1OQ&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
      "https://images.unsplash.com/photo-1625301950614-a3c4085f420d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIG1lbiB3ZWFyfHx8fHx8MTcxODU2MTU3Ng&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
      "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIG1lbiB3ZWFyfHx8fHx8MTcxODU2MTU5NA&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
      "https://images.unsplash.com/photo-1566483233832-3d408d05b393?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIG1lbiB3ZWFyfHx8fHx8MTcxODU2MTYxNQ&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
      "https://images.unsplash.com/photo-1543099678-f5a74c9a599e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIG1lbiB3ZWFyfHx8fHx8MTcxODU2MTYzMw&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
      
      // Nehru Jackets and Fashion Accessories for Men
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIG1lbiBqYWNrZXR8fHx8fHwxNzE4NTYxNjYw&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
      "https://images.unsplash.com/photo-1591925239811-454af9d98e9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIG1lbiBqYWNrZXR8fHx8fHwxNzE4NTYxNjc5&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
      "https://images.unsplash.com/photo-1623170505975-dd18d404c349?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIG1lbiBqYWNrZXR8fHx8fHwxNzE4NTYxNjk3&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
      "https://images.unsplash.com/photo-1656878125671-85e19e35d591?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIG1lbiBqYWNrZXR8fHx8fHwxNzE4NTYxNzE1&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
      
      // Indo-Western Fusion
      "https://images.unsplash.com/photo-1624557446120-884e2ef7b18f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIGZ1c2lvbiB3ZWFyfHx8fHx8MTcxODU2MTczNw&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
      "https://images.unsplash.com/photo-1595429035839-c99c298ffdde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIGZ1c2lvbiB3ZWFyfHx8fHx8MTcxODU2MTc1OQ&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
      "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIGZ1c2lvbiB3ZWFyfHx8fHx8MTcxODU2MTc4MA&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
      "https://images.unsplash.com/photo-1611042553480-a35c5ca1c835?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8aW5kaWFuIGZ1c2lvbiB3ZWFyfHx8fHx8MTcxODU2MTc5OA&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080"
    ];

    // Create 100 products
    for (let i = 0; i < 100; i++) {
      const price = Math.floor(Math.random() * 5000) + 1000;
      const discountRate =
        Math.random() < 0.3 ? 0 : Math.floor(Math.random() * 30) + 5;
      const discountedPrice =
        discountRate > 0
          ? Math.floor((price * (100 - discountRate)) / 100)
          : null;

      // Random sizes for each product
      const availableSizes = ["xs", "s", "m", "l", "xl", "xxl"];
      const productSizes = [];
      const numSizes = Math.floor(Math.random() * 5) + 1; // 1-5 sizes per product
      for (let j = 0; j < numSizes; j++) {
        productSizes.push(availableSizes[Math.floor(Math.random() * availableSizes.length)]);
      }
      
      // Generate random ratings
      const ratingCount = Math.floor(Math.random() * 100);
      const averageRating = ratingCount > 0 ? (Math.random() * 4 + 1).toFixed(1) : 0; // 1.0-5.0 rating
      
      // Randomly mark some products as featured or new
      const featured = Math.random() < 0.2; // 20% chance to be featured
      const isNew = Math.random() < 0.3; // 30% chance to be new
      
      // Get random indices for brand and category
      const brandIndex = i % brandMap.length;
      const categoryIndex = i % categoryMap.length;
      
      // Get the actual brand and category objects
      const selectedBrand = brandMap[brandIndex];
      const selectedCategory = categoryMap[categoryIndex];
      
      const product: InsertProduct = {
        name: `${selectedBrand.label} ${selectedCategory.label}`,
        description: `Beautiful ethnic ${selectedCategory.label} from ${selectedBrand.label}. Perfect for festive occasions.`,
        price,
        discountedPrice,
        brandId: selectedBrand.id,
        categoryId: selectedCategory.id,
        gender: genders[i % 2],
        sizes: [...new Set(productSizes)], // Remove duplicates
        averageRating: parseFloat(averageRating),
        ratingCount,
        featured,
        isNew,
        imageUrls: [imageUrls[i % imageUrls.length]],
      };

      const createdProduct = {
        ...product,
        id: this.currentProductId++,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      this.products.set(createdProduct.id, createdProduct);

      // Add inventory for this product
      const sizes = ["S", "M", "L", "XL", "XXL"];
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
          updatedAt: new Date(),
        };

        this.inventory.set(createdInventory.id, createdInventory);
      }
    }
  }
}

export const storage = new MemStorage();
