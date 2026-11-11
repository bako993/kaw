/** Kaw's colours (approved look: round 4, C2). Screens take every colour from here. */
export const colors = {
  backgroundTop: '#F6F0E8',
  backgroundBottom: '#EAE1D5',
  topicGlow: 'rgba(246, 181, 68, 0.20)',

  ink: '#2A2118',
  inkSoft: '#7B6B5A',

  paper: '#FFFDF9',
  paperShade: '#F1E8DC',
  paperEdge: '#D3C1A8',

  actionLight: '#FFD066',
  action: '#F6A623',
  actionEdge: '#C77A10',
  onAction: '#5A3200',

  success: '#2FA36B',
  successLight: '#5BC184',
  successEdge: '#23784A',

  white: '#FFFFFF',
} as const;

export type ColorToken = keyof typeof colors;
