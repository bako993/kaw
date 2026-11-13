import type { TextStyle } from 'react-native';

import { colors } from './colors';

/**
 * Font files in assets/fonts/, built into the app (expo-font plugin in app.json).
 * Each name is the file's PostScript name, which iPhone and Android both use.
 * Never add `fontWeight` to these: the weight is already in the file.
 */
export const fonts = {
  kurdish: 'Vazirmatn-Medium',
  kurdishBold: 'Vazirmatn-ExtraBold',
  latin: 'Nunito-SemiBold',
  latinBold: 'Nunito-ExtraBold',
} as const;

/** Kurdish letters need more height than Latin ones, so their line heights are taller. */
export const textStyles = {
  kurdishTitle: { fontFamily: fonts.kurdishBold, fontSize: 21, lineHeight: 34, color: colors.ink },
  kurdishWord: { fontFamily: fonts.kurdishBold, fontSize: 28, lineHeight: 44, color: colors.ink },
  kurdishBody: { fontFamily: fonts.kurdish, fontSize: 16, lineHeight: 28, color: colors.ink },
  kurdishLabel: { fontFamily: fonts.kurdishBold, fontSize: 15, lineHeight: 24, color: colors.ink },
  latinTitle: { fontFamily: fonts.latinBold, fontSize: 22, lineHeight: 30, color: colors.ink },
  latinLabel: { fontFamily: fonts.latinBold, fontSize: 15, lineHeight: 20, color: colors.ink },
  latinSmall: { fontFamily: fonts.latin, fontSize: 14, lineHeight: 20, color: colors.inkSoft },
} as const satisfies Record<string, TextStyle>;
