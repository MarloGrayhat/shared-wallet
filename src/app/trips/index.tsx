import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Plus, Users } from 'lucide-react-native';
import { Button, Header, Screen, SectionLabel, s } from '@/components/ui';
import { useStore } from '@/data/store';
import { tripSpent } from '@/data/selectors';
import { dateRange, money } from '@/data/format';
import { colors, radius } from '@/theme';

export default function Trips() {
  const router = useRouter();
  const trips = useStore((st) => st.trips);
  const expenses = useStore((st) => st.expenses);

  return (
    <Screen footer={<Button title="Создать поездку" icon={<Plus size={18} color={colors.white} />} onPress={() => router.push('/trips/new')} />}>
      <Header title="Мои поездки" subtitle="Управляйте вашими путешествиями" back={false} />
      <ScrollView contentContainerStyle={s.content}>
        <SectionLabel>Активные</SectionLabel>
        {trips.map((t) => (
          <Pressable key={t.id} style={st.card} onPress={() => router.push(`/trip/${t.id}`)} accessibilityRole="button">
            <LinearGradient colors={t.cover} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ height: 104 }} />
            <View style={{ padding: 16, gap: 10 }}>
              <View style={st.row}>
                <View>
                  <Text style={st.name}>{t.title}</Text>
                  <Text style={st.muted}>{t.country}</Text>
                </View>
                <Text style={st.badge}>Активна</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 16 }}>
                <View style={st.meta}><Calendar size={14} color={colors.textSecondary} /><Text style={st.metaText}>{dateRange(t.startDate, t.endDate)}</Text></View>
                <View style={st.meta}><Users size={14} color={colors.textSecondary} /><Text style={st.metaText}>{t.memberIds.length}</Text></View>
              </View>
              <View style={{ height: 1, backgroundColor: colors.divider }} />
              <View style={st.row}>
                <Text style={st.muted}>Потрачено из бюджета</Text>
                <Text style={{ fontSize: 15, fontWeight: '600', color: colors.text }}>
                  {money(tripSpent(t.id, expenses), '')}/ {money(t.budget)}
                </Text>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </Screen>
  );
}

const st = StyleSheet.create({
  card: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, overflow: 'hidden', backgroundColor: colors.bg },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 17, fontWeight: '600', color: colors.text },
  muted: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  badge: { fontSize: 12, fontWeight: '600', color: colors.primaryDark, backgroundColor: colors.primarySoft, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, overflow: 'hidden', alignSelf: 'flex-start' },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { fontSize: 13, color: colors.textSecondary },
});
