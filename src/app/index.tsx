import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowRight, TreePalm } from 'lucide-react-native';
import { Button, Screen } from '@/components/ui';
import { colors } from '@/theme';

export default function Onboarding() {
  const router = useRouter();
  return (
    <Screen
      footer={<Button title="Далее" onPress={() => router.replace('/trips')} iconRight={<ArrowRight size={18} color={colors.white} />} />}
    >
      <View style={st.center}>
        <View style={st.circle}>
          <TreePalm size={72} color={colors.primary} strokeWidth={1.8} />
        </View>
        <Text style={st.title}>Путешествуйте вместе с совместным кошельком</Text>
        <Text style={st.text}>
          Управляйте общими расходами в путешествиях. Добавляйте траты, делите счета и следите за бюджетом вместе с друзьями
        </Text>
        <View style={{ flexDirection: 'row', gap: 6, marginTop: 8 }}>
          <View style={[st.dot, { width: 20, backgroundColor: colors.primary }]} />
          <View style={st.dot} />
          <View style={st.dot} />
        </View>
      </View>
    </Screen>
  );
}

const st = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, gap: 20 },
  circle: { width: 168, height: 168, borderRadius: 84, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  title: { fontSize: 28, lineHeight: 35, fontWeight: '700', textAlign: 'center', color: colors.text },
  text: { fontSize: 15, lineHeight: 23, textAlign: 'center', color: colors.textSecondary },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#D1D5DB' },
});
