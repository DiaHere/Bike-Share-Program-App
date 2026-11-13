import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StationPin from '@/components/StationPin';
import { loadStations, type PreviewMode, type StationsResult } from '@/data/stations';
import { colors, fonts, radius, space } from '@/theme';

type LoadState =
  | { kind: 'loading' }
  | { kind: 'ready'; data: StationsResult }
  | { kind: 'offline' };

export default function HomeScreen() {
  const [state, setState] = useState<LoadState>({ kind: 'loading' });
  const [refreshing, setRefreshing] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [preview, setPreview] = useState<PreviewMode>('normal');

  const load = useCallback(async (mode: PreviewMode) => {
    try {
      const data = await loadStations(mode);
      setState({ kind: 'ready', data });
    } catch {
      setState({ kind: 'offline' });
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    loadStations(preview).then(
      (data) => !cancelled && setState({ kind: 'ready', data }),
      () => !cancelled && setState({ kind: 'offline' }),
    );
    return () => {
      cancelled = true;
    };
  }, [preview]);

  async function onRefresh() {
    setRefreshing(true);
    await load(preview);
    setRefreshing(false);
  }

  function changePreview(mode: PreviewMode) {
    setSelectedId(null);
    setState({ kind: 'loading' });
    setPreview(mode);
  }

  const stations = state.kind === 'ready' ? state.data.stations : [];
  const bikes = state.kind === 'ready' ? state.data.bikes : [];
  const selected = stations.find((s) => s.id === selectedId) ?? null;
  const selectedBikes = selected ? bikes.filter((b) => b.stationId === selected.id) : [];

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      {/* Top bar from the sketch: report placeholder and menu, both for later sprints. */}
      <View style={styles.topBar}>
        <Text style={styles.title} accessibilityRole="header">
          Whitman Bike Share
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Menu"
          hitSlop={8}
          style={styles.menuButton}
          onPress={() => Alert.alert('Coming soon', 'Account, settings and about pages arrive in a later sprint.')}
        >
          <View style={styles.menuLine} />
          <View style={styles.menuLine} />
          <View style={styles.menuLine} />
        </Pressable>
      </View>
      <View style={styles.reportPlaceholder} accessibilityState={{ disabled: true }}>
        <Text style={styles.reportText}>Report a problem · coming soon</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        {/* Station area. A campus map goes behind the pins in Sprint 10. */}
        <View style={styles.pinArea}>
          {state.kind === 'loading' && (
            <View style={styles.message}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.messageText}>Loading stations…</Text>
            </View>
          )}
          {state.kind === 'offline' && (
            <View style={styles.message}>
              <Text style={styles.messageTitle}>You&apos;re offline</Text>
              <Text style={styles.messageText}>Pull down to refresh.</Text>
            </View>
          )}
          {state.kind === 'ready' && stations.length === 0 && (
            <View style={styles.message}>
              <Text style={styles.messageTitle}>No stations available</Text>
            </View>
          )}
          {state.kind === 'ready' && stations.length > 0 && (
            <View style={styles.pinGrid}>
              {stations.map((s) => (
                <StationPin
                  key={s.id}
                  name={s.name}
                  available={s.availableBikes}
                  selected={s.id === selectedId}
                  onPress={() => setSelectedId(s.id === selectedId ? null : s.id)}
                />
              ))}
            </View>
          )}
        </View>

        {/* Bottom panel: empty until a station is pressed, then that station's available bikes. */}
        <View style={styles.sheet}>
          {!selected ? (
            <Text style={styles.sheetHint}>
              {state.kind === 'ready' && stations.length > 0 ? 'Tap a station to see its bikes.' : ' '}
            </Text>
          ) : (
            <>
              <Text style={styles.sheetTitle} accessibilityRole="header">
                {selected.name}
              </Text>
              <Text style={[styles.sheetCount, selectedBikes.length === 0 && { color: colors.textMuted }]}>
                {selectedBikes.length} {selectedBikes.length === 1 ? 'bike' : 'bikes'} available
              </Text>
              {selectedBikes.length === 0 ? (
                <Text style={styles.sheetHint}>No bikes here right now. Try another station.</Text>
              ) : (
                selectedBikes.map((b) => (
                  <View
                    key={b.id}
                    style={styles.bikeRow}
                    accessible
                    accessibilityLabel={`Bike ${b.number}, available`}
                  >
                    <Text style={styles.bikeNumber}>Bike {b.number}</Text>
                    <View style={styles.statusWrap}>
                      <View style={styles.statusDot} />
                      <Text style={styles.statusText}>Available</Text>
                    </View>
                  </View>
                ))
              )}
            </>
          )}
        </View>

        {__DEV__ && (
          <View style={styles.devBar}>
            <Text style={styles.devLabel}>Preview state (dev only):</Text>
            {(['normal', 'empty', 'offline'] as const).map((mode) => (
              <Pressable
                key={mode}
                onPress={() => changePreview(mode)}
                style={[styles.devChip, preview === mode && styles.devChipActive]}
                accessibilityRole="button"
                accessibilityState={{ selected: preview === mode }}
              >
                <Text style={[styles.devChipText, preview === mode && { color: '#FFFFFF' }]}>{mode}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space[4],
    paddingTop: space[2],
  },
  title: { fontFamily: fonts.heading, fontSize: 24, color: colors.primaryDark },
  menuButton: { width: 44, height: 44, justifyContent: 'center', alignItems: 'flex-end', gap: 5 },
  menuLine: { width: 24, height: 2, borderRadius: 1, backgroundColor: colors.primary },
  reportPlaceholder: {
    marginHorizontal: space[4],
    marginTop: space[2],
    paddingVertical: space[2],
    paddingHorizontal: space[4],
    borderRadius: 999,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
    alignItems: 'center',
  },
  reportText: { fontFamily: fonts.body, fontSize: 14, color: colors.textMuted },
  scroll: { flexGrow: 1 },
  pinArea: { minHeight: 300, justifyContent: 'center', paddingVertical: space[5], paddingHorizontal: space[4] },
  pinGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', rowGap: space[5] },
  message: { alignItems: 'center', gap: space[2] },
  messageTitle: { fontFamily: fonts.bodySemi, fontSize: 18, color: colors.text },
  messageText: { fontFamily: fonts.body, fontSize: 16, color: colors.textMuted },
  sheet: {
    flexGrow: 1,
    minHeight: 220,
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    padding: space[5],
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
    elevation: 4,
  },
  sheetHint: { fontFamily: fonts.body, fontSize: 16, color: colors.textMuted, textAlign: 'center' },
  sheetTitle: { fontFamily: fonts.heading, fontSize: 22, color: colors.primaryDark },
  sheetCount: {
    fontFamily: fonts.bodySemi,
    fontSize: 16,
    color: colors.statusAvailable,
    marginTop: space[1],
    marginBottom: space[3],
    fontVariant: ['tabular-nums'],
  },
  bikeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 52,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  bikeNumber: { fontFamily: fonts.bodySemi, fontSize: 17, color: colors.text, fontVariant: ['tabular-nums'] },
  statusWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.statusAvailable },
  statusText: { fontFamily: fonts.bodySemi, fontSize: 15, color: colors.statusAvailable },
  devBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: space[2],
    padding: space[4],
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  devLabel: { fontFamily: fonts.body, fontSize: 13, color: colors.textMuted },
  devChip: {
    paddingHorizontal: space[3],
    paddingVertical: space[1],
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  devChipActive: { backgroundColor: colors.primary },
  devChipText: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.primary },
});
