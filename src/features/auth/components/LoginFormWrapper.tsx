"use client";

import { Suspense } from "react";
import LoginForm from "./LoginForm";

function LoginFormFallback() {
  return (
    <div className="animate-pulse">
      <div className="mb-4">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-11 bg-gray-200 rounded"></div>
      </div>
      <div className="mb-4">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-11 bg-gray-200 rounded"></div>
      </div>
      <div className="h-11 bg-gray-200 rounded mt-4"></div>
    </div>
  );
}

export default function LoginFormWrapper() {
  return (
    <Suspense fallback={<LoginFormFallback />}>
      <LoginForm />
    </Suspense>
  );
}
