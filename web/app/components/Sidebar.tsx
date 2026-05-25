"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Session } from "next-auth";
import { ChevronDown, ChevronRight } from "lucide-react";

import { filterRoutes } from "@/lib/nav_routes/filterRoutes";
import { NavUser } from "@/components/nav-user";
import { cn } from "@/lib/utils";

const AppSidebar = ({ session }: { session: Session }) => {
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

  return (
    <div className="fixed left-0 top-0 z-30 hidden h-screen w-[220px] overflow-y-auto border-r border-slate-200 bg-muted/40 md:block lg:w-[280px]">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-[72px] items-center border-b border-slate-200 px-4">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <Image
                src="/logo.webp"
                alt="Thermosnoop"
                fill
                className="object-contain p-1"
              />
            </div>

            <div className="leading-tight">
              <h1 className="text-lg font-extrabold text-[#2563eb]">
                Thermosnoop
              </h1>

              <p className="text-xs font-medium text-slate-500">
                Analytics Dashboard
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
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
                    className={cn(
                      "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200",
                      "text-slate-700 hover:bg-slate-100 hover:text-black",
                      item.isActive &&
                        "bg-slate-200 text-black"
                    )}
                  >
                    {Icon && <Icon className="h-5 w-5 shrink-0" />}

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
                      {item.items.map(
                        (nestedItem: any, nestedIndex: number) => (
                          <Link
                            key={nestedIndex}
                            href={nestedItem.url}
                            className={cn(
                              "block rounded-lg px-3 py-2.5 text-xs font-medium transition-all duration-200",
                              "text-slate-500 hover:bg-slate-100 hover:text-black",
                              nestedItem.isActive &&
                                "bg-slate-200 text-black"
                            )}
                          >
                            {nestedItem.title}
                          </Link>
                        )
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-white p-4">
          <NavUser session={session} />
        </div>
      </div>
    </div>
  );
};

export default AppSidebar;