"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Session } from "next-auth";
import { ChevronDown, ChevronRight, X } from "lucide-react";

import { filterRoutes } from "@/lib/nav_routes/filterRoutes";
import { NavUser } from "@/components/nav-user";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  session: Session;
  open?: boolean;
  onClose?: () => void;
}

const AppSidebar = ({ session, open = false, onClose }: AppSidebarProps) => {
  const pathname = usePathname();
  const { navMain } = filterRoutes("user");

  const navMainWithActive = navMain.map((item) => ({
    ...item,
    isActive:
      pathname === item.url ||
      item.items?.some((nestedItem) => nestedItem.url === pathname),
    items: item.items?.map((nestedItem) => ({
      ...nestedItem,
      isActive: pathname === nestedItem.url,
    })),
  }));

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex h-[72px] items-center justify-between border-b border-slate-200 px-4">
        <Link
          href="/dashboard"
          onClick={onClose}
          className="flex items-center gap-3"
        >
          <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <Image
              src="/logo.webp"
              alt="Thermosnoop"
              fill
              className="object-contain p-1"
            />
          </div>

          <div className="leading-tight">
            <h1 className="text-lg font-extrabold text-primary">
              Thermosnoop
            </h1>
            <p className="text-xs font-medium text-slate-500">
              Analytics Dashboard
            </p>
          </div>
        </Link>

        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 md:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-5">
        <p className="mb-4 px-3 text-xs font-bold uppercase tracking-wider text-slate-400">
          Navigation
        </p>

        <nav className="space-y-1">
          {navMainWithActive.map((item: any, index: number) => {
            const Icon = item.icon;
            const hasChildren = item.items && item.items.length > 0;

            return (
              <div key={index}>
                <Link
                  href={item.url || "#"}
                  onClick={!hasChildren ? onClose : undefined}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200",
                    "text-slate-700 hover:bg-slate-100 hover:text-black",
                    item.isActive && "bg-slate-200 text-black"
                  )}
                >
                  {Icon && (
                    <div
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all",
                        item.isActive
                          ? "bg-white"
                          : "bg-slate-100 group-hover:bg-slate-200"
                      )}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                    </div>
                  )}

                  <span className="flex-1 truncate">{item.title}</span>

                  {hasChildren &&
                    (item.isActive ? (
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    ))}
                </Link>

                {hasChildren && item.isActive && (
                  <div className="mt-1 space-y-1 pl-8">
                    {item.items.map((nestedItem: any, nestedIndex: number) => (
                      <Link
                        key={nestedIndex}
                        href={nestedItem.url}
                        onClick={onClose}
                        className={cn(
                          "block rounded-lg px-3 py-2.5 text-xs font-medium transition-all duration-200",
                          "text-slate-500 hover:bg-slate-100 hover:text-black",
                          nestedItem.isActive && "bg-slate-200 text-black"
                        )}
                      >
                        {nestedItem.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-slate-200 bg-white p-4">
        <NavUser session={session} />
      </div>
    </div>
  );

  return (
    <>
      <div className="fixed left-0 top-0 z-30 hidden h-screen w-[220px] overflow-y-auto border-r border-slate-200 bg-white md:block lg:w-[280px]">
        <SidebarContent />
      </div>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={onClose}
            className="absolute inset-0 bg-black/40"
          />

          <div className="absolute left-0 top-0 h-full w-[82%] max-w-[320px] overflow-y-auto bg-white shadow-xl">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
};

export default AppSidebar;