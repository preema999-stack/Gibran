export interface SelectedDishItem {
  id: string;
  name: string;
  price: number;
  category?: string;
  imageUrl?: string;
  quantity: number;
}

const STORAGE_KEY = "gibran_table_selection";
export const SELECTION_UPDATED_EVENT = "gibran_table_selection_updated";

export function getSelectedDishes(): SelectedDishItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to read table selection from localStorage", err);
    return [];
  }
}

export function saveSelectedDishes(items: SelectedDishItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event(SELECTION_UPDATED_EVENT));
  } catch (err) {
    console.error("Failed to save table selection to localStorage", err);
  }
}

export function addDishToSelection(dish: {
  id?: string;
  name: string;
  price: number | string;
  category?: string;
  imageUrl?: string;
}): SelectedDishItem[] {
  const current = getSelectedDishes();
  const numPrice = typeof dish.price === "number" ? dish.price : parseFloat(String(dish.price).replace(/[^0-9.]/g, "")) || 0;
  const existingIndex = current.findIndex((item) => (dish.id && item.id === dish.id) || item.name.toLowerCase() === dish.name.toLowerCase());
  let updated: SelectedDishItem[];

  if (existingIndex >= 0) {
    updated = current.map((item, idx) =>
      idx === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
    );
  } else {
    updated = [
      ...current,
      {
        id: dish.id || `dish-${Date.now()}`,
        name: dish.name,
        price: numPrice,
        category: dish.category,
        imageUrl: dish.imageUrl,
        quantity: 1,
      },
    ];
  }

  saveSelectedDishes(updated);
  return updated;
}

export function updateDishQuantity(dishId: string, delta: number): SelectedDishItem[] {
  const current = getSelectedDishes();
  const updated = current
    .map((item) => {
      if (item.id === dishId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    })
    .filter((item): item is SelectedDishItem => item !== null);

  saveSelectedDishes(updated);
  return updated;
}

export function removeDishFromSelection(dishId: string): SelectedDishItem[] {
  const current = getSelectedDishes();
  const updated = current.filter((item) => item.id !== dishId);
  saveSelectedDishes(updated);
  return updated;
}

export function clearTableSelection(): void {
  saveSelectedDishes([]);
}

export function formatDishesSummary(items: SelectedDishItem[]): string {
  if (!items || items.length === 0) return "";
  const lines = items.map((item) => `- ${item.quantity}x ${item.name} (AED ${item.price * item.quantity})`);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return `*Table Selection / Pre-ordered Dishes:*\n${lines.join("\n")}\n*Estimated Dishes Total:* AED ${total}`;
}
