import { useAppContext } from "../../AppContext";
import { themes } from "../themes";

export default function SettingsTab() {
  const { currentTheme, setTheme } = useAppContext();

  return (
    <div className="p-6 overflow-auto h-full bg-background text-foreground">
      <h2 className="text-xl font-medium mb-6">Настройки</h2>

      <section>
        <h3 className="text-sm mb-3 text-muted-foreground">Цветовая тема</h3>
        <div className="grid grid-cols-2 gap-3">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setTheme(theme)}
              className="rounded-xl p-3 text-left transition-all"
              style={{
                background: theme.vars['--card'],
                border: `2px solid ${
                  currentTheme.id === theme.id
                    ? theme.vars['--primary']
                    : 'transparent'
                }`,
              }}
            >
              {/* превью палитры */}
              <div className="flex gap-1.5 mb-2">
                {[
                  theme.vars['--background'],
                  theme.vars['--card'],
                  theme.vars['--accent'],
                  theme.vars['--primary'],
                ].map((color, i) => (
                  <div
                    key={i}
                    style={{
                      background: color,
                      width: 18,
                      height: 18,
                      borderRadius: 4,
                      border: '1px solid rgba(0,0,0,0.15)',
                      flexShrink: 0,
                    }}
                  />
                ))}
              </div>
              <p style={{ color: theme.vars['--foreground'], fontSize: 13, fontWeight: 500 }}>
                {theme.name}
              </p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}