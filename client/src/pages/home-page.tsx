import { useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatedHeading } from "@/components/ui/animated-heading";

export default function HomePage() {
  // Fetch featured products
  const { data: featuredProducts, isLoading: isFeaturedLoading } = useQuery<Product[]>({
    queryKey: ["/api/products/featured"],
  });
  
  // Fetch new arrivals
  const { data: newArrivals, isLoading: isNewLoading } = useQuery<Product[]>({
    queryKey: ["/api/products/new"],
  });

  // Hero banner images
  const heroBanner = "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8d29tZW4ncyBpbmRpYW4gZXRobmljIGRyZXNzZXN8fHx8fHwxNzE4NTU3NTcz&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080";

  // Categories images
  const categories = [
    { 
      name: "Kurtis", 
      image: "https://images.unsplash.com/photo-1610189025554-708a149676b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8d29tZW4ncyBpbmRpYW4gZXRobmljIGRyZXNzZXN8fHx8fHwxNzE4NTU3Njk2&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
      count: "500+",
      href: "/products/women?category=kurtis"
    },
    { 
      name: "Sarees", 
      image: "https://images.unsplash.com/photo-1636628266722-d5448ca44f5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8d29tZW4ncyBpbmRpYW4gZXRobmljIGRyZXNzZXN8fHx8fHwxNzE4NTU3Njk3&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
      count: "300+",
      href: "/products/women?category=sarees"
    },
    { 
      name: "Men's Kurta", 
      image: "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8bWVuJ3MgdHJhZGl0aW9uYWwgY2xvdGhpbmd8fHx8fHwxNzE4NTU3Njk4&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
      count: "250+",
      href: "/products/men?category=kurta-sets"
    },
    { 
      name: "Lehengas", 
      image: "https://images.unsplash.com/photo-1623000963328-6eb604d3f15f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8ZmFzaGlvbiBtb2RlbHMgd2l0aCBldGhuaWMgd2Vhcnx8fHx8fDE3MTg1NTc2OTg&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
      count: "200+",
      href: "/products/women?category=lehengas"
    }
  ];

  // Collections
  const collections = [
    {
      name: "Festival Collection",
      description: "Celebrate in style",
      image: "https://images.unsplash.com/photo-1578148541106-219e9b56eb28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8d29tZW4ncyBpbmRpYW4gZXRobmljIGRyZXNzZXN8fHx8fHwxNzE4NTU3NzA0&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
      href: "/products/women?collection=festival"
    },
    {
      name: "Summer Essentials",
      description: "Light & breathable fabrics",
      image: "https://images.unsplash.com/photo-1594387903898-7d1235079332?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8d29tZW4ncyBpbmRpYW4gZXRobmljIGRyZXNzZXN8fHx8fHwxNzE4NTU3NzAy&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
      href: "/products/women?collection=summer"
    },
    {
      name: "Men's Collection",
      description: "Modern & traditional styles",
      image: "https://images.unsplash.com/photo-1625301840055-7c4d6f04b5d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8bWVuJ3MgdHJhZGl0aW9uYWwgY2xvdGhpbmd8fHx8fHwxNzE4NTU3NzAz&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
      href: "/products/men"
    }
  ];

  // Testimonials
  const testimonials = [
    {
      text: "I've been shopping with Kurtis & More for over a year and I'm always impressed with the quality and craftsmanship. The fabrics are beautiful and the fit is always perfect.",
      name: "Priya S.",
      location: "Delhi",
      image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=100&ixlib=rb-4.0.3&q=80&w=100"
    },
    {
      text: "The customer service is exceptional. I had an issue with sizing and they made the exchange process so easy. The kurta I purchased has become my go-to for special occasions.",
      name: "Rahul M.",
      location: "Mumbai",
      image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=100&ixlib=rb-4.0.3&q=80&w=100" 
    },
    {
      text: "I'm so impressed with the variety of designs and styles. Everything is so unique and well-made. The shipping is fast and the packaging is beautiful. Will definitely be a repeat customer!",
      name: "Ananya K.",
      location: "Bangalore",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=100&ixlib=rb-4.0.3&q=80&w=100"
    }
  ];

  // Features
  const features = [
    {
      icon: "truck",
      title: "Free Shipping",
      description: "On orders above ₹999"
    },
    {
      icon: "arrow-go-back",
      title: "Easy Returns",
      description: "30-day return policy"
    },
    {
      icon: "secure-payment",
      title: "Secure Payment",
      description: "Safe & trusted checkout"
    },
    {
      icon: "customer-service-2",
      title: "24/7 Support",
      description: "Dedicated customer service"
    }
  ];

  useEffect(() => {
    // Set page title
    document.title = "Kurtis & More | Ethnic Wear for All";
  }, []);

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative overflow-hidden">
        <div className="relative h-[60vh] md:h-[70vh]">
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/20 z-10"></div>
          <img 
            src={heroBanner}
            alt="Women in traditional Indian ethnic wear" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="container mx-auto px-4 h-full flex items-center relative z-20">
            <div className="max-w-lg">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight">
                Embrace Your <br /><span className="text-primary/80">Cultural Elegance</span>
              </h1>
              <p className="text-white text-lg mt-4 mb-8">
                Discover our latest collection of traditional and contemporary ethnic wear
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/products/women">
                  <Button size="lg" className="text-base">
                    Shop Women
                  </Button>
                </Link>
                <Link href="/products/men">
                  <Button size="lg" variant="outline" className="bg-white text-primary hover:bg-gray-100 border-0 text-base">
                    Shop Men
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-10 group">
            <AnimatedHeading center>Shop By Category</AnimatedHeading>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category, index) => (
              <Link key={index} href={category.href}>
                <a className="group">
                  <div className="relative rounded-lg overflow-hidden aspect-square">
                    <img 
                      src={category.image}
                      alt={category.name} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-medium text-lg">{category.name}</h3>
                      <p className="text-white/80 text-sm">{category.count} Products</p>
                    </div>
                  </div>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8 group">
            <AnimatedHeading>Featured Products</AnimatedHeading>
            <Link href="/products/featured">
              <a className="text-primary hover:text-primary/80 flex items-center gap-1 transition-all duration-300 hover:translate-x-1">
                View All
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </a>
            </Link>
          </div>
          
          {isFeaturedLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {Array(4).fill(0).map((_, index) => (
                <div key={index} className="space-y-4">
                  <Skeleton className="h-64 md:h-72 w-full rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ProductGrid products={featuredProducts || []} />
          )}
        </div>
      </section>

      {/* Collections */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-10 group">
            <AnimatedHeading center>Shop By Collections</AnimatedHeading>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {collections.map((collection, index) => (
              <Link key={index} href={collection.href}>
                <a className="group block relative rounded-lg overflow-hidden h-80">
                  <img 
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-white text-2xl font-medium mb-2">{collection.name}</h3>
                    <p className="text-white/90 mb-4">{collection.description}</p>
                    <span className="inline-block bg-white text-primary px-4 py-2 rounded-md font-medium group-hover:bg-primary group-hover:text-white transition-colors">
                      Explore Now
                    </span>
                  </div>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8 group">
            <AnimatedHeading>New Arrivals</AnimatedHeading>
            <Link href="/products/new">
              <a className="text-primary hover:text-primary/80 flex items-center gap-1 transition-all duration-300 hover:translate-x-1">
                View All
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </a>
            </Link>
          </div>
          
          {isNewLoading ? (
            <Carousel>
              <CarouselContent>
                {Array(6).fill(0).map((_, index) => (
                  <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/4">
                    <div className="p-1">
                      <Skeleton className="h-64 w-full rounded-lg" />
                      <div className="mt-4 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          ) : (
            <Carousel>
              <CarouselContent>
                {(newArrivals || []).map((product) => (
                  <CarouselItem key={product.id} className="md:basis-1/3 lg:basis-1/4">
                    <div className="p-1">
                      <ProductCard 
                        product={product}
                        onQuickView={(product) => {
                          // Quick view functionality would be added here
                          console.log("Quick view", product.id);
                        }}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 group">
            <AnimatedHeading center className="mb-3">What Our Customers Say</AnimatedHeading>
            <p className="text-gray-600 max-w-2xl mx-auto">See why thousands of customers love shopping with us</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 group">
                <div className="flex text-amber-400 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current transition-transform duration-300 group-hover:scale-110" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-4 transition-colors duration-300 group-hover:text-gray-700">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden mr-3 transition-transform duration-500 group-hover:scale-105">
                    <img 
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium transition-colors duration-300 group-hover:text-primary">{testimonial.name}</h4>
                    <p className="text-gray-500 text-sm">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group transition-all duration-300 hover:-translate-y-1 py-4">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:bg-primary/20 group-hover:shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 transition-all duration-500 group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {feature.icon === "truck" && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 100-4h14a2 2 0 100 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    )}
                    {feature.icon === "arrow-go-back" && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    )}
                    {feature.icon === "secure-payment" && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    )}
                    {feature.icon === "customer-service-2" && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    )}
                  </svg>
                </div>
                <h3 className="font-medium mb-2 transition-colors duration-300 group-hover:text-primary">{feature.title}</h3>
                <p className="text-gray-600 text-sm transition-all duration-500 group-hover:text-gray-800">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center group">
            <AnimatedHeading center className="mb-3 text-white before:bg-white">Join Our Newsletter</AnimatedHeading>
            <p className="mb-6 opacity-90">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="bg-white/10 border border-white/30 rounded-md px-4 py-3 flex-grow focus:outline-none focus:bg-white/20 placeholder-white/75"
              />
              <Button 
                type="submit" 
                variant="secondary" 
                className="bg-white text-primary hover:bg-white/90 transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
