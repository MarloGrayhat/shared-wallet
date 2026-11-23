import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeftRight, ChartPie, History, Plus, Settings, TrendingUp } from 'lucide-react-native';
import { Avatar, Button, Header, IconButton, Screen, SectionLabel, s } from '@/components/ui';
import { initials, useTrip } from '@/data/selectors';
import { dateRange, money, plural } from '@/data/format';
import { colors, radius } from '@/theme';

export default function TripOverview() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const data = useTrip(id);
  if (!data) return <Redirect href="/trips" />;
  const { trip, members, expenses, total, left, usedShare, paid, debts, byCategory } = data;

  const tiles = [
    { title: 'Баланс', sub: debts.length ? plural(debts.length, 'долг', 'долга', 'долгов') : 'Все в расчёте', Icon: ArrowLeftRight, to: 'balance' },
    { title: 'Статистика', sub: plural(byCategory.length, 'категория', 'категории', 'категорий'), Icon: ChartPie, to: 'stats' },
    { title: 'История', sub: plural(expenses.length, 'операция', 'операции', 'операций'), Icon: History, to: 'history' },
  ] as const;

  return (
    <Screen footer={<Button title="Добавить расход" icon={<Plus size={18} color={colors.white} />} onPress={() => router.push(`/trip/${id}/add-expense`)} />}>
      <Header
        large
        title={trip.title}
        subtitle={`${dateRange(trip.startDate, trip.endDate)} · ${plural(members.length, 'участник', 'участника', 'участников')}`}
        right={<IconButton label="Настройки группы" onPress={() => router.push(`/trip/${id}/settings`)}><Settings size={22} color={colors.text} /></IconButton>}
      />
      <ScrollView contentContainerStyle={[s.content, { gap: 16 }]}>
        <Pressable onPress={() => router.push(`/trip/${id}/stats`)} accessibilityRole="button">
          <LinearGradient colors={[colors.primary, colors.primaryDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={st.budget}>
            <View style={st.row}>
              <View>
                <Text style={st.wSoft}>Общие расходы</Text>
                <Text style={st.big}>{money(total)}</Text>
              </View>
              <View style={st.trend}><TrendingUp size={20} color={colors.white} /></View>
            </View>
            <View style={st.row}><Text style={st.wSoft}>Бюджет</Text><Text style={st.w}>{money(trip.budget)}</Text></View>
            <View style={st.track}><View style={[st.fill, { width: `${Math.min(usedShare, 1) * 100}%` }]} /></View>
            <View style={st.row}>
              <Text style={st.w}>{Math.round(usedShare * 100)}% использовано</Text>
              <Text style={st.w}>{left >= 0 ? `${money(left)} осталось` : `перерасход ${money(-left)}`}</Text>
            </View>
          </LinearGradient>
        </Pressable>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          {tiles.map(({ title, sub, Icon, to }) => (
            <Pressable key={to} style={st.tile} onPress={() => router.push(`/trip/${id}/${to}`)} accessibilityRole="button">
              <View style={st.tileIcon}><Icon size={18} color={colors.primary} /></View>
              <Text style={st.tileTitle}>{title}</Text>
              <Text style={st.tileSub}>{sub}</Text>
            </Pressable>
          ))}
        </View>

        <SectionLabel style={{ marginTop: 6 }}>Оплатили участники</SectionLabel>
        {paid.map(({ member, amount, share }) => (
          <View key={member.id} style={st.member}>
            <Avatar initials={initials(member)} />
            <Text style={{ flex: 1, fontSize: 15, color: colors.text }}>{member.firstName}</Text>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontWeight: '600', color: colors.text }}>{money(amount)}</Text>
              <Text style={{ fontSize: 12, color: colors.textMuted }}>{Math.round(share * 100)}%</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}

const st = StyleSheet.create({
  budget: { borderRadius: radius.xl, padding: 20, gap: 14 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  w: { color: colors.white, fontSize: 13 },
  wSoft: { color: colors.white, opacity: 0.85, fontSize: 13 },
  big: { color: colors.white, fontSize: 30, fontWeight: '700', marginTop: 4 },
  trend: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.16)', alignItems: 'center', justifyContent: 'center' },
  track: { height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.25)' },
  fill: { height: 6, borderRadius: 3, backgroundColor: colors.white },
  tile: { flex: 1, padding: 12, borderRadius: radius.md, backgroundColor: colors.surface, gap: 6 },
  tileIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: 2 },
  tileTitle: { fontSize: 13, fontWeight: '600', color: colors.text },
  tileSub: { fontSize: 12, color: colors.textSecondary },
  member: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, paddingHorizontal: 14, borderRadius: radius.md, backgroundColor: colors.surface },
});
