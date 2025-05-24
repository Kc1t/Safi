"use client"

import { useState, useEffect } from "react"
import { Menu } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Image from "next/image"
import NavLogo from "@/assets/logo/nav-logo.png"

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY
            setIsScrolled(scrollTop > 20)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const navigationItems = [
        { name: "Product", href: "#product" },
        { name: "About", href: "#about" },
        { name: "Pricing", href: "#pricing" },
        { name: "Contact", href: "#contact" },
        { name: "Blog", href: "#blog" },
    ]

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pt-4">
            <div
                className={`max-w-7xl mx-auto transition-all duration-300 ease-in-out rounded-full relative p-1 ${isScrolled
                    ? "bg-white/95 backdrop-blur-md shadow-sm border border-gray-200/50"
                    : "bg-white shadow-sm border border-gray-200/30"
                    }`}
            >
                <div className="w-full h-full border border-[#E9EBF1] rounded-full p-3">
                    <div className="px-6 lg:px-8">
                        <div className="flex items-center justify-between">
                            {/* Logo */}
                            <Link href="/" className="flex items-center space-x-2">
                                <div className="flex items-center">
                                    <Image src={NavLogo} alt="Logo" className="h-auto w-22" />
                                </div>
                            </Link>

                            {/* Desktop Navigation */}
                            <div className="hidden md:flex items-center space-x-8">
                                {navigationItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200 relative group"
                                    >
                                        {item.name}
                                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-900 transition-all duration-300 group-hover:w-full"></span>
                                    </Link>
                                ))}
                            </div>

                            {/* CTA Button and Mobile Menu */}
                            <div className="flex items-center">
                                <Button
                                    className={`hidden sm:inline-flex transition-all duration-300 rounded-full bg-transparent border text-black hover:bg-black/5 cursor-pointer ${isScrolled ? "scale-100" : "scale-100"
                                        }`}
                                    variant="default"
                                >
                                    Abrir Chamado
                                </Button>

                                {/* Mobile Menu Button */}
                                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                                    <SheetTrigger asChild>
                                        <Button variant="ghost" size="icon" className="md:hidden rounded-full">
                                            <Menu className="h-6 w-6" />
                                            <span className="sr-only">Toggle menu</span>
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="right" className="w-[300px] sm:w-[400px] px-4">
                                        <div className="flex flex-col space-y-6 mt-6">
                                            <Link href="/" className="flex items-center space-x-2">
                                                <div className="flex items-center">
                                                    <Image src={NavLogo} alt="Logo" className="h-auto w-22" />
                                                </div>
                                            </Link>

                                            <nav className="flex flex-col space-y-4">
                                                {navigationItems.map((item) => (
                                                    <Link
                                                        key={item.name}
                                                        href={item.href}
                                                        className="text-lg font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200 py-2"
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                    >
                                                        {item.name}
                                                    </Link>
                                                ))}
                                            </nav>

                                            <div className="pt-4 border-t">
                                                <Button className="w-full rounded-full" onClick={() => setIsMobileMenuOpen(false)}>
                                                    Abrir Chamado
                                                </Button>
                                            </div>
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}
