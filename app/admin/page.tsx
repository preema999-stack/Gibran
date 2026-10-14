import type { Metadata } from "next";
import { FULL_MENU_CATEGORIES } from "@/lib/full-menu-data";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Portal · Food Menu Management | Gibran & Co.",
  description:
    "Curatorial administration interface for Gibran & Co. Add, manage, and update live restaurant dishes, categories, dietary classifications, and culinary notes powered by Firebase.",
};

export default function AdminPage() {
  return <AdminDashboard initialCategories={FULL_MENU_CATEGORIES} />;
}
