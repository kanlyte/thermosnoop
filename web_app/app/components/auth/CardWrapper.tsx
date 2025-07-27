"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Header } from "@/components/auth/Header";
import { BackButton } from "@/components/auth/BackButton";

interface CardWrapperProps {
  children: React.ReactNode;
  headerTitle: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}

export const CardWrapper = ({
  children,
  showSocial,
  backButtonLabel,
  backButtonHref,
  headerTitle,
}: CardWrapperProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Optional logo area */}
   

      <Card className="w-full max-w-xl shadow-lg rounded-xl border-baseContent/10">
       <div className="w-full max-w-md mb-8">
    <div className="bg-white p-6 rounded-xl flex flex-col items-center">
      <img
        src="/logo.webp"
        alt="Thermosnoop Logo"
        className="h-16 w-auto mb-4"
        width={64}
        height={64}
      />
      <h1 className="text-2xl font-bold text-gray-800">Thermosnoop</h1>
      <p className="text-gray-500 text-sm mt-1">Temperature Monitoring System</p>
    </div>
  </div>

        <CardContent className="pb-6">{children}</CardContent>

        <CardFooter className="flex justify-center border-t border-baseContent/10 pt-6">
          <BackButton label={backButtonLabel} href={backButtonHref} />
        </CardFooter>
      </Card>
    </div>
  );
};
