import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X, MapPin, Clock, Utensils } from "lucide-react";

interface FoodRegistrationFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function FoodRegistrationForm({ onSubmit, onCancel }: FoodRegistrationFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    quantity: "",
    location: "",
    foodType: "",
    expiresIn: "",
    urgency: "medium",
    contactInfo: "",
    specialInstructions: ""
  });

  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", { ...formData, tags });
    onSubmit({ ...formData, tags });
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Utensils className="w-5 h-5 text-primary" />
          Register Food for Donation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Food Title*</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="e.g., Fresh Vegetarian Meals"
                required
                data-testid="input-title"
              />
            </div>

            <div>
              <Label htmlFor="description">Description*</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Describe the food items, ingredients, preparation method..."
                required
                data-testid="input-description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity">Quantity*</Label>
                <Input
                  id="quantity"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  placeholder="e.g., 25 meals, 5kg rice"
                  required
                  data-testid="input-quantity"
                />
              </div>

              <div>
                <Label htmlFor="foodType">Food Type*</Label>
                <Select value={formData.foodType} onValueChange={(value) => setFormData({...formData, foodType: value})}>
                  <SelectTrigger data-testid="select-food-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prepared-meals">Prepared Meals</SelectItem>
                    <SelectItem value="raw-ingredients">Raw Ingredients</SelectItem>
                    <SelectItem value="packaged-food">Packaged Food</SelectItem>
                    <SelectItem value="beverages">Beverages</SelectItem>
                    <SelectItem value="baked-goods">Baked Goods</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Location and Timing */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Pickup Location*
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="Full address including landmark"
                required
                data-testid="input-location"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiresIn" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Expires In*
                </Label>
                <Select value={formData.expiresIn} onValueChange={(value) => setFormData({...formData, expiresIn: value})}>
                  <SelectTrigger data-testid="select-expires">
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2-hours">2 hours</SelectItem>
                    <SelectItem value="4-hours">4 hours</SelectItem>
                    <SelectItem value="6-hours">6 hours</SelectItem>
                    <SelectItem value="12-hours">12 hours</SelectItem>
                    <SelectItem value="1-day">1 day</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="urgency">Priority Level*</Label>
                <Select value={formData.urgency} onValueChange={(value) => setFormData({...formData, urgency: value})}>
                  <SelectTrigger data-testid="select-urgency">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Flexible timing</SelectItem>
                    <SelectItem value="medium">Medium - Same day</SelectItem>
                    <SelectItem value="high">High - Urgent pickup</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <Label>Tags (Optional)</Label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add tags like 'halal', 'vegan'..."
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                data-testid="input-tag"
              />
              <Button type="button" variant="outline" size="icon" onClick={addTag} data-testid="button-add-tag">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full"
                      data-testid={`button-remove-tag-${index}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div>
            <Label htmlFor="contactInfo">Contact Information*</Label>
            <Input
              id="contactInfo"
              value={formData.contactInfo}
              onChange={(e) => setFormData({...formData, contactInfo: e.target.value})}
              placeholder="Phone number or email for coordination"
              required
              data-testid="input-contact"
            />
          </div>

          {/* Special Instructions */}
          <div>
            <Label htmlFor="specialInstructions">Special Instructions</Label>
            <Textarea
              id="specialInstructions"
              value={formData.specialInstructions}
              onChange={(e) => setFormData({...formData, specialInstructions: e.target.value})}
              placeholder="Any special handling, storage requirements, or pickup instructions..."
              data-testid="input-instructions"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1" data-testid="button-submit">
              Register Food Donation
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} data-testid="button-cancel">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}