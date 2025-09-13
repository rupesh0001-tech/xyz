import UserTypeSelector from "../UserTypeSelector";

export default function UserTypeSelectorExample() {
  return (
    <div className="min-h-screen bg-background">
      <UserTypeSelector
        onSelectType={(type) => console.log(`Selected type: ${type}`)}
      />
    </div>
  );
}