"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

function LoginForm() {
  const t = useTranslations("Auth");
  const { login } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [role, setRole] = useState<"USER" | "VENDOR">("USER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [demoOtp, setDemoOtp] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!/^\d{10}$/.test(phone)) {
      setError(t("invalid_phone"));
      return;
    }
    setLoading(true);
    try {
      const res = await api.requestOtp(phone);
      setDemoOtp(res.otp || "");
      setStep("otp");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t("invalid_phone"));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!/^\d{6}$/.test(otp)) {
      setError(t("invalid_otp"));
      return;
    }
    setLoading(true);
    try {
      const res = await api.verifyOtp(phone, otp, role);
      const user = res.user as unknown as Parameters<typeof login>[1];
      
      login(res.accessToken, user);
      const next = new URLSearchParams(window.location.search).get('next');
      if (next?.startsWith('/') && !next.startsWith('//') && !next.includes('\\')) {
        router.push(next);
      } else if (user.role === "VENDOR") {
        if (user.hasKyc) {
          router.push("/vendor/dashboard");
        } else {
          router.push("/pandas/register");
        }
      } else {
        router.push("/");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t("invalid_otp"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
        background:
          "radial-gradient(ellipse at 50% 0%, rgba(201,64,10,0.12) 0%, transparent 60%)",
      }}
    >
      <div style={{ width: "100%", maxWidth: "420px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              fontSize: "3rem",
              marginBottom: "0.5rem",
            }}
          >
            🕉️
          </div>
          <h1
            className="nav-logo"
            style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}
          >
            मंगलम विंध्याचल
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem", fontFamily: "var(--font-devanagari)" }}>
            {step === "phone" ? t("login_title") : t("otp_sent_to", { phone })}
          </p>
        </div>

        <div className="card animate-fade-in">
          {/* Role selector */}
          {step === "phone" && (
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                marginBottom: "1.5rem",
                background: "var(--color-bg)",
                padding: "4px",
                borderRadius: "var(--radius-full)",
              }}
            >
              {(["USER", "VENDOR"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className="btn"
                  style={{
                    flex: 1,
                    padding: "0.5rem",
                    fontSize: "0.875rem",
                    borderRadius: "var(--radius-full)",
                    background:
                      role === r ? "var(--gradient-brand)" : "transparent",
                    color:
                      role === r ? "white" : "var(--color-text-secondary)",
                    boxShadow: role === r ? "var(--shadow-button)" : "none",
                  }}
                >
                  {r === "USER" ? t("i_am_pilgrim") : t("i_am_vendor")}
                </button>
              ))}
            </div>
          )}

          {/* Phone form */}
          {step === "phone" ? (
            <form onSubmit={handleSendOtp} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div className="input-group">
                <label className="label">{t("phone_label")}</label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <span
                    className="input"
                    style={{
                      width: "auto",
                      padding: "0.875rem",
                      background: "var(--color-bg)",
                      flexShrink: 0,
                      color: "var(--color-text-secondary)",
                      fontSize: "0.9rem",
                    }}
                  >
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    className="input"
                    placeholder={t("phone_placeholder")}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    maxLength={10}
                    pattern="\d{10}"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="alert alert-error">{error}</div>
              )}

              <div
                className="alert alert-info"
                style={{ fontSize: "0.8rem", fontFamily: "var(--font-devanagari)" }}
              >
                💡 {t("demo_note")}
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ width: "100%" }}
              >
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span className="spinner" style={{ width: 18, height: 18 }} />
                    {t("logging_in")}
                  </span>
                ) : (
                  t("send_otp")
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div className="input-group">
                <label className="label">{t("otp_label")}</label>
                <input
                  type="text"
                  className="input"
                  placeholder={t("otp_placeholder")}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  maxLength={6}
                  pattern="\d{6}"
                  required
                  style={{ textAlign: "center", fontSize: "1.5rem", letterSpacing: "0.5em", fontWeight: 700 }}
                  autoFocus
                />
              </div>

              {demoOtp && (
                <div className="alert alert-info" style={{ fontSize: "0.8rem" }}>
                  🔑 Demo OTP: <strong>{demoOtp}</strong>
                </div>
              )}

              {error && <div className="alert alert-error">{error}</div>}

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || otp.length !== 6}
                style={{ width: "100%" }}
              >
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span className="spinner" style={{ width: 18, height: 18 }} />
                    {t("logging_in")}
                  </span>
                ) : (
                  t("verify_otp")
                )}
              </button>

              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setStep("phone")}
                style={{ width: "100%" }}
              >
                ← {t("resend_otp")}
              </button>
            </form>
          )}
        </div>

        <p style={{ textAlign: "center", marginTop: "1.5rem", color: "var(--color-text-muted)", fontSize: "0.8rem", fontFamily: "var(--font-devanagari)" }}>
          लॉगिन सहायता के लिए <a href="tel:8739000333">8739000333</a> पर संपर्क करें।
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <LoginForm />
      </div>
    </>
  );
}
