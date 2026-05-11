export interface Theme {
  id: string;
  name: string;
  vars: Record<string, string>;
}

export const themes: Theme[] = [
  {
    id: 'default',
    name: 'Стандартная',
    vars: {
      '--background':        '#ffffff',
      '--foreground':        'oklch(0.145 0 0)',
      '--card':              '#ffffff',
      '--card-foreground':   'oklch(0.145 0 0)',
      '--primary':           '#030213',
      '--primary-foreground':'oklch(1 0 0)',
      '--muted':             '#ececf0',
      '--muted-foreground':  '#717182',
      '--accent':            '#e9ebef',
      '--accent-foreground': '#030213',
      '--border':            'rgba(0,0,0,0.1)',
      '--input-background':  '#f3f3f5',
    }
  },
  {
    id: 'olive',
    name: 'Оливковая',
    vars: {
      '--background':        '#1a1d0f',
      '--foreground':        '#e8ead0',
      '--card':              '#2a2d1f',
      '--card-foreground':   '#e8ead0',
      '--primary':           '#6b7d47',
      '--primary-foreground':'#e8ead0',
      '--muted':             '#2a2d1f',
      '--muted-foreground':  '#a0a880',
      '--accent':            '#3a3d2f',
      '--accent-foreground': '#e8ead0',
      '--border':            'rgba(107,125,71,0.3)',
      '--input-background':  '#2a2d1f',
    }
  },
  {
    id: 'dark',
    name: 'Тёмная',
    vars: {
      '--background':        '#0f0f0f',
      '--foreground':        '#f9fafb',
      '--card':              '#1a1a1a',
      '--card-foreground':   '#f9fafb',
      '--primary':           '#3b82f6',
      '--primary-foreground':'#ffffff',
      '--muted':             '#1a1a1a',
      '--muted-foreground':  '#9ca3af',
      '--accent':            '#2a2a2a',
      '--accent-foreground': '#f9fafb',
      '--border':            'rgba(255,255,255,0.1)',
      '--input-background':  '#1a1a1a',
    }
  },
  {
    id: 'rose',
    name: 'Розовая',
    vars: {
      '--background':        '#fff1f2',
      '--foreground':        '#1f0a0d',
      '--card':              '#ffe4e6',
      '--card-foreground':   '#1f0a0d',
      '--primary':           '#e11d48',
      '--primary-foreground':'#ffffff',
      '--muted':             '#fecdd3',
      '--muted-foreground':  '#9f1239',
      '--accent':            '#fecdd3',
      '--accent-foreground': '#1f0a0d',
      '--border':            'rgba(225,29,72,0.2)',
      '--input-background':  '#ffe4e6',
    }
  },
  {
    id: 'midnight',
    name: 'Полночь',
    vars: {
      '--background':        '#0d1117',
      '--foreground':        '#c9d1d9',
      '--card':              '#161b22',
      '--card-foreground':   '#c9d1d9',
      '--primary':           '#58a6ff',
      '--primary-foreground':'#0d1117',
      '--muted':             '#161b22',
      '--muted-foreground':  '#8b949e',
      '--accent':            '#21262d',
      '--accent-foreground': '#c9d1d9',
      '--border':            'rgba(255,255,255,0.1)',
      '--input-background':  '#161b22',
    }
  },
];