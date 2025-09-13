import { Link } from "wouter";
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold text-primary mb-4">ZeroWasteRescue</h3>
            <p className="text-gray-300 mb-4">
              Bridging the gap between food surplus and community need. Together, we can reduce waste and feed communities.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-gray-300 hover:text-primary transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/impact" className="text-gray-300 hover:text-primary transition-colors">
                  Our Impact
                </Link>
              </li>
            </ul>
          </div>

          {/* For Organizations */}
          <div>
            <h4 className="text-lg font-semibold mb-4">For Organizations</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/provider-login" className="text-gray-300 hover:text-primary transition-colors">
                  Food Providers
                </Link>
              </li>
              <li>
                <Link href="/ngo-login" className="text-gray-300 hover:text-primary transition-colors">
                  NGOs & Charities
                </Link>
              </li>
              <li>
                <Link href="/partnerships" className="text-gray-300 hover:text-primary transition-colors">
                  Partnerships
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-gray-300 hover:text-primary transition-colors">
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-gray-300">contact@zerowasterescue.org</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-gray-300">123 Community Street, City, State 12345</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <span className="text-gray-300">Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span className="text-gray-300">for a sustainable future</span>
            </div>
            <div className="flex flex-col md:flex-row gap-4 text-gray-400 text-sm">
              <a href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="/terms" className="hover:text-primary transition-colors">Terms of Service</a>
              <span>&copy; 2024 ZeroWasteRescue. All rights reserved.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}