import { useState } from 'react';
import { useLogout } from '@/hooks/useLogout';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function SidebarLogout() {
  const { logout, loading: logoutLoading } = useLogout();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = async () => {
    setShowConfirm(false);
    await logout();
  };

  return (
    <>
      <div className="p-5 border-t border-border mt-auto">
        <button
          onClick={() => setShowConfirm(true)}
          disabled={logoutLoading}
          className="flex items-center gap-2 text-destructive hover:text-destructive/80 font-medium transition w-full"
        >
          <span className="material-symbols-outlined">logout</span>
          {logoutLoading ? "Déconnexion..." : "Se déconnecter"}
        </button>
      </div>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Déconnexion</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir vous déconnecter ?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirm(false)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
              disabled={logoutLoading}
            >
              {logoutLoading ? "Déconnexion..." : "Oui, me déconnecter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}