import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Globe, Users, DollarSign, Heart, Leaf } from "lucide-react";

export default function FoodWasteAwareness() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-green-50 to-blue-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            The Global Food Waste Crisis
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Every year, approximately <span className="font-bold text-red-600">1.3 billion tons</span> of food 
            is wasted globally while <span className="font-bold text-orange-600">828 million people</span> go hungry. 
            Together, we can change this.
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-red-500">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-3 rounded-full">
                  <Trash2 className="w-8 h-8 text-red-600" />
                </div>
                <CardTitle className="text-lg">Food Waste Impact</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-3xl font-bold text-red-600">40%</div>
                <p className="text-gray-600">
                  of all food produced globally is wasted, enough to feed 3 billion people
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Globe className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Environmental Cost</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-3xl font-bold text-blue-600">8%</div>
                <p className="text-gray-600">
                  of global greenhouse gas emissions come from food waste
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-3 rounded-full">
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-lg">Economic Loss</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-3xl font-bold text-green-600">$1T</div>
                <p className="text-gray-600">
                  worth of food is wasted annually worldwide
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Why It Matters */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Why Every Meal Matters
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-orange-100 p-3 rounded-full flex-shrink-0">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Human Impact</h4>
                  <p className="text-gray-600">
                    While tons of perfectly good food gets thrown away, millions of people struggle with hunger. 
                    Food rescue directly addresses this injustice by redirecting surplus to those who need it most.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-full flex-shrink-0">
                  <Leaf className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Environmental Protection</h4>
                  <p className="text-gray-600">
                    Food waste in landfills produces methane, a greenhouse gas 25 times more potent than CO2. 
                    By rescuing food, we reduce environmental damage and conserve precious resources like water and land.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Economic Benefits</h4>
                  <p className="text-gray-600">
                    Food providers save money on waste disposal costs while gaining valuable tax deductions. 
                    Communities benefit from increased food security and reduced social services burden.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-3 rounded-full flex-shrink-0">
                  <Heart className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Community Building</h4>
                  <p className="text-gray-600">
                    Food rescue creates connections between businesses and communities, fostering partnerships 
                    that strengthen social bonds and create lasting positive change.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-primary to-green-600 rounded-2xl text-white p-8">
          <h3 className="text-3xl font-bold mb-4">Every Action Counts</h3>
          <p className="text-xl mb-6 opacity-90">
            When we rescue food, we're not just preventing waste – we're feeding families, 
            protecting our planet, and building stronger communities.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">12,000+</div>
              <div className="text-lg opacity-90">Meals Rescued</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">150+</div>
              <div className="text-lg opacity-90">Partner Organizations</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">25 Tons</div>
              <div className="text-lg opacity-90">CO2 Prevented</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}