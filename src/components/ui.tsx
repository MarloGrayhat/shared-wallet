import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle, StyleProp } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Href, useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { colors, radius, spacing } from '@/theme';

export function Screen({ children, footer }: { children: ReactNode; footer?: ReactNode }) {
  return (
    <SafeAreaView style={s.screen} edges={['top', 'bottom']}>
      <View style={s.body}>{children}</View>
      {footer ? <View style={s.footer}>{footer}</View> : null}
    </SafeAreaView>
  );
}

/** router.back(), or replace(fallback) when the screen was opened directly (deep link / web reload). */
export function useGoBack() {
  const router = useRouter();
  return (fallback: Href) => (router.canGoBack() ? router.back() : router.replace(fallback));
}

export function Header({ title, subtitle, back = true, right, large, fallback = '/trips' }: {
  title: string; subtitle?: string; back?: boolean; right?: ReactNode; large?: boolean; fallback?: Href;
}) {
  const goBack = useGoBack();
  return (
    <View style={s.header}>
      {large ? (
        <>
          <View style={s.headerRow}>
            {back ? <BackButton onPress={() => goBack(fallback)} /> : <View />}
            {right}
          </View>
          <Text style={[s.title, { fontSize: 24, marginTop: 8 }]}>{title}</Text>
          {subtitle ? <Text style={s.subtitle}>{subtitle}</Text> : null}
        </>
      ) : (
        <View style={[s.headerRow, { justifyContent: 'flex-start', gap: 6 }]}>
          {back ? <BackButton onPress={() => goBack(fallback)} /> : null}
          <View style={{ flex: 1 }}>
            <Text style={[s.title, !back && { fontSize: 28 }]}>{title}</Text>
            {subtitle ? <Text style={s.subtitle}>{subtitle}</Text> : null}
          </View>
          {right}
        </View>
      )}
    </View>
  );
}

function BackButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel="Назад" style={s.iconBtn} hitSlop={8}>
      <ChevronLeft size={24} color={colors.text} />
    </Pressable>
  );
}

export function IconButton({ onPress, label, children }: { onPress: () => void; label: string; children: ReactNode }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} style={s.iconBtn} hitSlop={8}>
      {children}
    </Pressable>
  );
}

export function Button({ title, onPress, icon, iconRight, disabled, variant = 'primary', style }: {
  title: string; onPress: () => void; icon?: ReactNode; iconRight?: ReactNode; disabled?: boolean;
  variant?: 'primary' | 'dashed'; style?: StyleProp<ViewStyle>;
}) {
  const dashed = variant === 'dashed';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [dashed ? s.btnDashed : s.btn, disabled && { opacity: 0.4 }, pressed && { opacity: 0.85 }, style]}
    >
      {icon}
      <Text style={dashed ? s.btnDashedText : s.btnText}>{title}</Text>
      {iconRight}
    </Pressable>
  );
}

export function Avatar({ initials, size = 40, muted }: { initials: string; size?: number; muted?: boolean }) {
  return (
    <View style={[s.avatar, { width: size, height: size, borderRadius: size / 2 }, muted && { backgroundColor: '#EEF0EE' }]}>
      <Text style={{ color: muted ? '#374151' : colors.white, fontWeight: '600', fontSize: size * 0.35 }}>{initials}</Text>
    </View>
  );
}

export function SectionLabel({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={style}>
      <Text style={s.label}>{children}</Text>
    </View>
  );
}

export function Field({ label, suffix, big, ...input }: TextInputProps & { label: string; suffix?: string; big?: boolean }) {
  return (
    <View>
      <Text style={[s.label, { marginBottom: 8 }]}>{label}</Text>
      <View>
        <TextInput
          placeholderTextColor={colors.textMuted}
          {...input}
          accessibilityLabel={label}
          style={[s.input, big && { height: 64, fontSize: 28, fontWeight: '600' }]}
        />
        {suffix ? <Text style={[s.suffix, big && { top: 18, fontSize: 22 }]}>{suffix}</Text> : null}
      </View>
    </View>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[s.card, style]}>{children}</View>;
}

export const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  body: { flex: 1 },
  footer: { paddingHorizontal: spacing.screen, paddingTop: 16, paddingBottom: 16, borderTopWidth: 1, borderTopColor: colors.divider },
  header: { paddingHorizontal: spacing.screen, paddingTop: 12, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.divider },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: -10 },
  title: { fontSize: 22, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: 13, color: colors.textSecondary, marginTop: 3 },
  iconBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  btn: { height: 52, borderRadius: radius.md, backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  btnText: { color: colors.white, fontSize: 16, fontWeight: '600' },
  btnDashed: { height: 52, borderRadius: radius.md, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#C9CEC9', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  btnDashedText: { color: colors.text, fontSize: 15, fontWeight: '500' },
  avatar: { backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 12, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase', color: colors.textMuted },
  input: { height: 50, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, backgroundColor: colors.input, paddingHorizontal: 16, fontSize: 15, color: colors.text },
  suffix: { position: 'absolute', right: 16, top: 14, fontSize: 18, color: colors.textMuted },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: 14 },
  content: { padding: spacing.screen, gap: 12 },
});
