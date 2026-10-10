import { LayoutDashboard, ListTodo, Columns3 } from 'lucide-react';

/** Single source of truth for primary navigation (sidebar + topbar titles). */
export const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/issues', label: 'Issues', icon: ListTodo, end: false },
  { to: '/kanban', label: 'Kanban Board', icon: Columns3, end: false },
];
