import { ReactNode } from "react";
import { useAppContext } from "../../AppContext";
import { themes } from "../themes";
import { useSettings, UserSettings } from "../hooks/useSettings";

// ── Option pill group ────────────────────────────────────────────────────────
function OptionGroup<T extends string>({
  value,
  options,
  onChange,
  disabled,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          disabled={disabled}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            value === opt.value
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          } disabled:opacity-50`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ── Setting row ──────────────────────────────────────────────────────────────
function SettingRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 py-4 border-b border-gray-100 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        {description && (
          <p className="text-xs text-gray-400 mt-0.5">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

export default function SettingsTab() {
  const { currentTheme, setTheme, currentUser } = useAppContext();
  const { settings, loading, saving, updateSetting } = useSettings(
    currentUser?.user_id ?? 0,
  );

  return (
    <div className="overflow-auto h-full">
      <div className="p-6 max-w-lg">
        {/* ── Theme ── */}
        <section className="mb-8">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            Appearance
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setTheme(theme)}
                className="rounded-xl p-3 text-left transition-all"
                style={{
                  background: theme.vars["--card"],
                  border: `2px solid ${
                    currentTheme.id === theme.id
                      ? theme.vars["--primary"]
                      : "transparent"
                  }`,
                }}
              >
                <div className="flex gap-1.5 mb-2">
                  {[
                    theme.vars["--background"],
                    theme.vars["--card"],
                    theme.vars["--accent"],
                    theme.vars["--primary"],
                  ].map((color, i) => (
                    <div
                      key={i}
                      style={{
                        background: color,
                        width: 18,
                        height: 18,
                        borderRadius: 4,
                        border: "1px solid rgba(0,0,0,0.15)",
                        flexShrink: 0,
                      }}
                    />
                  ))}
                </div>
                <p
                  style={{
                    color: theme.vars["--foreground"],
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                >
                  {theme.name}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* ── Privacy & Social ── */}
        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-1">
            Privacy &amp; Social
          </h2>
          <p className="text-xs text-gray-400 mb-4">
            Control who can interact with you
          </p>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="rounded-2xl border border-gray-100 overflow-hidden px-4">
              {/* Friend requests */}
              <SettingRow
                label="Friend requests"
                description="Who can send you friend requests"
              >
                <OptionGroup<UserSettings["friend_requests_from"]>
                  value={settings.friend_requests_from}
                  disabled={saving}
                  options={[
                    { value: "everyone", label: "Everyone" },
                    { value: "nobody", label: "Nobody" },
                  ]}
                  onChange={(v) => updateSetting("friend_requests_from", v)}
                />
              </SettingRow>

              {/* Messages */}
              <SettingRow
                label="Messages"
                description="Who can send you direct messages"
              >
                <OptionGroup<UserSettings["messages_from"]>
                  value={settings.messages_from}
                  disabled={saving}
                  options={[
                    { value: "everyone", label: "Everyone" },
                    { value: "friends", label: "Friends only" },
                    { value: "nobody", label: "Nobody" },
                  ]}
                  onChange={(v) => updateSetting("messages_from", v)}
                />
              </SettingRow>

              {/* Follow mode */}
              <SettingRow
                label="Follow mode"
                description="How followers can subscribe to you"
              >
                <OptionGroup<UserSettings["follow_mode"]>
                  value={settings.follow_mode}
                  disabled={saving}
                  options={[
                    { value: "open", label: "Anyone can follow" },
                    { value: "approval", label: "Requires approval" },
                  ]}
                  onChange={(v) => updateSetting("follow_mode", v)}
                />
              </SettingRow>

              {/* Profile visibility */}
              <SettingRow
                label="Profile visibility"
                description="Who can view your profile and pins"
              >
                <OptionGroup<UserSettings["profile_visibility"]>
                  value={settings.profile_visibility}
                  disabled={saving}
                  options={[
                    { value: "public", label: "Public" },
                    { value: "friends", label: "Friends only" },
                  ]}
                  onChange={(v) => updateSetting("profile_visibility", v)}
                />
              </SettingRow>
            </div>
          )}

          {saving && (
            <p className="text-xs text-gray-400 mt-2 text-right">Saving…</p>
          )}
        </section>
      </div>
    </div>
  );
}
