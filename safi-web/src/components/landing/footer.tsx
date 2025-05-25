import { Instagram, Linkedin, Facebook, Twitter } from "lucide-react"
import Link from "next/link"

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
                            © 2025 SAFI - Plataforma de Testes. Este site é uma versão experimental para demonstração de funcionalidades do Sistema de Apoio Farmacêutico Inteligente.
                        </p>
                    </div>

                    {/* About section */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Sobre</h4>
                        <ul className="space-y-3">
                            <li>
                                <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                    Início
                                </a>
                            </li>
                            <li>
                                <a href="#features" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                    Funcionalidades
                                </a>
                            </li>
                            <li>
                                <a href="#pillars" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                    Pilares
                                </a>
                            </li>
                            <li>
                                <a href="#support" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                    Abrir Chamado
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Privacy section */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Privacidade</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/privacy-policy" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                    Privacidade
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy-policy" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                    Política
                                </Link>
                            </li>
                            {/* <li>
                                <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                    Pagamento
                                </a>
                            </li> */}
                            <li>
                                <Link href="/terms" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                    Termos
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact section */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Contato</h4>
                        <div className="space-y-3 mb-4">
                            <p className="text-gray-600 text-sm">(Em Breve)</p>
                            <p className="text-gray-600 text-sm">safi@gmail.com</p>
                        </div>

                        {/* Social media icons */}
                        {/* <div className="flex space-x-3">
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
                        </div> */}
                    </div>
                </div>

                {/* Bottom section */}
                <div className="border-t pt-6 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-500 text-sm mb-4 md:mb-0">
                        © Safi 2025 Todos os direitos reservados.
                    </p>
                    <div className="flex space-x-6">
                        {/* <a href="#" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">
                            Contato
                        </a> */}
                        {/* <a href="#" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">
                            Termos
                        </a> */}
                    </div>
                </div>
            </div>
        </footer>
    )
}
