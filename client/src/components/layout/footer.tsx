import { Logo } from "./logo";
import { Link } from "wouter";
import { Facebook, Instagram, Twitter, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div>
            <div className="mb-4">
              <Logo />
            </div>
            <p className="text-gray-400 mb-4">
              India's premier destination for ethnic and traditional wear, offering 
              a rich blend of culture and contemporary fashion.
            </p>
            <div className="flex gap-4">
              <button className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
              </button>
              <button className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </button>
              <button className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </button>
              <button className="text-gray-400 hover:text-white">
                <Mail className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* Shop links */}
          <div>
            <h3 className="text-lg font-medium mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products/women" className="text-gray-400 hover:text-white cursor-pointer">
                  Women's Wear
                </Link>
              </li>
              <li>
                <Link href="/products/men" className="text-gray-400 hover:text-white cursor-pointer">
                  Men's Wear
                </Link>
              </li>
              <li>
                <Link href="/products/new" className="text-gray-400 hover:text-white cursor-pointer">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/products/sale" className="text-gray-400 hover:text-white cursor-pointer">
                  Sale
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Customer service */}
          <div>
            <h3 className="text-lg font-medium mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact">
                  <div className="text-gray-400 hover:text-white cursor-pointer">Contact Us</div>
                </Link>
              </li>
              <li>
                <Link href="/faq">
                  <div className="text-gray-400 hover:text-white cursor-pointer">FAQs</div>
                </Link>
              </li>
              <li>
                <Link href="/returns">
                  <div className="text-gray-400 hover:text-white cursor-pointer">Shipping & Returns</div>
                </Link>
              </li>
              <li>
                <Link href="/size-guide">
                  <div className="text-gray-400 hover:text-white cursor-pointer">Size Guide</div>
                </Link>
              </li>
              <li>
                <Link href="/track-order">
                  <div className="text-gray-400 hover:text-white cursor-pointer">Track Order</div>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* About */}
          <div>
            <h3 className="text-lg font-medium mb-4">About</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/our-story">
                  <div className="text-gray-400 hover:text-white cursor-pointer">Our Story</div>
                </Link>
              </li>
              <li>
                <Link href="/careers">
                  <div className="text-gray-400 hover:text-white cursor-pointer">Careers</div>
                </Link>
              </li>
              <li>
                <Link href="/privacy">
                  <div className="text-gray-400 hover:text-white cursor-pointer">Privacy Policy</div>
                </Link>
              </li>
              <li>
                <Link href="/terms">
                  <div className="text-gray-400 hover:text-white cursor-pointer">Terms & Conditions</div>
                </Link>
              </li>
              <li>
                <Link href="/store-locator">
                  <div className="text-gray-400 hover:text-white cursor-pointer">Store Locator</div>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Newsletter */}
        <div className="border-t border-gray-800 pt-8 pb-4">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-lg font-medium mb-2">Subscribe to our newsletter</h3>
            <p className="text-gray-400 text-sm mb-4">Get the latest updates on new products and upcoming sales</p>
            <form className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email address"
                className="bg-gray-800 border-gray-700"
              />
              <Button type="submit">Subscribe</Button>
            </form>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="text-center text-gray-500 text-sm mt-8">
          <p>&copy; 2023 Kurtis & More. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
