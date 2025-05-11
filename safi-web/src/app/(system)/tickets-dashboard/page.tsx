import { Dashboard } from "@/components/dashboard/dashboard"
import { Topbar } from "@/components/tobar"

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Topbar />
      <main className="flex-1">
        <Dashboard />
      </main>
    </div>
  )
}
