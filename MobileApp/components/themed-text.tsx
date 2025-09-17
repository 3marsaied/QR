import { Text, type TextProps } from 'react-native';

export type ThemedTextProps = TextProps & {
  // kept for compatibility but not applied by default
  lightColor?: string;
  darkColor?: string;
  type?: string;
};

// Minimal passthrough component: don't apply any default styles or theme colors.
export function ThemedText({ style, ...rest }: ThemedTextProps) {
  return <Text style={style} {...rest} />;
}
