import OpenAI from "openai";
import { Product } from "@shared/schema";

// Initialize the OpenAI client
// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Generate personalized product recommendations based on user preferences and product attributes
 */
export async function getAIRecommendations(
  product: Product,
  allProducts: Product[],
  userPreferences?: {
    favoriteCategories?: string[];
    favoriteColors?: string[];
    priceRange?: { min: number; max: number };
    previouslyViewed?: number[];
    pastPurchases?: number[];
  }
): Promise<Product[]> {
  try {
    // Exclude the current product from recommendations
    const otherProducts = allProducts.filter(p => p.id !== product.id);

    // Create a more detailed prompt with product and user data
    const prompt = `
      As an AI shopping assistant for an ethnic clothing store, recommend 5 products based on the following:
      
      CURRENT PRODUCT:
      - Name: ${product.name}
      - Category: ${product.category}
      - Brand: ${product.brand}
      - Gender: ${product.gender}
      - Price: ${product.price}
      - Description: ${product.description}
      
      ${userPreferences ? `USER PREFERENCES:
      - Favorite Categories: ${userPreferences.favoriteCategories?.join(', ') || 'Not specified'}
      - Favorite Colors: ${userPreferences.favoriteColors?.join(', ') || 'Not specified'}
      - Preferred Price Range: ${userPreferences.priceRange ? `Rs.${userPreferences.priceRange.min} - Rs.${userPreferences.priceRange.max}` : 'Not specified'}
      - Previously Viewed Product IDs: ${userPreferences.previouslyViewed?.join(', ') || 'None'}
      - Past Purchases Product IDs: ${userPreferences.pastPurchases?.join(', ') || 'None'}` : ''}
      
      AVAILABLE PRODUCTS (ID | Name | Category | Brand | Gender | Price):
      ${otherProducts.slice(0, 30).map(p => 
        `${p.id} | ${p.name} | ${p.category} | ${p.brand} | ${p.gender} | ${p.price}`
      ).join('\n')}
      
      Provide recommendations based on:
      1. Items that complement the current product
      2. Items from similar categories that the user might like
      3. Items from the same brand with a different style
      4. Items that match the user's preferences
      5. Trending items in similar categories
      
      Return ONLY a JSON array of product IDs from the available products, like: [12, 45, 67, 89, 23]
      Make sure all recommendations are from the AVAILABLE PRODUCTS list.
      Choose only 5 products maximum, in order of relevance.
    `;

    // Make the OpenAI API request
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an AI shopping assistant for an ethnic clothing store. Your recommendations should help users discover complementary products that enhance their shopping experience."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 500,
    });

    // Parse the response
    const content = response.choices[0].message.content;
    if (!content) {
      return getDefaultRecommendations(product, allProducts);
    }

    try {
      const responseJson = JSON.parse(content);
      const recommendedIds = responseJson.hasOwnProperty('recommendations') 
        ? responseJson.recommendations 
        : Array.isArray(responseJson) ? responseJson : [];
      
      // Filter products based on the recommended IDs
      const recommendedProducts = allProducts.filter(p => 
        recommendedIds.includes(p.id)
      ).slice(0, 5);

      // If we didn't get enough recommendations, fill with default ones
      if (recommendedProducts.length < 5) {
        const defaultRecs = getDefaultRecommendations(
          product, 
          allProducts.filter(p => !recommendedProducts.some(rp => rp.id === p.id))
        );
        
        return [...recommendedProducts, ...defaultRecs].slice(0, 5);
      }

      return recommendedProducts;
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError);
      return getDefaultRecommendations(product, allProducts);
    }
  } catch (error) {
    console.error("OpenAI API error:", error);
    // Fallback to non-AI recommendations if OpenAI fails
    return getDefaultRecommendations(product, allProducts);
  }
}

/**
 * Generate a list of similar products based on text similarity
 */
export async function getSemanticRecommendations(
  searchQuery: string,
  allProducts: Product[],
  limit: number = 6
): Promise<Product[]> {
  try {
    // Create a prompt for semantic search
    const prompt = `
      As an AI shopping assistant for an ethnic clothing store, find products that match this search query: "${searchQuery}"
      
      AVAILABLE PRODUCTS (ID | Name | Category | Brand | Gender | Description):
      ${allProducts.slice(0, 50).map(p => 
        `${p.id} | ${p.name} | ${p.category} | ${p.brand} | ${p.gender} | ${p.description}`
      ).join('\n')}
      
      Return ONLY a JSON array of product IDs from the available products, like: [12, 45, 67, 89, 23]
      Choose products that semantically match the search query, considering style, occasion, color, fabric, etc.
      Return up to ${limit} matches, ranked by relevance.
    `;

    // Make the OpenAI API request
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an AI shopping assistant for an ethnic clothing store. Your task is to find products that match a user's search query based on semantic relevance."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 500,
    });

    // Parse the response
    const content = response.choices[0].message.content;
    if (!content) {
      return [];
    }

    try {
      const responseJson = JSON.parse(content);
      const matchedIds = responseJson.hasOwnProperty('matches') 
        ? responseJson.matches 
        : Array.isArray(responseJson) ? responseJson : [];
      
      // Filter products based on the matched IDs
      return allProducts.filter(p => matchedIds.includes(p.id)).slice(0, limit);
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError);
      return [];
    }
  } catch (error) {
    console.error("OpenAI API error:", error);
    return [];
  }
}

/**
 * Get personalized collection recommendations based on user preferences
 */
export async function getPersonalizedCollections(
  allProducts: Product[],
  userPreferences?: {
    favoriteCategories?: string[];
    seasonalPreference?: string;
    occasion?: string; 
    gender?: string;
    priceRange?: { min: number; max: number };
  }
): Promise<{
  name: string;
  description: string;
  products: Product[];
}[]> {
  try {
    // Create a prompt for personalized collections
    const prompt = `
      As an AI shopping assistant for an ethnic clothing store, create 3 personalized collections for a user.
      
      ${userPreferences ? `USER PREFERENCES:
      - Favorite Categories: ${userPreferences.favoriteCategories?.join(', ') || 'Not specified'}
      - Seasonal Preference: ${userPreferences.seasonalPreference || 'Not specified'}
      - Occasion: ${userPreferences.occasion || 'Not specified'}
      - Gender: ${userPreferences.gender || 'Not specified'}
      - Preferred Price Range: ${userPreferences.priceRange ? `Rs.${userPreferences.priceRange.min} - Rs.${userPreferences.priceRange.max}` : 'Not specified'}` : ''}
      
      AVAILABLE PRODUCTS (ID | Name | Category | Brand | Gender | Price):
      ${allProducts.slice(0, 50).map(p => 
        `${p.id} | ${p.name} | ${p.category} | ${p.brand} | ${p.gender} | ${p.price}`
      ).join('\n')}
      
      Create 3 themed collections that would appeal to this user. Each collection should have:
      1. A catchy name (e.g. "Festival Ready", "Summer Essentials")
      2. A brief description of the collection
      3. A list of 4-6 product IDs from the available products that fit the collection theme
      
      Return a JSON object with an array of collections, following this format:
      {
        "collections": [
          {
            "name": "Collection Name",
            "description": "Brief description of the collection theme",
            "productIds": [12, 45, 67, 89]
          },
          ...
        ]
      }
    `;

    // Make the OpenAI API request
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an AI shopping assistant for an ethnic clothing store. Your task is to create personalized collections that match a user's preferences."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000,
    });

    // Parse the response
    const content = response.choices[0].message.content;
    if (!content) {
      return getDefaultCollections(allProducts);
    }

    try {
      const responseJson = JSON.parse(content);
      const collections = responseJson.collections || [];
      
      return collections.map(collection => {
        const collectionProducts = allProducts.filter(p => 
          collection.productIds?.includes(p.id)
        ).slice(0, 6);
        
        return {
          name: collection.name,
          description: collection.description,
          products: collectionProducts
        };
      });
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError);
      return getDefaultCollections(allProducts);
    }
  } catch (error) {
    console.error("OpenAI API error:", error);
    return getDefaultCollections(allProducts);
  }
}

// Default recommendation function (non-AI fallback)
function getDefaultRecommendations(product: Product, allProducts: Product[]): Product[] {
  // Get products of the same category
  const sameCategory = allProducts.filter(p => 
    p.id !== product.id && p.category === product.category
  ).slice(0, 2);
  
  // Get products of the same brand
  const sameBrand = allProducts.filter(p => 
    p.id !== product.id && 
    p.brand === product.brand && 
    !sameCategory.some(c => c.id === p.id)
  ).slice(0, 1);
  
  // Get products of the same gender
  const sameGender = allProducts.filter(p => 
    p.id !== product.id && 
    p.gender === product.gender && 
    !sameCategory.some(c => c.id === p.id) && 
    !sameBrand.some(b => b.id === p.id)
  ).slice(0, 2);
  
  // Combine recommendations
  return [...sameCategory, ...sameBrand, ...sameGender].slice(0, 5);
}

// Default collections function (non-AI fallback)
function getDefaultCollections(allProducts: Product[]): {
  name: string;
  description: string;
  products: Product[];
}[] {
  // Create Festival Collection
  const festivalCollection = {
    name: "Festival Ready",
    description: "Elegant ethnic wear for celebrating special occasions in style",
    products: allProducts.filter(p => 
      p.category === "lehengas" || p.category === "sarees" || p.category === "sherwanis"
    ).slice(0, 5)
  };
  
  // Create Casual Collection
  const casualCollection = {
    name: "Everyday Elegance",
    description: "Comfortable yet stylish ethnic wear for your daily wardrobe",
    products: allProducts.filter(p => 
      p.category === "kurtas" || p.category === "kurtis" || p.category === "tops"
    ).slice(0, 5)
  };
  
  // Create Accessories Collection
  const accessoriesCollection = {
    name: "Complete Your Look",
    description: "Essential accessories to complement your ethnic outfit",
    products: allProducts.filter(p => 
      p.category === "jewelry" || p.category === "footwear" || p.category === "bags"
    ).slice(0, 5)
  };
  
  return [festivalCollection, casualCollection, accessoriesCollection];
}