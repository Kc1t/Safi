import { TrendingUp, BarChart3, Users } from "lucide-react"

export default function FeaturesStart() {
    return (
        <section className="mt-12">
            <div className="py-16 px-4container mx-auto max-w-6xl border-t">
                <div className="w-full mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-4">
                        {/* SEO Enhancement Card */}
                        <div className="text-center space-y-4 flex gap-4">
                            <div className="w-11 h-11 min-h-11 min-w-11 md:w-15 md:h-15 md:min-h-15 md:min-w-15 bg-[#DF1463]/20 rounded-full flex items-center justify-center">
                                <Users className="w-4 h-4 md:w-6 md:h-6 text-[#DF1463]" />
                            </div>
                            <p className="text-gray-700 leading-relaxed text-left text-sm md:text-base">
                                text-sm md:text-base
                            </p>
                        </div>

                        {/* Data Analytics Card */}
                        <div className="text-center space-y-4 flex gap-4">
                            <div className="w-11 h-11 min-h-11 min-w-11 md:w-15 md:h-15 md:min-h-15 md:min-w-15 bg-[#DF1463]/20 rounded-full flex items-center justify-center">
                                <Users className="w-4 h-4 md:w-6 md:h-6 text-[#DF1463]" />
                            </div>
                            <p className="text-gray-700 leading-relaxed text-left text-sm md:text-base">
                                Stellar is more than just a SaaS and technology template—it's a complete digital transformation solution.
                            </p>
                        </div>

                        {/* Digital Transformation Card */}
                        <div className="text-center space-y-4 flex gap-4">
                            <div className="w-11 h-11 min-h-11 min-w-11 md:w-15 md:h-15 md:min-h-15 md:min-w-15 bg-[#DF1463]/20 rounded-full flex items-center justify-center">
                                <Users className="w-4 h-4 md:w-6 md:h-6 text-[#DF1463]" />
                            </div>
                            <p className="text-gray-700 leading-relaxed text-left text-sm md:text-base">
                                Stellar is more than just a SaaS and technology template—it's a complete digital transformation solution.
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    )
}
