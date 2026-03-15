import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel = "Delete",
  confirmLoading = false,
  onConfirm,
  onClose,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        <div className="mt-5 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={confirmLoading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={confirmLoading}>
            {confirmLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
