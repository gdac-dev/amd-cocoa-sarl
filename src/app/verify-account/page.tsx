import { Suspense } from "react";
import VerifyAccountForm from "./VerifyAccountForm";

export default function VerifyAccountPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-beige flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <VerifyAccountForm />
    </Suspense>
  );
}
