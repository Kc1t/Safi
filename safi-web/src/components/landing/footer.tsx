import { Instagram, Linkedin, Facebook, Twitter } from "lucide-react"

export default function Footer() {
    return (
        <footer className="bg-white border-t">
            <div className="max-w-6xl mx-auto px-4 py-12">
                {/* Main footer content */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand section */}
                    <div className="md:col-span-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">SAFI</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Yet bed any for travelling assistance indulgence unpleasing. Not thoughts all exercise blessing.
                            Indulgence way everything.
                        </p>
                    </div>

                    {/* About section */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">About</h4>
                        <ul className="space-y-3">
                            <li>
                                <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                    Home
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                    Features
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                    FAQs
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                    Reviews
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                    Stories
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Privacy section */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Privacy</h4>
                        <ul className="space-y-3">
                            <li>
                                <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                    Privacy
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                    Policy
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                    Payment
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                    Terms
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact section */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Contact Us</h4>
                        <div className="space-y-3 mb-4">
                            <p className="text-gray-600 text-sm">+01 234 567 8910</p>
                            <p className="text-gray-600 text-sm">hello@duxo.ai</p>
                        </div>

                        {/* Social media icons */}
                        <div className="flex space-x-3">
                            <a
                                href="#"
                                className="w-8 h-8 bg-pink-500 rounded flex items-center justify-center hover:bg-pink-600 transition-colors"
                            >
                                <Instagram className="w-4 h-4 text-white" />
                            </a>
                            <a
                                href="#"
                                className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center hover:bg-blue-700 transition-colors"
                            >
                                <Linkedin className="w-4 h-4 text-white" />
                            </a>
                            <a
                                href="#"
                                className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center hover:bg-blue-600 transition-colors"
                            >
                                <Facebook className="w-4 h-4 text-white" />
                            </a>
                            <a
                                href="#"
                                className="w-8 h-8 bg-blue-400 rounded flex items-center justify-center hover:bg-blue-500 transition-colors"
                            >
                                <Twitter className="w-4 h-4 text-white" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom section */}
                <div className="border-t pt-6 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-500 text-sm mb-4 md:mb-0">
                        © Copyright 2021 <span className="font-semibold">Duxo</span> All rights reserved.
                    </p>
                    <div className="flex space-x-6">
                        <a href="#" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">
                            Contact Us
                        </a>
                        <a href="#" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">
                            Terms
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
