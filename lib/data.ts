import type { IconName } from "@/components/icons";

export const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "Menu", href: "#menu" },
  { label: "Gallery", href: "#signature" },
  { label: "Reservation", href: "#reservations" },
  { label: "About Us", href: "#about" },
  { label: "Contact Us", href: "#contact" },
] as const;

export const pillars: { title: string; caption: string; icon: IconName }[] = [
  {
    title: "Fresh Ingredients",
    caption: "Always",
    icon: "sun",
  },
  {
    title: "Authentic",
    caption: "Recipes",
    icon: "book",
  },
  {
    title: "Elegant",
    caption: "Ambience",
    icon: "facade",
  },
  {
    title: "Memorable",
    caption: "Experiences",
    icon: "heart",
  },
];

export type RestaurantLocation = {
  id: string;
  city: string;
  district: string;
  country: string;
  address: string;
  hours: string;
  phone: string;
  badge?: string;
  mapUrl: string;
};

export const restaurantLocations: RestaurantLocation[] = [
  {
    id: "bahrain",
    city: "Bahrain",
    district: "Block 338, Adliya",
    country: "Kingdom of Bahrain",
    address: "Road 3819, Block 338, Adliya, Manama",
    hours: "12:00 PM – 11:00 PM (Daily)",
    phone: "+973 1771 4567",
    badge: "Flagship House",
    mapUrl: "https://maps.google.com/?q=Block+338+Adliya+Bahrain",
  },
  {
    id: "abu-dhabi",
    city: "Abu Dhabi",
    district: "Al Maryah Island",
    country: "United Arab Emirates",
    address: "The Galleria Promenade, Al Maryah Island",
    hours: "12:00 PM – 12:00 AM (Daily)",
    phone: "+971 2 645 8920",
    badge: "Waterfront Lounge",
    mapUrl: "https://maps.google.com/?q=The+Galleria+Al+Maryah+Island+Abu+Dhabi",
  },
  {
    id: "beirut",
    city: "Beirut",
    district: "Saifi Village",
    country: "Lebanon",
    address: "Quartier des Arts, Saifi Village, Beirut",
    hours: "1:00 PM – 11:30 PM (Daily)",
    phone: "+961 1 980 120",
    badge: "Artisan Courtyard",
    mapUrl: "https://maps.google.com/?q=Saifi+Village+Beirut+Lebanon",
  },
];


export type Dish = {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  tag?: string;
};

export const signatureDishes: Dish[] = [
  {
    id: "risotto",
    name: "Truffle Mushroom Risotto",
    description:
      "Arborio rice, wild forest porcini, aged parmesan & shaved black truffle.",
    price: "AED 18",
    image: "/images/dish-risotto.jpg",
    tag: "Vegetarian",
  },
  {
    id: "chicken",
    name: "Grilled Lavender Chicken",
    description:
      "Free-range chicken breast infused with Provence lavender, baby carrots & jus.",
    price: "AED 22",
    image: "/images/dish-chicken.jpg",
    tag: "House Favourite",
  },
  {
    id: "lava-cake",
    name: "Chocolate Lava Cake",
    description:
      "Valrhona dark chocolate molten centre served with Tahitian vanilla bean gelato.",
    price: "AED 12",
    image: "/images/dish-lava-cake.jpg",
    tag: "Signature",
  },
  {
    id: "fruit-tart",
    name: "Seasonal Fruit Tart",
    description:
      "Crisp shortbread crust, Madagascar pastry cream, glazed summer berries & mint.",
    price: "AED 10",
    image: "/images/dish-fruit-tart.jpg",
    tag: "Seasonal",
  },
];

export type MenuCategory = {
  id: string;
  label: string;
  intro: string;
  items: { name: string; note: string; price: string }[];
};

export const menuCategories: MenuCategory[] = [
  {
    id: "starters",
    label: "Starters",
    intro: "Small plates to open the palate — bright, herbaceous, unhurried.",
    items: [
      { name: "Hummus & Tahini", note: "Warm chickpeas, olive oil, za’atar", price: "9" },
      { name: "Baba Ganoush", note: "Smoked aubergine, pomegranate molasses", price: "11" },
      { name: "Levantine Fattoush", note: "Garden leaves, sumac, crisp pita", price: "12" },
      { name: "Lamb Arayes", note: "Spiced lamb, garlic toum, griddle bread", price: "16" },
    ],
  },
  {
    id: "mains",
    label: "Main Course",
    intro: "The centre of the table — slow-cooked, flame-finished, generous.",
    items: [
      { name: "Charred Lamb Chops", note: "Rosemary jus, grilled lemon", price: "34" },
      { name: "Braised Short Rib", note: "Baharat spice, root vegetables", price: "32" },
      { name: "Grilled Sea Bass", note: "Levantine herb crust, fennel", price: "31" },
      { name: "Wild Mushroom Risotto", note: "Porcini, truffle, aged parmesan", price: "18" },
    ],
  },
  {
    id: "pasta",
    label: "Pasta & Risotto",
    intro: "Silk-thin hand-rolled pasta and all’onda rice, finished to order.",
    items: [
      { name: "Lobster Linguine", note: "Brown butter, n’duja, citrus", price: "29" },
      { name: "Truffle Risotto", note: "Wild porcini, black truffle", price: "18" },
      { name: "Saffron Orzo", note: "Lamb stock, toasted almond", price: "17" },
      { name: "Aubergine Maklouba", note: "Fried aubergine, tomato, pine nut", price: "15" },
    ],
  },
  {
    id: "desserts",
    label: "Desserts",
    intro: "A quiet, sweet finale — restrained and beautifully made.",
    items: [
      { name: "Chocolate Lava Cake", note: "Valrhona, vanilla bean gelato", price: "12" },
      { name: "Seasonal Fruit Tart", note: "Pastry cream, glazed berries", price: "10" },
      { name: "Baklava & Ashta", note: "Pistachio, filo, clotted cream", price: "11" },
      { name: "Mouhalabia", note: "Orange blossom, almond, rose water", price: "9" },
    ],
  },
  {
    id: "beverages",
    label: "Beverages",
    intro: "Lebanese coffee, mountain herbs and a cellar chosen for the table.",
    items: [
      { name: "Lebanese Coffee", note: "Cardamom, orange blossom", price: "6" },
      { name: "Sage & Lemon", note: "Mountain za’atar infusion", price: "7" },
      { name: "Cellar Red — Lebanese", note: "Béthanie, glass", price: "14" },
      { name: "Arak & Ice", note: "Aniseed, traditional", price: "11" },
    ],
  },
];

export const marqueeItems = [
  "Fresh Ingredients",
  "Timeless Recipes",
  "Slow Hospitality",
  "Levantine Craft",
  "Seasonal & Local",
  "Unhurried Dining",
];

/**
 * Scroll-linked narrative for the pinned "A Culinary Journey" sequence.
 * Each slide reveals in turn as the frame sequence scrubs forward.
 */
export const journeySlides = [
  {
    eyebrow: "Exquisite Flavors • Sophisticated Ambience",
    line1: "A Culinary Journey",
    line2: "Like No Other",
    body: "At Gibran & Co., every dish tells a story. A harmony of fine ingredients, timeless recipes and a passion for exceptional dining.",
    label: "Chef's Tasting Edition",
  },
  {
    eyebrow: "Sourced Daily • Terraces Above Bsharri",
    line1: "Picked Before",
    line2: "The Sun Lifts",
    body: "Herbs cut at first light, olives turned the day they fall, cheese still warm from the village oven. Nothing waits on a shelf longer than it should.",
    label: "Seasonal Mezza Service",
  },
  {
    eyebrow: "Charcoal • Vine Cuttings • Stone Oven",
    line1: "Fire, Salt",
    line2: "And Patience",
    body: "The grill decides the crust. Bread is baked against hot stone, and every sauce is given the time it asks for — unhurried, because the best things are.",
    label: "The Wood-Fired Grill",
  },
  {
    eyebrow: "Cellar Chosen • Plate By Plate",
    line1: "Every Plate",
    line2: "Tells A Story",
    body: "A Lebanese reserve, an old-vintage Burgundy, a Bedouin coffee poured at the close. Pairings that arrive before anyone thinks to ask.",
    label: "The Cellar Pairing",
  },
];

export const infoStrip: {
  label: string;
  value: string;
  icon: IconName;
  id?: string;
}[] = [
  {
    label: "Location",
    value: "Bahrain / Abu Dhabi & Beirut",
    icon: "pin",
  },
  {
    label: "Open Hours",
    value: "12:00 PM – 11:00 PM (Daily)",
    icon: "clock",
  },
  {
    label: "Call Us",
    value: "+973 123 4567",
    icon: "phone",
    id: "contact",
  },
];
