import { Text, type TextProps } from 'react-native';


export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'button';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  // Make button text white, others black
  const color = type === 'button' ? '#fff' : '#000';

  return (
    <Text
      style={[{ color }, style]}
      {...rest}
    />
  );
}

