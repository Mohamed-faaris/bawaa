import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import type { Id } from "@bawaa/convex-db/convex/_generated/dataModel";

interface AuthContextValue {
  accountId: Id<"accounts"> | null;
  profileId: string | null;
  isAuthenticated: boolean;
  login: (id: string) => void;
  logout: () => void;
  setProfileId: (id: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accountId, setAccountId] = useState<Id<"accounts"> | null>(() =>
    localStorage.getItem("accountId") as Id<"accounts"> | null
  );
  const [profileId, setProfileId] = useState<string | null>(() =>
    localStorage.getItem("profileId")
  );

  useEffect(() => {
    const sync = () => {
      setAccountId(localStorage.getItem("accountId") as Id<"accounts"> | null);
      setProfileId(localStorage.getItem("profileId"));
    };
    window.addEventListener("storage", sync);
    window.addEventListener("fcm:login", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("fcm:login", sync);
    };
  }, []);

  const login = (id: string) => {
    localStorage.setItem("accountId", id);
    setAccountId(id as Id<"accounts">);
  };

  const logout = () => {
    localStorage.removeItem("accountId");
    localStorage.removeItem("profileId");
    setAccountId(null);
    setProfileId(null);
  };

  return (
    <AuthContext.Provider
      value={{
        accountId,
        profileId,
        isAuthenticated: !!accountId,
        login,
        logout,
        setProfileId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
