import HeroSection from "../HeroSection";

export default function HeroSectionExample() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection 
        onGetStarted={() => console.log("Get started clicked")}
        userType="provider"
      />
    </div>
  );
}