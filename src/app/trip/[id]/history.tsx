import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Redirect, useLocalSearchParams } from 'expo-router';
import { Avatar, Header, Screen, s } from '@/components/ui';
import { CATEGORIES } from '@/data/categories';
import { Expense } from '@/data/store';
import { initials, useMember, useTrip } from '@/data/selectors';
import { day, money } from '@/data/format';
import { colors, radius } from '@/theme';

export default function HistoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const data = useTrip(id);
  const member = useMember();
  if (!data) return <Redirect href="/trips" />;
  const { expenses, total } = data;

  // Newest day first; within a day, newest added first.
  const groups = new Map<string, Expense[]>();
  for (const e of [...expenses].reverse().sort((a, b) => b.date.localeCompare(a.date))) {
    groups.set(e.date, [...(groups.get(e.date) ?? []), e]);
  }

  return (
    <Screen>
      <Header fallback={`/trip/${id}`} title="История" subtitle="Все транзакции группы" />
      <ScrollView contentContainerStyle={[s.content, { gap: 10 }]}>
        <View style={st.summary}>
          <View style={st.row}><Text style={st.muted}>Всего транзакций</Text><Text style={st.bold}>{expenses.length}</Text></View>
          <View style={st.row}><Text style={st.muted}>Общая сумма</Text><Text style={[st.bold, { fontSize: 17 }]}>{money(total)}</Text></View>
        </View>

        {[...groups].map(([date, list]) => (
          <View key={date} style={{ gap: 10 }}>
            <Text style={st.day}>{day(date)}</Text>
            {list.map((e) => {
              const cat = CATEGORIES[e.category];
              const payer = member(e.payerId);
              return (
                <View key={e.id} style={st.tx}>
                  <View style={[st.icon, { backgroundColor: cat.soft }]}><cat.Icon size={20} color={cat.ink} /></View>
                  <View style={{ flex: 1 }}>
                    <Text style={st.title}>{e.title}</Text>
                    <View style={st.who}>
                      <Avatar initials={initials(payer)} size={22} />
                      <Text style={st.small}>{payer.firstName} · {e.splitIds.length} чел.</Text>
                    </View>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={st.bold}>{money(e.amount)}</Text>
                    <Text style={st.small}>{money(e.amount / e.splitIds.length)}/чел</Text>
                  </View>
                </View>
              );
            })}
          </View>
        ))}
        {expenses.length === 0 ? <Text style={[st.muted, { textAlign: 'center', marginTop: 24 }]}>Пока нет расходов</Text> : null}
      </ScrollView>
    </Screen>
  );
}

const st = StyleSheet.create({
  summary: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: 16, gap: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  muted: { fontSize: 14, color: colors.textSecondary },
  bold: { fontSize: 15, fontWeight: '600', color: colors.text },
  day: { marginTop: 6, fontSize: 12, fontWeight: '600', letterSpacing: 0.8, textTransform: 'uppercase', color: colors.textMuted },
  tx: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 14, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg },
  icon: { width: 40, height: 40, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 15, fontWeight: '500', color: colors.text },
  who: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  small: { fontSize: 12, color: colors.textMuted },
});
