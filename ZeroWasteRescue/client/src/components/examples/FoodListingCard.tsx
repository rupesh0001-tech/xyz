import FoodListingCard, { type FoodListing } from "../FoodListingCard";

const mockListing: FoodListing = {
  id: "1",
  title: "Fresh Vegetarian Meals",
  description: "25 prepared vegetarian meals with rice, dal, and vegetables. Freshly prepared today.",
  quantity: "25 meals",
  location: "Downtown Hotel, 123 Main St",
  provider: "Grand Plaza Hotel",
  timePosted: "2 hours ago", 
  expiresIn: "4 hours",
  urgency: "high",
  type: "Prepared Meals"
};

export default function FoodListingCardExample() {
  return (
    <div className="p-4 max-w-md">
      <FoodListingCard
        listing={mockListing}
        onContact={(id) => console.log(`Contact clicked for listing ${id}`)}
        onClaim={(id) => console.log(`Claim clicked for listing ${id}`)}
        userType="ngo"
      />
    </div>
  );
}