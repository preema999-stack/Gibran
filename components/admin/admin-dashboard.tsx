"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MenuGroup,
  MenuSubgroup,
  MenuItem,
  DietaryTag,
  DEFAULT_MENU_GROUPS,
  DEFAULT_MENU_SUBGROUPS,
  buildCategoriesFromGroups,
} from "@/lib/full-menu-data";
import { DishFormModal } from "@/components/admin/dish-form-modal";
import {
  getMenuFromFirebase,
  subscribeToFirebaseMenu,
  deleteDishFromFirebase,
  clearAllDishesFromFirebase,
  addGroupToFirebase,
  updateGroupInFirebase,
  deleteGroupFromFirebase,
  addSubgroupToFirebase,
  updateSubgroupInFirebase,
  deleteSubgroupFromFirebase,
  checkFirestoreConnection,
  seedSampleLebaneseDishes,
  MenuDataState,
} from "@/lib/firebase-menu";

export function AdminDashboard({
  initialCategories,
}: {
  initialCategories?: unknown;
}) {
  const [menuState, setMenuState] = useState<MenuDataState>({
    groups: DEFAULT_MENU_GROUPS,
    subgroups: DEFAULT_MENU_SUBGROUPS,
    items: [],
    categories: buildCategoriesFromGroups(DEFAULT_MENU_GROUPS, DEFAULT_MENU_SUBGROUPS, []),
  });

  // Top tab: "dishes" or "structure" (groups & subgroups)
  const [currentTab, setCurrentTab] = useState<"dishes" | "structure">("dishes");

  // Filter States for dishes
  const [activeGroupFilter, setActiveGroupFilter] = useState<string>("all");
  const [activeSubgroupFilter, setActiveSubgroupFilter] = useState<string>("all");
  const [activeDietaryFilter, setActiveDietaryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Modal State
  const [isAddDishModalOpen, setIsAddDishModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);
  const [isClearDishesConfirmOpen, setIsClearDishesConfirmOpen] = useState(false);

  // Group / Subgroup Edit Modal States
  const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<MenuGroup | null>(null);
  const [groupToDelete, setGroupToDelete] = useState<MenuGroup | null>(null);
  const [groupFormName, setGroupFormName] = useState("");
  const [groupFormDesc, setGroupFormDesc] = useState("");

  const [isAddSubgroupModalOpen, setIsAddSubgroupModalOpen] = useState(false);
  const [targetGroupIdForSubgroup, setTargetGroupIdForSubgroup] = useState<string>("");
  const [editingSubgroup, setEditingSubgroup] = useState<MenuSubgroup | null>(null);
  const [subgroupToDelete, setSubgroupToDelete] = useState<MenuSubgroup | null>(null);
  const [subgroupFormName, setSubgroupFormName] = useState("");
  const [subgroupFormDesc, setSubgroupFormDesc] = useState("");

  // Firestore status & Diagnostics
  const [firestoreStatus, setFirestoreStatus] = useState<{
    connected: boolean;
    projectId: string;
    error?: string;
  }>({
    connected: true,
    projectId: "gibran-2f16c",
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Subscribe to real-time updates from Firebase Firestore
  useEffect(() => {
    const unsubscribe = subscribeToFirebaseMenu((updated) => {
      setMenuState(updated);
    });

    // Check Firestore connection
    checkFirestoreConnection().then((res) => {
      setFirestoreStatus(res);
    });

    return () => unsubscribe();
  }, []);

  const refreshMenu = async () => {
    setIsLoading(true);
    try {
      const live = await getMenuFromFirebase();
      setMenuState(live);
      const conn = await checkFirestoreConnection();
      setFirestoreStatus(conn);
      showToast("Menu synced with Firebase");
    } catch {
      showToast("Error refreshing menu from Firebase");
    } finally {
      setIsLoading(false);
    }
  };

  // Lock scrolling when confirmation modals are open
  useEffect(() => {
    const hasOpenModal =
      !!itemToDelete ||
      isClearDishesConfirmOpen ||
      isAddGroupModalOpen ||
      !!editingGroup ||
      !!groupToDelete ||
      isAddSubgroupModalOpen ||
      !!editingSubgroup ||
      !!subgroupToDelete;

    if (!hasOpenModal) return;

    const prevBody = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevBody;
    };
  }, [
    itemToDelete,
    isClearDishesConfirmOpen,
    isAddGroupModalOpen,
    editingGroup,
    groupToDelete,
    isAddSubgroupModalOpen,
    editingSubgroup,
    subgroupToDelete,
  ]);

  // Subgroups available for the currently selected group filter
  const subgroupsForActiveGroup = useMemo(() => {
    if (activeGroupFilter === "all") return menuState.subgroups;
    return menuState.subgroups.filter((s) => s.groupId === activeGroupFilter);
  }, [menuState.subgroups, activeGroupFilter]);

  // Reset subgroup filter if active group filter changes
  useEffect(() => {
    if (activeGroupFilter !== "all") {
      const exists = menuState.subgroups.some(
        (s) => s.groupId === activeGroupFilter && s.id === activeSubgroupFilter
      );
      if (!exists && activeSubgroupFilter !== "all") {
        setActiveSubgroupFilter("all");
      }
    }
  }, [activeGroupFilter, menuState.subgroups, activeSubgroupFilter]);

  // Filtered dishes
  const filteredDishes = useMemo(() => {
    return menuState.items.filter((dish) => {
      // Group filter
      if (activeGroupFilter !== "all" && dish.groupId !== activeGroupFilter) {
        return false;
      }
      // Subgroup filter
      if (activeSubgroupFilter !== "all" && dish.subgroupId !== activeSubgroupFilter) {
        return false;
      }
      // Dietary filter
      if (
        activeDietaryFilter !== "all" &&
        !dish.dietary?.includes(activeDietaryFilter as DietaryTag)
      ) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inName = dish.name.toLowerCase().includes(q);
        const inDesc = dish.description.toLowerCase().includes(q);
        const inIngr = dish.ingredients?.some((ing) => ing.toLowerCase().includes(q));
        const inBadge = dish.badge?.toLowerCase().includes(q);
        const inGroup = dish.groupName?.toLowerCase().includes(q);
        const inSubgroup = dish.subgroupName?.toLowerCase().includes(q);
        if (!inName && !inDesc && !inIngr && !inBadge && !inGroup && !inSubgroup) {
          return false;
        }
      }
      return true;
    });
  }, [
    menuState.items,
    activeGroupFilter,
    activeSubgroupFilter,
    activeDietaryFilter,
    searchQuery,
  ]);

  // Metrics
  const totalDishes = menuState.items.length;
  const totalGroups = menuState.groups.length;
  const totalSubgroups = menuState.subgroups.length;
  const avgPrice = useMemo(() => {
    if (totalDishes === 0) return 0;
    const sum = menuState.items.reduce((acc, d) => acc + (d.price || 0), 0);
    return Math.round((sum / totalDishes) * 10) / 10;
  }, [menuState.items, totalDishes]);

  // ==========================================
  // DISH ACTIONS
  // ==========================================
  const handleDeleteDishConfirm = async () => {
    if (!itemToDelete) return;
    setIsLoading(true);
    try {
      const res = await deleteDishFromFirebase(itemToDelete.id, menuState);
      if (res.success) {
        setMenuState(res.state);
        showToast(`"${itemToDelete.name}" deleted from menu`);
      }
    } catch {
      showToast("Error deleting dish");
    } finally {
      setItemToDelete(null);
      setIsLoading(false);
    }
  };

  const handleClearAllDishesConfirm = async () => {
    setIsLoading(true);
    try {
      const res = await clearAllDishesFromFirebase(menuState);
      if (res.success) {
        setMenuState(res.state);
        showToast("All custom dishes cleared. Menu is ready for fresh entries.");
      }
    } catch {
      showToast("Error clearing dishes");
    } finally {
      setIsClearDishesConfirmOpen(false);
      setIsLoading(false);
    }
  };

  const handleSeedLebaneseDishes = async () => {
    setIsLoading(true);
    try {
      const res = await seedSampleLebaneseDishes(menuState);
      if (res.success) {
        setMenuState(res.state);
        showToast(`Loaded ${res.count} authentic Lebanese fine dining creations!`);
      }
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Error loading sample dishes");
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // GROUP ACTIONS
  // ==========================================
  const handleSaveGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupFormName.trim()) return;
    setIsLoading(true);
    try {
      if (editingGroup) {
        const res = await updateGroupInFirebase(
          editingGroup.id,
          { name: groupFormName.trim(), description: groupFormDesc.trim() },
          menuState
        );
        if (res.success) {
          setMenuState(res.state);
          showToast(`Group "${groupFormName}" updated`);
        }
      } else {
        const res = await addGroupToFirebase(
          groupFormName.trim(),
          menuState,
          groupFormDesc.trim()
        );
        if (res.success) {
          setMenuState(res.state);
          showToast(`Group "${res.group.name}" created`);
        }
      }
      setIsAddGroupModalOpen(false);
      setEditingGroup(null);
      setGroupFormName("");
      setGroupFormDesc("");
    } catch {
      showToast("Error saving group");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteGroupConfirm = async () => {
    if (!groupToDelete) return;
    setIsLoading(true);
    try {
      const res = await deleteGroupFromFirebase(groupToDelete.id, menuState);
      if (res.success) {
        setMenuState(res.state);
        showToast(`Group "${groupToDelete.name}" and its contents removed`);
      }
    } catch {
      showToast("Error deleting group");
    } finally {
      setGroupToDelete(null);
      setIsLoading(false);
    }
  };

  // ==========================================
  // SUBGROUP ACTIONS
  // ==========================================
  const handleSaveSubgroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subgroupFormName.trim() || !targetGroupIdForSubgroup) return;
    setIsLoading(true);
    try {
      if (editingSubgroup) {
        const res = await updateSubgroupInFirebase(
          editingSubgroup.id,
          {
            name: subgroupFormName.trim(),
            description: subgroupFormDesc.trim(),
            groupId: targetGroupIdForSubgroup,
          },
          menuState
        );
        if (res.success) {
          setMenuState(res.state);
          showToast(`Subgroup "${subgroupFormName}" updated`);
        }
      } else {
        const res = await addSubgroupToFirebase(
          targetGroupIdForSubgroup,
          subgroupFormName.trim(),
          menuState,
          subgroupFormDesc.trim()
        );
        if (res.success) {
          setMenuState(res.state);
          showToast(`Subgroup "${res.subgroup.name}" created`);
        }
      }
      setIsAddSubgroupModalOpen(false);
      setEditingSubgroup(null);
      setSubgroupFormName("");
      setSubgroupFormDesc("");
    } catch {
      showToast("Error saving subgroup");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSubgroupConfirm = async () => {
    if (!subgroupToDelete) return;
    setIsLoading(true);
    try {
      const res = await deleteSubgroupFromFirebase(subgroupToDelete.id, menuState);
      if (res.success) {
        setMenuState(res.state);
        showToast(`Subgroup "${subgroupToDelete.name}" and its dishes removed`);
      }
    } catch {
      showToast("Error deleting subgroup");
    } finally {
      setSubgroupToDelete(null);
      setIsLoading(false);
    }
  };

  // Quick inline creation wrappers for DishFormModal
  const handleQuickAddGroup = async (name: string): Promise<MenuGroup> => {
    const res = await addGroupToFirebase(name, menuState);
    setMenuState(res.state);
    return res.group;
  };

  const handleQuickAddSubgroup = async (
    grpId: string,
    name: string
  ): Promise<MenuSubgroup> => {
    const res = await addSubgroupToFirebase(grpId, name, menuState);
    setMenuState(res.state);
    return res.subgroup;
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#1C241B]">
      {/* 1. TOP LUXURY NAVIGATION BAR */}
      <header className="sticky top-0 z-40 border-b border-[#ECE5D6] bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/images/logo-gold.png"
                alt="Gibran & Co."
                width={34}
                height={34}
                className="h-8 w-8 object-contain"
              />
              <div>
                <span className="font-serif text-lg font-medium tracking-wide text-[#1C241B] block leading-none">
                  GIBRAN &amp; CO.
                </span>
                <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9A7B4F]">
                  Curatorial Administration
                </span>
              </div>
            </Link>

            <span className="hidden sm:inline-block h-4 w-px bg-[#ECE5D6]" />

            {/* Firestore Live Status Pill */}
            <div
              className={`hidden sm:inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-mono transition-colors ${
                firestoreStatus.connected
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-amber-50 text-amber-800 border border-amber-200"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  firestoreStatus.connected
                    ? "bg-emerald-500 animate-pulse"
                    : "bg-amber-500"
                }`}
              />
              <span>
                {firestoreStatus.connected
                  ? `Firestore: ${firestoreStatus.projectId}`
                  : "Firestore Local Cache"}
              </span>
            </div>
          </div>

          {/* Quick Links & CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/menu"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-[#D5C9B3] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#5A6355] transition-colors hover:border-[#1C241B] hover:text-[#1C241B]"
            >
              <span>Public Live Menu</span>
              <span className="text-[10px]">↗</span>
            </Link>

            <button
              type="button"
              onClick={() => {
                setEditingItem(null);
                setIsAddDishModalOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-full bg-[#1C241B] px-4 py-2 sm:px-5 sm:py-2 text-xs font-semibold uppercase tracking-wider text-white shadow-md transition-all hover:bg-[#2F3A2C] hover:scale-[1.02]"
            >
              <span className="text-sm font-bold leading-none">+</span>
              <span>Add Dish</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN DASHBOARD CONTENT */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 space-y-6 sm:space-y-8">
        {/* KPI METRIC CARDS */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
          <div className="rounded-2xl border border-[#ECE5D6] bg-white p-4 sm:p-5 shadow-xs transition-all hover:border-[#D5C9B3] hover:shadow-sm">
            <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6E7868] block">
              Total Live Dishes
            </span>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-[#1C241B] tabular-nums">
                {totalDishes}
              </span>
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-sans font-medium text-emerald-700 border border-emerald-200/60">
                Active
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-[#ECE5D6] bg-white p-4 sm:p-5 shadow-xs transition-all hover:border-[#D5C9B3] hover:shadow-sm">
            <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6E7868] block">
              Menu Groups
            </span>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-[#1C241B] tabular-nums">
                {totalGroups}
              </span>
              <span className="font-sans text-xs text-[#7A8374]">
                e.g. Food, Beverage
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-[#ECE5D6] bg-white p-4 sm:p-5 shadow-xs transition-all hover:border-[#D5C9B3] hover:shadow-sm">
            <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6E7868] block">
              Subgroups
            </span>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-[#1C241B] tabular-nums">
                {totalSubgroups}
              </span>
              <span className="inline-flex items-center rounded-full bg-[#FAF5EE] px-2 py-0.5 text-[11px] font-sans font-medium text-[#9E7B4F] border border-[#E8DEC9]">
                Sections
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-[#ECE5D6] bg-white p-4 sm:p-5 shadow-xs transition-all hover:border-[#D5C9B3] hover:shadow-sm">
            <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6E7868] block">
              Average Dish Price
            </span>
            <div className="mt-2.5 flex items-baseline gap-1.5">
              <span className="font-sans text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#9E7B4F]">
                AED
              </span>
              <span className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-[#1C241B] tabular-nums">
                {avgPrice}
              </span>
            </div>
          </div>
        </div>

        {/* PRIMARY VIEW SWITCHER: DISHES vs GROUPS & SUBGROUPS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ECE5D6] pb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentTab("dishes")}
              className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                currentTab === "dishes"
                  ? "bg-[#1C241B] text-white shadow-md"
                  : "bg-white border border-[#D5C9B3] text-[#5A6355] hover:text-[#1C241B]"
              }`}
            >
              🍽️ Dishes ({totalDishes})
            </button>
            <button
              type="button"
              onClick={() => setCurrentTab("structure")}
              className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                currentTab === "structure"
                  ? "bg-[#1C241B] text-white shadow-md"
                  : "bg-white border border-[#D5C9B3] text-[#5A6355] hover:text-[#1C241B]"
              }`}
            >
              📁 Groups &amp; Subgroups ({totalGroups} Groups • {totalSubgroups} Subgroups)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSeedLebaneseDishes}
              disabled={isLoading}
              title="Quick-load 12 authentic Lebanese fine dining dishes with photography"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#6d7835] bg-[#6d7835]/10 px-3 py-1.5 text-xs font-semibold text-[#545e26] hover:bg-[#6d7835]/20 transition-colors"
            >
              <span>⚡</span>
              <span>Load Lebanese Tasting Menu</span>
            </button>

            <button
              type="button"
              onClick={refreshMenu}
              disabled={isLoading}
              title="Refresh from Firebase"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#D5C9B3] bg-white px-3 py-1.5 text-xs text-[#5A6355] hover:bg-[#FAF7F0] transition-colors"
            >
              <span>🔄</span>
              <span>Sync Firestore</span>
            </button>

            {totalDishes > 0 && (
              <button
                type="button"
                onClick={() => setIsClearDishesConfirmOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50/70 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 transition-colors"
                title="Remove all dishes and start fresh"
              >
                <span>🗑️</span>
                <span>Clear All Dishes</span>
              </button>
            )}
          </div>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: DISHES MANAGEMENT */}
        {/* ============================================================== */}
        {currentTab === "dishes" && (
          <div className="space-y-6">
            {/* CONTROLS BAR: SEARCH & FILTERS */}
            <div className="rounded-2xl border border-[#ECE5D6] bg-white p-4 sm:p-5 shadow-xs space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {/* Search Input */}
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    placeholder="Search dishes by name, ingredients, badge, group..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-[#D5C9B3] bg-[#FAF7F0]/60 pl-9 pr-4 py-2 text-xs sm:text-sm text-[#1C241B] placeholder-[#9E9B93] focus:border-[#1C241B] focus:bg-white focus:outline-none"
                  />
                  <span className="absolute left-3 top-2.5 text-xs text-[#8A9A86]">🔍</span>
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-2 text-xs text-[#8A9A86] hover:text-[#1C241B]"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-2">
                  <div className="flex rounded-lg border border-[#D5C9B3] p-0.5 bg-[#FAF7F0]">
                    <button
                      type="button"
                      onClick={() => setViewMode("grid")}
                      className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                        viewMode === "grid"
                          ? "bg-white text-[#1C241B] shadow-xs"
                          : "text-[#6E7569] hover:text-[#1C241B]"
                      }`}
                    >
                      Grid
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("table")}
                      className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                        viewMode === "table"
                          ? "bg-white text-[#1C241B] shadow-xs"
                          : "text-[#6E7569] hover:text-[#1C241B]"
                      }`}
                    >
                      Table
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingItem(null);
                      setIsAddDishModalOpen(true);
                    }}
                    className="rounded-full bg-[#1C241B] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#2C382A]"
                  >
                    + Add Dish
                  </button>
                </div>
              </div>

              {/* Group Filter Row */}
              <div className="flex flex-wrap items-center gap-1.5 border-t border-[#ECE5D6] pt-3 text-xs">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#7A8374] mr-1">
                  Group:
                </span>
                <button
                  type="button"
                  onClick={() => setActiveGroupFilter("all")}
                  className={`rounded-full px-3 py-1 font-medium transition-colors ${
                    activeGroupFilter === "all"
                      ? "bg-[#1C241B] text-white shadow-xs"
                      : "bg-[#FAF7F0] text-[#5A6355] hover:bg-[#ECE5D6]"
                  }`}
                >
                  All Groups ({totalDishes})
                </button>
                {menuState.groups.map((grp) => {
                  const count = menuState.items.filter((it) => it.groupId === grp.id).length;
                  return (
                    <button
                      key={grp.id}
                      type="button"
                      onClick={() => setActiveGroupFilter(grp.id)}
                      className={`rounded-full px-3 py-1 font-medium transition-colors ${
                        activeGroupFilter === grp.id
                          ? "bg-[#1C241B] text-white shadow-xs"
                          : "bg-[#FAF7F0] text-[#5A6355] hover:bg-[#ECE5D6]"
                      }`}
                    >
                      {grp.name} ({count})
                    </button>
                  );
                })}
              </div>

              {/* Subgroup Filter Row */}
              {subgroupsForActiveGroup.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 border-t border-[#ECE5D6]/60 pt-2 text-xs">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#7A8374] mr-1">
                    Subgroup:
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveSubgroupFilter("all")}
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors ${
                      activeSubgroupFilter === "all"
                        ? "bg-[#6d7835] text-white"
                        : "bg-white border border-[#D5C9B3] text-[#5A6355] hover:border-[#1C241B]"
                    }`}
                  >
                    All Subgroups
                  </button>
                  {subgroupsForActiveGroup.map((sub) => {
                    const count = menuState.items.filter((it) => it.subgroupId === sub.id).length;
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => setActiveSubgroupFilter(sub.id)}
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors ${
                          activeSubgroupFilter === sub.id
                            ? "bg-[#6d7835] text-white"
                            : "bg-white border border-[#D5C9B3] text-[#5A6355] hover:border-[#1C241B]"
                        }`}
                      >
                        {sub.name} ({count})
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* DISHES LIST */}
            {filteredDishes.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-[#D5C9B3] bg-white p-12 text-center">
                <span className="text-4xl block mb-3">🍽️</span>
                <h3 className="font-serif text-xl font-normal text-[#1C241B]">
                  {searchQuery || activeGroupFilter !== "all" || activeSubgroupFilter !== "all"
                    ? "No dishes match current filters"
                    : "No Dishes in Menu Yet"}
                </h3>
                <p className="mt-1 text-xs text-[#7A8374] max-w-md mx-auto leading-relaxed">
                  {searchQuery
                    ? "Try clearing your search query or reset group filters."
                    : "Your menu is completely clean. Click below to add your first authentic culinary creation."}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(null);
                    setIsAddDishModalOpen(true);
                  }}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#1C241B] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-md hover:bg-[#2F3A2C]"
                >
                  <span>+ Add Your First Dish</span>
                </button>
              </div>
            ) : viewMode === "grid" ? (
              /* GRID VIEW */
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filteredDishes.map((dish) => (
                  <div
                    key={dish.id}
                    className="group flex flex-col justify-between rounded-2xl border border-[#ECE5D6] bg-white p-4 shadow-xs transition-shadow hover:shadow-lg"
                  >
                    <div>
                      {/* Image Preview */}
                      <div className="relative mb-3 h-44 w-full overflow-hidden rounded-xl bg-[#F2EDE2]">
                        {dish.image ? (
                          <Image
                            src={dish.image}
                            alt={dish.name}
                            fill
                            unoptimized
                            sizes="300px"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-xs text-[#8A9A86]">
                            No photo
                          </div>
                        )}

                        {dish.badge && (
                          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[9px] font-bold tracking-wider text-[#1C241B] uppercase shadow-xs">
                            {dish.badge}
                          </span>
                        )}

                        <span className="absolute right-3 bottom-3 rounded-full bg-[#162115]/80 px-2 py-0.5 text-[9px] font-mono text-white backdrop-blur-xs">
                          {dish.subgroupName || "Subgroup"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#9A7B4F]">
                          {dish.groupName || "Food Menu"}
                        </span>
                        <span className="font-sans text-base font-bold tabular-nums text-[#1C241B]">
                          AED {dish.price}
                        </span>
                      </div>

                      <h3 className="font-serif text-lg font-semibold text-[#1C241B] leading-snug">
                        {dish.name}
                      </h3>

                      <p className="mt-1 line-clamp-2 text-xs text-[#6E7569] leading-relaxed">
                        {dish.description}
                      </p>

                      {dish.dietary && dish.dietary.length > 0 && (
                        <div className="mt-2.5 flex flex-wrap gap-1">
                          {dish.dietary
                            .filter((d) => d !== "All")
                            .map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full bg-[#FAF7F0] border border-[#ECE5D6] px-2 py-0.5 text-[9px] font-medium text-[#586255]"
                              >
                                {tag}
                              </span>
                            ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex items-center justify-end gap-2 border-t border-[#F2ECE0] pt-3">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingItem(dish);
                          setIsAddDishModalOpen(true);
                        }}
                        className="rounded-lg border border-[#D5C9B3] px-3 py-1.5 text-xs font-semibold text-[#1C241B] hover:bg-[#FAF7F0] transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setItemToDelete(dish)}
                        className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* TABLE VIEW */
              <div className="overflow-hidden rounded-2xl border border-[#ECE5D6] bg-white shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF7F0] border-b border-[#ECE5D6] text-[10px] font-mono uppercase tracking-wider text-[#6E7569]">
                      <tr>
                        <th className="py-3 px-4">Dish</th>
                        <th className="py-3 px-4">Group / Subgroup</th>
                        <th className="py-3 px-4">Price</th>
                        <th className="py-3 px-4">Dietary Tags</th>
                        <th className="py-3 px-4">Badge</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2ECE0]">
                      {filteredDishes.map((dish) => (
                        <tr key={dish.id} className="hover:bg-[#FAF7F0]/40 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-[#F2EDE2]">
                                {dish.image && (
                                  <Image
                                    src={dish.image}
                                    alt={dish.name}
                                    fill
                                    unoptimized
                                    className="object-cover"
                                  />
                                )}
                              </div>
                              <div>
                                <span className="font-semibold text-[#1C241B] block">
                                  {dish.name}
                                </span>
                                <span className="line-clamp-1 text-[11px] text-[#7A8374]">
                                  {dish.description}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-medium text-[#1C241B] block">
                              {dish.groupName}
                            </span>
                            <span className="text-[10px] text-[#868E81]">
                              {dish.subgroupName}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-bold tabular-nums text-[#1C241B]">
                            AED {dish.price}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap gap-1">
                              {dish.dietary
                                ?.filter((d) => d !== "All")
                                .map((t) => (
                                  <span
                                    key={t}
                                    className="rounded bg-[#FAF7F0] px-1.5 py-0.5 text-[9px] text-[#586255]"
                                  >
                                    {t}
                                  </span>
                                ))}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            {dish.badge ? (
                              <span className="rounded-full bg-[#FAF7F0] border border-[#ECE5D6] px-2 py-0.5 text-[9px] font-bold text-[#1C241B]">
                                {dish.badge}
                              </span>
                            ) : (
                              <span className="text-[#A2AAA0]">—</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingItem(dish);
                                  setIsAddDishModalOpen(true);
                                }}
                                className="rounded px-2.5 py-1 font-semibold text-[#1C241B] hover:bg-[#FAF7F0]"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => setItemToDelete(dish)}
                                className="rounded px-2.5 py-1 font-semibold text-red-600 hover:bg-red-50"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: GROUPS & SUBGROUPS ARCHITECTURE */}
        {/* ============================================================== */}
        {currentTab === "structure" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-4 sm:p-5 rounded-2xl border border-[#ECE5D6] shadow-xs">
              <div>
                <h3 className="font-serif text-lg font-normal text-[#1C241B]">
                  Menu Hierarchy Architecture
                </h3>
                <p className="text-xs text-[#7A8374] mt-0.5">
                  Organize dishes into primary Groups (e.g. Food, Beverages) and Subgroups (e.g. Starters, Mains).
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingGroup(null);
                  setGroupFormName("");
                  setGroupFormDesc("");
                  setIsAddGroupModalOpen(true);
                }}
                className="rounded-full bg-[#1C241B] px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow hover:bg-[#2C382A]"
              >
                + Add New Group
              </button>
            </div>

            {/* Tree / Card Display of Groups */}
            <div className="space-y-6">
              {menuState.groups.map((group) => {
                const groupSubgroups = menuState.subgroups.filter(
                  (s) => s.groupId === group.id
                );
                const groupDishesCount = menuState.items.filter(
                  (it) => it.groupId === group.id
                ).length;

                return (
                  <div
                    key={group.id}
                    className="rounded-2xl border border-[#D5C9B3] bg-white p-5 shadow-xs space-y-4"
                  >
                    {/* Group Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#ECE5D6] pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono uppercase tracking-widest text-[#9A7B4F]">
                            Group
                          </span>
                          <span className="text-xs rounded-full bg-[#FAF7F0] border border-[#ECE5D6] px-2 py-0.5 text-[#5A6355] font-mono">
                            {groupDishesCount} total dishes
                          </span>
                        </div>
                        <h4 className="font-serif text-xl font-normal text-[#1C241B] mt-0.5">
                          {group.name}
                        </h4>
                        {group.description && (
                          <p className="text-xs text-[#7A8374]">{group.description}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setTargetGroupIdForSubgroup(group.id);
                            setEditingSubgroup(null);
                            setSubgroupFormName("");
                            setSubgroupFormDesc("");
                            setIsAddSubgroupModalOpen(true);
                          }}
                          className="rounded-full bg-[#6d7835] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#5b642c]"
                        >
                          + Add Subgroup
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingGroup(group);
                            setGroupFormName(group.name);
                            setGroupFormDesc(group.description || "");
                            setIsAddGroupModalOpen(true);
                          }}
                          className="rounded-full border border-[#D5C9B3] px-3 py-1.5 text-xs font-medium text-[#5A6355] hover:bg-[#FAF7F0]"
                        >
                          Edit Group
                        </button>
                        <button
                          type="button"
                          onClick={() => setGroupToDelete(group)}
                          className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Subgroups within this Group */}
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[#7A8374] block mb-2">
                        Subgroups in {group.name} ({groupSubgroups.length}):
                      </span>

                      {groupSubgroups.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-[#D5C9B3] p-4 text-center text-xs text-[#7A8374]">
                          No subgroups under this group yet. Click <strong>+ Add Subgroup</strong> to create one.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          {groupSubgroups.map((sub) => {
                            const subDishCount = menuState.items.filter(
                              (it) => it.subgroupId === sub.id
                            ).length;

                            return (
                              <div
                                key={sub.id}
                                className="rounded-xl border border-[#ECE5D6] bg-[#FAF7F0]/60 p-3.5 flex flex-col justify-between"
                              >
                                <div>
                                  <div className="flex items-center justify-between">
                                    <h5 className="font-serif text-base font-normal text-[#1C241B]">
                                      {sub.name}
                                    </h5>
                                    <span className="text-[10px] font-mono rounded bg-white px-1.5 py-0.5 border border-[#ECE5D6] text-[#6E7569]">
                                      {subDishCount} dishes
                                    </span>
                                  </div>
                                  {sub.description && (
                                    <p className="mt-1 text-[11px] text-[#7A8374] line-clamp-2">
                                      {sub.description}
                                    </p>
                                  )}
                                </div>

                                <div className="mt-3 flex items-center justify-between border-t border-[#ECE5D6] pt-2 text-xs">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveGroupFilter(group.id);
                                      setActiveSubgroupFilter(sub.id);
                                      setCurrentTab("dishes");
                                    }}
                                    className="font-medium text-[#6d7835] hover:underline text-[11px]"
                                  >
                                    View Dishes →
                                  </button>

                                  <div className="flex gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setTargetGroupIdForSubgroup(group.id);
                                        setEditingSubgroup(sub);
                                        setSubgroupFormName(sub.name);
                                        setSubgroupFormDesc(sub.description || "");
                                        setIsAddSubgroupModalOpen(true);
                                      }}
                                      className="text-[11px] text-[#5A6355] hover:text-[#1C241B]"
                                    >
                                      Edit
                                    </button>
                                    <span className="text-[#D5C9B3]">|</span>
                                    <button
                                      type="button"
                                      onClick={() => setSubgroupToDelete(sub)}
                                      className="text-[11px] text-red-600 hover:text-red-800"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* ============================================================== */}
      {/* MODAL 1: ADD / EDIT DISH MODAL */}
      {/* ============================================================== */}
      <DishFormModal
        isOpen={isAddDishModalOpen || !!editingItem}
        onClose={() => {
          setIsAddDishModalOpen(false);
          setEditingItem(null);
        }}
        onSaved={(item) => {
          showToast(`"${item.name}" saved successfully to Firebase!`);
          refreshMenu();
        }}
        menuState={menuState}
        onQuickAddGroup={handleQuickAddGroup}
        onQuickAddSubgroup={handleQuickAddSubgroup}
        initialGroupId={activeGroupFilter !== "all" ? activeGroupFilter : undefined}
        initialSubgroupId={activeSubgroupFilter !== "all" ? activeSubgroupFilter : undefined}
        editItem={editingItem}
      />

      {/* ============================================================== */}
      {/* MODAL 2: ADD / EDIT GROUP MODAL */}
      {/* ============================================================== */}
      <AnimatePresence>
        {isAddGroupModalOpen && (
          <motion.div
            data-lenis-prevent="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm overscroll-contain"
            onClick={() => setIsAddGroupModalOpen(false)}
          >
            <motion.div
              data-lenis-prevent="true"
              initial={{ scale: 0.95, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 12 }}
              className="w-full max-w-md rounded-2xl border border-[#D5C9B3] bg-white p-6 shadow-2xl overscroll-contain"
              onClick={(e) => e.stopPropagation()}
              onWheel={(e) => e.stopPropagation()}
            >
              <h3 className="font-serif text-xl font-normal text-[#1C241B]">
                {editingGroup ? "Edit Menu Group" : "Create New Menu Group"}
              </h3>
              <p className="mt-1 text-xs text-[#7A8374]">
                Top-level grouping for your menu (e.g. Food Menu, Beverages, Desserts, Shisha).
              </p>

              <form onSubmit={handleSaveGroup} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5446] mb-1">
                    Group Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Beverages or Shisha Lounge"
                    value={groupFormName}
                    onChange={(e) => setGroupFormName(e.target.value)}
                    className="w-full rounded-xl border border-[#D5C9B3] bg-white px-3.5 py-2 text-xs text-[#1C241B] focus:border-[#6d7835] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5446] mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Brief curatorial note about this group..."
                    value={groupFormDesc}
                    onChange={(e) => setGroupFormDesc(e.target.value)}
                    className="w-full rounded-xl border border-[#D5C9B3] bg-white px-3.5 py-2 text-xs text-[#1C241B] focus:border-[#6d7835] focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddGroupModalOpen(false)}
                    className="rounded-full border border-[#D5C9B3] px-4 py-1.5 text-xs font-semibold text-[#5A6355] hover:bg-[#FAF7F0]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="rounded-full bg-[#1C241B] px-5 py-1.5 text-xs font-semibold uppercase tracking-wider text-white shadow hover:bg-[#2C382A]"
                  >
                    {editingGroup ? "Save Changes" : "Create Group"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* MODAL 3: ADD / EDIT SUBGROUP MODAL */}
      {/* ============================================================== */}
      <AnimatePresence>
        {isAddSubgroupModalOpen && (
          <motion.div
            data-lenis-prevent="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm overscroll-contain"
            onClick={() => setIsAddSubgroupModalOpen(false)}
          >
            <motion.div
              data-lenis-prevent="true"
              initial={{ scale: 0.95, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 12 }}
              className="w-full max-w-md rounded-2xl border border-[#D5C9B3] bg-white p-6 shadow-2xl overscroll-contain"
              onClick={(e) => e.stopPropagation()}
              onWheel={(e) => e.stopPropagation()}
            >
              <h3 className="font-serif text-xl font-normal text-[#1C241B]">
                {editingSubgroup ? "Edit Subgroup" : "Create New Subgroup"}
              </h3>
              <p className="mt-1 text-xs text-[#7A8374]">
                Subgroup category under a parent group (e.g. Starters, Main Courses, Mocktails).
              </p>

              <form onSubmit={handleSaveSubgroup} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5446] mb-1">
                    Parent Group *
                  </label>
                  <select
                    value={targetGroupIdForSubgroup}
                    onChange={(e) => setTargetGroupIdForSubgroup(e.target.value)}
                    className="w-full rounded-xl border border-[#D5C9B3] bg-white px-3.5 py-2 text-xs font-medium text-[#1C241B] focus:border-[#6d7835] focus:outline-none"
                  >
                    {menuState.groups.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5446] mb-1">
                    Subgroup Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hot Appetizers or Artisanal Pizzas"
                    value={subgroupFormName}
                    onChange={(e) => setSubgroupFormName(e.target.value)}
                    className="w-full rounded-xl border border-[#D5C9B3] bg-white px-3.5 py-2 text-xs text-[#1C241B] focus:border-[#6d7835] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5446] mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Culinary subtitle for this subgroup..."
                    value={subgroupFormDesc}
                    onChange={(e) => setSubgroupFormDesc(e.target.value)}
                    className="w-full rounded-xl border border-[#D5C9B3] bg-white px-3.5 py-2 text-xs text-[#1C241B] focus:border-[#6d7835] focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddSubgroupModalOpen(false)}
                    className="rounded-full border border-[#D5C9B3] px-4 py-1.5 text-xs font-semibold text-[#5A6355] hover:bg-[#FAF7F0]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="rounded-full bg-[#1C241B] px-5 py-1.5 text-xs font-semibold uppercase tracking-wider text-white shadow hover:bg-[#2C382A]"
                  >
                    {editingSubgroup ? "Save Changes" : "Create Subgroup"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* CONFIRMATION 1: DELETE DISH */}
      {/* ============================================================== */}
      <AnimatePresence>
        {itemToDelete && (
          <motion.div
            data-lenis-prevent="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm overscroll-contain"
            onClick={() => setItemToDelete(null)}
          >
            <motion.div
              data-lenis-prevent="true"
              initial={{ scale: 0.95, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 12 }}
              className="w-full max-w-sm rounded-2xl border border-[#D5C9B3] bg-white p-6 shadow-2xl text-center overscroll-contain"
              onClick={(e) => e.stopPropagation()}
              onWheel={(e) => e.stopPropagation()}
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 text-xl font-bold mb-4">
                ⚠️
              </div>
              <h3 className="font-serif text-lg font-normal text-[#1C241B]">
                Delete &ldquo;{itemToDelete.name}&rdquo;?
              </h3>
              <p className="mt-2 text-xs text-[#6E7569] leading-relaxed">
                This item will be permanently removed from the live public food menu.
              </p>

              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setItemToDelete(null)}
                  className="rounded-full border border-[#D5C9B3] px-4 py-2 text-xs font-semibold text-[#5A6355] hover:bg-[#FAF7F0]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteDishConfirm}
                  className="rounded-full bg-red-600 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow hover:bg-red-700"
                >
                  Yes, Delete Dish
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* CONFIRMATION 2: CLEAR ALL DISHES */}
      {/* ============================================================== */}
      <AnimatePresence>
        {isClearDishesConfirmOpen && (
          <motion.div
            data-lenis-prevent="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm overscroll-contain"
            onClick={() => setIsClearDishesConfirmOpen(false)}
          >
            <motion.div
              data-lenis-prevent="true"
              initial={{ scale: 0.95, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 12 }}
              className="w-full max-w-sm rounded-2xl border border-[#D5C9B3] bg-white p-6 shadow-2xl text-center overscroll-contain"
              onClick={(e) => e.stopPropagation()}
              onWheel={(e) => e.stopPropagation()}
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-800 text-xl font-bold mb-4">
                🗑️
              </div>
              <h3 className="font-serif text-lg font-normal text-[#1C241B]">
                Clear All Dishes?
              </h3>
              <p className="mt-2 text-xs text-[#6E7569] leading-relaxed">
                This will remove all current dishes from the menu, leaving an empty menu ready for your own fresh entries. Your Groups and Subgroups will be kept.
              </p>

              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsClearDishesConfirmOpen(false)}
                  className="rounded-full border border-[#D5C9B3] px-4 py-2 text-xs font-semibold text-[#5A6355] hover:bg-[#FAF7F0]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleClearAllDishesConfirm}
                  className="rounded-full bg-red-600 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow hover:bg-red-700"
                >
                  Clear All Dishes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* CONFIRMATION 3: DELETE GROUP */}
      {/* ============================================================== */}
      <AnimatePresence>
        {groupToDelete && (
          <motion.div
            data-lenis-prevent="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm overscroll-contain"
            onClick={() => setGroupToDelete(null)}
          >
            <motion.div
              data-lenis-prevent="true"
              initial={{ scale: 0.95, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 12 }}
              className="w-full max-w-sm rounded-2xl border border-[#D5C9B3] bg-white p-6 shadow-2xl text-center overscroll-contain"
              onClick={(e) => e.stopPropagation()}
              onWheel={(e) => e.stopPropagation()}
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 text-xl font-bold mb-4">
                ⚠️
              </div>
              <h3 className="font-serif text-lg font-normal text-[#1C241B]">
                Delete Group &ldquo;{groupToDelete.name}&rdquo;?
              </h3>
              <p className="mt-2 text-xs text-[#6E7569] leading-relaxed">
                Deleting this group will also remove its subgroups and all dishes inside them.
              </p>

              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setGroupToDelete(null)}
                  className="rounded-full border border-[#D5C9B3] px-4 py-2 text-xs font-semibold text-[#5A6355] hover:bg-[#FAF7F0]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteGroupConfirm}
                  className="rounded-full bg-red-600 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow hover:bg-red-700"
                >
                  Delete Group
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* CONFIRMATION 4: DELETE SUBGROUP */}
      {/* ============================================================== */}
      <AnimatePresence>
        {subgroupToDelete && (
          <motion.div
            data-lenis-prevent="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm overscroll-contain"
            onClick={() => setSubgroupToDelete(null)}
          >
            <motion.div
              data-lenis-prevent="true"
              initial={{ scale: 0.95, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 12 }}
              className="w-full max-w-sm rounded-2xl border border-[#D5C9B3] bg-white p-6 shadow-2xl text-center overscroll-contain"
              onClick={(e) => e.stopPropagation()}
              onWheel={(e) => e.stopPropagation()}
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 text-xl font-bold mb-4">
                ⚠️
              </div>
              <h3 className="font-serif text-lg font-normal text-[#1C241B]">
                Delete Subgroup &ldquo;{subgroupToDelete.name}&rdquo;?
              </h3>
              <p className="mt-2 text-xs text-[#6E7569] leading-relaxed">
                Deleting this subgroup will also remove all dishes inside it.
              </p>

              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setSubgroupToDelete(null)}
                  className="rounded-full border border-[#D5C9B3] px-4 py-2 text-xs font-semibold text-[#5A6355] hover:bg-[#FAF7F0]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteSubgroupConfirm}
                  className="rounded-full bg-red-600 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow hover:bg-red-700"
                >
                  Delete Subgroup
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-[#1C241B]/20 bg-[#162115] px-5 py-3 text-xs font-medium text-white shadow-2xl backdrop-blur-md"
          >
            <span className="text-emerald-400">✓</span>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
