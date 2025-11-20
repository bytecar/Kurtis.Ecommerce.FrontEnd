import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
<<<<<<< HEAD
import { setupAuth, hashPassword } from "./auth.js";
import { z } from "zod";
import { insertProductSchema, insertInventorySchema, insertReviewSchema, insertOrderSchema, insertOrderItemSchema, insertReturnSchema, User, Product, ProductWithRelations, Brand, Category, orders } from "@/shared/schema";
=======
import { setupAuth, hashPassword } from "./auth";
import { z } from "zod";
import { insertProductSchema, insertInventorySchema, insertReviewSchema, insertOrderSchema, insertOrderItemSchema, insertReturnSchema, User, Product } from "@shared/schema";
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
import multer from "multer";
import path from "path";
import fs from "fs";

// --- services (auto-inserted) ---
import { ProductsAPI } from './services/products.service';
import { CollectionsAPI } from './services/collections.service';
import { InventoriesAPI } from './services/inventories.service';
import { ReviewsAPI } from './services/reviews.service';
import { OrdersAPI } from './services/orders.service';
import { ReturnsAPI } from './services/returns.service';
import { WishlistAPI } from './services/wishlist.service';
import { RecentlyViewedAPI } from './services/recently.viewed.service';
import { PreferencesAPI } from './services/preferences.service';
import { CategoriesAPI } from './services/categories.service';
import { BrandsAPI } from './services/brands.service';
import { UsersAPI } from './services/users.service';
<<<<<<< HEAD
import { OrderItemsAPI } from './services/orderItems.service';
import { authenticateJWT, requirePermission, requireRole } from './services/jwt.service';
// --- end services ---
import { productQuerySchema } from './validators/schemas.js';
import { validateQuery } from './middleware/validate.js';
=======
import { authenticateJWT, requirePermission, requireRole } from './services/jwt.service';
// --- end services ---
import { productQuerySchema } from './validators/schemas';
import { validateQuery } from './middleware/validate';
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
//import { MetadataAPI } from "./services/metadata.service";
import express from "express";


// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      user?: User;
      isAuthenticated(): boolean;
    }
  }
}

// Helper function to safely access req.user
function getUserSafely(req: Request): User {
  if (!req.user) {
    throw new Error("User not authenticated");
  }
  return req.user;
}

// Check if user is admin
function isAdmin(req: Request): boolean {
  return req.isAuthenticated() && req.user !== undefined && req.user.role === "admin";
}

// Safe date handling
function safeDate(date: Date | null): Date {
  return date || new Date();
}

// Safe array handling
function toStringArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

// Helper function to populate brand and category relations in products
async function populateProductRelations(
  product: Product,
  brandsMap: Map<number, Brand>,
  categoriesMap: Map<number, Category>
): Promise<ProductWithRelations> {
  return {
    ...product,
    brand: brandsMap.get(product.brandId),
    category: categoriesMap.get(product.categoryId)
  };
}

// Helper function to populate relations for multiple products
async function populateProductsRelations(products: Product[]): Promise<ProductWithRelations[]> {
  console.log(`[populateProductsRelations] Starting with ${products.length} products`);

  // Early return if no products
  if (!products || products.length === 0) {
    console.log('[populateProductsRelations] No products to populate, returning empty array');
    return [];
  }

  // Fetch all brands and categories once
  const [brandsResponse, categoriesResponse] = await Promise.all([
    BrandsAPI.getAllBrands(),
    CategoriesAPI.getAllCategories()
  ]);

  console.log(`[populateProductsRelations] Fetched ${brandsResponse.data?.length || 0} brands and ${categoriesResponse.data?.length || 0} categories`);

  // Create lookup maps for efficient access
  const brandsMap = new Map<number, Brand>(
    brandsResponse.data.map((brand: Brand) => [brand.id, brand])
  );
  const categoriesMap = new Map<number, Category>(
    categoriesResponse.data.map((category: Category) => [category.id, category])
  );

  // Populate all products with their relations
  return Promise.all(
    products.map(product => populateProductRelations(product, brandsMap, categoriesMap))
  );
}

// Set up multer for file uploads
const upload_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: upload_storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max size
  },
  fileFilter: (req, file, cb) => {
    // Accept only images
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }

    cb(new Error("Only image files are allowed!"));
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);

  // ======= Category and Brand Endpoints =======

  // Get all categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await CategoriesAPI.getAllCategories();
<<<<<<< HEAD
      res.json(categories.data);
=======
      res.json(categories);
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  // Get all brands
  app.get("/api/brands", async (req, res) => {
<<<<<<< HEAD
    try {
      const brands = await BrandsAPI.getAllBrands();
      res.json(brands.data);
=======
      try {
          const brands = await BrandsAPI.getAllBrands();
      res.json(brands);
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
    } catch (error) {
      console.error("Error fetching brands:", error);
      res.status(500).json({ error: "Failed to fetch brands" });
    }
  });

  // ======= Admin Routes =======

  // Get all users (admin only)
  app.get("/api/users", authenticateJWT, requireRole("admin"), async (req, res) => {
    try {

<<<<<<< HEAD
      const users = await UsersAPI.getAllUsers();

      // Remove sensitive information
      const safeUsers = users.data.map((users: { [x: string]: any; password: any; }) => {
=======
        const users = await UsersAPI.getAllUsers();

      // Remove sensitive information
      const safeUsers = users.map((users: { [x: string]: any; password: any; }) => {
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
        const { password, ...safeUser } = users;
        return safeUser;
      });
      
      res.json(safeUsers);      
        return users;
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // Get a specific user (admin only)
  app.get("/api/admin/users/:id", async (req, res) => {
    try {
      // Check if user is admin
      if (!isAdmin(req)) {
        return res.status(403).json({ error: "Unauthorized: Admin access required" });
      }

      const id = parseInt(req.params.id);
      const user = await UsersAPI.getUser(id);

      if (!user.data) {
        return res.status(404).json({ error: "User not found" });
      }

      // Remove sensitive information
      const { password, ...safeUser } = user.data;

      res.json(safeUser);        
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // Create a new user (admin only)
  app.post("/api/admin/users", async (req, res) => {
    try {
      // Check if user is admin
      if (!isAdmin(req)) {
        return res.status(403).json({ error: "Unauthorized: Admin access required" });
      }

      // Validate request data
      const schema = z.object({
        username: z.string().min(3),
        email: z.string().email().optional(),
        fullName: z.string().optional(),
        role: z.enum(["admin", "customer", "contentManager"]).default("customer"),
        password: z.string().min(6)
      });

      const result = schema.safeParse(req.body);

      if (!result.success) {
        return res.status(400).json({ error: "Invalid input data", details: result.error });
      }

      // Check if username is already taken
      const existingUser = await UsersAPI.getUserByUsername(result.data.username);
<<<<<<< HEAD
      if (existingUser.data) {
=======
      if (existingUser) {
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
        return res.status(409).json({ error: "Username already exists" });
      }

      // Create the user
      const hashedPassword = await hashPassword(result.data.password);
      const newUser = await UsersAPI.createUser({
        ...result.data,
        password: hashedPassword,
        status: "active" // Required for JWT authentication
      });

      // Remove password from response
      const { password, ...safeUser } = newUser.data;

      res.status(201).json(safeUser);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  // Update a user (admin only)
  app.patch("/api/admin/users/:id", async (req, res) => {
    try {
      // Check if user is admin
      if (!isAdmin(req)) {
        return res.status(403).json({ error: "Unauthorized: Admin access required" });
      }

      const id = parseInt(req.params.id);

      // Validate request data
      const schema = z.object({
        username: z.string().min(3).optional(),
        email: z.string().email().optional(),
        fullName: z.string().optional(),
        role: z.enum(["admin", "customer", "contentManager"]).optional(),
        password: z.string().min(6).optional()
      });

      const result = schema.safeParse(req.body);

      if (!result.success) {
        return res.status(400).json({ error: "Invalid input data", details: result.error });
      }

      // Check if username is already taken if it's being updated
      if (result.data.username) {
        const existingUser = await UsersAPI.getUserByUsername(result.data.username);
<<<<<<< HEAD
        if (existingUser.data && existingUser.data.id !== id) {
=======
        if (existingUser && existingUser.id !== id) {
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
          return res.status(409).json({ error: "Username already exists" });
        }
      }

      // Update user data
      let updateData = { ...result.data };

      // If password is provided, hash it
      if (result.data.password) {
        const hashedPassword = await hashPassword(result.data.password);
        updateData.password = hashedPassword;
      }

      // Update the user
      const updatedUser = await UsersAPI.updateUser(id, updateData);

      if (!updatedUser.data) {
        return res.status(404).json({ error: "User not found" });
      }

      // Remove password from response
      const { password, ...safeUser } = updatedUser.data;

      res.json(safeUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  // Delete a user (admin only)
  app.delete("/api/admin/users/:id", async (req, res) => {
    try {
      // Check if user is admin
      if (!isAdmin(req)) {
        return res.status(403).json({ error: "Unauthorized: Admin access required" });
      }

      const id = parseInt(req.params.id);
      const user = getUserSafely(req);

      // Don't allow deleting the requesting user
      if (id === user.id) {
        return res.status(400).json({ error: "Cannot delete your own user account" });
      }

      const deleted = await UsersAPI.deleteUser(id);

      if (!deleted) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  // Public endpoint to get basic user information by ID
  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await UsersAPI.getUser(id);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Return only public user info
      const publicInfo = {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role
      };

      res.json(publicInfo);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // ======= User Preferences Routes =======

  // Get user preferences
  app.get("/api/user/preferences", authenticateJWT, async (req, res) => {
    try {
      // Get authenticated user safely
      const user = getUserSafely(req);
      const userId = user.id;
<<<<<<< HEAD
      const preferences = await PreferencesAPI.getUserPreferences();
=======
      const preferences = await PreferencesAPI.getUserPreferences(userId);
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758

      if (!preferences.data) {
        return res.status(404).json({ error: "Preferences not found" });
      }

      res.json(preferences.data);
    } catch (error) {
      console.error("Error getting user preferences:", error);
      res.status(500).json({ error: "Failed to get user preferences" });
    }
  });

  // Create or update user preferences
  app.post("/api/user/preferences", authenticateJWT, async (req, res) => {
    try {
      // Get authenticated user safely
      const user = getUserSafely(req);
      const userId = user.id;
      const { favoriteCategories, favoriteColors, favoriteOccasions, priceRangeMin, priceRangeMax } = req.body;

      // Validate input
      if (!Array.isArray(favoriteCategories) || !Array.isArray(favoriteColors) || !Array.isArray(favoriteOccasions)) {
        return res.status(400).json({ error: "Invalid input data" });
      }

      // Create new preferences
      const preferences = {
        userId,
        // Ensure arrays are properly typed as string[]
        favoriteCategories: Array.isArray(favoriteCategories) ? favoriteCategories : Array.from(favoriteCategories) as string[],
        favoriteColors: Array.isArray(favoriteColors) ? favoriteColors : Array.from(favoriteColors) as string[],
        favoriteOccasions: Array.isArray(favoriteOccasions) ? favoriteOccasions : Array.from(favoriteOccasions) as string[],
        priceRangeMin: priceRangeMin || null,
        priceRangeMax: priceRangeMax || null
      };

<<<<<<< HEAD
      const userPreferences = await PreferencesAPI.saveUserPreferences(preferences);
      res.status(201).json(userPreferences.data);
=======
        const userPreferences = await PreferencesAPI.saveUserPreferences(preferences);
      res.status(201).json(userPreferences);
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
    } catch (error) {
      console.error("Error saving user preferences:", error);
      res.status(500).json({ error: "Failed to save user preferences" });
    }
  });

  // ======= Product Routes =======

  // Get metadata endpoints for filtering UI
<<<<<<< HEAD
  app.get("/api/sizes", async (req, res) => {
    try {
=======
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await CategoriesAPI.getAllCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.get("/api/brands", async (req, res) => {
    try {
      const brands = await BrandsAPI.getAllBrands();
      res.json(brands);
    } catch (error) {
      console.error("Error fetching brands:", error);
      res.status(500).json({ error: "Failed to fetch brands" });
    }
  });

  app.get("/api/sizes", async (req, res) => {
    try {
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
      const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
      res.json(sizes);
    } catch (error) {
      console.error("Error fetching sizes:", error);
      res.status(500).json({ error: "Failed to fetch sizes" });
    }
  });

  app.get("/api/ratings", async (req, res) => {
    try {
      const ratings = await ReviewsAPI.getAllReviews();
<<<<<<< HEAD
      res.json(ratings.data);
=======
      res.json(ratings);
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
    } catch (error) {
      console.error("Error fetching rating options:", error);
      res.status(500).json({ error: "Failed to fetch rating options" });
    }
  });

  // Get all products
  app.get("/api/products", validateQuery(productQuerySchema), async (req, res) => {
    try {
      // Extract filter parameters
      const gender = req.query.gender as string;
      const category = req.query.category ? Array.isArray(req.query.category) ? req.query.category as string[] : [req.query.category as string] : [];
      const brand = req.query.brand ? Array.isArray(req.query.brand) ? req.query.brand as string[] : [req.query.brand as string] : [];
      const size = req.query.size ? Array.isArray(req.query.size) ? req.query.size as string[] : [req.query.size as string] : [];
      const rating = req.query.rating as string;
      const minPrice = req.query.minPrice ? parseInt(req.query.minPrice as string) : 0;
      const maxPrice = req.query.maxPrice ? parseInt(req.query.maxPrice as string) : Number.MAX_SAFE_INTEGER;
      const query = req.query.q as string;
      const collectionParam = req.query.collection as string;

      // Filter parameters are now silently applied (removed excessive logging)
      var productData: any = null;
      // If collection filter is applied, get products by collection first
      var products: Product[] = [];
      if (collectionParam) {
        try {
          // First try to find the collection by ID
          const collectionId = parseInt(collectionParam);
          if (!isNaN(collectionId)) {
            // Use collection-specific endpoint to retrieve products
<<<<<<< HEAD
            productData = await ProductsAPI.getProductsInCollection(collectionId)
            products = productData.data;
            // Fall back to all products if none found in the collection
            if (!products || products.length === 0) {
              productData = await ProductsAPI.getAllProducts();
              products = productData.data;
            }
          } else {
            // If not a number, get all products for other filters
            productData = await ProductsAPI.getAllProducts();
            products = productData.data;
          }
        } catch (err) {
          console.error("Error retrieving collection products:", err);
          productData = await ProductsAPI.getAllProducts();
          products = productData.data;
        }
      } else {
        // No collection filter, get all products
        productData = await ProductsAPI.getAllProducts();
        products = productData.data;
=======
            products = await ProductsAPI.getProductsInCollection(collectionId);

            // Fall back to all products if none found in the collection
            if (!products || products.length === 0) {
              products = await ProductsAPI.getAllProducts();
            }
          } else {
            // If not a number, get all products for other filters
            products = await ProductsAPI.getAllProducts();
          }
        } catch (err) {
          console.error("Error retrieving collection products:", err);
          products = await ProductsAPI.getAllProducts();
        }
      } else {
        // No collection filter, get all products
        products = await ProductsAPI.getAllProducts();
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
      }
      //console.log(products.data[1].name + "|||||" + products.data[1].price + "****************************************");        

      // Apply filters
      if (gender && gender !== "all" && gender !== "search") {
        products = products.filter(product => product.gender === gender);
      }

      // Get category and brand lookup data to match IDs to names
<<<<<<< HEAD
      var allCategories = await CategoriesAPI.getAllCategories();
      var allBrands = await BrandsAPI.getAllBrands();
      allCategories = allCategories.data;
      allBrands = allBrands.data;
=======
      const allCategories = await CategoriesAPI.getAllCategories();
      const allBrands = await BrandsAPI.getAllBrands();

>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
      // Create maps for efficient lookups
      const categoryNameToIdMap = new Map(allCategories.map((cat: { name: any; id: any; }) => [cat.name, cat.id]));
      const brandNameToIdMap = new Map(allBrands.map((brand: { name: any; id: any; }) => [brand.name, brand.id]));

      if (category.length > 0) {
        // Get category IDs from selected category names
        const categoryIds = category.map(catName => categoryNameToIdMap.get(catName)).filter(Boolean);

        products = products.filter(product => {
          if (!product.categoryId) return false;
          return categoryIds.includes(product.categoryId);
        });
      }

      if (brand.length > 0) {
        // Get brand IDs from selected brand names
        const brandIds = brand.map(brandName => brandNameToIdMap.get(brandName)).filter(Boolean);

        products = products.filter(product => {
          if (!product.brandId) return false;
          return brandIds.includes(product.brandId);
        });
      }

      // Size filter - Get inventory for each product and check if any item has the requested size
      if (size.length > 0) {
        const filteredProducts = [];

        for (const product of products) {
<<<<<<< HEAD
          var inventory = await InventoriesAPI.getInventoryByProduct(product.id);
          inventory = inventory.data;
=======
          const inventory = await InventoriesAPI.getInventoryByProduct(product.id);

>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
          const hasSizes = inventory.some((item: { size: string | null; quantity: number; }) => {
            if (!item.size || item.size === null) return false;
            return size.includes(item.size) && item.quantity > 0;
          });

          if (hasSizes) {
            filteredProducts.push(product);
          }
        }

        products = filteredProducts;
      }

      // Rating filter
      if (rating) {
        // First try using the averageRating field if available
        const ratingValue = rating.split('-')[0]; // Extracts "4" from "4-up"
        const minimumRating = parseInt(ratingValue);

        if (!isNaN(minimumRating)) {
          products = products.filter(product => {
            // If product has averageRating field, use it
            if (product.averageRating !== undefined && product.averageRating !== null) {
              return product.averageRating >= minimumRating;
            }

            // Otherwise, calculate from reviews
            return false; // Will check reviews below
          });

          // For products without averageRating, calculate from reviews
          const productsToCheck = products.filter(p =>
            p.averageRating === undefined || p.averageRating === null
          );

          if (productsToCheck.length > 0) {
            const additionalFilteredProducts = [];

            for (const product of productsToCheck) {
<<<<<<< HEAD
              var reviews = await ReviewsAPI.getReviewsByProduct(product.id);
              reviews = reviews.data;
=======
              const reviews = await ReviewsAPI.getReviewsByProduct(product.id);

>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
              if (reviews.length > 0) {
                const avgRating = reviews.reduce((sum: any, review: { rating: any; }) => sum + review.rating, 0) / reviews.length;
                if (avgRating >= minimumRating) {
                  additionalFilteredProducts.push(product);
                }
              }
            }

            // Combine products with valid averageRating and products with calculated rating
            products = [
              ...products.filter(p => p.averageRating !== undefined && p.averageRating !== null),
              ...additionalFilteredProducts
            ];
          }
        }
      }

      // Price filter
      products = products.filter(product => {
        if (!product.price) return false;
        const price = product.discountedPrice || product.price;
        return price >= minPrice && price <= maxPrice;
      });

      // Search filter
      if (query) {
        const searchLower = query.toLowerCase();
        products = products.filter(product => {
          const nameMatch = product.name ? product.name.toLowerCase().includes(searchLower) : false;
          const descMatch = product.description ? product.description.toLowerCase().includes(searchLower) : false;

          // Look up brand and category names using their IDs
          let brandMatch = false;
          let categoryMatch = false;

          if (product.brandId) {
            const brand = allBrands.find((b: { id: number; }) => b.id === product.brandId);
            if (brand) {
              brandMatch = brand.name.toLowerCase().includes(searchLower) ||
                brand.label.toLowerCase().includes(searchLower);
            }
          }

          if (product.categoryId) {
            const category = allCategories.find((c: { id: number; }) => c.id === product.categoryId);
            if (category) {
              categoryMatch = category.name.toLowerCase().includes(searchLower) ||
                category.label.toLowerCase().includes(searchLower);
            }
          }

          return nameMatch || descMatch || brandMatch || categoryMatch;
        });
      }

      // Legacy string-based collection filtering (festival, summer, etc.)
      if (collectionParam && isNaN(parseInt(collectionParam))) {
        try {
          // Find the category IDs for lehengas, sarees, kurtis and tops
          const lehengaCategory = allCategories.find((c: { name: string; }) => c.name === "lehengas");
          const sareeCategory = allCategories.find((c: { name: string; }) => c.name === "sarees");
          const kurtiCategory = allCategories.find((c: { name: string; }) => c.name === "kurtis");
          const topCategory = allCategories.find((c: { name: string; }) => c.name === "tops");

          // Use the legacy approach for predefined text-based collections
          if (collectionParam === "festival") {
            products = products.filter(product => {
              if (!product.categoryId) return false;
              return (lehengaCategory && product.categoryId === lehengaCategory.id) ||
                (sareeCategory && product.categoryId === sareeCategory.id);
            });
          } else if (collectionParam === "summer") {
            products = products.filter(product => {
              if (!product.categoryId) return false;
              return (kurtiCategory && product.categoryId === kurtiCategory.id) ||
                (topCategory && product.categoryId === topCategory.id);
            });
          }
        } catch (err) {
          console.error("Error filtering by legacy collection:", err);
        }
      }

      console.log(`[Products API] Found ${products.length} products before population`);

      // Populate brand and category relations before returning
      try {
        const productsWithRelations = await populateProductsRelations(products);
        console.log(`[Products API] Populated ${productsWithRelations.length} products with relations`);
        res.json(productsWithRelations);
      } catch (populateError) {
        console.error('[Products API] Error populating relations:', populateError);
        // Fallback: return products without relations if population fails
        res.json(products);
      }
    } catch (error) {
      console.error('[Products API] Error:', error);
      res.status(500).json({ error: "Failed to retrieve products" });
    }
  });

  // Get featured products
  app.get("/api/products/featured", async (req, res) => {
    try {
<<<<<<< HEAD
      const products = await ProductsAPI.getFeaturedProducts();
      // Use the featured flag to get featured products
      const featured = products.filter((p: { featured: boolean; }) => p.featured === true)
=======
      const products = await ProductsAPI.getAllProducts();
      // Use the featured flag to get featured products
      const featured = products
        .filter((p: { featured: boolean; }) => p.featured === true)
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
        .slice(0, 12);

      // If there aren't enough featured products, fall back to products with discounts
      if (featured.length < 8) {
        const discountedProducts = products
          .filter((p: { discountedPrice: null | undefined; featured: any; }) => p.discountedPrice !== null && p.discountedPrice !== undefined && !p.featured)
          .slice(0, 8 - featured.length);

        featured.push(...discountedProducts);
      }

      // Populate brand and category relations before returning
      const featuredWithRelations = await populateProductsRelations(featured);
      res.json(featuredWithRelations);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve featured products" });
    }
  });

<<<<<<< HEAD
=======
  // Get collections
  app.get("/api/collections", async (req, res) => {
    try {
      const collections = await CollectionsAPI.getAllCollections();
      res.json(collections);
    } catch (error) {
      console.error("Error fetching collections:", error);
      res.status(500).json({ error: "Failed to fetch collections" });
    }
  });

  // Get a specific collection with its products
  app.get("/api/collections/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid collection ID" });
      }

        const collection = await CollectionsAPI.getCollection(id);
      if (!collection) {
        return res.status(404).json({ error: "Collection not found" });
      }

        const products = await ProductsAPI.getProductsInCollection(id);

      res.json({
        ...collection,
        products
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve collection details" });
    }
  });

>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
  // Get new arrivals
  app.get("/api/products/trending", async (req, res) => {
    try {
      // First try to get products with the isNew flag set to true
<<<<<<< HEAD
      const products = await ProductsAPI.getTrendingProducts();
      const newFlaggedProducts = products.filter((p: Product) => p.isNew === true);
=======
        const products = await ProductsAPI.getAllProducts();
      const newFlaggedProducts = products.filter((p: { isNew: boolean; }) => p.isNew === true);
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758

      if (newFlaggedProducts.length >= 6) {
        // If we have enough products marked as new, use those
        const productsWithRelations = await populateProductsRelations(newFlaggedProducts.slice(0, 12));
        res.json(productsWithRelations);
        return;
      }

      // Next, try to get products from the "New Arrivals" collection
<<<<<<< HEAD
      const collections = await CollectionsAPI.getAllCollections();
      const newArrivalsCollection = collections.data.find((collection: { name: string; }) => collection.name === "New Arrivals");

      if (newArrivalsCollection) {
        // Get products from the "New Arrivals" collection
        const collectionProducts = await ProductsAPI.getProductsInCollection(newArrivalsCollection.id);
=======
        const collections = await CollectionsAPI.getAllCollections();
      const newArrivalsCollection = collections.find((collection: { name: string; }) => collection.name === "New Arrivals");

      if (newArrivalsCollection) {
        // Get products from the "New Arrivals" collection
          const collectionProducts = await ProductsAPI.getProductsInCollection(newArrivalsCollection.id);
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758

        // Combine flagged new products with collection products, avoiding duplicates
        const combinedProducts = [...newFlaggedProducts];

        // Add products from the collection that aren't already included
        for (const product of collectionProducts.data) {
          if (!combinedProducts.some(p => p.id === product.id)) {
            combinedProducts.push(product);
          }
        }

        // Sort by creation date (newest first) and limit to 12 items
        const sortedNewArrivals = combinedProducts
          .sort((a, b) => safeDate(b.createdAt).getTime() - safeDate(a.createdAt).getTime())
          .slice(0, 12);

        const productsWithRelations = await populateProductsRelations(sortedNewArrivals);
        res.json(productsWithRelations);
      } else {
        // Fallback to the old method if collection doesn't exist and not enough flagged products
        const sortedByDate = [...products]
          .sort((a, b) => safeDate(b.createdAt).getTime() - safeDate(a.createdAt).getTime())
          .slice(0, 12);

        const productsWithRelations = await populateProductsRelations(sortedByDate);
        res.json(productsWithRelations);
      }
    } catch (error) {
      console.error("Error retrieving new arrivals:", error);
      res.status(500).json({ error: "Failed to retrieve new arrivals" });
    }
  });

  // Get top selling products (Admin only)
  app.get("/api/products/top", authenticateJWT, async (req, res) => {
    try {
      // Get authenticated user and verify admin role
      const user = getUserSafely(req);
      if (user.role !== "admin") {
        return res.status(403).json({ error: "Not authorized" });
      }

      const products = await ProductsAPI.getAllProducts();
      const orders = await OrdersAPI.getRecentOrders();

      // In a real app, this would be based on actual sales data
      // For now, we'll generate some mock data based on the available products
      const productSales = new Map<number, number>();

      // Initialize all products with 0 sales
<<<<<<< HEAD
      products.data.forEach((product: { id: number; }) => {
=======
      products.forEach((product: { id: number; }) => {
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
        productSales.set(product.id, 0);
      });

      // Calculate sales for each product based on order items
<<<<<<< HEAD
      for (const order of orders.data) {
=======
      for (const order of orders) {
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
        const orderItems = await OrdersAPI.getOrderItemsByOrder(order.id);

        for (const item of orderItems.orderItems) {
          if (productSales.has(item.productId)) {
            productSales.set(
              item.productId,
              (productSales.get(item.productId) || 0) + item.quantity
            );
          }
        }
      }

      // Sort products by sales and take the top 5
      const topProducts = [...products]
        .filter(product => productSales.has(product.id))
        .sort((a, b) => (productSales.get(b.id) || 0) - (productSales.get(a.id) || 0))
        .slice(0, 5);
      if (topProducts.length === 0) {
        // If no top products are found yet (no orders), return some featured products
        const featured = [...products]
          .filter(p => p.discountedPrice !== null && p.discountedPrice !== undefined)
          .slice(0, 5);

        const featuredWithRelations = await populateProductsRelations(featured);
        return res.json(featuredWithRelations);
      }

      const topProductsWithRelations = await populateProductsRelations(topProducts);
      res.json(topProductsWithRelations);
    } catch (error) {
      console.error("Error getting top products:", error);
      res.status(500).json({ error: "Failed to retrieve top products" });
    }
  });

  // Get product by ID
  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await ProductsAPI.getProduct(id);

      if (!product.product) {
        return res.status(404).json({ error: "Product not found" });
      }

      // Populate brand and category relations
      const [brandsResponse, categoriesResponse] = await Promise.all([
        BrandsAPI.getAllBrands(),
        CategoriesAPI.getAllCategories()
      ]);
      const brandsMap = new Map<number, Brand>(brandsResponse.data.map((b: Brand) => [b.id, b]));
      const categoriesMap = new Map<number, Category>(categoriesResponse.data.map((c: Category) => [c.id, c]));
      const productWithRelations = await populateProductRelations(product.product, brandsMap, categoriesMap);

      res.json(productWithRelations);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve product" });
    }
  });

  // Get product recommendations
  app.get("/api/products/:id/recommendations", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await ProductsAPI.getProduct(id);

      if (!product.product) {
        return res.status(404).json({ error: "Product not found" });
      }

      const products = await ProductsAPI.getAllProducts();
      let userPreferences = null;

      // If user is authenticated, get their preferences and recently viewed products
      if (req.isAuthenticated && req.isAuthenticated()) {
        // Get authenticated user safely
        const user = getUserSafely(req);
<<<<<<< HEAD
        userPreferences = await PreferencesAPI.getUserPreferences();
        const recentlyViewed = await RecentlyViewedAPI.getRecentlyViewed();
      }

      // Basic recommendation fallback - find products in the same category
      const recommendations = products.data.filter((p: { id: number; categoryId: any; }) => p.id !== id && p.categoryId === product.product.categoryId).slice(0, 4);
=======
        userPreferences = await PreferencesAPI.getUserPreferences(user.id);
        const recentlyViewed = await RecentlyViewedAPI.getRecentlyViewedByUser(user.id);
      }

      // Basic recommendation fallback - find products in the same category
      const recommendations = products
        .filter((p: { id: number; categoryId: any; }) => p.id !== id && p.categoryId === product.categoryId)
        .slice(0, 4);
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758

      const recommendationsWithRelations = await populateProductsRelations(recommendations);
      res.json(recommendationsWithRelations);
    } catch (error) {
      console.error("Recommendation error:", error);
      res.status(500).json({ error: "Failed to retrieve product recommendations" });
    }
  });

  // Create product (ContentManager or Admin only)
  app.post("/api/products", authenticateJWT, requireRole(["contentManager", "admin"]), async (req, res) => {
    try {

      // Validate request body
      const validatedData = insertProductSchema.parse(req.body);

      // Ensure imageUrls is properly typed as string[] if present
      if (validatedData.imageUrls) {
        // Make sure we always have an array of strings
        const imageUrlArray: string[] = Array.isArray(validatedData.imageUrls)
          ? validatedData.imageUrls.map(url => String(url))
          : [];

        // Assign the properly typed array
        validatedData.imageUrls = imageUrlArray;
      }

      // Create product
      const product = await ProductsAPI.createProduct(validatedData);

      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create product" });
    }
  });

  // Update product (ContentManager or Admin only)
  app.patch("/api/products/:id", authenticateJWT, requireRole(["contentManager", "admin"]), async (req, res) => {
    try {

      const id = parseInt(req.params.id);

      // Create a copy of request body without the imageUrls field
      const { imageUrls, ...otherFields } = req.body;

      // Validate other fields
      const validatedData = insertProductSchema.partial().parse(otherFields);

      // Handle imageUrls separately if present
      let updatedData: Partial<Product> = validatedData;
      
      if (imageUrls !== undefined) {
        // Process imageUrls into a proper string array
        const imageUrlArray: string[] = Array.isArray(imageUrls)
          ? imageUrls.map(url => String(url))
            : [];

        // Add properly typed imageUrls to the update data
        updatedData = {
          ...validatedData,
          imageUrls: imageUrlArray
        };
      }

      // Update product
<<<<<<< HEAD
      const product = await ProductsAPI.updateProduct(id, updatedData);
=======
      const product = await ProductsAPI.updateProduct(id, {});
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  // Delete product (ContentManager or Admin only)
  app.delete("/api/products/:id", authenticateJWT, requireRole(["contentManager", "admin"]), async (req, res) => {
    try {

      const id = parseInt(req.params.id);

      // Delete product
      const success = await ProductsAPI.deleteProduct(id);

      if (success === null) {
        // Assuming null means success (204) or we can't check
      }

      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // ======= Collection Routes =======

<<<<<<< HEAD
=======
  // Get all collections
  app.get("/api/collections", async (req, res) => {
    try {
      const collections = await CollectionsAPI.getAllCollections();
      res.json(collections);
    } catch (error) {
      console.error("Error fetching collections:", error);
      res.status(500).json({ error: "Failed to fetch collections" });
    }
  });

>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
  // Get collection by ID
  app.get("/api/collections/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
<<<<<<< HEAD
      const collection = await CollectionsAPI.getCollection(id);
=======
        const collection = await CollectionsAPI.getCollection(id);
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758

      if (!collection) {
        return res.status(404).json({ error: "Collection not found" });
      }

      res.json(collection);
    } catch (error) {
      console.error(`Error fetching collection ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to fetch collection" });
    }
  });

  // Create collection (ContentManager or Admin only)
  app.post("/api/collections", authenticateJWT, requireRole(["contentManager", "admin"]), async (req, res) => {
    try {
      const collection = await CollectionsAPI.createCollection(req.body);
      res.status(201).json(collection);
    } catch (error) {
      console.error("Error creating collection:", error);
      res.status(500).json({ error: "Failed to create collection" });
    }
  });

  // Update collection (ContentManager or Admin only)
  app.patch("/api/collections/:id", authenticateJWT, requireRole(["contentManager", "admin"]), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const collection = await CollectionsAPI.updateCollection(id, req.body);

      if (!collection) {
        return res.status(404).json({ error: "Collection not found" });
      }

      res.json(collection);
    } catch (error) {
      console.error(`Error updating collection ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to update collection" });
    }
  });

  // Delete collection (ContentManager or Admin only)
  app.delete("/api/collections/:id", authenticateJWT, requireRole(["contentManager", "admin"]), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await CollectionsAPI.deleteCollection(id);
<<<<<<< HEAD
=======

      if (!success) {
        return res.status(404).json({ error: "Collection not found" });
      }
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758

      // Success is null/void on 204
      res.status(204).end();
    } catch (error) {
      console.error(`Error deleting collection ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to delete collection" });
    }
  });

  // Get products in a collection
  app.get("/api/collections/:id/products", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const products = await ProductsAPI.getProductsInCollection(id);
      res.json(products);
    } catch (error) {
      console.error(`Error fetching products for collection ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to fetch products for collection" });
    }
  });

  // Get collections for a product
  app.get("/api/products/:id/collections", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const collections = await CollectionsAPI.getCollectionByProduct(id);
      res.json(collections);
    } catch (error) {
      console.error(`Error fetching collections for product ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to fetch collections for product" });
    }
  });

  // Add product to collection (ContentManager or Admin only)
  app.post("/api/products/:productId/collections/:collectionId", authenticateJWT, requireRole(["contentManager", "admin"]), async (req, res) => {
    try {
      const productId = parseInt(req.params.productId);
      const collectionId = parseInt(req.params.collectionId);

<<<<<<< HEAD
      const productCollection = await ProductsAPI.addProductToCollection(productId, collectionId);
=======
      const productCollection = await ProductsAPI.addProductToCollection(productId,collectionId);
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758

      res.status(201).json(productCollection);
    } catch (error) {
      console.error(`Error adding product ${req.params.productId} to collection ${req.params.collectionId}:`, error);
      res.status(500).json({ error: "Failed to add product to collection" });
    }
  });

  // Remove product from collection (ContentManager or Admin only)
  app.delete("/api/products/:productId/collections/:collectionId", authenticateJWT, requireRole(["contentManager", "admin"]), async (req, res) => {
    try {
      const productId = parseInt(req.params.productId);
      const collectionId = parseInt(req.params.collectionId);

<<<<<<< HEAD
      const success = await ProductsAPI.removeProductFromCollection(productId, collectionId);
=======
        const success = await ProductsAPI.removeProductFromCollection(productId, collectionId);

      if (!success) {
        return res.status(404).json({ error: "Product-collection association not found" });
      }
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758

      // Success is null/void on 204
      res.status(204).end();
    } catch (error) {
      console.error(`Error removing product ${req.params.productId} from collection ${req.params.collectionId}:`, error);
      res.status(500).json({ error: "Failed to remove product from collection" });
    }
  });

  // ======= Inventory Routes =======

  // Get inventory for product
  app.get("/api/inventory/product/:productId", async (req, res) => {
    try {
      const productId = parseInt(req.params.productId);
<<<<<<< HEAD
      const inventory = await InventoriesAPI.getInventoryByProduct(productId);
=======
        const inventory = await InventoriesAPI.getInventoryByProduct(productId);
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758

      res.json(inventory);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve inventory" });
    }
  });

  // Create inventory item (ContentManager or Admin only)
  app.post("/api/inventory", authenticateJWT, requireRole(["contentManager", "admin"]), async (req, res) => {
    try {

      // Validate request body
      const validatedData = insertInventorySchema.parse(req.body);

      // Create inventory item
<<<<<<< HEAD
      const inventory = await InventoriesAPI.createInventory(validatedData);
=======
        const inventory = await InventoriesAPI.createInventory(validatedData);
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758

      res.status(201).json(inventory);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create inventory item" });
    }
  });

  // Update inventory item (ContentManager or Admin only)
  app.patch("/api/inventory/:id", authenticateJWT, requireRole(["contentManager", "admin"]), async (req, res) => {
    try {

      const id = parseInt(req.params.id);

      // Validate request body
      const { quantity } = req.body;

      if (typeof quantity !== 'number' || quantity < 0) {
        return res.status(400).json({ error: "Invalid quantity" });
      }

      // Update inventory
<<<<<<< HEAD
      const inventory = await InventoriesAPI.updateInventory(id, { quantity });
=======
        const inventory = await InventoriesAPI.updateInventory(id, { quantity });
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758

      if (!inventory) {
        return res.status(404).json({ error: "Inventory item not found" });
      }

      res.json(inventory);
    } catch (error) {
      res.status(500).json({ error: "Failed to update inventory" });
    }
  });

  // ======= Review Routes =======

  // Get reviews for product
  app.get("/api/products/:id/reviews", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
<<<<<<< HEAD
      const reviews = await ReviewsAPI.getReviewsByProduct(productId);
=======
        const reviews = await ReviewsAPI.getReviewsByProduct(productId);
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758

      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve reviews" });
    }
  });

  // Get all reviews (Admin only)
  app.get("/api/reviews", authenticateJWT, requireRole("admin"), async (req, res) => {
    try {

<<<<<<< HEAD
      // Note: Backend might not have getAllReviews
      const reviews = await ReviewsAPI.getAllReviews();
=======
        const reviews = await ReviewsAPI.getAllReviews();
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758

      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve reviews" });
    }
  });

  // Create review (authenticated users only)
  app.post("/api/reviews", authenticateJWT, async (req, res) => {
    try {

      // Validate request body
      const validatedData = insertReviewSchema.parse(req.body);

      // Get authenticated user
      const user = getUserSafely(req);

      // Ensure the user ID matches the authenticated user
      if (validatedData.userId !== user.id) {
        return res.status(403).json({ error: "Not authorized to create review for another user" });
      }

      // Create review
<<<<<<< HEAD
      const review = await ReviewsAPI.createReview(validatedData);
=======
        const review = await ReviewsAPI.createReview(validatedData);
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758

      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create review" });
    }
  });

  // Delete review (Admin only)
  app.delete("/api/reviews/:id", authenticateJWT, requireRole("admin"), async (req, res) => {
    try {

      const id = parseInt(req.params.id);

      // Delete review
<<<<<<< HEAD
      const success = await ReviewsAPI.deleteReview(id);
=======
        const success = await ReviewsAPI.deleteReview(id);
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758

      if (!success) {
        return res.status(404).json({ error: "Review not found" });
      }

      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete review" });
    }
  });

  // ======= Order Routes =======

  // Get user orders (authenticated users only)
  app.get("/api/orders/user", authenticateJWT, async (req, res) => {
    try {
      // Get authenticated user
      const user = getUserSafely(req);

<<<<<<< HEAD
      const orders = await OrdersAPI.getOrdersByUser(user.id);
=======
        const orders = await OrdersAPI.getOrdersByUser(user.id);
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758

      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve orders" });
    }
  });

  // Get recent orders (Admin only)
  app.get("/api/orders/recent", authenticateJWT, requireRole("admin"), async (req, res) => {
    try {

<<<<<<< HEAD
      const ordersRecent = await OrdersAPI.getRecentOrders();
      const orders = ordersRecent.data;
=======
        const orders = await OrdersAPI.getRecentOrders();
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758

      // Sort by createdAt descending and take the first 10
      const recentOrders = [...orders]
        .sort((a, b) => safeDate(b.createdAt).getTime() - safeDate(a.createdAt).getTime())
        .slice(0, 10);

      res.json(recentOrders);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve recent orders" });
    }
  });

  // Get order by ID (authenticated users only)
  app.get("/api/orders/:id", authenticateJWT, async (req, res) => {
    try {

      const id = parseInt(req.params.id);
      const order = await OrdersAPI.getOrder(id);

      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      // Get authenticated user
      const user = getUserSafely(req);

      // Ensure the order belongs to the user or user is admin
      if (order.userId !== user.id && user.role !== "admin") {
        return res.status(403).json({ error: "Not authorized to view this order" });
      }

      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve order" });
    }
  });

  // Get order items for order
  app.get("/api/orders/:id/items", authenticateJWT, async (req, res) => {
    try {

      const id = parseInt(req.params.id);
<<<<<<< HEAD
      const order = await OrdersAPI.getOrder(id);
=======
        const order = await OrdersAPI.getOrder(id);
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758

      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      // Get authenticated user
      const user = getUserSafely(req);

      // Ensure the order belongs to the user or user is admin
      if (order.userId !== user.id && user.role !== "admin") {
        return res.status(403).json({ error: "Not authorized to view this order" });
      }

<<<<<<< HEAD
      const orderItems = await OrdersAPI.getOrderItemsByOrder(id);
=======
        const orderItems = await OrdersAPI.getOrderItemsByOrder(id);
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758

      res.json(orderItems.orderItems);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve order items" });
    }
  });

  // Create order
  app.post("/api/orders", authenticateJWT, async (req, res) => {
    try {
      // Validate request body
      const validatedData = insertOrderSchema.parse(req.body);

      // Get authenticated user
      const user = getUserSafely(req);

      // Set userId from JWT
      validatedData.userId = user.id;

      // Create order
<<<<<<< HEAD
      const order = await OrdersAPI.createOrder(validatedData);
=======
        const order = await OrdersAPI.createOrder(validatedData);
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758

      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  // Create order item
  app.post("/api/order-items", async (req, res) => {
    try {
      // Validate request body
      const validatedData = insertOrderItemSchema.parse(req.body);

      // Create order item
<<<<<<< HEAD
      const orderItem = await OrderItemsAPI.addOrderItem(validatedData.orderId, validatedData);
=======
      const orderItem = await OrdersAPI.createOrderItems(validatedData);
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758

      res.status(201).json(orderItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create order item" });
    }
  });

  // Update order status (Admin only)
  app.patch("/api/orders/:id/status", authenticateJWT, requireRole("admin"), async (req, res) => {
    try {

      const id = parseInt(req.params.id);
      const { status } = req.body;

      // Validate status
      if (!['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      // Update order
<<<<<<< HEAD
      const order = await OrdersAPI.updateOrderStatus(id, status);
=======
        const order = await OrdersAPI.updateOrderStatus(id, status);
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758

      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to update order status" });
    }
  });

  // ======= Return Routes =======

  // Get all returns (admin only)
  app.get("/api/returns", authenticateJWT, requireRole("admin"), async (req, res) => {
    try {
<<<<<<< HEAD
      const returns = await ReturnsAPI.getAllReturns();
=======
        const returns = await ReturnsAPI.getAllReturns();
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
      res.json(returns);
    } catch (error) {
      console.error("Error fetching returns:", error);
      res.status(500).json({ error: "Failed to retrieve returns" });
    }
  });

  // Get returns for specific user (authenticated users only)
  app.get("/api/user/returns", authenticateJWT, async (req, res) => {
    try {
      // Get authenticated user
      const user = getUserSafely(req);
<<<<<<< HEAD
      const returns = await ReturnsAPI.getReturnsByUser(user.id);
=======

        const returns = await ReturnsAPI.getReturnsByUser(user.id);
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
      res.json(returns);
    } catch (error) {
      console.error("Error fetching user returns:", error);
      res.status(500).json({ error: "Failed to retrieve user returns" });
    }
  });

  // Get a specific return (admin or owner)
  app.get("/api/returns/:id", authenticateJWT, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const returnItem = await ReturnsAPI.getAllReturns();
      const foundReturn = returnItem.find((item: { id: number; }) => item.id === id);

      if (!foundReturn) {
        return res.status(404).json({ error: "Return not found" });
      }

      // Get authenticated user
      const user = getUserSafely(req);

      // If the user is not an admin, check if they own the return
      if (user.role !== "admin") {
        const order = await OrdersAPI.getOrder(foundReturn.orderId);
        if (!order || order.userId !== user.id) {
          return res.status(403).json({ error: "Not authorized to view this return" });
        }
      }

      res.json(foundReturn);
    } catch (error) {
      console.error("Error fetching return:", error);
      res.status(500).json({ error: "Failed to retrieve return" });
    }
  });

  // Update return status (admin only)
  app.patch("/api/returns/:id", authenticateJWT, requireRole("admin"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;

      // Validate status
      if (!['pending', 'approved', 'rejected', 'completed'].includes(status)) {
        return res.status(400).json({ error: "Invalid status. Must be one of: pending, approved, rejected, completed" });
      }

      // Update return status
      const updatedReturn = await ReturnsAPI.updateReturnStatus(id, status);

      if (!updatedReturn) {
        return res.status(404).json({ error: "Return not found" });
      }

      res.json(updatedReturn);
    } catch (error) {
      console.error("Error updating return status:", error);
      res.status(500).json({ error: "Failed to update return status" });
    }
  });

  // Create return (authenticated users only)
  app.post("/api/returns", authenticateJWT, async (req, res) => {
    try {

      // Validate request body
      const validatedData = insertReturnSchema.parse(req.body);

      // Ensure the user owns the order
      const order = await OrdersAPI.getOrder(validatedData.orderId);

      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      // Get authenticated user
      const user = getUserSafely(req);

      if (order.userId !== user.id && user.role !== "admin") {
        return res.status(403).json({ error: "Not authorized to create return for this order" });
      }

      // Create return
      const returnItem = await ReturnsAPI.createReturn(validatedData);

      res.status(201).json(returnItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create return" });
    }
  });

  // ======= Wishlist Routes =======

  // Get user wishlist (authenticated users only)
  app.get("/api/wishlist", authenticateJWT, async (req, res) => {
    try {
      // Get authenticated user
      const user = getUserSafely(req);

      // This already returns the Product objects directly
      const products = await WishlistAPI.getWishlistByUser(user.id);

      const productsWithRelations = await populateProductsRelations(products);
      res.json(productsWithRelations);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve wishlist" });
    }
  });

  // Add product to wishlist (authenticated users only)
  app.post("/api/wishlist", authenticateJWT, async (req, res) => {
    try {
      // Get authenticated user
      const user = getUserSafely(req);

      const { productId } = req.body;

      if (typeof productId !== 'number') {
        return res.status(400).json({ error: "Invalid product ID" });
      }

      // Check if product exists
      const product = await ProductsAPI.getProduct(productId);

      if (!product.data) {
        return res.status(404).json({ error: "Product not found" });
      }

      // Add to wishlist
      const wishlistItem = await WishlistAPI.addToWishlist(user.id, productId);

      res.status(201).json(wishlistItem);
    } catch (error) {
      res.status(500).json({ error: "Failed to add to wishlist" });
    }
  });

  // Remove product from wishlist (authenticated users only)
  app.delete("/api/wishlist/:productId", authenticateJWT, async (req, res) => {
    try {
      // Get authenticated user
      const user = getUserSafely(req);

      const productId = parseInt(req.params.productId);

      // Remove from wishlist
<<<<<<< HEAD
      const success = await WishlistAPI.removeFromWishlist(user.id, productId);
=======
        const success = await WishlistAPI.removeFromWishlist(user.id, productId);
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758

      // Success is null/void on 204
      res.status(204).end();

      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: "Failed to remove from wishlist" });
    }
  });

  // ======= Collections Routes =======

  // Get product collections (personalized if user is logged in)
  app.get("/api/collections", async (req, res) => {
    try {
      const products = await ProductsAPI.getAllProducts();
      let collections;

      // Check if user is authenticated to get personalized collections
      const isAuthenticated = req.isAuthenticated && req.isAuthenticated();
      if (isAuthenticated) {
        try {
          // Get authenticated user (safe now since we checked authentication)
          const user = getUserSafely(req);

<<<<<<< HEAD
          const userPreferencesRet = await PreferencesAPI.getUserPreferences();
          const userPreferences = userPreferencesRet;
          // If user has preferences, try to get personalized collections using AI
          if (userPreferences) {
            // Prepare user preference data for the AI
            const preferenceData = {
              favoriteCategories: userPreferences.favoriteCategories,
              favoriteColors: userPreferences.favoriteColors,
              gender: user.gender || undefined, // Convert null to undefined to match the expected type
              priceRange: userPreferences.priceRangeMin && userPreferences.priceRangeMax ?
                { min: userPreferences.priceRangeMin, max: userPreferences.priceRangeMax } : undefined
            };
=======
          const userPreferences = await PreferencesAPI.getUserPreferences(user.id);

          // If user has preferences, try to get personalized collections using AI
          if (userPreferences) {                           
              // Prepare user preference data for the AI
              const preferenceData = {
                favoriteCategories: userPreferences.favoriteCategories,
                favoriteColors: userPreferences.favoriteColors,
                gender: user.gender || undefined, // Convert null to undefined to match the expected type
                priceRange: userPreferences.priceRangeMin && userPreferences.priceRangeMax ?
                  { min: userPreferences.priceRangeMin, max: userPreferences.priceRangeMax } : undefined
              };                          
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
          }
        } catch (prefError) {
          console.error("Error getting user preferences:", prefError);
          // Fall back to default collections
        }
      }

      // Default collections if not authenticated or AI failed
      // Populate relations for collection items
      const productsWithRelations = await populateProductsRelations(products.data);

      collections = [
        {
          id: "festival",
          name: "Festival Ready",
          description: "Elegant ethnic wear for celebrating special occasions in style",
<<<<<<< HEAD
          items: productsWithRelations.filter((p: ProductWithRelations) => {
            return p.category && (p.category.name === "lehengas" || p.category.name === "sarees");
          }).slice(0, 6)
=======
          items: products.filter((p: { category: string; }) => p.category === "lehengas" || p.category === "sarees").slice(0, 6)
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
        },
        {
          id: "summer",
          name: "Summer Essentials",
          description: "Stay cool and elegant with our summer ethnic fashion collection",
<<<<<<< HEAD
          items: productsWithRelations.filter((p: ProductWithRelations) => {
            return p.category && (p.category.name === "kurtis" || p.category.name === "tops");
          }).slice(0, 6)
=======
          items: products.filter((p: { category: string; }) => p.category === "kurtis" || p.category === "tops").slice(0, 6)
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
        },
        {
          id: "wedding",
          name: "Wedding Season",
          description: "Stunning wedding outfits for the bride, groom, and wedding party",
<<<<<<< HEAD
          items: productsWithRelations.filter((p: ProductWithRelations) => {
            return p.category && (p.category.name === "lehengas" || p.category.name === "sherwanis");
          }).slice(0, 6)
=======
          items: products.filter((p: { category: string; }) => p.category === "lehengas" || p.category === "sherwanis").slice(0, 6)
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
        }
      ];

      res.json(collections);
    } catch (error) {
      console.error("Collection error:", error);
      res.status(500).json({ error: "Failed to retrieve collections" });
    }
  });

  // ======= Recently Viewed Routes =======

  // Get recently viewed products (authenticated users only)
  app.get("/api/recently-viewed", authenticateJWT, async (req, res) => {
    try {
      // Get authenticated user
      const user = getUserSafely(req);

      // This already returns the Product objects directly
<<<<<<< HEAD
      const products = await RecentlyViewedAPI.getRecentlyViewed();
=======
      const products = await RecentlyViewedAPI.getRecentlyViewedByUser(user.id);
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758

      const productsWithRelations = await populateProductsRelations(products);
      res.json(productsWithRelations);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve recently viewed products" });
    }
  });

  // Add product to recently viewed (authenticated users only)
  app.post("/api/recently-viewed", authenticateJWT, async (req, res) => {
    try {
      // Get authenticated user
      const user = getUserSafely(req);

      const { productId } = req.body;

      if (typeof productId !== 'number') {
        return res.status(400).json({ error: "Invalid product ID" });
      }

      // Check if product exists
      const product = await ProductsAPI.getProduct(productId);

      if (!product.data) {
        return res.status(404).json({ error: "Product not found" });
      }

      // Add to recently viewed
<<<<<<< HEAD
      const recentlyViewedItem = await RecentlyViewedAPI.addRecentlyViewed(productId);
=======
        const recentlyViewedItem = await RecentlyViewedAPI.addRecentlyViewed(user.id, productId);
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758

      res.status(201).json(recentlyViewedItem);
    } catch (error) {
      res.status(500).json({ error: "Failed to add to recently viewed" });
    }
  });

  // ======= Dashboard Stats =======

  // Get dashboard statistics (Admin only)
  app.get("/api/stats", authenticateJWT, async (req, res) => {
    try {
      // Get authenticated user and verify admin role
      const user = getUserSafely(req);
      if (user.role !== "admin") {
        return res.status(403).json({ error: "Not authorized" });
      }

      // Get data for stats
      const products = await ProductsAPI.getAllProducts();
      const orders = await OrdersAPI.getRecentOrders();
      const reviews = await ReviewsAPI.getAllReviews();
      const users = await UsersAPI.getAllUsers();

      // Calculate total sales
<<<<<<< HEAD
      const totalSales = orders.data.reduce((sum: any, order: { total: any; }) => sum + order.total, 0);
=======
      const totalSales = orders.reduce((sum: any, order: { total: any; }) => sum + order.total, 0);
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758

      // Calculate sales by category
      // Calculate sales by category
      const salesByCategory: { category: string; sales: number }[] = [];
      const categorySales: Record<string, number> = {};

<<<<<<< HEAD
      for (const order of orders.data) {
        const orderItems = await OrdersAPI.getOrderItemsByOrder(order.id);
        // orderItems is the Order object, so we access .orderItems
        if (orderItems && orderItems.orderItems) {
          for (const item of orderItems.orderItems) {
            const product = await ProductsAPI.getProduct(item.productId);
            if (product.product) {
              if (!categorySales[product.product.categoryId]) {
                categorySales[product.product.categoryId] = 0;
              }
              categorySales[product.product.categoryId] += item.price * item.quantity;
=======
      for (const order of orders) {
        const orderItems = await OrdersAPI.getOrderItemsByOrder(order.id);

        for (const item of orderItems) {
          const product = await ProductsAPI.getProduct(item.productId);
          if (product) {
            if (!categorySales[product.category]) {
              categorySales[product.category] = 0;
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
            }
          }
        }
      }

      for (const category in categorySales) {
        salesByCategory.push({
          category,
          sales: categorySales[category]
        });
      }

      // Generate sample monthly sales data (in a real app, this would come from the database)
      const salesByMonth = [
        { month: "Jan", sales: 120000 },
        { month: "Feb", sales: 150000 },
        { month: "Mar", sales: 180000 },
        { month: "Apr", sales: 160000 },
        { month: "May", sales: 190000 },
        { month: "Jun", sales: 230000 },
        { month: "Jul", sales: 210000 },
        { month: "Aug", sales: 250000 },
        { month: "Sep", sales: 270000 },
        { month: "Oct", sales: 290000 },
        { month: "Nov", sales: 350000 },
        { month: "Dec", sales: 400000 }
      ];

      // Calculate rating distribution
      // Assuming reviews is an array
      const reviewsList = Array.isArray(reviews) ? reviews : (reviews.data || []);

      const ratingDistribution = [
<<<<<<< HEAD
        { rating: 1, count: reviewsList.filter((r: { rating: number; }) => r.rating === 1).length },
        { rating: 2, count: reviewsList.filter((r: { rating: number; }) => r.rating === 2).length },
        { rating: 3, count: reviewsList.filter((r: { rating: number; }) => r.rating === 3).length },
        { rating: 4, count: reviewsList.filter((r: { rating: number; }) => r.rating === 4).length },
        { rating: 5, count: reviewsList.filter((r: { rating: number; }) => r.rating === 5).length }
      ];

      // Calculate average rating
      const avgRating = reviewsList.length > 0
        ? reviewsList.reduce((sum: any, review: { rating: any; }) => sum + review.rating, 0) / reviewsList.length
=======
        { rating: 1, count: reviews.filter((r: { rating: number; }) => r.rating === 1).length },
        { rating: 2, count: reviews.filter((r: { rating: number; }) => r.rating === 2).length },
        { rating: 3, count: reviews.filter((r: { rating: number; }) => r.rating === 3).length },
        { rating: 4, count: reviews.filter((r: { rating: number; }) => r.rating === 4).length },
        { rating: 5, count: reviews.filter((r: { rating: number; }) => r.rating === 5).length }
      ];

      // Calculate average rating
      const avgRating = reviews.length > 0
        ? reviews.reduce((sum: any, review: { rating: any; }) => sum + review.rating, 0) / reviews.length
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
        : 0;

      // Compile stats
      // Assuming users is an array (UsersController.GetAll returns Ok(users))
      const usersList = Array.isArray(users) ? users : (users.data || []);
      const productsList = Array.isArray(products) ? products : (products.data || []);

      const stats = {
        totalSales,
<<<<<<< HEAD
        totalOrders: orders.data.length,
        totalProducts: productsList.length,
        totalCustomers: usersList.filter((u: { role: string; }) => u.role === "customer").length,
=======
        totalOrders: orders.length,
        totalProducts: products.length,
        totalCustomers: users.filter((u: { role: string; }) => u.role === "customer").length,
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
        avgRating,
        salesByCategory,
        salesByMonth,
        ratingDistribution
      };

      res.json(stats);
    } catch (error) {
      console.error("Error getting stats:", error);
      res.status(500).json({ error: "Failed to retrieve dashboard statistics" });
    }
  });

  // Serve uploads directory with Express
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  // ======= Content Manager Routes =======

  // Upload product images
  app.post('/api/upload', authenticateJWT, requirePermission('product:write'), upload.array('images', 10), (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      // Create URLs for the uploaded files
      const fileUrls = files.map(file => `/uploads/${file.filename}`);
      res.status(200).json({ urls: fileUrls });
    } catch (error) {
      console.error("Error uploading files:", error);
      res.status(500).json({ error: "Failed to upload files" });
    }
  });

  // Bulk update products
  app.post('/api/products/bulk-update', authenticateJWT, requirePermission('product:write'), async (req, res) => {
    try {

      // Validate request
      const bulkUpdateSchema = z.object({
        selectedIds: z.array(z.number()),
        action: z.enum(["discount", "category", "stock"]),
        discount: z.number().optional(),
        newCategoryId: z.number().optional(),
        stockChange: z.number().optional(),
        sizeToUpdate: z.string().optional()
      });

      const result = bulkUpdateSchema.safeParse(req.body);

      if (!result.success) {
        return res.status(400).json({ error: "Invalid input data", details: result.error });
      }

      const { selectedIds, action, discount, newCategoryId, stockChange, sizeToUpdate } = result.data;

      // Ensure we have required fields based on action
      if (action === "discount" && (discount === undefined || discount < 0 || discount > 100)) {
        return res.status(400).json({ error: "Valid discount percentage is required" });
      }

      if (action === "category" && !newCategoryId) {
        return res.status(400).json({ error: "New category ID is required" });
      }

      if (action === "stock" && (stockChange === undefined || !sizeToUpdate)) {
        return res.status(400).json({ error: "Size and stock change are required" });
      }

      // Process bulk update based on action type
      let updatedCount = 0;

      if (action === "discount") {
        // Ensure discount is defined (validated above)
        if (discount !== undefined) {
          // Apply discount to all selected products
          for (const id of selectedIds) {
            const product = await ProductsAPI.getProduct(id);
<<<<<<< HEAD
            if (product.data) {
              const discountedPrice = product.data.price - (product.data.price * (discount / 100));
=======
            if (product) {
              const discountedPrice = product.price - (product.price * (discount / 100));
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
              await ProductsAPI.updateProduct(id, { discountedPrice });
              updatedCount++;
            }
          }
        }
      } else if (action === "category") {
        // Change category for all selected products
<<<<<<< HEAD
        if (newCategoryId !== undefined) {
          for (const id of selectedIds) {
            const product = await ProductsAPI.getProduct(id);
            if (product.data) {
              await ProductsAPI.updateProduct(id, { categoryId: newCategoryId });
              updatedCount++;
            }
=======
        for (const id of selectedIds) {
            const product = await ProductsAPI.getProduct(id);
          if (product) {
              await ProductsAPI.updateProduct(id, { category: newCategory });
            updatedCount++;
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
          }
        }
      } else if (action === "stock") {
        // We already validated stockChange and sizeToUpdate are defined above
        if (stockChange !== undefined && sizeToUpdate !== undefined) {
          // Update inventory for all selected products
          for (const id of selectedIds) {
            const inventoryItems = await InventoriesAPI.getInventoryByProduct(id);
<<<<<<< HEAD
            const sizeItem = inventoryItems.data.find((item: { size: string; }) => item.size === sizeToUpdate);
=======
            const sizeItem = inventoryItems.find((item: { size: string; }) => item.size === sizeToUpdate);
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758

            if (sizeItem) {
              // stockChange is guaranteed to be defined here by the outer if check
              const newQuantity = Math.max(0, sizeItem.quantity + (stockChange as number));
<<<<<<< HEAD
              await InventoriesAPI.updateInventory(sizeItem.id, { quantity: newQuantity });
=======
                await InventoriesAPI.updateInventory(sizeItem.id, { quantity: newQuantity });
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
              updatedCount++;
            } else {
              // Create new inventory if size doesn't exist (only if adding stock)
              if (stockChange > 0 && sizeToUpdate) {
<<<<<<< HEAD
                await InventoriesAPI.createInventory({
=======
                  await InventoriesAPI.createInventory({
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
                  productId: id,
                  size: sizeToUpdate,
                  quantity: stockChange
                });
                updatedCount++;
              }
            }
          }
        }
      }

      res.json({ success: true, updatedCount });
    } catch (error) {
      console.error("Error performing bulk update:", error);
      res.status(500).json({ error: "Failed to perform bulk update" });
    }
  });

<<<<<<< HEAD
=======
  // Update user endpoint to handle 401 more securely
  app.get('/api/users', (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
      return res.json(req.user);
    }
    // Return 401 without detailed error message for security
    res.status(401).json({ error: 'Unauthorized' });
  });

>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
  const httpServer = createServer(app);

  return httpServer;
}