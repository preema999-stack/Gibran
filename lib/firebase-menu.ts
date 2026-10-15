import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  DEFAULT_MENU_GROUPS,
  DEFAULT_MENU_SUBGROUPS,
  buildCategoriesFromGroups,
  type MenuGroup,
  type MenuSubgroup,
  type MenuItem,
  type MenuCategoryData,
} from "@/lib/full-menu-data";

export interface MenuDataState {
  groups: MenuGroup[];
  subgroups: MenuSubgroup[];
  items: MenuItem[];
  categories: MenuCategoryData[];
}

const MENU_DOC_REF = () => doc(db, "restaurant", "menu");
const LOCAL_STORAGE_KEY = "gibran_menu_full_data_v2";

const INITIAL_DEFAULT_STATE: MenuDataState = {
  groups: DEFAULT_MENU_GROUPS,
  subgroups: DEFAULT_MENU_SUBGROUPS,
  items: [],
  categories: buildCategoriesFromGroups(DEFAULT_MENU_GROUPS, DEFAULT_MENU_SUBGROUPS, []),
};

function getLocalStoredState(): MenuDataState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.groups) && Array.isArray(parsed.subgroups)) {
        return normalizeFirestoreData(parsed);
      }
    }
  } catch {
    // Ignore storage parse errors
  }
  return null;
}

function saveLocalStoredState(state: MenuDataState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(
      new CustomEvent("gibran-menu-updated", { detail: state })
    );
  } catch {
    // Ignore storage write errors
  }
}

/**
 * Checks live connection to Firestore and returns connectivity diagnostic.
 */
export async function checkFirestoreConnection(): Promise<{
  connected: boolean;
  projectId: string;
  error?: string;
}> {
  const projectId = db.app.options.projectId || "unknown";
  try {
    const snap = await getDoc(MENU_DOC_REF());
    return { connected: true, projectId };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { connected: false, projectId, error: msg };
  }
}

/**
 * Normalizes document data from Firestore into full MenuDataState.
 */
function normalizeFirestoreData(data: Record<string, unknown> | undefined): MenuDataState {
  let groups: MenuGroup[] = Array.isArray(data?.groups) && (data.groups as MenuGroup[]).length > 0
    ? (data.groups as MenuGroup[])
    : DEFAULT_MENU_GROUPS;

  let subgroups: MenuSubgroup[] = Array.isArray(data?.subgroups) && (data.subgroups as MenuSubgroup[]).length > 0
    ? (data.subgroups as MenuSubgroup[])
    : DEFAULT_MENU_SUBGROUPS;

  // Items: only user dishes. If legacy data had categories with items, extract items with group/subgroup
  let items: MenuItem[] = [];
  if (Array.isArray(data?.items)) {
    items = data.items as MenuItem[];
  }

  // Ensure every item has groupId, subgroupId and a valid existing image path
  items = items.map((it) => {
    const sub = subgroups.find((s) => s.id === it.subgroupId) || subgroups[0];
    const grp = groups.find((g) => g.id === it.groupId || g.id === sub?.groupId) || groups[0];

    let validImage = it.image;
    if (!validImage || validImage.startsWith("/uploads/")) {
      const lowerName = (it.name || "").toLowerCase();
      if (lowerName.includes("chocolate") || lowerName.includes("fondant") || lowerName.includes("cake")) {
        validImage = "/images/dish-lava-cake.jpg";
      } else if (lowerName.includes("hummus")) {
        validImage = "/assets/gallery/hummus-tahini-mezza.jpg";
      } else {
        validImage = "/images/dish-risotto.jpg";
      }
    }

    return {
      ...it,
      image: validImage,
      groupId: it.groupId || grp?.id || "food",
      groupName: it.groupName || grp?.name || "Food Menu",
      subgroupId: it.subgroupId || sub?.id || "starters",
      subgroupName: it.subgroupName || sub?.name || "Starters & Mezze",
    };
  });

  const categories = buildCategoriesFromGroups(groups, subgroups, items);

  return { groups, subgroups, items, categories };
}

/**
 * Loads menu data directly from Firebase Firestore, falling back to local cache or defaults.
 */
export async function getMenuFromFirebase(): Promise<MenuDataState> {
  const local = getLocalStoredState();

  try {
    const snap = await getDoc(MENU_DOC_REF());
    if (snap.exists()) {
      const state = normalizeFirestoreData(snap.data());
      saveLocalStoredState(state);
      return state;
    } else {
      // Initialize doc in Firestore with default groups & subgroups (0 dishes)
      await setDoc(MENU_DOC_REF(), {
        groups: INITIAL_DEFAULT_STATE.groups,
        subgroups: INITIAL_DEFAULT_STATE.subgroups,
        items: [],
        categories: INITIAL_DEFAULT_STATE.categories,
        updatedAt: Date.now(),
      });
      saveLocalStoredState(INITIAL_DEFAULT_STATE);
      return INITIAL_DEFAULT_STATE;
    }
  } catch (err) {
    console.warn("Firestore menu fetch fallback:", err);
  }

  return local || INITIAL_DEFAULT_STATE;
}

/**
 * Real-time listener for menu updates directly from Firebase Firestore.
 */
export function subscribeToFirebaseMenu(
  onUpdate: (state: MenuDataState) => void
): () => void {
  // First deliver cached data immediately if available
  const cached = getLocalStoredState();
  if (cached) onUpdate(cached);

  let unsubscribeFirestore: (() => void) | null = null;

  try {
    unsubscribeFirestore = onSnapshot(
      MENU_DOC_REF(),
      (snap) => {
        if (snap.exists()) {
          const state = normalizeFirestoreData(snap.data());
          saveLocalStoredState(state);
          onUpdate(state);
        }
      },
      (err) => {
        console.warn("Firestore snapshot listener notice:", err.message);
      }
    );
  } catch (err) {
    console.warn("Could not bind Firestore listener:", err);
  }

  const handleLocalUpdate = (e: Event) => {
    const customEvent = e as CustomEvent<MenuDataState>;
    if (customEvent.detail?.groups) {
      onUpdate(customEvent.detail);
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener("gibran-menu-updated", handleLocalUpdate);
  }

  return () => {
    if (unsubscribeFirestore) unsubscribeFirestore();
    if (typeof window !== "undefined") {
      window.removeEventListener("gibran-menu-updated", handleLocalUpdate);
    }
  };
}

/**
 * Persists updated state to both local storage and Firestore.
 */
async function syncMenuState(state: MenuDataState): Promise<void> {
  const categories = buildCategoriesFromGroups(state.groups, state.subgroups, state.items);
  const fullState: MenuDataState = {
    ...state,
    categories,
  };

  saveLocalStoredState(fullState);

  try {
    await setDoc(
      MENU_DOC_REF(),
      {
        groups: fullState.groups,
        subgroups: fullState.subgroups,
        items: fullState.items,
        categories: fullState.categories,
        updatedAt: Date.now(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn("Saved locally, Firestore sync note:", err);
  }
}

// ==========================================
// GROUP MANAGEMENT
// ==========================================

export async function addGroupToFirebase(
  name: string,
  currentState: MenuDataState,
  description?: string
): Promise<{ success: boolean; group: MenuGroup; state: MenuDataState }> {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const id = slug || `group-${Date.now().toString().slice(-4)}`;

  const newGroup: MenuGroup = {
    id,
    name: name.trim(),
    description: description?.trim() || "",
    order: currentState.groups.length + 1,
  };

  const updatedGroups = [...currentState.groups.filter((g) => g.id !== id), newGroup];
  const nextState: MenuDataState = {
    ...currentState,
    groups: updatedGroups,
  };

  await syncMenuState(nextState);
  return { success: true, group: newGroup, state: nextState };
}

export async function updateGroupInFirebase(
  groupId: string,
  updates: Partial<MenuGroup>,
  currentState: MenuDataState
): Promise<{ success: boolean; state: MenuDataState }> {
  const updatedGroups = currentState.groups.map((g) => {
    if (g.id === groupId) {
      return { ...g, ...updates };
    }
    return g;
  });

  const nextState: MenuDataState = {
    ...currentState,
    groups: updatedGroups,
  };

  await syncMenuState(nextState);
  return { success: true, state: nextState };
}

export async function deleteGroupFromFirebase(
  groupId: string,
  currentState: MenuDataState
): Promise<{ success: boolean; state: MenuDataState }> {
  const updatedGroups = currentState.groups.filter((g) => g.id !== groupId);
  // Also remove subgroups belonging to this group
  const updatedSubgroups = currentState.subgroups.filter((s) => s.groupId !== groupId);
  // Also remove dishes belonging to this group
  const updatedItems = currentState.items.filter((it) => it.groupId !== groupId);

  const nextState: MenuDataState = {
    ...currentState,
    groups: updatedGroups,
    subgroups: updatedSubgroups,
    items: updatedItems,
  };

  await syncMenuState(nextState);
  return { success: true, state: nextState };
}

// ==========================================
// SUBGROUP MANAGEMENT
// ==========================================

export async function addSubgroupToFirebase(
  groupId: string,
  name: string,
  currentState: MenuDataState,
  description?: string
): Promise<{ success: boolean; subgroup: MenuSubgroup; state: MenuDataState }> {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const id = slug || `subgroup-${Date.now().toString().slice(-4)}`;

  const newSubgroup: MenuSubgroup = {
    id,
    groupId,
    name: name.trim(),
    description: description?.trim() || "",
    order: currentState.subgroups.filter((s) => s.groupId === groupId).length + 1,
  };

  const updatedSubgroups = [...currentState.subgroups.filter((s) => s.id !== id), newSubgroup];
  const nextState: MenuDataState = {
    ...currentState,
    subgroups: updatedSubgroups,
  };

  await syncMenuState(nextState);
  return { success: true, subgroup: newSubgroup, state: nextState };
}

export async function updateSubgroupInFirebase(
  subgroupId: string,
  updates: Partial<MenuSubgroup>,
  currentState: MenuDataState
): Promise<{ success: boolean; state: MenuDataState }> {
  const updatedSubgroups = currentState.subgroups.map((s) => {
    if (s.id === subgroupId) {
      return { ...s, ...updates };
    }
    return s;
  });

  const nextState: MenuDataState = {
    ...currentState,
    subgroups: updatedSubgroups,
  };

  await syncMenuState(nextState);
  return { success: true, state: nextState };
}

export async function deleteSubgroupFromFirebase(
  subgroupId: string,
  currentState: MenuDataState
): Promise<{ success: boolean; state: MenuDataState }> {
  const updatedSubgroups = currentState.subgroups.filter((s) => s.id !== subgroupId);
  // Also remove items inside this subgroup
  const updatedItems = currentState.items.filter((it) => it.subgroupId !== subgroupId);

  const nextState: MenuDataState = {
    ...currentState,
    subgroups: updatedSubgroups,
    items: updatedItems,
  };

  await syncMenuState(nextState);
  return { success: true, state: nextState };
}

// ==========================================
// DISH (ITEM) MANAGEMENT
// ==========================================

export async function addDishToFirebase(
  dish: Omit<MenuItem, "id"> & { id?: string },
  currentState: MenuDataState
): Promise<{ success: boolean; item: MenuItem; state: MenuDataState }> {
  const slug = (dish.name || "dish")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const id = dish.id || `${slug}-${Date.now().toString().slice(-4)}`;

  const dietary = Array.from(new Set(["All", ...(dish.dietary || [])])) as MenuItem["dietary"];

  // Resolve group and subgroup names
  const group = currentState.groups.find((g) => g.id === dish.groupId);
  const subgroup = currentState.subgroups.find((s) => s.id === dish.subgroupId);

  const newItem: MenuItem = {
    id,
    name: dish.name.trim(),
    description: dish.description?.trim() || "",
    price: Number(dish.price) || 0,
    groupId: dish.groupId || group?.id || currentState.groups[0]?.id || "food",
    groupName: group?.name || dish.groupName || "Food Menu",
    subgroupId: dish.subgroupId || subgroup?.id || currentState.subgroups[0]?.id || "starters",
    subgroupName: subgroup?.name || dish.subgroupName || "Starters & Mezze",
    badge: dish.badge || undefined,
    image: dish.image || "/images/dish-risotto.jpg",
    dietary,
    calories: dish.calories?.trim() || undefined,
    prepTime: dish.prepTime?.trim() || undefined,
    winePairing: dish.winePairing?.trim() || undefined,
    ingredients: dish.ingredients?.filter((i) => i.trim().length > 0) || [],
    createdAt: Date.now(),
  };

  const updatedItems = [newItem, ...currentState.items.filter((it) => it.id !== newItem.id)];
  const nextState: MenuDataState = {
    ...currentState,
    items: updatedItems,
  };

  await syncMenuState(nextState);
  return { success: true, item: newItem, state: nextState };
}

export async function updateDishInFirebase(
  dishId: string,
  updates: Partial<MenuItem>,
  currentState: MenuDataState
): Promise<{ success: boolean; item: MenuItem; state: MenuDataState }> {
  const existing = currentState.items.find((it) => it.id === dishId);
  if (!existing) {
    throw new Error(`Dish '${dishId}' not found`);
  }

  const group = updates.groupId
    ? currentState.groups.find((g) => g.id === updates.groupId)
    : currentState.groups.find((g) => g.id === existing.groupId);

  const subgroup = updates.subgroupId
    ? currentState.subgroups.find((s) => s.id === updates.subgroupId)
    : currentState.subgroups.find((s) => s.id === existing.subgroupId);

  const updatedItem: MenuItem = {
    ...existing,
    ...updates,
    groupName: group?.name || updates.groupName || existing.groupName,
    subgroupName: subgroup?.name || updates.subgroupName || existing.subgroupName,
    price: updates.price !== undefined ? Number(updates.price) : existing.price,
    dietary: updates.dietary
      ? (Array.from(new Set(["All", ...updates.dietary])) as MenuItem["dietary"])
      : existing.dietary,
  };

  const updatedItems = currentState.items.map((it) => (it.id === dishId ? updatedItem : it));
  const nextState: MenuDataState = {
    ...currentState,
    items: updatedItems,
  };

  await syncMenuState(nextState);
  return { success: true, item: updatedItem, state: nextState };
}

export async function deleteDishFromFirebase(
  dishId: string,
  currentState: MenuDataState
): Promise<{ success: boolean; state: MenuDataState }> {
  const updatedItems = currentState.items.filter((it) => it.id !== dishId);
  const nextState: MenuDataState = {
    ...currentState,
    items: updatedItems,
  };

  await syncMenuState(nextState);
  return { success: true, state: nextState };
}

/**
 * Clears ALL dishes from the menu completely (sets dishes to empty array []).
 */
export async function clearAllDishesFromFirebase(
  currentState: MenuDataState
): Promise<{ success: boolean; state: MenuDataState }> {
  const nextState: MenuDataState = {
    ...currentState,
    items: [],
  };

  await syncMenuState(nextState);
  return { success: true, state: nextState };
}

/**
 * Converts an image file to an optimized, lightweight Base64 data URL (<40KB)
 * completely in the client browser using HTML5 Canvas.
 * No API routes or cloud storage buckets required.
 */
export async function convertImageToBase64(
  file: File,
  maxDim = 800,
  quality = 0.75
): Promise<string> {
  if (typeof window === "undefined") return "";

  return new Promise((resolve, reject) => {
    // If already an SVG, read directly
    if (file.type === "image/svg+xml") {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      if (!src) return resolve("");

      const img = new window.Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Export as compressed, lightweight JPEG Base64
          const base64Data = canvas.toDataURL("image/jpeg", quality);
          resolve(base64Data);
        } else {
          resolve(src);
        }
      };
      img.onerror = () => resolve(src);
      img.src = src;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Direct client-side Base64 converter (no api routes or cloud storage needed)
 */
export const uploadDishImageToFirebase = convertImageToBase64;

/**
 * Authentic Lebanese & Mediterranean Fine Dining Dishes for quick seeding
 */
export const AUTHENTIC_LEBANESE_DISHES: Omit<MenuItem, "id">[] = [
  // 1. Starters & Mezze
  {
    name: "Hummus bil Lahme (حمص باللحمة)",
    description: "Silk-smooth whipped chickpeas with artisanal sesame tahini, topped with warm spiced Australian lamb confit, toasted pine nuts, and cold-pressed extra virgin Lebanese olive oil.",
    price: 65,
    groupId: "food",
    groupName: "Food Menu",
    subgroupId: "starters",
    subgroupName: "Starters & Mezze",
    badge: "CHEF'S PICK",
    image: "/assets/gallery/hummus-tahini-mezza.jpg",
    dietary: ["Non-Vegetarian", "Chef's Selection"],
    calories: "480 kcal",
    prepTime: "12 mins",
    winePairing: "Château Musar Jeune White or Crisp Arak",
    ingredients: ["Chickpeas", "Tahini", "Spiced Lamb", "Toasted Pine Nuts", "EVOO", "Paprika"],
  },
  {
    name: "Levantine Heritage Fattoush (فتوش جبلي)",
    description: "Heirloom baby gem lettuce, garden radishes, Persian cucumber, sumac pomegranate molasses vinaigrette, and golden crispy wood-fired pita crisps.",
    price: 55,
    groupId: "food",
    groupName: "Food Menu",
    subgroupId: "starters",
    subgroupName: "Starters & Mezze",
    badge: "SIGNATURE",
    image: "/assets/gallery/levantine-fattoush.jpg",
    dietary: ["Vegetarian"],
    calories: "280 kcal",
    prepTime: "10 mins",
    ingredients: ["Baby Gem Lettuce", "Pomegranate Molasses", "Sumac", "Radish", "Woodfired Pita"],
  },
  {
    name: "Truffle Manakish Zaatar (مناقيش بالزعتر والكمأة)",
    description: "Wild thyme from Mount Lebanon, roasted white sesame, fresh buffalo mozzarella, sumac, and shaved black winter truffle baked on stone hearth.",
    price: 75,
    groupId: "food",
    groupName: "Food Menu",
    subgroupId: "starters",
    subgroupName: "Starters & Mezze",
    badge: "POPULAR",
    image: "/assets/gallery/woodfired-zaatar.jpg",
    dietary: ["Vegetarian"],
    calories: "420 kcal",
    prepTime: "15 mins",
    ingredients: ["Wild Lebanese Zaatar", "Black Truffle", "Buffalo Mozzarella", "Stoneground Flour", "Sesame"],
  },
  {
    name: "Spiced Mediterranean Calamari (كلماري مقرمش)",
    description: "Tender baby squid tossed in crushed Aleppo pepper, wild oregano, roasted garlic, served with sumac-lime toum aioli and charred lemon.",
    price: 85,
    groupId: "food",
    groupName: "Food Menu",
    subgroupId: "starters",
    subgroupName: "Starters & Mezze",
    badge: "HOUSE FAVOURITE",
    image: "/images/crispy-calamari.jpg",
    dietary: ["Non-Vegetarian"],
    calories: "390 kcal",
    prepTime: "12 mins",
    ingredients: ["Baby Squid", "Aleppo Chili", "Sumac Lime Aioli", "Garlic", "Sea Salt"],
  },
  // 2. Main Courses
  {
    name: "Royal Charcoal Lamb Chops (ريش غنم مشوية)",
    description: "Prime Australian lamb cutlets marinated in 7 Lebanese aromatics and pomegranate glaze, flame-grilled over binchotan charcoal, with smoked garlic toum and batata harra.",
    price: 195,
    groupId: "food",
    groupName: "Food Menu",
    subgroupId: "mains",
    subgroupName: "Main Courses",
    badge: "SIGNATURE",
    image: "/assets/gallery/charred-lamb-chops.jpg",
    dietary: ["Non-Vegetarian", "Chef's Selection"],
    calories: "720 kcal",
    prepTime: "22 mins",
    winePairing: "Cabernet Sauvignon / Syrah Blend",
    ingredients: ["Australian Lamb Rack", "Pomegranate Glaze", "Lebanese 7-Spice", "Garlic Toum", "Rosemary"],
  },
  {
    name: "Mediterranean Grilled Sea Bass (سيباس مشوي)",
    description: "Wild-caught Mediterranean sea bass fillet, spiced coriander-walnut harra sauce, glazed baby fennel, and citrus confit.",
    price: 180,
    groupId: "food",
    groupName: "Food Menu",
    subgroupId: "mains",
    subgroupName: "Main Courses",
    badge: "CHEF'S PICK",
    image: "/assets/gallery/grilled-sea-bass.jpg",
    dietary: ["Non-Vegetarian", "Gluten-Free"],
    calories: "510 kcal",
    prepTime: "20 mins",
    winePairing: "Sauvignon Blanc or Chablis",
    ingredients: ["Sea Bass Fillet", "Coriander Harra", "Walnuts", "Charred Lemon", "EVOO"],
  },
  {
    name: "Saffron & Wild Mushroom Risotto (ريزوتو الزعفران)",
    description: "Acquerello carnaroli rice slow-cooked with royal Persian saffron, sautéed morel mushrooms, 24-month Parmigiano Reggiano, and herb oil.",
    price: 135,
    groupId: "food",
    groupName: "Food Menu",
    subgroupId: "mains",
    subgroupName: "Main Courses",
    badge: "POPULAR",
    image: "/images/dish-risotto.jpg",
    dietary: ["Vegetarian", "Gluten-Free"],
    calories: "590 kcal",
    prepTime: "25 mins",
    ingredients: ["Carnaroli Rice", "Persian Saffron", "Morel Mushrooms", "Parmigiano Reggiano"],
  },
  {
    name: "Zaatar Herb Roasted Baby Chicken (فروج مشوي)",
    description: "Spatchcock organic poussin roasted with mountain zaatar, confit garlic cloves, caramelized shallots, and golden sumac potatoes.",
    price: 140,
    groupId: "food",
    groupName: "Food Menu",
    subgroupId: "mains",
    subgroupName: "Main Courses",
    badge: "HOUSE FAVOURITE",
    image: "/images/dish-chicken.jpg",
    dietary: ["Non-Vegetarian"],
    calories: "650 kcal",
    prepTime: "24 mins",
    ingredients: ["Free-Range Baby Chicken", "Zaatar Marinade", "Confit Garlic", "Sumac Potatoes"],
  },
  // 3. Desserts & Sweets
  {
    name: "Artisanal Baklava with Fresh Ashta (بقلاوة بالقشطة)",
    description: "Hand-rolled crisp filo pastry layered with organic orange blossom Ashta cream, roasted Aleppo pistachios, and warm blossom syrup.",
    price: 65,
    groupId: "food",
    groupName: "Food Menu",
    subgroupId: "desserts",
    subgroupName: "Desserts & Sweets",
    badge: "SIGNATURE",
    image: "/assets/gallery/baklava-ashta.jpg",
    dietary: ["Vegetarian"],
    calories: "450 kcal",
    prepTime: "10 mins",
    ingredients: ["Filo Pastry", "Ashta Clotted Cream", "Pistachios", "Orange Blossom Water", "Honey"],
  },
  {
    name: "Valrhona Molten Chocolate Fondant (كعكة الشوكولاتة)",
    description: "Warm 70% dark Valrhona chocolate cake with molten heart, served alongside Madagascar bourbon vanilla bean gelato and edible 24k gold leaf.",
    price: 70,
    groupId: "food",
    groupName: "Food Menu",
    subgroupId: "desserts",
    subgroupName: "Desserts & Sweets",
    badge: "POPULAR",
    image: "/images/dish-lava-cake.jpg",
    dietary: ["Vegetarian"],
    calories: "560 kcal",
    prepTime: "14 mins",
    ingredients: ["Valrhona 70% Dark Chocolate", "Butter", "Madagascar Vanilla Gelato", "Gold Leaf"],
  },
  // 4. Beverages
  {
    name: "Beirut Sunset Botanical Spritz",
    description: "Freshly pressed ruby pomegranate, pink grapefruit, organic rosewater elixir, sparkling soda, and fragrant bruised rosemary.",
    price: 48,
    groupId: "beverages",
    groupName: "Beverages",
    subgroupId: "mocktails",
    subgroupName: "Signature Mocktails",
    badge: "SIGNATURE",
    image: "/assets/gallery/principal-dining-hall.jpg",
    dietary: ["Vegetarian", "Gluten-Free"],
    calories: "120 kcal",
    prepTime: "5 mins",
    ingredients: ["Fresh Pomegranate", "Pink Grapefruit", "Rosewater", "Sparkling Soda", "Fresh Rosemary"],
  },
  {
    name: "Traditional Cezve Cardamom Coffee (قهوة عربية)",
    description: "Dark-roasted heirloom Arabica beans slow-steeped in an authentic hand-hammered copper cezve with crushed green cardamom pods.",
    price: 35,
    groupId: "beverages",
    groupName: "Beverages",
    subgroupId: "hot-drinks",
    subgroupName: "Coffee & Infusions",
    badge: "HOUSE FAVOURITE",
    image: "/assets/gallery/roastery-cezve.jpg",
    dietary: ["Vegetarian", "Gluten-Free"],
    calories: "15 kcal",
    prepTime: "7 mins",
    ingredients: ["Heirloom Arabica Coffee", "Green Cardamom", "Spring Water"],
  },
];

/**
 * Seeds the menu with the authentic Lebanese tasting menu collection.
 */
export async function seedSampleLebaneseDishes(
  currentState: MenuDataState
): Promise<{ success: boolean; state: MenuDataState; count: number }> {
  const newDishes: MenuItem[] = AUTHENTIC_LEBANESE_DISHES.map((d, index) => ({
    ...d,
    id: `lebanese_dish_${Date.now()}_${index}`,
    createdAt: Date.now() + index,
  }));

  const nextState: MenuDataState = {
    ...currentState,
    items: [...currentState.items, ...newDishes],
  };

  await syncMenuState(nextState);
  return { success: true, state: nextState, count: newDishes.length };
}
