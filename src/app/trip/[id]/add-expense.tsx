import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Redirect, useLocalSearchParams } from 'expo-router';
import { Check } from 'lucide-react-native';
import { Avatar, Button, Field, Header, Screen, SectionLabel, s, useGoBack } from '@/components/ui';
import { CATEGORIES, CATEGORY_ORDER, CategoryId } from '@/data/categories';
import { useStore } from '@/data/store';
import { fullName, initials, useTrip } from '@/data/selectors';
import { money } from '@/data/format';
import { colors, radius } from '@/theme';

export default function AddExpense() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const goBack = useGoBack();
  const data = useTrip(id);
  const me = useStore((st) => st.currentUserId);
  const addExpense = useStore((st) => st.addExpense);

  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryId>('food');
  const [payerId, setPayerId] = useState(me);
  const [split, setSplit] = useState<string[]>(data?.trip.memberIds ?? []);

  if (!data) return <Redirect href="/trips" />;
  const { members } = data;

  const sum = Number(amount.replace(/\s/g, '').replace(',', '.'));
  const valid = sum > 0 && title.trim() && split.length > 0;
  const toggle = (mid: string) => setSplit((cur) => (cur.includes(mid) ? cur.filter((x) => x !== mid) : [...cur, mid]));

  const save = () => {
    if (!valid) return;
    addExpense({ tripId: id, title: title.trim(), amount: sum, category, payerId, splitIds: split, date: new Date().toISOString().slice(0, 10) });
    goBack(`/trip/${id}`);
  };

  return (
    <Screen footer={<Button title="Сохранить расход" onPress={save} disabled={!valid} />}>
      <Header fallback={`/trip/${id}`} title="Новый расход" />
      <ScrollView contentContainerStyle={[s.content, { gap: 20 }]} keyboardShouldPersistTaps="handled">
        <Field label="Сумма" value={amount} onChangeText={setAmount} placeholder="0" keyboardType="decimal-pad" suffix="₽" big autoFocus />
        <Field label="Описание" value={title} onChangeText={setTitle} placeholder="Например, ресторан в центре" />

        <View>
          <SectionLabel style={{ marginBottom: 8 }}>Категория</SectionLabel>
          <View style={st.grid}>
            {CATEGORY_ORDER.map((cid) => {
              const { label, Icon } = CATEGORIES[cid];
              const on = cid === category;
              return (
                <Pressable key={cid} onPress={() => setCategory(cid)} accessibilityRole="radio" accessibilityState={{ selected: on }}
                  style={[st.cat, on && st.catOn]}>
                  <Icon size={20} color={on ? colors.primaryDark : '#374151'} />
                  <Text style={[st.catText, on && { color: colors.primaryDark, fontWeight: '600' }]}>{label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View>
          <SectionLabel style={{ marginBottom: 8 }}>Кто оплатил</SectionLabel>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {members.map((m) => {
              const on = m.id === payerId;
              return (
                <Pressable key={m.id} onPress={() => setPayerId(m.id)} accessibilityRole="radio" accessibilityState={{ selected: on }}
                  style={[st.chip, on && st.chipOn]}>
                  <Avatar initials={initials(m)} size={32} />
                  <Text style={{ fontSize: 14, color: colors.text }}>{m.firstName}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <SectionLabel>Разделить между</SectionLabel>
            {sum > 0 && split.length > 0 ? (
              <Text style={{ fontSize: 13, fontWeight: '600', color: colors.primaryDark }}>по {money(sum / split.length)}</Text>
            ) : null}
          </View>
          <View style={st.splitBox}>
            {members.map((m) => {
              const on = split.includes(m.id);
              return (
                <Pressable key={m.id} onPress={() => toggle(m.id)} style={st.splitRow} accessibilityRole="checkbox" accessibilityState={{ checked: on }}>
                  <Avatar initials={initials(m)} size={32} />
                  <Text style={{ flex: 1, fontSize: 15, color: colors.text }}>{fullName(m)}</Text>
                  <View style={[st.box, on && st.boxOn]}>{on ? <Check size={14} color={colors.white} strokeWidth={3} /> : null}</View>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const st = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  cat: { width: '31.8%', height: 68, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', gap: 6 },
  catOn: { borderWidth: 2, borderColor: colors.primary, backgroundColor: colors.primarySoft },
  catText: { fontSize: 12, color: '#374151' },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 44, paddingLeft: 6, paddingRight: 14, borderRadius: 22, borderWidth: 1, borderColor: colors.border },
  chipOn: { borderWidth: 2, borderColor: colors.primary, backgroundColor: colors.primarySoft },
  splitBox: { backgroundColor: colors.surface, borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 4 },
  splitRow: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 48 },
  box: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: '#9CA3AF', alignItems: 'center', justifyContent: 'center' },
  boxOn: { backgroundColor: colors.primary, borderColor: colors.primary },
});
