import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  MapPin, 
  MessageCircle, 
  Shield, 
  TrendingUp, 
  Users,
  Smartphone,
  CheckCircle,
  ArrowRight
} from "lucide-react";

export default function FeaturesSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            How ZeroWasteRescue Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform makes food rescue simple, efficient, and impactful for everyone involved
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Register Surplus Food</h3>
            <p className="text-gray-600">
              Food providers quickly list available surplus food with details about quantity, 
              location, and pickup requirements
            </p>
          </div>

          <div className="text-center">
            <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">NGOs Claim & Coordinate</h3>
            <p className="text-gray-600">
              Verified NGOs browse available food, claim listings, and coordinate pickup 
              times directly with providers
            </p>
          </div>

          <div className="text-center">
            <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Track & Distribute</h3>
            <p className="text-gray-600">
              Real-time status tracking ensures smooth coordination while rescued food 
              reaches communities in need
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Real-Time Coordination</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Live status updates keep everyone informed throughout the rescue process, 
                from listing to delivery completion.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">Location-Based Matching</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Smart location filtering connects nearby food providers with local NGOs 
                for efficient and timely pickup coordination.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <MessageCircle className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Direct Communication</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Built-in messaging system enables direct communication between providers 
                and NGOs for seamless coordination.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded-lg">
                  <Shield className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle className="text-lg">Verified Organizations</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                All NGOs undergo verification to ensure food reaches legitimate 
                organizations serving communities in need.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle className="text-lg">Impact Tracking</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Comprehensive analytics help organizations track their social and 
                environmental impact over time.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-cyan-100 p-2 rounded-lg">
                  <Smartphone className="w-6 h-6 text-cyan-600" />
                </div>
                <CardTitle className="text-lg">Mobile-Friendly</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Responsive design ensures the platform works seamlessly on any device, 
                making food rescue accessible anywhere.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Section */}
        <div className="bg-gray-50 rounded-2xl p-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Benefits for Everyone
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* For Providers */}
            <div>
              <h4 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                For Food Providers
              </h4>
              <ul className="space-y-3">
                {[
                  "Reduce waste disposal costs",
                  "Gain valuable tax deductions", 
                  "Enhance corporate social responsibility",
                  "Build community partnerships",
                  "Easy-to-use registration process",
                  "Real-time pickup coordination"
                ].map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* For NGOs */}
            <div>
              <h4 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                For NGOs & Charities
              </h4>
              <ul className="space-y-3">
                {[
                  "Access to fresh, quality food donations",
                  "Efficient food sourcing and logistics",
                  "Serve more community members",
                  "Build relationships with local businesses", 
                  "Track and report social impact",
                  "Professional verification system"
                ].map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}