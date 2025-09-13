import { useState } from "react";
import Navigation from "../Navigation";

export default function NavigationExample() {
  const [userType, setUserType] = useState<"provider" | "ngo" | null>("provider");

  return (
    <Navigation 
      userType={userType}
      onUserTypeChange={setUserType}
      onAuthClick={() => console.log("Auth clicked")}
    />
  );
}