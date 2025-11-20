// schema.ts - Combined Drizzle + Zod Schemas (Part 1)

import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  timestamp,
  json,
  doublePrecision,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { ZodDate, z } from "zod";

/* ---------------- USERS ---------------- */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
  gender: text("gender"),
  status: text("status").default("active"),
  profilePicture: text("profile_picture"),
  lastLogin: timestamp("last_login"),
  phoneNumber: text("phone_number"),
  address: text("address"),
  birthdate: timestamp("birthdate"),
});

export const insertUserSchema = createInsertSchema(users).extend({
  email: z.string().email().optional(),
  fullName: z.string().optional(),
  gender: z.string().optional(),
  status: z.string().default("active"),
  profilePicture: z.string().optional(),
  lastLogin: z.date().optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  birthdate: z.date().optional(),
  username: z.string(),
<<<<<<< HEAD:src/shared/schema.ts
  password: z.string(),
  confirmPassword: z.string().optional(),
  role: z.string().optional(),
});

export const insertLoginSchema = createInsertSchema(users).extend({
  email: z.string(),
  password: z.string(),
  clientId: z.string().optional(),
=======
  password: z.string(),    

});

export const insertLoginSchema = createInsertSchema(users).extend({
    username: z.string(),
    password: z.string(),    
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758:shared/schema.ts
});

/* ---------------- CATEGORIES ---------------- */
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  label: text("label").notNull(),
  description: text("description"),
  gender: text("gender"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCategorySchema = createInsertSchema(categories).extend({
  description: z.string().optional(),
  gender: z.string().optional(),
});

/* ---------------- BRANDS ---------------- */
export const brands = pgTable("brands", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  label: text("label").notNull(),
  description: text("description"),
  logo: text("logo"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertBrandSchema = createInsertSchema(brands).extend({
  description: z.string().optional(),
  logo: z.string().optional(),
});


/* ---------------- PRODUCTS ---------------- */
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
<<<<<<< HEAD:src/shared/schema.ts
  price: doublePrecision("price").notNull(),
  discountedPrice: doublePrecision("discounted_price"),
=======
  price: integer("price").notNull(),
  discountedPrice: integer("discounted_price"),
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758:shared/schema.ts
  brandId: integer("brand_id").notNull(),
  categoryId: integer("category_id").notNull(),
  gender: text("gender").notNull(),
  sizes: json("sizes").$type<string[]>(),
  averageRating: doublePrecision("average_rating").default(0),
  ratingCount: integer("rating_count").default(0),
  imageUrls: json("image_urls").notNull().$type<string[]>(),
  featured: boolean("featured").default(false),
  isNew: boolean("is_new").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertProductSchema = createInsertSchema(products).extend({
  discountedPrice: z.number().optional(),
<<<<<<< HEAD:src/shared/schema.ts
  price: z.number(),
=======
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758:shared/schema.ts
  sizes: z.array(z.string()).optional(),
  imageUrls: z.array(z.string()),
  averageRating: z.number().optional(),
  ratingCount: z.number().optional(),
  featured: z.boolean().optional(),
<<<<<<< HEAD:src/shared/schema.ts
  isNew: z.boolean().optional(),
  gender: z.string().optional(),
  brandId: z.number(),
  description: z.string().optional(),
  name: z.string().optional(),
  categoryId: z.number(),
  id: z.number().optional(),
  tempImageUrl: z.string().optional(),
=======
  isNew: z.boolean().optional(),    
  brandId: z.number().optional(),
  name: z.string().optional(),
  categoryId: z.number().optional(),  
  id: z.number().optional(),
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758:shared/schema.ts
});

/* ---------------- INVENTORY ---------------- */
export const inventory = pgTable("inventory", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  size: text("size").notNull(),
  quantity: integer("quantity").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertInventorySchema = createInsertSchema(inventory).extend({
  quantity: z.number().optional(),
});

/* ---------------- REVIEWS ---------------- */
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  userId: integer("user_id").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertReviewSchema = createInsertSchema(reviews).extend({
<<<<<<< HEAD:src/shared/schema.ts
  comment: z.string().optional(),
  userId: z.number().optional(),
  productId: z.number().optional(),
=======
    comment: z.string().optional(),
    userId: z.number().optional(),
    productId: z.number().optional(),
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758:shared/schema.ts
});

/* ---------------- ORDERS ---------------- */
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  email: text("email").notNull(),
  fullName: text("full_name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  postalCode: text("postal_code").notNull(),
  phone: text("phone").notNull(),
  status: text("status").notNull().default("pending"),
  total: doublePrecision("total").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertOrderSchema = createInsertSchema(orders).extend({
  userId: z.number().optional(),
});

/* ---------------- ORDER ITEMS ---------------- */
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  productId: integer("product_id").notNull(),
  size: text("size").notNull(),
  quantity: integer("quantity").notNull(),
  price: doublePrecision("price").notNull(),
});

export const insertOrderItemSchema = createInsertSchema(orderItems);

/* ---------------- WISHLISTS ---------------- */
export const wishlists = pgTable("wishlists", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  productId: integer("product_id").notNull(),
  addedAt: timestamp("added_at").defaultNow(),
});

export const insertWishlistSchema = createInsertSchema(wishlists);


/* ---------------- RETURNS ---------------- */
export const returns = pgTable("returns", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  orderItemId: integer("order_item_id").notNull(),
  reason: text("reason").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertReturnSchema = createInsertSchema(returns).extend({
<<<<<<< HEAD:src/shared/schema.ts
  orderId: z.number(),
=======
    orderId: z.number(),
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758:shared/schema.ts
});;

/* ---------------- RECENTLY VIEWED ---------------- */
export const recentlyViewed = pgTable("recently_viewed", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  productId: integer("product_id").notNull(),
  viewedAt: timestamp("viewed_at").defaultNow(),
});

export const insertRecentlyViewedSchema = createInsertSchema(recentlyViewed);

/* ---------------- USER PREFERENCES ---------------- */
export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  favoriteCategories: json("favorite_categories").notNull().$type<string[]>(),
  favoriteColors: json("favorite_colors").notNull().$type<string[]>(),
  favoriteOccasions: json("favorite_occasions").notNull().$type<string[]>(),
  priceRangeMin: integer("price_range_min"),
  priceRangeMax: integer("price_range_max"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserPreferencesSchema = createInsertSchema(
  userPreferences
).extend({
  favoriteCategories: z.array(z.string()),
  favoriteColors: z.array(z.string()),
  favoriteOccasions: z.array(z.string()),
  priceRangeMin: z.number().optional(),
  priceRangeMax: z.number().optional(),
});

/* ---------------- COLLECTIONS ---------------- */
export const collections = pgTable("collections", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  active: boolean("active").default(true),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCollectionSchema = createInsertSchema(collections).extend({
  imageUrl: z.string().optional(),
  active: z.boolean().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

/* ---------------- PRODUCT COLLECTIONS ---------------- */
export const productCollections = pgTable("product_collections", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  collectionId: integer("collection_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProductCollectionSchema = createInsertSchema(productCollections);


/* ---------------- TYPE EXPORTS ---------------- */

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginUser = z.infer<typeof insertLoginSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Brand = typeof brands.$inferSelect;
export type InsertBrand = z.infer<typeof insertBrandSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

// Product with populated brand and category relations
export type ProductWithRelations = Product & {
  brand?: Brand;
  category?: Category;
};

export type Inventory = typeof inventory.$inferSelect;
export type InsertInventory = z.infer<typeof insertInventorySchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;

export type Wishlist = typeof wishlists.$inferSelect;
export type InsertWishlist = z.infer<typeof insertWishlistSchema>;

export type Return = typeof returns.$inferSelect;
export type InsertReturn = z.infer<typeof insertReturnSchema>;

export type RecentlyViewed = typeof recentlyViewed.$inferSelect;
export type InsertRecentlyViewed = z.infer<typeof insertRecentlyViewedSchema>;

export type UserPreferences = typeof userPreferences.$inferSelect;
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;

export type Collection = typeof collections.$inferSelect;
export type InsertCollection = z.infer<typeof insertCollectionSchema>;

export type ProductCollection = typeof productCollections.$inferSelect;
export type InsertProductCollection = z.infer<typeof insertProductCollectionSchema>;

