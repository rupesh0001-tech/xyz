import FoodRegistrationForm from "../FoodRegistrationForm";

export default function FoodRegistrationFormExample() {
  return (
    <div className="p-4 min-h-screen bg-background">
      <FoodRegistrationForm
        onSubmit={(data) => console.log("Registration submitted:", data)}
        onCancel={() => console.log("Registration cancelled")}
      />
    </div>
  );
}