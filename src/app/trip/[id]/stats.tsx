import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Redirect, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { Header, Screen, SectionLabel, s } from '@/components/ui';
import { CATEGORIES } from '@/data/categories';
import { useTrip } from '@/data/selectors';
import { money } from '@/data/format';
import { colors, radius } from '@/theme';

const SIZE = 200, STROKE = 26, R = (SIZE - STROKE) / 2, C = 2 * Math.PI * R, GAP = 2;

export default function Stats() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const data = useTrip(id);
  if (!data) return <Redirect href="/trips" />;
  const { total, byCategory, expenses, average, perPerson } = data;

  const arcs = byCategory.map((c, i) => {
    const len = c.share * C;
    const start = byCategory.slice(0, i).reduce((sum, p) => sum + p.share * C, 0);
    return { id: c.id, color: CATEGORIES[c.id].color, dash: `${Math.max(len - GAP, 0.5)} ${C}`, offset: -start };
  });

  return (
    <Screen>
      <Header fallback={`/trip/${id}`} title="Статистика" subtitle="Анализ расходов группы" />
      <ScrollView contentContainerStyle={s.content}>
        <SectionLabel>Расходы по категориям</SectionLabel>
        <View style={st.panel}>
          <View style={{ alignSelf: 'center', width: SIZE, height: SIZE }}>
            <Svg width={SIZE} height={SIZE} style={{ transform: [{ rotate: '-90deg' }] }}>
              {total === 0 ? <Circle cx={SIZE / 2} cy={SIZE / 2} r={R} stroke={colors.border} strokeWidth={STROKE} fill="none" /> : null}
              {arcs.map((a) => (
                <Circle key={a.id} cx={SIZE / 2} cy={SIZE / 2} r={R} stroke={a.color} strokeWidth={STROKE} fill="none"
                  strokeDasharray={a.dash} strokeDashoffset={a.offset} />
              ))}
            </Svg>
            <View style={st.center}>
              <Text style={{ fontSize: 12, color: colors.textSecondary }}>Всего</Text>
              <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text }}>{money(total)}</Text>
            </View>
          </View>
          <View>
            {byCategory.map((c) => (
              <View key={c.id} style={st.legend}>
                <View style={[st.dot, { backgroundColor: CATEGORIES[c.id].color }]} />
                <Text style={{ flex: 1, fontSize: 14, color: colors.text }}>{CATEGORIES[c.id].label}</Text>
                <Text style={{ fontSize: 14, color: colors.text }}>{money(c.amount)}</Text>
                <Text style={st.pct}>{Math.round(c.share * 100)}%</Text>
              </View>
            ))}
            {byCategory.length === 0 ? <Text style={{ textAlign: 'center', color: colors.textMuted }}>Пока нет расходов</Text> : null}
          </View>
        </View>

        <SectionLabel style={{ marginTop: 8 }}>Общая информация</SectionLabel>
        <View style={st.grid}>
          <LinearGradient colors={[colors.primary, colors.primaryDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={st.kpi}>
            <Text style={[st.kpiLabel, { color: colors.primarySoft }]}>Всего потрачено</Text>
            <Text style={[st.kpiValue, { color: colors.white }]}>{money(total)}</Text>
          </LinearGradient>
          <Kpi label="Транзакций" value={String(expenses.length)} />
          <Kpi label="Средний чек" value={money(average)} />
          <Kpi label="На человека" value={money(perPerson)} />
        </View>
      </ScrollView>
    </Screen>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <View style={[st.kpi, { backgroundColor: colors.surface }]}>
      <Text style={st.kpiLabel}>{label}</Text>
      <Text style={st.kpiValue}>{value}</Text>
    </View>
  );
}

const st = StyleSheet.create({
  panel: { backgroundColor: colors.surface, borderRadius: radius.xl, paddingTop: 20, paddingBottom: 12, paddingHorizontal: 16, gap: 16 },
  center: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
  legend: { flexDirection: 'row', alignItems: 'center', gap: 10, height: 30 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  pct: { width: 40, textAlign: 'right', fontSize: 12, color: colors.textMuted },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  kpi: { flexGrow: 1, flexBasis: '40%', borderRadius: radius.lg, paddingVertical: 14, paddingHorizontal: 16, gap: 6 },
  kpiLabel: { fontSize: 12, color: colors.textSecondary },
  kpiValue: { fontSize: 22, fontWeight: '600', color: colors.text },
});
