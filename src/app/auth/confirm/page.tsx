import { Suspense } from "react";
import { ConfirmContent } from "./confirm-content";

export default function ConfirmPage() {
  return (
    <Suspense>
      <ConfirmContent />
    </Suspense>
  );
}
