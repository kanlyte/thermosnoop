"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Session } from "next-auth";
import {
  AlertCircle,
  ArrowRight,
  MapPin,
  Plus,
  Search,
  Sprout,
} from "lucide-react";

import { fetchUserFarms, MyFarm } from "@/actions/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export default function FarmsList({ session }: { session: Session }) {
  const [my_farms, setFarms] = useState<MyFarm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadFarms = async () => {
      if (!session?.user?.id) return;

      setLoading(true);
      setError(null);

      const { farms, error } = await fetchUserFarms(session);

      if (farms) {
        setFarms(farms);
      } else {
        setError(error);
        console.error(error);
      }

      setLoading(false);
    };

    loadFarms();
  }, [session]);

  const filteredFarms = useMemo(() => {
    const keyword = search.toLowerCase();

    return my_farms.filter((farm) => {
      return (
        farm.name?.toLowerCase().includes(keyword) ||
        farm.district?.toLowerCase().includes(keyword) ||
        farm.id?.toString().includes(keyword)
      );
    });
  }, [my_farms, search]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="border border-emerald-100 bg-white shadow-sm">
          <CardContent className="p-6">
            <Skeleton className="mb-4 h-6 w-32" />
            <Skeleton className="mb-3 h-9 w-72" />
            <Skeleton className="h-5 w-full max-w-xl" />
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Skeleton className="mb-2 h-8 w-36" />
            <Skeleton className="h-4 w-28" />
          </div>

          <div className="flex gap-3">
            <Skeleton className="h-11 w-72 rounded-xl" />
            <Skeleton className="h-11 w-32 rounded-xl" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Card key={item} className="overflow-hidden border border-slate-200 bg-white">
              <Skeleton className="h-44 w-full" />
              <CardContent className="space-y-4 p-5">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-11 rounded-xl" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border border-red-200 bg-red-50 shadow-sm">
        <CardContent className="flex items-center gap-3 p-6 text-red-700">
          <AlertCircle className="h-5 w-5" />
          <p className="font-medium">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border border-emerald-100 bg-white shadow-sm">
        <CardContent className="flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Badge className="mb-3 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 hover:bg-emerald-50">
              Farm Monitoring
            </Badge>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Welcome back, {session?.user?.name || "Farmer"}
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              View your registered farms, check farm locations, and open a farm
              to monitor temperature, humidity, and thermal stress.
            </p>
          </div>

          <Button
            asChild
            className="h-11 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
          >
            <Link href="/dashboard/add-farm">
              <Plus className="mr-2 h-4 w-4" />
              Add Farm
            </Link>
          </Button>
        </CardContent>
      </Card>

      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            My Farms
          </h2>

          <p className="text-sm text-slate-500">
            {my_farms.length} farm{my_farms.length === 1 ? "" : "s"} registered
          </p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500" />

          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by farm, district or ID..."
            className="h-11 rounded-xl border-slate-200 bg-white pl-9 shadow-sm focus-visible:ring-emerald-500"
          />
        </div>
      </section>

      {filteredFarms.length === 0 ? (
        <Card className="border border-dashed border-emerald-200 bg-white shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50">
              <Sprout className="h-7 w-7 text-emerald-600" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              No farms found
            </h3>

            <p className="mt-2 max-w-md text-sm text-slate-500">
              {search
                ? "No farm matches your search. Try another keyword."
                : "You have not added any farm yet. Add your first farm to start monitoring."}
            </p>

            <Button
              asChild
              className="mt-5 rounded-xl bg-emerald-600 hover:bg-emerald-700"
            >
              <Link href="/dashboard/add-farm">
                <Plus className="mr-2 h-4 w-4" />
                Add Farm
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredFarms.map((farm) => {
            const detailsHref = `/dashboard/${farm.id}/farm`;
            const farmImage =
              farm.image ||
              `https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop`;

            return (
              <Card
                key={farm.id}
                className="group overflow-hidden border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:border-emerald-300 hover:shadow-md"
              >
                <Link href={detailsHref} className="block">
                  <div className="relative h-44 overflow-hidden">
                    <Image
                      src={farmImage}
                      alt={farm.name || "Farm"}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

                    <Badge className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-emerald-700 hover:bg-white">
                      Farm #{farm.id}
                    </Badge>

                    <Badge className="absolute right-4 top-4 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-600">
                      Active
                    </Badge>

                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="line-clamp-1 text-xl font-bold text-white">
                        {farm.name}
                      </h3>

                      <div className="mt-1 flex items-center gap-1.5 text-sm text-white/85">
                        <MapPin className="h-4 w-4" />
                        {farm.district || "No district"}
                      </div>
                    </div>
                  </div>
                </Link>

                <CardContent className="p-5">
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-medium text-slate-500">
                          Details ID
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          {farm.id}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-slate-500">
                          District
                        </p>
                        <p className="mt-1 truncate text-sm font-semibold text-slate-900">
                          {farm.district || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    asChild
                    variant="outline"
                    className="mt-5 h-11 w-full rounded-xl border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
                  >
                    <Link href={detailsHref}>
                      View farm details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}