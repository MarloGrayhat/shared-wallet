import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Info } from 'lucide-react-native';
import { Button, Field, Header, Screen, SectionLabel, s } from '@/components/ui';
import { COVERS, useStore } from '@/data/store';
import { parseDate } from '@/data/format';
import { colors, radius } from '@/theme';

export default function NewTrip() {
  const router = useRouter();
  const addTrip = useStore((st) => st.addTrip);
  const [title, setTitle] = useState('');
  const [country, setCountry] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [budget, setBudget] = useState('');
  const [cover, setCover] = useState(0);

  const startDate = parseDate(from);
  const endDate = parseDate(to);
  const budgetNum = Number(budget.replace(/\s/g, ''));
  const valid = title.trim() && startDate && endDate && startDate <= endDate && budgetNum > 0;

  const submit = () => {
    if (!valid) return;
    const id = addTrip({ title: title.trim(), country: country.trim(), startDate, endDate, budget: budgetNum, cover: COVERS[cover] });
    router.replace(`/trip/${id}`);
  };

  return (
    <Screen footer={<Button title="Создать поездку" onPress={submit} disabled={!valid} />}>
      <Header title="Новая поездка" />
      <ScrollView contentContainerStyle={[s.content, { gap: 20 }]} keyboardShouldPersistTaps="handled">
        <Field label="Название" value={title} onChangeText={setTitle} placeholder="Например, Казань" />
        <Field label="Страна" value={country} onChangeText={setCountry} placeholder="Например, Россия" />
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}><Field label="Начало" value={from} onChangeText={setFrom} placeholder="01.06" /></View>
          <View style={{ flex: 1 }}><Field label="Конец" value={to} onChangeText={setTo} placeholder="07.06" /></View>
        </View>
        <Field label="Общий бюджет" value={budget} onChangeText={setBudget} placeholder="0" keyboardType="number-pad" suffix="₽" big />
        <View>
          <SectionLabel style={{ marginBottom: 8 }}>Валюта</SectionLabel>
          <Text style={st.chip}>₽ RUB</Text>
        </View>
        <View>
          <SectionLabel style={{ marginBottom: 8 }}>Обложка</SectionLabel>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {COVERS.map((c, i) => (
              <Pressable key={i} onPress={() => setCover(i)} accessibilityRole="radio" accessibilityState={{ selected: cover === i }}
                style={[st.swatchWrap, cover === i && { borderColor: colors.primary }]}>
                <LinearGradient colors={c} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={st.swatch} />
              </Pressable>
            ))}
          </View>
        </View>
        <View style={st.note}>
          <Info size={18} color={colors.primary} />
          <Text style={st.noteText}>Участников можно пригласить после создания — по QR-коду или ссылке в настройках группы.</Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

const st = StyleSheet.create({
  chip: { alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 10, borderRadius: radius.sm, borderWidth: 2, borderColor: colors.primary, backgroundColor: colors.primarySoft, color: colors.primaryDark, fontWeight: '600', overflow: 'hidden' },
  swatchWrap: { padding: 3, borderRadius: 17, borderWidth: 2, borderColor: 'transparent' },
  swatch: { width: 48, height: 48, borderRadius: radius.md },
  note: { flexDirection: 'row', gap: 12, backgroundColor: colors.surface, borderRadius: radius.md, padding: 14 },
  noteText: { flex: 1, fontSize: 13, lineHeight: 19, color: colors.textSecondary },
});
