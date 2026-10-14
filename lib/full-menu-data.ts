export type DietaryTag = "All" | "Vegetarian" | "Non-Vegetarian" | "Gluten-Free" | "Chef's Selection";

export type MenuGroup = {
  id: string;
  name: string; // e.g. "Food Menu", "Beverages"
  description?: string;
  order: number;
};

export type MenuSubgroup = {
  id: string;
  groupId: string; // e.g. "food"
  name: string; // e.g. "Starters & Mezze", "Main Courses", "Desserts"
  description?: string;
  order: number;
};

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  groupId: string;
  groupName: string;
  subgroupId: string;
  subgroupName: string;
  badge?: "VEGETARIAN" | "POPULAR" | "CHEF'S PICK" | "HOUSE FAVOURITE" | string;
  image: string;
  dietary: DietaryTag[];
  calories?: string;
  prepTime?: string;
  winePairing?: string;
  ingredients?: string[];
  createdAt?: number;
};

export type MenuCategoryData = {
  id: string;
  label: string;
  icon: "signatures" | "starters" | "mains" | "pasta" | "pizza" | "salads" | "desserts" | "beverages";
  count: number;
  eyebrow: string;
  title: string;
  subtitle: string;
  collectionBadge: string;
  bannerImage: string;
  items: MenuItem[];
};

export const DEFAULT_MENU_GROUPS: MenuGroup[] = [
  {
    id: "food",
    name: "Food Menu",
    description: "Artisanal Levantine and Mediterranean creations",
    order: 1,
  },
  {
    id: "beverages",
    name: "Beverages",
    description: "Crafted mocktails, infusions, and specialty beverages",
    order: 2,
  },
];

export const DEFAULT_MENU_SUBGROUPS: MenuSubgroup[] = [
  {
    id: "starters",
    groupId: "food",
    name: "Starters & Mezze",
    description: "Small plates, mezzas and hot appetizers designed for sharing.",
    order: 1,
  },
  {
    id: "mains",
    groupId: "food",
    name: "Main Courses",
    description: "Wood-fired grills and signature master plates.",
    order: 2,
  },
  {
    id: "desserts",
    groupId: "food",
    name: "Desserts & Sweets",
    description: "Handcrafted baklava, ashta and artisanal sweet finishes.",
    order: 3,
  },
  {
    id: "mocktails",
    groupId: "beverages",
    name: "Signature Mocktails",
    description: "Fresh botanical and fruit mocktails infused with mint and citrus.",
    order: 1,
  },
  {
    id: "hot-drinks",
    groupId: "beverages",
    name: "Coffee & Infusions",
    description: "Cardamom coffees, sage infusions, and slow-steeped herbal teas.",
    order: 2,
  },
];

/**
 * Builds standard MenuCategoryData array dynamically from Groups, Subgroups, and Dishes.
 */
export function buildCategoriesFromGroups(
  groups: MenuGroup[] = DEFAULT_MENU_GROUPS,
  subgroups: MenuSubgroup[] = DEFAULT_MENU_SUBGROUPS,
  items: MenuItem[] = []
): MenuCategoryData[] {
  if (!subgroups || subgroups.length === 0) {
    // Fallback if no subgroups exist yet
    return [
      {
        id: "all",
        label: "All Selections",
        icon: "signatures",
        count: items.length,
        eyebrow: "CURATED MENU",
        title: "All Dishes",
        subtitle: "Explore our culinary creations",
        collectionBadge: "GIBRAN MENU",
        bannerImage: "/images/dish-risotto.jpg",
        items,
      },
    ];
  }

  return subgroups.map((sub) => {
    const parentGroup = groups.find((g) => g.id === sub.groupId);
    const subItems = items.filter(
      (item) => item.subgroupId === sub.id || (!item.subgroupId && item.groupId === sub.groupId)
    );

    const subLower = (sub.id + " " + sub.name).toLowerCase();
    const icon = subLower.includes("bever") || subLower.includes("drink") || subLower.includes("mocktail") || subLower.includes("coffee")
      ? "beverages"
      : subLower.includes("dessert") || subLower.includes("sweet") || subLower.includes("baklava")
      ? "desserts"
      : subLower.includes("main") || subLower.includes("grill")
      ? "mains"
      : subLower.includes("pasta") || subLower.includes("risotto")
      ? "pasta"
      : subLower.includes("pizza")
      ? "pizza"
      : subLower.includes("salad")
      ? "salads"
      : subLower.includes("starter") || subLower.includes("mezze") || subLower.includes("appetiz")
      ? "starters"
      : "signatures";

    return {
      id: sub.id,
      label: sub.name,
      icon,
      count: subItems.length,
      eyebrow: (parentGroup?.name || "CURATED SELECTION").toUpperCase(),
      title: sub.name,
      subtitle: sub.description || `Curated selections from our ${parentGroup?.name || "kitchen"}`,
      collectionBadge: "GIBRAN SELECTION",
      bannerImage: "/images/dish-risotto.jpg",
      items: subItems,
    };
  });
}

// Clean menu categories starting without any hardcoded custom dishes
export const FULL_MENU_CATEGORIES: MenuCategoryData[] = buildCategoriesFromGroups(
  DEFAULT_MENU_GROUPS,
  DEFAULT_MENU_SUBGROUPS,
  []
);
