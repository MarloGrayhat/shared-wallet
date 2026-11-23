import { Car, Ellipsis, House, ShoppingBag, Ticket, Utensils } from 'lucide-react-native';

export type CategoryId = 'food' | 'housing' | 'transport' | 'shopping' | 'fun' | 'other';

export const CATEGORIES: Record<CategoryId, { label: string; color: string; soft: string; ink: string; Icon: typeof Car }> = {
  food: { label: 'Еда', color: '#E53935', soft: '#FDECEA', ink: '#C62828', Icon: Utensils },
  housing: { label: 'Жильё', color: '#26A69A', soft: '#E0F2F1', ink: '#00796B', Icon: House },
  transport: { label: 'Транспорт', color: '#42A5F5', soft: '#E3F2FD', ink: '#1565C0', Icon: Car },
  shopping: { label: 'Покупки', color: '#EC407A', soft: '#FCE4EC', ink: '#AD1457', Icon: ShoppingBag },
  fun: { label: 'Развлечения', color: '#FFCA28', soft: '#FFF8E1', ink: '#B26A00', Icon: Ticket },
  other: { label: 'Прочее', color: '#9E9E9E', soft: '#F3F4F6', ink: '#4B5563', Icon: Ellipsis },
};

// Order used in the category picker (3×2 grid) and the stats legend.
export const CATEGORY_ORDER: CategoryId[] = ['food', 'housing', 'transport', 'shopping', 'fun', 'other'];
