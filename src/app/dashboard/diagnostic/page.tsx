import { Suspense } from "react";
import { DiagnosticContent } from "./diagnostic-content";

export default function DiagnosticPage() {
  return (
    <Suspense>
      <DiagnosticContent />
    </Suspense>
  );
}
