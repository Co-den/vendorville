import { Suspense } from "react";
import VerifyCodeContent from "./verifyCodeContent";

export default function VerifyCodePage() {
  return (
    <Suspense fallback={<VerifyCodeFallback />}>
      <VerifyCodeContent />
    </Suspense>
  );
}

function VerifyCodeFallback() {
  return (
    <div className="signup-container">
      <div className="form-panel">
        <div
          className="auth-card"
          style={{ textAlign: "center", padding: "60px 32px" }}
        >
          Loading...
        </div>
      </div>
    </div>
  );
}
