import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Thermometer, Droplets, AlertCircle, Smartphone } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center py-16 md:py-24">
          <div className="space-y-6 text-center lg:text-left">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="block text-green-600">Monitor Thermal Stress</span>
              <span className="block text-gray-900">For Healthier Livestock</span>
            </h1>
            
            <p className="text-lg text-gray-600 max-w-lg mx-auto lg:mx-0">
              ThermoSnoop combines temperature and humidity data to estimate thermal stress levels and provide actionable management interventions for your farm.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white" asChild>
                <Link href="/auth/register">
                  Get Started for Free
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50" asChild>
                <Link href="#how-it-works">
                  How It Works
                </Link>
              </Button>
            </div>
            
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Thermometer className="h-4 w-4 text-green-600" />
                <span>Temperature Monitoring</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Droplets className="h-4 w-4 text-green-600" />
                <span>Humidity Tracking</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <AlertCircle className="h-4 w-4 text-green-600" />
                <span>Stress Alerts</span>
              </div>
            </div>
          </div>
          
          <div className="relative aspect-square w-full max-w-lg mx-auto">
            <Image
              src="/hero.jpeg"
              alt="ThermoSnoop app showing thermal stress levels"
              fill
              className="object-contain"
              priority
            />
            <div className="absolute -bottom-6 -right-6 bg-green-100 rounded-full h-32 w-32 z-[-1]"></div>
            <div className="absolute -top-6 -left-6 bg-green-600/10 rounded-full h-40 w-40 z-[-1]"></div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  )
}