"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
    Thermometer,
    Droplets,
    ChevronRight,
    CheckCircle2,
    ArrowRight,
    X,
    Share2,
    BarChart,
    Smartphone,
    AlertCircle,
    Settings,
    Bell,
    Calendar,
    MapPin,
    Leaf,
    Egg,
    PiggyBank,
    Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import HeroSection from "./components/hero-section"
// import HowItWorks from "./components/how-it-works"
// import HeroSection from "./components/hero-section"

export default function LandingPage() {
    const [showBanner, setShowBanner] = useState(true)
    const [activeTestimonial, setActiveTestimonial] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % 3)
        }, 5000)
        return () => clearInterval(timer)
    }, [])

    const testimonials = [
        {
            name: "John K.",
            quote: "ThermoSnoop has revolutionized how we monitor our poultry farm. The temperature alerts have saved us thousands in potential losses.",
            farm: "Kampala Poultry Farm",
            location: "Wakiso, Uganda",
            image: "/images/farmer3.jpeg"
        },
        {
            name: "Sarah N.",
            quote: "As a dairy farmer, maintaining optimal conditions is crucial. ThermoSnoop gives me peace of mind with real-time monitoring.",
            farm: "Mbarara Dairy Cooperative",
            location: "Mbarara, Uganda",
            image: "/images/farmer2.jpeg"
        },
        {
            name: "Robert M.",
            quote: "The humidity monitoring feature has helped us improve our greenhouse yields by 30%. Highly recommended for any serious farmer.",
            farm: "Jinja Greenhouse Ventures",
            location: "Jinja, Uganda",
            image: "/images/farmer1.jpeg"
        }
    ]

    const features = [
        {
            icon: Thermometer,
            title: "Real-time Monitoring",
            description: "Track temperature and humidity levels in your farm in real-time from anywhere.",
        },
        {
            icon: AlertCircle,
            title: "Instant Alerts",
            description: "Get immediate notifications when conditions go beyond your set thresholds.",
        },
        {
            icon: BarChart,
            title: "Data Analytics",
            description: "View historical data and trends to make informed farming decisions.",
        },
        {
            icon: Settings,
            title: "Custom Thresholds",
            description: "Set personalized thresholds for different areas of your farm.",
        },
        {
            icon: Smartphone,
            title: "Mobile Access",
            description: "Monitor your farm conditions from your smartphone or computer.",
        },
        {
            icon: Share2,
            title: "Multi-user Access",
            description: "Share access with farm managers and workers for collaborative monitoring.",
        },
    ]

    const useCases = [
        {
            icon: Egg,
            title: "Poultry Farming",
            description: "Maintain optimal conditions for chicken health and egg production.",
        },
        {
            icon: Leaf,
            title: "Greenhouse Farming",
            description: "Monitor and control microclimate conditions for maximum crop yield.",
        },
        {
            icon: PiggyBank,
            title: "Piggery",
            description: "Ensure proper temperature for pig growth and health.",
        },
        {
            icon: Droplets,
            title: "Dairy Farming",
            description: "Monitor storage conditions for milk and dairy products.",
        },
        {
            icon: Calendar,
            title: "Grain Storage",
            description: "Prevent spoilage by monitoring storage facilities.",
        },
        {
            icon: Clock,
            title: "Hatcheries",
            description: "Maintain precise conditions for egg incubation.",
        },
    ]

    return (
        <div className="min-h-screen bg-background">
            {/* Promotional Banner */}
            {showBanner && (
                <div className="relative isolate flex items-center gap-x-6 overflow-hidden bg-green-800 px-6 py-2.5 sm:px-3.5">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 flex-1">
                        <Bell className="h-5 w-5 text-white" />
                        <p className="text-sm leading-6 text-white">
                            <strong className="font-semibold">ThermoSnoop Pro</strong>
                            <svg viewBox="0 0 2 2" className="mx-2 inline h-0.5 w-0.5 fill-current">
                                <circle cx="1" cy="1" r="1" />
                            </svg>
                            Get 30% off annual subscriptions for a limited time!
                        </p>
                        <Button size="sm" className="bg-white text-green-800 border-none hover:bg-green-100" asChild>
                            <Link href="/pricing">
                                View Plans <ChevronRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 top-4 text-white hover:bg-green-700"
                        onClick={() => setShowBanner(false)}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}

            {/* Hero Section */}
            <main>
                <HeroSection />
            </main>

            {/* Features Grid */}
            <section className="py-20 md:py-32 bg-gradient-to-b from-green-900 to-green-800 relative">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <div className="inline-block text-sm font-medium text-white/90 mb-4 uppercase tracking-wider">
                            Farm Monitoring
                        </div>
                        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-white">
                            Comprehensive Farm Monitoring Solutions
                        </h2>
                        <p className="text-white/80 mx-auto text-lg max-w-2xl">
                            ThermoSnoop provides all the tools you need to monitor and optimize your farm's environmental conditions.
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature, index) => (
                            <div 
                                key={index} 
                                className="group p-6 bg-white/10 hover:bg-white/20 rounded-lg border border-white/10 transition-all duration-300 flex flex-col h-full"
                            >
                                <div className="mb-5 text-white">
                                    <feature.icon className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-medium mb-2 text-white">{feature.title}</h3>
                                <p className="text-white/80 text-sm leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Use Cases Section */}
            <section className="py-16 md:py-24 bg-white">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm text-green-800 font-medium mb-4">
                            Applications
                        </div>
                        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-gray-900">
                            Designed for Various Farming Needs
                        </h2>
                        <p className="text-gray-600 mx-auto text-lg max-w-2xl">
                            ThermoSnoop adapts to different agricultural applications to help you maximize productivity.
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {useCases.map((useCase, index) => (
                            <Card key={index} className="p-6 hover:shadow-lg transition-shadow duration-300">
                                <div className="mb-5 text-green-600">
                                    <useCase.icon className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-medium mb-2 text-gray-900">{useCase.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{useCase.description}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose ThermoSnoop Section */}
            <section className="py-16 md:py-24 bg-gray-50">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="relative h-[500px] w-full rounded-xl overflow-hidden shadow-lg">
                                <Image
                                    src="/images/cattle.jpg"
                                    alt="Farmer using ThermoSnoop app"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm text-green-800 font-medium">
                                Why ThermoSnoop
                            </div>
                            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-gray-900">
                                Precision Farming Made Simple
                            </h2>
                            <p className="text-lg text-gray-600">
                                ThermoSnoop is built specifically for African farmers, with features that address the unique challenges of farming in our climate.
                            </p>

                            <ul className="space-y-4">
                                <li className="flex gap-3">
                                    <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-bold text-gray-900">Localized for African farming conditions</h3>
                                        <p className="text-gray-600">Our thresholds and alerts are optimized for African climates and farming practices.</p>
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-bold text-gray-900">Affordable monitoring solutions</h3>
                                        <p className="text-gray-600">
                                            We provide cost-effective monitoring tailored to African farmers' budgets.
                                        </p>
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-bold text-gray-900">Works with intermittent connectivity</h3>
                                        <p className="text-gray-600">
                                            Our system stores data locally and syncs when connection is available.
                                        </p>
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-bold text-gray-900">Local support team</h3>
                                        <p className="text-gray-600">
                                            Get help from our Uganda-based support team that understands your farming context.
                                        </p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 md:py-32 bg-green-700 relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-green-800 to-transparent"></div>
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-green-800 to-transparent"></div>
                </div>

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-block rounded-full bg-white/20 px-5 py-2 text-sm font-bold text-white mb-6">
                            FARMER TESTIMONIALS
                        </div>
                        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6 text-white">
                            Trusted by Farmers Across Uganda
                        </h2>
                        <p className="text-white/90 max-w-2xl mx-auto text-lg">
                            See how farmers are improving their yields and reducing losses with ThermoSnoop.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {testimonials.map((testimony, index) => (
                            <Card
                                className="bg-white/10 rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300"
                                key={index}
                            >
                                <div className="flex items-center mb-6">
                                    <div className="h-16 w-16 rounded-full overflow-hidden mr-4 border-2 border-white/50">
                                        <Image
                                            src={testimony.image}
                                            alt={`${testimony.name} portrait`}
                                            width={64}
                                            height={64}
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{testimony.name}</h3>
                                        <p className="text-white/70">{testimony.farm}</p>
                                        <p className="text-white/60 text-sm">{testimony.location}</p>
                                    </div>
                                </div>

                                <blockquote className="text-white/90 mb-6 text-lg">"{testimony.quote}"</blockquote>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 md:py-24 bg-gradient-to-r from-green-600 to-green-800 text-white">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center max-w-3xl mx-auto space-y-6">
                        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                            Ready to Optimize Your Farm?
                        </h2>
                        <p className="text-xl text-green-100">
                            Join ThermoSnoop today and start monitoring your farm conditions with precision.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <Button size="lg" className="text-green-700 bg-white hover:bg-green-100" asChild>
                                <Link href="/auth/register">
                                    Sign Up Now <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
                                <Link href="/demo">
                                    Request a Demo
                                </Link>
                            </Button>
                        </div>
                        <p className="text-sm text-green-200 pt-2">
                            No credit card required. Start monitoring in minutes.
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer Section */}
            <footer className="border-t py-12 bg-gray-900 text-white">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="col-span-2 md:col-span-1">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="h-10 w-10 rounded-md bg-green-600 flex items-center justify-center">
                                    <Thermometer className="h-6 w-6 text-white" />
                                </div>
                                <span className="text-xl font-bold text-green-400">ThermoSnoop</span>
                            </div>
                            <p className="text-sm text-gray-400 mb-4">Precision farming monitoring for African agriculture.</p>
                            <div className="flex gap-4">
                                <Link href="#" className="text-gray-400 hover:text-green-400">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-facebook"
                                    >
                                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                                    </svg>
                                    <span className="sr-only">Facebook</span>
                                </Link>
                                <Link href="#" className="text-gray-400 hover:text-green-400">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-twitter"
                                    >
                                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                                    </svg>
                                    <span className="sr-only">Twitter</span>
                                </Link>
                                <Link href="#" className="text-gray-400 hover:text-green-400">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-instagram"
                                    >
                                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                                    </svg>
                                    <span className="sr-only">Instagram</span>
                                </Link>
                                <Link href="#" className="text-gray-400 hover:text-green-400">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-youtube"
                                    >
                                        <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                                        <path d="m10 15 5-3-5-3z" />
                                    </svg>
                                    <span className="sr-only">YouTube</span>
                                </Link>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4 text-white">Product</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li>
                                    <Link href="#" className="hover:text-green-400 transition-colors">
                                        Features
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-green-400 transition-colors">
                                        Pricing
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-green-400 transition-colors">
                                        Mobile App
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-green-400 transition-colors">
                                        Hardware
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4 text-white">Support</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li>
                                    <Link href="#" className="hover:text-green-400 transition-colors">
                                        Help Center
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-green-400 transition-colors">
                                        Contact Us
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-green-400 transition-colors">
                                        FAQs
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-green-400 transition-colors">
                                        Community
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4 text-white">Company</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li>
                                    <Link href="#" className="hover:text-green-400 transition-colors">
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-green-400 transition-colors">
                                        Careers
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-green-400 transition-colors">
                                        Blog
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-green-400 transition-colors">
                                        Partners
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-12 pt-6 text-center text-sm text-gray-400">
                        <p>&copy; {new Date().getFullYear()} ThermoSnoop. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}