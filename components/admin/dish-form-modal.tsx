"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { MenuItem, MenuGroup, MenuSubgroup, DietaryTag } from "@/lib/full-menu-data";
import {
  addDishToFirebase,
  updateDishInFirebase,
  uploadDishImageToFirebase,
  MenuDataState,
} from "@/lib/firebase-menu";

export interface DishFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (dish: MenuItem) => void;
  menuState: MenuDataState;
  onQuickAddGroup?: (name: string) => Promise<MenuGroup>;
  onQuickAddSubgroup?: (groupId: string, name: string) => Promise<MenuSubgroup>;
  initialGroupId?: string;
  initialSubgroupId?: string;
  editItem?: MenuItem | null;
}

const AVAILABLE_DIETARY: DietaryTag[] = [
  "Vegetarian",
  "Non-Vegetarian",
  "Gluten-Free",
  "Chef's Selection",
];

const AVAILABLE_BADGES = [
  "",
  "CHEF'S PICK",
  "POPULAR",
  "HOUSE FAVOURITE",
  "VEGETARIAN",
  "SIGNATURE",
] as const;

const PRESET_FOOD_PHOTOS = [
  { label: "Hummus bil Lahme", url: "/assets/gallery/hummus-tahini-mezza.jpg" },
  { label: "Heritage Fattoush", url: "/assets/gallery/levantine-fattoush.jpg" },
  { label: "Truffle Zaatar", url: "/assets/gallery/woodfired-zaatar.jpg" },
  { label: "Crispy Calamari", url: "/images/crispy-calamari.jpg" },
  { label: "Charred Lamb Chops", url: "/assets/gallery/charred-lamb-chops.jpg" },
  { label: "Grilled Sea Bass", url: "/assets/gallery/grilled-sea-bass.jpg" },
  { label: "Saffron Risotto", url: "/images/dish-risotto.jpg" },
  { label: "Roast Baby Chicken", url: "/images/dish-chicken.jpg" },
  { label: "Baklava with Ashta", url: "/assets/gallery/baklava-ashta.jpg" },
  { label: "Molten Lava Cake", url: "/images/dish-lava-cake.jpg" },
  { label: "Wild Berry Tart", url: "/images/dish-fruit-tart.jpg" },
  { label: "Cardamom Coffee", url: "/assets/gallery/roastery-cezve.jpg" },
];

export function DishFormModal({
  isOpen,
  onClose,
  onSaved,
  menuState,
  onQuickAddGroup,
  onQuickAddSubgroup,
  initialGroupId,
  initialSubgroupId,
  editItem = null,
}: DishFormModalProps) {
  const isEditing = !!editItem;
  const groups = menuState.groups;
  const subgroups = menuState.subgroups;

  const [groupId, setGroupId] = useState(
    initialGroupId || groups[0]?.id || "food"
  );
  const [subgroupId, setSubgroupId] = useState(
    initialSubgroupId || subgroups.find((s) => s.groupId === groupId)?.id || subgroups[0]?.id || "starters"
  );

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [badge, setBadge] = useState<string>("");
  const [selectedDietary, setSelectedDietary] = useState<DietaryTag[]>([]);
  const [image, setImage] = useState("/assets/gallery/hummus-tahini-mezza.jpg");
  const [imageMode, setImageMode] = useState<"upload" | "presets" | "url">("upload");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [customImageUrl, setCustomImageUrl] = useState("");
  const [ingredientsInput, setIngredientsInput] = useState("");
  const [calories, setCalories] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [winePairing, setWinePairing] = useState("");

  // Quick inline creation states
  const [showQuickGroupInput, setShowQuickGroupInput] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [showQuickSubgroupInput, setShowQuickSubgroupInput] = useState(false);
  const [newSubgroupName, setNewSubgroupName] = useState("");

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const modalCardRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Available subgroups filtered by selected group
  const availableSubgroups = subgroups.filter((s) => s.groupId === groupId);

  useEffect(() => {
    if (editItem) {
      setName(editItem.name || "");
      setDescription(editItem.description || "");
      setPrice(editItem.price ?? "");
      setBadge(editItem.badge || "");
      setSelectedDietary(editItem.dietary?.filter((d) => d !== "All") || []);
      setImage(editItem.image || "/images/dish-risotto.jpg");
      setCustomImageUrl(editItem.image || "");
      setIngredientsInput(editItem.ingredients?.join(", ") || "");
      setCalories(editItem.calories || "");
      setPrepTime(editItem.prepTime || "");
      setWinePairing(editItem.winePairing || "");
      setGroupId(editItem.groupId || groups[0]?.id || "food");
      setSubgroupId(editItem.subgroupId || subgroups[0]?.id || "starters");
    } else {
      setName("");
      setDescription("");
      setPrice("");
      setBadge("");
      setSelectedDietary([]);
      setImage("/images/dish-risotto.jpg");
      setCustomImageUrl("");
      setIngredientsInput("");
      setCalories("");
      setPrepTime("");
      setWinePairing("");

      const defaultGrp = initialGroupId || groups[0]?.id || "food";
      setGroupId(defaultGrp);
      const defaultSubs = subgroups.filter((s) => s.groupId === defaultGrp);
      setSubgroupId(initialSubgroupId || defaultSubs[0]?.id || subgroups[0]?.id || "starters");
    }
    setErrorMessage("");
    setShowQuickGroupInput(false);
    setShowQuickSubgroupInput(false);
  }, [editItem, initialGroupId, initialSubgroupId, groups, subgroups, isOpen]);

  // Keep subgroupId synced when groupId changes
  const handleGroupChange = (newGrpId: string) => {
    setGroupId(newGrpId);
    const matchingSubs = subgroups.filter((s) => s.groupId === newGrpId);
    if (matchingSubs.length > 0) {
      setSubgroupId(matchingSubs[0].id);
    } else {
      setSubgroupId("");
    }
  };

  // Lock body scroll while modal is open
  useEffect(() => {
    if (!isOpen) return;

    const prevBodyOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.body.style.paddingRight = prevPaddingRight;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleDietary = (tag: DietaryTag) => {
    setSelectedDietary((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setErrorMessage("");
    try {
      const downloadUrl = await uploadDishImageToFirebase(file);
      setImage(downloadUrl);
      setCustomImageUrl(downloadUrl);
      setUploadedFileName(file.name);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error processing photo";
      setErrorMessage(msg);
    } finally {
      setUploading(false);
    }
  };

  const handleQuickAddGroup = async () => {
    if (!newGroupName.trim() || !onQuickAddGroup) return;
    try {
      const created = await onQuickAddGroup(newGroupName.trim());
      setGroupId(created.id);
      setNewGroupName("");
      setShowQuickGroupInput(false);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Error creating group");
    }
  };

  const handleQuickAddSubgroup = async () => {
    if (!newSubgroupName.trim() || !onQuickAddSubgroup) return;
    try {
      const created = await onQuickAddSubgroup(groupId, newSubgroupName.trim());
      setSubgroupId(created.id);
      setNewSubgroupName("");
      setShowQuickSubgroupInput(false);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Error creating subgroup");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!groupId) {
      setErrorMessage("Please select or create a Menu Group (e.g. Food, Beverages)");
      return;
    }
    if (!subgroupId) {
      setErrorMessage("Please select or create a Subgroup (e.g. Starters, Main Courses)");
      return;
    }
    if (!name.trim()) {
      setErrorMessage("Please enter a dish name");
      return;
    }
    if (price === "" || isNaN(Number(price)) || Number(price) <= 0) {
      setErrorMessage("Please enter a valid price (AED)");
      return;
    }
    if (!description.trim()) {
      setErrorMessage("Please enter a culinary description");
      return;
    }

    setSubmitting(true);

    const ingredients = ingredientsInput
      .split(/[,;\n]+/)
      .map((i) => i.trim())
      .filter((i) => i.length > 0);

    const selGroup = groups.find((g) => g.id === groupId);
    const selSubgroup = subgroups.find((s) => s.id === subgroupId);

    const dishPayload = {
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      groupId,
      groupName: selGroup?.name || "Food Menu",
      subgroupId,
      subgroupName: selSubgroup?.name || "Starters & Mezze",
      badge: badge ? (badge as MenuItem["badge"]) : undefined,
      image: image || "/images/dish-risotto.jpg",
      dietary: ["All", ...selectedDietary] as MenuItem["dietary"],
      ingredients: ingredients.length > 0 ? ingredients : undefined,
      calories: calories.trim() || undefined,
      prepTime: prepTime.trim() || undefined,
      winePairing: winePairing.trim() || undefined,
    };

    try {
      if (isEditing && editItem) {
        const res = await updateDishInFirebase(editItem.id, dishPayload, menuState);
        onSaved(res.item);
        onClose();
      } else {
        const res = await addDishToFirebase(dishPayload, menuState);
        onSaved(res.item);
        onClose();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving dish to Firebase";
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        data-lenis-prevent="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 sm:p-4 md:p-6 backdrop-blur-sm overflow-hidden overscroll-contain"
        onClick={onClose}
      >
        <motion.div
          ref={modalCardRef}
          data-lenis-prevent="true"
          initial={{ scale: 0.95, y: 16, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.96, y: 12, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative flex flex-col w-full max-w-4xl h-[90vh] max-h-[92vh] overflow-hidden rounded-2xl border border-[#D5C9B3] bg-[#FAF7F0] shadow-2xl overscroll-contain"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="shrink-0 flex items-center justify-between border-b border-[#ECE5D6] bg-white px-5 py-3.5 sm:px-6 sm:py-4">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#9A7B4F]">
                Gibran &amp; Co. Backstage
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-light text-[#1C241B]">
                {isEditing ? `Edit Dish: ${editItem.name}` : "Add New Dish to Live Menu"}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FAF7F0] text-[#1C241B] transition-colors hover:bg-[#EAE4D5]"
            >
              ✕
            </button>
          </div>

          {/* Form + Preview Grid */}
          <div
            ref={scrollContainerRef}
            tabIndex={0}
            className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-6 focus:outline-none"
            style={{
              WebkitOverflowScrolling: "touch",
              overscrollBehavior: "contain",
            }}
          >
            <form id="dish-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              {/* LEFT: FORM INPUTS (7 cols) */}
              <div className="space-y-5 lg:col-span-7">
                {errorMessage && (
                  <div className="rounded-lg bg-red-50 p-3 text-xs font-medium text-red-700 border border-red-200">
                    {errorMessage}
                  </div>
                )}

                {/* 1. Group & Subgroup Row */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 bg-white/70 p-4 rounded-xl border border-[#ECE5D6]">
                  {/* Group Selection */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#4A5446]">
                        1. Menu Group *
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowQuickGroupInput(!showQuickGroupInput)}
                        className="text-[10px] font-bold text-[#6d7835] hover:underline"
                      >
                        {showQuickGroupInput ? "Cancel" : "+ New Group"}
                      </button>
                    </div>

                    {showQuickGroupInput ? (
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          placeholder="e.g. Shisha or Desserts"
                          value={newGroupName}
                          onChange={(e) => setNewGroupName(e.target.value)}
                          className="flex-1 rounded-lg border border-[#6d7835] bg-white px-3 py-1.5 text-xs text-[#1C241B] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleQuickAddGroup}
                          className="rounded-lg bg-[#1C241B] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#2C382A]"
                        >
                          Add
                        </button>
                      </div>
                    ) : (
                      <select
                        value={groupId}
                        onChange={(e) => handleGroupChange(e.target.value)}
                        className="w-full rounded-xl border border-[#D5C9B3] bg-white px-3.5 py-2 text-xs font-medium text-[#1C241B] focus:border-[#6d7835] focus:outline-none"
                      >
                        {groups.map((g) => (
                          <option key={g.id} value={g.id}>
                            {g.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* Subgroup Selection */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#4A5446]">
                        2. Subgroup *
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowQuickSubgroupInput(!showQuickSubgroupInput)}
                        className="text-[10px] font-bold text-[#6d7835] hover:underline"
                      >
                        {showQuickSubgroupInput ? "Cancel" : "+ New Subgroup"}
                      </button>
                    </div>

                    {showQuickSubgroupInput ? (
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          placeholder="e.g. Cold Mezze"
                          value={newSubgroupName}
                          onChange={(e) => setNewSubgroupName(e.target.value)}
                          className="flex-1 rounded-lg border border-[#6d7835] bg-white px-3 py-1.5 text-xs text-[#1C241B] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleQuickAddSubgroup}
                          className="rounded-lg bg-[#1C241B] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#2C382A]"
                        >
                          Add
                        </button>
                      </div>
                    ) : (
                      <select
                        value={subgroupId}
                        onChange={(e) => setSubgroupId(e.target.value)}
                        className="w-full rounded-xl border border-[#D5C9B3] bg-white px-3.5 py-2 text-xs font-medium text-[#1C241B] focus:border-[#6d7835] focus:outline-none"
                      >
                        {availableSubgroups.length === 0 ? (
                          <option value="">No subgroups yet — click + New Subgroup</option>
                        ) : (
                          availableSubgroups.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name}
                            </option>
                          ))
                        )}
                      </select>
                    )}
                  </div>
                </div>

                {/* Dish Name & Price */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5446] mb-1.5">
                      Dish Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Slow-Braised Lamb Shank"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-[#D5C9B3] bg-white px-4 py-2.5 text-sm text-[#1C241B] placeholder-[#9E9B93] focus:border-[#6d7835] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5446] mb-1.5">
                      Price (AED) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0.5"
                      step="0.5"
                      placeholder="28"
                      value={price}
                      onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
                      className="w-full rounded-xl border border-[#D5C9B3] bg-white px-4 py-2.5 text-sm text-[#1C241B] font-semibold tabular-nums placeholder-[#9E9B93] focus:border-[#6d7835] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Culinary Description */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5446] mb-1.5">
                    Culinary Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe textures, spices, preparation method, and presentation..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-xl border border-[#D5C9B3] bg-white px-4 py-2.5 text-sm leading-relaxed text-[#1C241B] placeholder-[#9E9B93] focus:border-[#6d7835] focus:outline-none"
                  />
                </div>

                {/* Badge & Dietary Tags */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5446] mb-1.5">
                      Distinction Badge
                    </label>
                    <select
                      value={badge}
                      onChange={(e) => setBadge(e.target.value)}
                      className="w-full rounded-xl border border-[#D5C9B3] bg-white px-3.5 py-2 text-xs text-[#1C241B] focus:border-[#6d7835] focus:outline-none"
                    >
                      <option value="">No Special Badge</option>
                      {AVAILABLE_BADGES.filter(Boolean).map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5446] mb-1.5">
                      Dietary Tags
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {AVAILABLE_DIETARY.map((tag) => {
                        const active = selectedDietary.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => toggleDietary(tag)}
                            className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                              active
                                ? "bg-[#1C241B] text-white"
                                : "bg-white border border-[#D5C9B3] text-[#5A6355] hover:border-[#1C241B]"
                            }`}
                          >
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Dish Photo: Upload directly or provide URL */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#4A5446]">
                      Dish Photography *
                    </label>
                    <div className="flex gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setImageMode("upload")}
                        className={`font-medium transition-colors ${
                          imageMode === "upload" ? "text-[#1C241B] underline font-bold" : "text-[#7A8374] hover:text-[#1C241B]"
                        }`}
                      >
                        Upload Photo
                      </button>
                      <span className="text-[#D5C9B3]">|</span>
                      <button
                        type="button"
                        onClick={() => setImageMode("presets")}
                        className={`font-medium transition-colors ${
                          imageMode === "presets" ? "text-[#1C241B] underline font-bold" : "text-[#7A8374] hover:text-[#1C241B]"
                        }`}
                      >
                        Lebanese Presets
                      </button>
                      <span className="text-[#D5C9B3]">|</span>
                      <button
                        type="button"
                        onClick={() => setImageMode("url")}
                        className={`font-medium transition-colors ${
                          imageMode === "url" ? "text-[#1C241B] underline font-bold" : "text-[#7A8374] hover:text-[#1C241B]"
                        }`}
                      >
                        Image URL
                      </button>
                    </div>
                  </div>

                  {imageMode === "upload" ? (
                    <div className="rounded-xl border-2 border-dashed border-[#D5C9B3] bg-white p-5 text-center transition-colors hover:border-[#1C241B]">
                      <input
                        type="file"
                        accept="image/*"
                        id="dish-file-upload-input"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="dish-file-upload-input"
                        className="cursor-pointer inline-flex flex-col items-center gap-1.5 text-xs text-[#5A6355]"
                      >
                        <span className="text-2xl">📸</span>
                        <span className="font-semibold text-[#1C241B]">
                          {uploading
                            ? "Converting to Base64..."
                            : uploadedFileName
                            ? `✓ ${uploadedFileName} (Click to change)`
                            : "Click to upload dish photo"}
                        </span>
                        <span className="text-[10px] text-[#868E81]">
                          Client-side Base64 conversion (PNG, JPG, WEBP). Optimized for instant loading.
                        </span>
                      </label>
                    </div>
                  ) : imageMode === "presets" ? (
                    <div className="rounded-xl border border-[#D5C9B3] bg-[#FAF7F0]/60 p-3">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#7A8374] block mb-2">
                        Select an authentic Lebanese culinary photo:
                      </span>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1">
                        {PRESET_FOOD_PHOTOS.map((preset) => {
                          const isSelected = image === preset.url;
                          return (
                            <button
                              key={preset.url}
                              type="button"
                              onClick={() => {
                                setImage(preset.url);
                                setCustomImageUrl(preset.url);
                              }}
                              className={`group relative flex flex-col items-center overflow-hidden rounded-lg border text-left transition-all ${
                                isSelected
                                  ? "border-[#1C241B] ring-2 ring-[#1C241B]/30"
                                  : "border-[#ECE5D6] hover:border-[#1C241B]"
                              }`}
                            >
                              <div className="relative h-14 w-full bg-[#ECE5D6]">
                                <Image
                                  src={preset.url}
                                  alt={preset.label}
                                  fill
                                  unoptimized
                                  className="object-cover"
                                />
                                {isSelected && (
                                  <div className="absolute inset-0 bg-[#1C241B]/30 flex items-center justify-center text-white text-xs font-bold">
                                    ✓
                                  </div>
                                )}
                              </div>
                              <span className="w-full bg-white px-1.5 py-1 text-[9px] font-medium text-[#1C241B] truncate text-center">
                                {preset.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/... or /images/..."
                        value={customImageUrl}
                        onChange={(e) => {
                          setCustomImageUrl(e.target.value);
                          if (e.target.value.trim()) setImage(e.target.value.trim());
                        }}
                        className="w-full rounded-xl border border-[#D5C9B3] bg-white px-4 py-2.5 text-xs text-[#1C241B] focus:border-[#6d7835] focus:outline-none"
                      />
                    </div>
                  )}
                </div>

                {/* Optional Culinary Specifications */}
                <div className="rounded-xl border border-[#ECE5D6] bg-white/70 p-4 space-y-3">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#6E7569]">
                    Culinary Specifications &amp; Sommelier Pairing (Optional)
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#5A6355] mb-1">
                      Key Ingredients (comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Acquerello Rice, Wild Porcini, Aged 24m Parmesan"
                      value={ingredientsInput}
                      onChange={(e) => setIngredientsInput(e.target.value)}
                      className="w-full rounded-lg border border-[#D5C9B3] bg-white px-3 py-1.5 text-xs text-[#1C241B] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-[#5A6355] mb-1">
                        Wine Pairing
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Massaya Gold Reserve"
                        value={winePairing}
                        onChange={(e) => setWinePairing(e.target.value)}
                        className="w-full rounded-lg border border-[#D5C9B3] bg-white px-3 py-1.5 text-xs text-[#1C241B] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-[#5A6355] mb-1">
                        Calories
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 520 kcal"
                        value={calories}
                        onChange={(e) => setCalories(e.target.value)}
                        className="w-full rounded-lg border border-[#D5C9B3] bg-white px-3 py-1.5 text-xs text-[#1C241B] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-[#5A6355] mb-1">
                        Prep Time
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 15 mins"
                        value={prepTime}
                        onChange={(e) => setPrepTime(e.target.value)}
                        className="w-full rounded-lg border border-[#D5C9B3] bg-white px-3 py-1.5 text-xs text-[#1C241B] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT: LIVE CARD PREVIEW (5 cols) */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <div className="sticky top-0 w-full space-y-3">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#9A7B4F] block text-center">
                    Live Public Menu Card Preview
                  </span>

                  {/* Render exact card */}
                  <div className="rounded-2xl border border-[#ECE5D6] bg-white p-3.5 shadow-xl">
                    <div className="relative mb-3 h-44 w-full overflow-hidden rounded-xl bg-[#F2EDE2]">
                      {image ? (
                        <Image
                          src={image}
                          alt={name || "Dish Preview"}
                          fill
                          unoptimized
                          sizes="300px"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-xs text-[#8A9A86]">
                          No image selected
                        </div>
                      )}

                      {badge && (
                        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[9px] font-bold tracking-wider text-[#1C241B] uppercase shadow-xs backdrop-blur-sm">
                          {badge}
                        </span>
                      )}

                      <span className="absolute right-3 bottom-3 rounded-full bg-[#162115]/80 px-2 py-0.5 text-[9px] font-mono text-white backdrop-blur-xs">
                        {subgroups.find((s) => s.id === subgroupId)?.name || "Subgroup"}
                      </span>
                    </div>

                    <div className="min-h-[64px]">
                      <h3 className="font-serif text-base font-semibold leading-snug text-[#1C241B]">
                        {name || "Your Dish Title"}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#6E7569]">
                        {description || "Dish description and notes will appear here as you type..."}
                      </p>
                    </div>

                    {selectedDietary.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {selectedDietary.map((d) => (
                          <span
                            key={d}
                            className="rounded-full bg-[#FAF7F0] border border-[#ECE5D6] px-2 py-0.5 text-[9px] font-medium text-[#586255]"
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-3 flex items-center justify-between border-t border-[#F2ECE0] pt-3">
                      <span className="font-sans text-base font-bold tabular-nums text-[#1C241B]">
                        AED {price !== "" ? price : "—"}
                      </span>
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#6d7835] text-white text-xs font-bold shadow-xs">
                        +
                      </div>
                    </div>
                  </div>

                  <div className="text-center space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#7A8374] block">
                      Assigned Group: <strong className="text-[#1C241B]">{groups.find((g) => g.id === groupId)?.name || "—"}</strong>
                    </span>
                    <p className="text-[11px] text-[#7A8374] italic">
                      Card updates dynamically in real time
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Footer Actions */}
          <div className="shrink-0 flex items-center justify-between border-t border-[#ECE5D6] bg-white px-5 py-3.5 sm:px-6 sm:py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-full border border-[#D5C9B3] px-5 py-2 text-xs font-semibold uppercase tracking-wider text-[#5A6355] transition-colors hover:bg-[#FAF7F0]"
            >
              Cancel
            </button>

            <button
              type="submit"
              form="dish-form"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-full bg-[#1C241B] px-7 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-md transition-all hover:bg-[#2C382A] hover:scale-[1.02] disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Saving Dish to Firebase...</span>
                </>
              ) : (
                <span>{isEditing ? "Save Dish Changes" : "Publish Dish to Live Menu"}</span>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
