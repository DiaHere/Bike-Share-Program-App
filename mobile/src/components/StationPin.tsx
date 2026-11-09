import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '@/theme';

// The "station drop" from the sketch: a teardrop pin with the number of available bikes.
export default function StationPin({
  name,
  available,
  selected,
  onPress,
}: {
  name: string;
  available: number;
  selected: boolean;
  onPress: () => void;
}) {
  const empty = available === 0;
  const fill = empty ? colors.statusInactive : selected ? colors.primaryDark : colors.primary;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${name}, ${available} ${available === 1 ? 'bike' : 'bikes'} available`}
      accessibilityState={{ selected }}
      hitSlop={8}
      style={({ pressed }) => [styles.wrap, pressed && { opacity: 0.8 }]}
    >
      <View
        style={[
          styles.drop,
          { backgroundColor: fill },
          selected && { borderColor: colors.accent, borderWidth: 3 },
        ]}
      >
        <Text style={styles.count} maxFontSizeMultiplier={1.4}>
          {available}
        </Text>
      </View>
    </Pressable>
  );
}

const SIZE = 56;

const styles = StyleSheet.create({
  wrap: {
    width: SIZE + 16,
    height: SIZE + 24,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  drop: {
    width: SIZE,
    height: SIZE,
    // A square with three round corners, turned 45 degrees, makes a teardrop pointing down.
    borderTopLeftRadius: SIZE / 2,
    borderTopRightRadius: SIZE / 2,
    borderBottomLeftRadius: SIZE / 2,
    borderBottomRightRadius: 4,
    transform: [{ rotate: '45deg' }],
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  count: {
    transform: [{ rotate: '-45deg' }],
    color: '#FFFFFF',
    fontFamily: fonts.bodySemi,
    fontSize: 22,
    fontVariant: ['tabular-nums'],
  },
});
