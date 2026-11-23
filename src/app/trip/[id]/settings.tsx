import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Redirect, useLocalSearchParams } from 'expo-router';
import { Globe, Link2, QrCode, UserX } from 'lucide-react-native';
import { Avatar, Button, Header, IconButton, Screen, SectionLabel, s } from '@/components/ui';
import { fullName, initials, useTrip } from '@/data/selectors';
import { dateRange } from '@/data/format';
import { colors, radius } from '@/theme';

export default function GroupSettings() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const data = useTrip(id);
  const [notice, setNotice] = useState<string | null>(null);
  if (!data) return <Redirect href="/trips" />;
  const { trip, members } = data;
  const soon = (what: string) => setNotice(`${what} появится в следующей версии`);

  return (
    <Screen>
      <Header fallback={`/trip/${id}`} title="Настройки группы" subtitle={`${trip.title} · ${dateRange(trip.startDate, trip.endDate)}`} />
      <ScrollView contentContainerStyle={s.content}>
        <SectionLabel>Валюта поездки</SectionLabel>
        <View style={[st.panel, { gap: 12 }]}>
          <View style={st.row}>
            <View style={st.globe}><Globe size={20} color={colors.primary} /></View>
            <View>
              <Text style={{ fontSize: 12, color: colors.textSecondary }}>Выбранная валюта</Text>
              <Text style={{ fontSize: 15, fontWeight: '500', color: colors.text }}>Российский рубль</Text>
            </View>
          </View>
          <View style={st.currency}>
            <Text style={{ flex: 1, fontSize: 15, fontWeight: '600', color: colors.text }}>₽  RUB</Text>
            <View style={st.radio}><View style={st.radioDot} /></View>
          </View>
        </View>

        <SectionLabel style={{ marginTop: 10 }}>Участники ({members.length})</SectionLabel>
        {members.map((m) => {
          const admin = m.id === trip.adminId;
          return (
            <View key={m.id} style={[st.panel, st.row]}>
              <Avatar initials={initials(m)} size={44} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '500', color: colors.text }}>{fullName(m)}</Text>
                <Text style={{ fontSize: 12, color: admin ? colors.primaryDark : colors.textMuted }}>{admin ? 'Администратор' : 'Участник'}</Text>
              </View>
              {admin ? null : (
                <IconButton label={`Удалить: ${fullName(m)}`} onPress={() => soon('Удаление участников')}>
                  <UserX size={20} color={colors.textMuted} />
                </IconButton>
              )}
            </View>
          );
        })}

        <Button variant="dashed" title="Пригласить по QR-коду" icon={<QrCode size={20} color={colors.text} />} onPress={() => soon('Приглашение по QR-коду')} style={{ marginTop: 8 }} />
        <Button variant="dashed" title="Поделиться ссылкой" icon={<Link2 size={20} color={colors.text} />} onPress={() => soon('Приглашение по ссылке')} />
        {notice ? <Text style={st.notice}>{notice}</Text> : null}
      </ScrollView>
    </Screen>
  );
}

const st = StyleSheet.create({
  panel: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: 14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  globe: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  currency: { flexDirection: 'row', alignItems: 'center', height: 52, paddingHorizontal: 16, borderWidth: 2, borderColor: colors.primary, borderRadius: radius.sm, backgroundColor: colors.primarySoft },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  notice: { textAlign: 'center', fontSize: 13, color: colors.textSecondary, marginTop: 4 },
});
