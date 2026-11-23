import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Redirect, useLocalSearchParams } from 'expo-router';
import { ArrowRight, Check } from 'lucide-react-native';
import { Avatar, Button, Header, Screen, SectionLabel, s } from '@/components/ui';
import { useStore } from '@/data/store';
import { initials, useMember, useTrip } from '@/data/selectors';
import { money } from '@/data/format';
import { colors, radius } from '@/theme';

export default function Balance() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const data = useTrip(id);
  const member = useMember();
  const confirmTransfer = useStore((st) => st.confirmTransfer);
  if (!data) return <Redirect href="/trips" />;
  const { debts, transfers } = data;

  return (
    <Screen>
      <Header fallback={`/trip/${id}`} title="Баланс" subtitle="Взаиморасчёты группы" />
      <ScrollView contentContainerStyle={s.content}>
        <SectionLabel>Требуется оплата ({debts.length})</SectionLabel>
        {debts.length === 0 ? (
          <View style={st.settled}><Text style={{ color: colors.primaryDark, fontSize: 14 }}>Все долги погашены</Text></View>
        ) : null}
        {debts.map((d) => {
          const from = member(d.fromId);
          const to = member(d.toId);
          return (
            <View key={`${d.fromId}-${d.toId}`} style={st.card}>
              <View style={st.row}>
                <Avatar initials={initials(from)} muted />
                <ArrowRight size={16} color="#9CA3AF" />
                <Avatar initials={initials(to)} />
                <View style={{ flex: 1, marginLeft: 4 }}>
                  <Text style={st.who}>{from.firstName} → {to.firstName}</Text>
                  <Text style={st.sub}>Долг</Text>
                </View>
                <Text style={st.amount}>{money(d.amount)}</Text>
              </View>
              <Button
                title="Подтвердить перевод"
                icon={<Check size={16} color={colors.white} strokeWidth={2.6} />}
                onPress={() => confirmTransfer({ tripId: id, ...d })}
                style={{ height: 44, borderRadius: radius.sm }}
              />
            </View>
          );
        })}

        <SectionLabel style={{ marginTop: 12 }}>Завершённые ({transfers.length})</SectionLabel>
        {[...transfers].reverse().map((t) => (
          <View key={t.id} style={st.done}>
            <Text style={{ flex: 1, fontSize: 14, color: colors.textSecondary }}>
              {member(t.fromId).firstName} → {member(t.toId).firstName}
            </Text>
            <Text style={{ fontSize: 14, color: colors.textSecondary }}>{money(t.amount)}</Text>
            <View style={st.check}><Check size={14} color={colors.white} strokeWidth={3} /></View>
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}

const st = StyleSheet.create({
  card: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 14, gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  who: { fontSize: 14, fontWeight: '600', color: colors.text },
  sub: { fontSize: 12, color: colors.textMuted },
  amount: { fontSize: 17, fontWeight: '600', color: colors.text },
  settled: { padding: 20, borderRadius: radius.lg, backgroundColor: colors.primarySoft, alignItems: 'center' },
  done: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, paddingHorizontal: 14, borderRadius: radius.md, backgroundColor: colors.surface },
  check: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
});
