"use client"

import { useState, useEffect } from "react"
import { Menu } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Image from "next/image"
import NavLogo from "@/assets/logo/nav-logo.png"

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY
            setIsScrolled(scrollTop > 20)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const navigationItems = [
        { name: "Funcionalidades", href: "#features" },
        { name: "Pilares", href: "#pillars" },
        { name: "Abrir Chamado", href: "#support" },
    ]

    function renderNavigation() {
        if (pathname === "/") {
            return (
                <>
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
                </>
            )
        }
        return (
            <Link
                href="/"
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200 relative group"
            >
                {/* Início */}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-900 transition-all duration-300 group-hover:w-full"></span>
            </Link>
        )
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pt-4">
            <div
                className={` mx-auto transition-all duration-300 ease-in-out rounded-full relative p-1 ${isScrolled
                    ? "bg-white/95 backdrop-blur-md shadow-sm border border-gray-200/50 max-w-7xl"
                    : "bg-white shadow-sm border border-gray-200/30 max-w-6xl"
                    }`}
            >
                <div className="w-full h-full border border-[#E9EBF1] rounded-full p-3">
                    <div className="px-6 lg:px-8">
                        <div className="flex items-center justify-between">
                            {/* Logo */}
                            <a href="/" className="flex items-center space-x-2">
                                <div className="flex items-center">
                                    <Image src={NavLogo} alt="Logo" className="h-auto w-22" />
                                </div>
                            </a>

                            {/* Desktop Navigation */}
                            <div className="hidden md:flex items-center space-x-8">
                                {renderNavigation()}
                            </div>

                            {/* CTA Button and Mobile Menu */}
                            <div className="flex items-center">
                                {pathname === "/" ? (
                                    <a href="#support">
                                        <Button
                                            className={`hidden sm:inline-flex transition-all duration-300 rounded-full bg-transparent border text-black hover:bg-black/5 cursor-pointer ${isScrolled ? "scale-100" : "scale-100"
                                                }`}
                                            variant="default"
                                        >
                                            Simular Chamado
                                        </Button>
                                    </a>
                                ) : <Link href="/#support">
                                    <Button
                                        className={`hidden sm:inline-flex transition-all duration-300 rounded-full bg-transparent border text-black hover:bg-black/5 cursor-pointer ${isScrolled ? "scale-100" : "scale-100"
                                            }`}
                                        variant="default"
                                    >
                                        Simular Chamado
                                    </Button>
                                </Link>}

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
                                            <a href="/" className="flex items-center space-x-2">
                                                <div className="flex items-center">
                                                    <Image src={NavLogo} alt="Logo" className="h-auto w-22" />
                                                </div>
                                            </a>

                                            <nav className="flex flex-col space-y-4">
                                                {pathname === "/" ? (
                                                    navigationItems.map((item) => (
                                                        <Link
                                                            key={item.name}
                                                            href={item.href}
                                                            className="text-lg font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200 py-2"
                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                        >
                                                            {item.name}
                                                        </Link>
                                                    ))
                                                ) : (
                                                    <Link
                                                        href="/"
                                                        className="text-lg font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200 py-2"
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                    >
                                                        Início
                                                    </Link>
                                                )}
                                            </nav>

                                            {pathname === "/" ? (
                                                <div className="pt-4 border-t">
                                                    <Link href={pathname === "/" ? "#support" : "/"}
                                                        className="w-full rounded-full" onClick={() => setIsMobileMenuOpen(false)}>
                                                        Simular Chamado
                                                    </Link>
                                                </div>
                                            ) : (
                                                <div className="pt-4 border-t">
                                                    <Link href={pathname === "/" ? "#support" : "/"}
                                                        className="w-full rounded-full" onClick={() => setIsMobileMenuOpen(false)}>
                                                        Simular Chamado
                                                    </Link>
                                                </div>
                                            )}
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
