"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Zap } from "lucide-react";
import { toast } from "sonner";
import {
  auth,
  signInWithEmailAndPassword,
  signInWithPopup,
  googleProvider,
} from "@/lib/firebase";
import { loginUser, getRoleDashboard } from "@/lib/api";
import ParticleBackground from "@/components/landing/ParticleBackground";
import Button from "@/components/ui/Button";

const inputStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: "0.5rem",
  border: "1px solid #222",
  background: "#0d0d0d",
  paddingTop: "0.625rem",
  paddingBottom: "0.625rem",
  paddingLeft: "2.5rem",
  paddingRight: "1rem",
  fontSize: "0.875rem",
  color: "#fff",
  outline: "none",
  transition: "all 0.2s",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "0.5rem",
  fontSize: "0.875rem",
  fontWeight: 500,
  color: "rgba(255,255,255,0.7)",
};

const iconWrapStyle: React.CSSProperties = {
  position: "absolute",
  left: "0.875rem",
  top: "50%",
  transform: "translateY(-50%)",
  pointerEvents: "none",
  color: "rgba(255,255,255,0.3)",
  display: "flex",
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [passFocus, setPassFocus] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const profile = await loginUser({});
      toast.success("Welcome back!");
      router.push(getRoleDashboard(profile.role));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Login failed";
      toast.error(
        message.includes("auth/") ? "Invalid email or password" : message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      const profile = await loginUser({
        name: auth.currentUser?.displayName || undefined,
      });
      toast.success("Welcome!");
      router.push(getRoleDashboard(profile.role));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Google sign-in failed";
      if (!message.includes("popup-closed")) {
        toast.error("Google sign-in failed. Please try again.");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        background: "#0a0a0a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <ParticleBackground />

      <div
        className="grid-bg"
        style={{ position: "absolute", inset: 0, opacity: 0.4, pointerEvents: "none" }}
      />

      {/* Animated glow blobs */}
      <motion.div
        style={{
          position: "absolute",
          top: "20%",
          left: "20%",
          height: "24rem",
          width: "24rem",
          borderRadius: "9999px",
          background: "rgba(232,80,58,0.12)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
        animate={{ x: [0, 60, 0], y: [0, -40, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        style={{
          position: "absolute",
          bottom: "20%",
          right: "20%",
          height: "20rem",
          width: "20rem",
          borderRadius: "9999px",
          background: "rgba(232,80,58,0.08)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
        animate={{ x: [0, -50, 0], y: [0, 40, 0], scale: [1.1, 1, 1.1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 22 }}
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: "28rem",
        }}
      >
        {/* Outer glow */}
        <motion.div
          style={{
            position: "absolute",
            inset: -2,
            borderRadius: "1rem",
            background: "linear-gradient(135deg, rgba(232,80,58,0.4), rgba(232,80,58,0.1), rgba(232,80,58,0.4))",
            filter: "blur(20px)",
            opacity: 0.5,
            pointerEvents: "none",
          }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        <div
          style={{
            position: "relative",
            borderRadius: "1rem",
            border: "1px solid #222",
            background: "rgba(17,17,17,0.95)",
            backdropFilter: "blur(12px)",
            padding: "2.5rem 2rem",
            boxShadow: "0 25px 50px rgba(0,0,0,0.6)",
          }}
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            style={{
              marginBottom: "2rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0], scale: 1.05 }}
              transition={{ duration: 0.5 }}
              style={{
                display: "flex",
                height: "3rem",
                width: "3rem",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "0.75rem",
                background: "#e8503a",
                boxShadow: "0 0 30px rgba(232,80,58,0.5)",
              }}
            >
              <Zap size={24} color="white" />
            </motion.div>
            <div style={{ textAlign: "center" }}>
              <h1
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 900,
                  fontStyle: "italic",
                  color: "#fff",
                  margin: 0,
                }}
              >
                Welcome back
              </h1>
              <p style={{ marginTop: "0.25rem", fontSize: "0.875rem", color: "rgba(255,255,255,0.4)" }}>
                Sign in to your EKAM account
              </p>
            </div>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleEmailLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label style={labelStyle}>Email</label>
              <div style={{ position: "relative" }}>
                <div style={iconWrapStyle}>
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailFocus(true)}
                  onBlur={() => setEmailFocus(false)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  style={{
                    ...inputStyle,
                    borderColor: emailFocus ? "#e8503a" : "#222",
                    boxShadow: emailFocus ? "0 0 0 3px rgba(232,80,58,0.15)" : "none",
                  }}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
            >
              <label style={labelStyle}>Password</label>
              <div style={{ position: "relative" }}>
                <div style={iconWrapStyle}>
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPassFocus(true)}
                  onBlur={() => setPassFocus(false)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  style={{
                    ...inputStyle,
                    paddingRight: "2.5rem",
                    borderColor: passFocus ? "#e8503a" : "#222",
                    boxShadow: passFocus ? "0 0 0 3px rgba(232,80,58,0.15)" : "none",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "0.875rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "rgba(255,255,255,0.4)",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{ marginTop: "0.5rem" }}
            >
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
              >
                Sign In
              </Button>
            </motion.div>
          </form>

          {/* OR divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            style={{
              margin: "1.25rem 0",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <div style={{ flex: 1, height: "1px", background: "#222" }} />
            <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", fontWeight: 500 }}>
              OR
            </span>
            <div style={{ flex: 1, height: "1px", background: "#222" }} />
          </motion.div>

          {/* Google */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.01, borderColor: "rgba(255,255,255,0.4)" }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            style={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              borderRadius: "0.5rem",
              border: "1px solid #333",
              background: "transparent",
              padding: "0.625rem 1rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "rgba(255,255,255,0.8)",
              cursor: googleLoading ? "not-allowed" : "pointer",
              opacity: googleLoading ? 0.5 : 1,
              transition: "all 0.2s",
            }}
          >
            {googleLoading ? (
              <svg style={{ animation: "spin 1s linear infinite", height: "1rem", width: "1rem" }} viewBox="0 0 24 24" fill="none">
                <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg style={{ height: "1rem", width: "1rem" }} viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            )}
            Continue with Google
          </motion.button>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              marginTop: "1.5rem",
              textAlign: "center",
              fontSize: "0.875rem",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            New here?{" "}
            <Link
              href="/signup"
              style={{ color: "#e8503a", fontWeight: 500, transition: "color 0.2s" }}
            >
              Create an account
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
