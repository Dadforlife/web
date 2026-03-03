"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Download, RotateCcw } from "lucide-react";
import { exportPaymentsCSV, refundPayment } from "./actions";

export function ExportCSVButton() {
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);
    try {
      const { csv, filename } = await exportPaymentsCSV();
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleExport} disabled={loading}>
      <Download className="h-4 w-4 mr-2" />
      {loading ? "Export…" : "Exporter CSV"}
    </Button>
  );
}

export function RefundButton({ paymentId }: { paymentId: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleRefund() {
    setLoading(true);
    try {
      await refundPayment(paymentId);
      setOpen(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <RotateCcw className="h-4 w-4 mr-1" />
        Rembourser
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Confirmer le remboursement"
        description="Êtes-vous sûr de vouloir rembourser ce paiement ? Cette action est irréversible."
        confirmLabel="Rembourser"
        variant="destructive"
        loading={loading}
        onConfirm={handleRefund}
      />
    </>
  );
}
