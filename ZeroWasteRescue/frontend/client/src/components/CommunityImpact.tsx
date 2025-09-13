import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Heart, 
  Leaf, 
  Building2, 
  Quote,
  Star,
  ArrowRight,
  Globe
} from "lucide-react";

export default function CommunityImpact() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-green-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Real Impact, Real Stories
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how ZeroWasteRescue is making a difference in communities across the globe
          </p>
        </div>

        {/* Impact Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="bg-white rounded-full p-4 shadow-lg inline-flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <div className="text-3xl font-bold text-gray-900">50,000+</div>
            <div className="text-gray-600">People Fed</div>
          </div>

          <div className="text-center">
            <div className="bg-white rounded-full p-4 shadow-lg inline-flex items-center justify-center mb-4">
              <Leaf className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">500</div>
            <div className="text-gray-600">Tons Saved</div>
          </div>

          <div className="text-center">
            <div className="bg-white rounded-full p-4 shadow-lg inline-flex items-center justify-center mb-4">
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">200+</div>
            <div className="text-gray-600">Partners</div>
          </div>

          <div className="text-center">
            <div className="bg-white rounded-full p-4 shadow-lg inline-flex items-center justify-center mb-4">
              <Globe className="w-8 h-8 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">25</div>
            <div className="text-gray-600">Cities</div>
          </div>
        </div>

        {/* Success Stories */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Success Stories
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Story 1 */}
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  <Quote className="w-8 h-8 text-primary" />
                  <div className="flex">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                <CardTitle className="text-lg">"Transforming Our Community"</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  "Through ZeroWasteRescue, our food bank now receives fresh meals daily from 
                  local restaurants. We've been able to serve 300% more families while reducing 
                  food costs by 80%."
                </p>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 rounded-full p-2">
                    <Heart className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Sarah Martinez</div>
                    <div className="text-xs text-gray-500">Director, City Food Bank</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Story 2 */}
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  <Quote className="w-8 h-8 text-green-600" />
                  <div className="flex">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                <CardTitle className="text-lg">"Reducing Waste & Costs"</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  "As a hotel chain, we were throwing away tons of perfectly good food. 
                  Now we rescue it all through the platform, saving $50,000 annually in 
                  disposal costs while helping our community."
                </p>
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 rounded-full p-2">
                    <Building2 className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Michael Chen</div>
                    <div className="text-xs text-gray-500">GM, Grand Plaza Hotels</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Story 3 */}
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  <Quote className="w-8 h-8 text-purple-600" />
                  <div className="flex">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                <CardTitle className="text-lg">"Building Partnerships"</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  "The platform connected us with amazing local businesses. These partnerships 
                  have grown beyond food rescue - we now collaborate on community events and 
                  volunteer programs."
                </p>
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 rounded-full p-2">
                    <Users className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Amanda Rodriguez</div>
                    <div className="text-xs text-gray-500">Volunteer Coordinator</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Environmental Impact */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Environmental Impact
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Leaf className="w-10 h-10 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">2,500 Tons</div>
              <div className="text-gray-600 font-medium mb-2">CO2 Prevented</div>
              <p className="text-sm text-gray-500">
                Equivalent to taking 500 cars off the road for a year
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Globe className="w-10 h-10 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-2">50M Gallons</div>
              <div className="text-gray-600 font-medium mb-2">Water Saved</div>
              <p className="text-sm text-gray-500">
                Enough to supply 1,500 households for a year
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Building2 className="w-10 h-10 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-orange-600 mb-2">1,000 Acres</div>
              <div className="text-gray-600 font-medium mb-2">Land Preserved</div>
              <p className="text-sm text-gray-500">
                Agricultural land saved from unnecessary production
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-primary to-blue-600 rounded-2xl text-white p-8">
          <h3 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h3>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of organizations already making an impact in their communities
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-primary">
              Become a Food Provider
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              Join as an NGO
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}