import { useState, useRef } from "react";
import { Camera } from "lucide-react";
import logo from "../assets/logo.png";

type Mode = "login" | "register";

interface LoginPageProps {
  onLogin: (
    username: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  onRegister: (
    username: string,
    email: string,
    password: string,
    bio?: string,
    avatar?: File | null,
  ) => Promise<{ success: boolean; error?: string }>;
}

/** Small inline asterisk for required fields */
function Req() {
  return <span className="text-red-500 ml-0.5">*</span>;
}

export default function LoginPage({ onLogin, onRegister }: LoginPageProps) {
  const [mode, setMode] = useState<Mode>("login");

  // shared
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // register-only
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirm] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const switchMode = (next: Mode) => {
    setMode(next);
    setError("");
    setUsername("");
    setPassword("");
    setEmail("");
    setConfirm("");
    setBio("");
    setAvatar(null);
    setAvatarPreview(null);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setAvatar(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    } else {
      setAvatarPreview(null);
    }
  };

  const handleSubmit = async () => {
    setError("");

    if (!username.trim() || !password) {
      setError("Please fill in all required fields");
      return;
    }

    if (mode === "register") {
      if (username.trim().length < 3) {
        setError("Username must be at least 3 characters");
        return;
      }
      if (!email.trim()) {
        setError("Email is required");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        setError("Invalid email address");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
    }

    setLoading(true);
    let result: { success: boolean; error?: string };

    if (mode === "login") {
      result = await onLogin(username.trim(), password);
    } else {
      result = await onRegister(
        username.trim(),
        email.trim(),
        password,
        bio.trim() || undefined,
        avatar,
      );
    }

    if (!result.success) {
      setError(result.error ?? "Something went wrong");
    }
    setLoading(false);
  };

  const isLogin = mode === "login";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
        {/* ── Logo ── */}
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="logo" className="w-16 h-16 rounded-full mb-3" />
          <h1 className="text-2xl font-bold">Chpinterest</h1>
          <p className="text-gray-500 text-sm mt-1">
            {isLogin ? "Sign in to your account" : "Create a new account"}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {/* ── Avatar upload (register only) ── */}
          {!isLogin && (
            <div className="flex flex-col items-center mb-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-dashed border-gray-300 hover:border-red-400 bg-gray-50 hover:bg-red-50 transition-all group"
                title="Upload avatar"
              >
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-1">
                    <Camera className="w-6 h-6 text-gray-400 group-hover:text-red-400 transition-colors" />
                    <span className="text-xs text-gray-400 group-hover:text-red-400 transition-colors leading-tight text-center px-1">
                      Photo
                    </span>
                  </div>
                )}
                {/* Edit overlay on hover when preview exists */}
                {avatarPreview && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                )}
              </button>
              <p className="text-xs text-gray-400 mt-1.5">Optional</p>
            </div>
          )}

          {/* ── Username * ── */}
          <div>
            {!isLogin && (
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                Username <Req />
              </label>
            )}
            <input
              type="text"
              placeholder={isLogin ? "Username" : ""}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all text-sm"
            />
          </div>

          {/* ── Email * (register only) ── */}
          {!isLogin && (
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                Email <Req />
              </label>
              <input
                type="email"
                placeholder=""
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all text-sm"
              />
            </div>
          )}

          {/* ── Password * ── */}
          <div>
            {!isLogin && (
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                Password <Req />{" "}
                <span className="text-gray-400 font-normal">
                  (min. 6 characters)
                </span>
              </label>
            )}
            <input
              type="password"
              placeholder={isLogin ? "Password" : ""}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all text-sm"
            />
          </div>

          {/* ── Confirm password (register only) ── */}
          {!isLogin && (
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                Confirm password <Req />
              </label>
              <input
                type="password"
                placeholder=""
                value={confirmPassword}
                onChange={(e) => setConfirm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all text-sm"
              />
            </div>
          )}

          {/* ── Bio (register only, optional) ── */}
          {!isLogin && (
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                Bio{" "}
                <span className="text-gray-400 font-normal">— optional</span>
              </label>
              <textarea
                placeholder="Tell a bit about yourself…"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={2}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all text-sm resize-none"
              />
            </div>
          )}

          {/* ── Error ── */}
          {error && (
            <p className="text-red-500 text-sm text-center -mt-1">{error}</p>
          )}

          {/* ── Submit ── */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white py-3 rounded-full font-semibold transition-all mt-1"
          >
            {loading
              ? isLogin
                ? "Signing in…"
                : "Creating account…"
              : isLogin
                ? "Sign in"
                : "Create account"}
          </button>

          {/* ── Mode toggle ── */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <button
            onClick={() => switchMode(isLogin ? "register" : "login")}
            className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 py-3 rounded-full font-medium text-sm transition-all"
          >
            {isLogin ? "Register" : "Sign in instead"}
          </button>
        </div>
      </div>
    </div>
  );
}
