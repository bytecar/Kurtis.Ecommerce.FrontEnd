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
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Shop links */}
          <div>
            <h3 className="text-lg font-medium mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products/women">
                  <a className="text-gray-400 hover:text-white">Women's Wear</a>
                </Link>
              </li>
              <li>
                <Link href="/products/men">
                  <a className="text-gray-400 hover:text-white">Men's Wear</a>
                </Link>
              </li>
              <li>
                <Link href="/products/new">
                  <a className="text-gray-400 hover:text-white">New Arrivals</a>
                </Link>
              </li>
              <li>
                <Link href="/products/sale">
                  <a className="text-gray-400 hover:text-white">Sale</a>
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
                  <a className="text-gray-400 hover:text-white">Contact Us</a>
                </Link>
              </li>
              <li>
                <Link href="/faq">
                  <a className="text-gray-400 hover:text-white">FAQs</a>
                </Link>
              </li>
              <li>
                <Link href="/returns">
                  <a className="text-gray-400 hover:text-white">Shipping & Returns</a>
                </Link>
              </li>
              <li>
                <Link href="/size-guide">
                  <a className="text-gray-400 hover:text-white">Size Guide</a>
                </Link>
              </li>
              <li>
                <Link href="/track-order">
                  <a className="text-gray-400 hover:text-white">Track Order</a>
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
                  <a className="text-gray-400 hover:text-white">Our Story</a>
                </Link>
              </li>
              <li>
                <Link href="/careers">
                  <a className="text-gray-400 hover:text-white">Careers</a>
                </Link>
              </li>
              <li>
                <Link href="/privacy">
                  <a className="text-gray-400 hover:text-white">Privacy Policy</a>
                </Link>
              </li>
              <li>
                <Link href="/terms">
                  <a className="text-gray-400 hover:text-white">Terms & Conditions</a>
                </Link>
              </li>
              <li>
                <Link href="/store-locator">
                  <a className="text-gray-400 hover:text-white">Store Locator</a>
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
