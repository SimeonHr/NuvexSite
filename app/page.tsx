"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Check, X, HelpCircle } from "lucide-react"
import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const translations = {
  en: {
    title: "Pricing Calculator",
    users: "Number of Users",
    storage: "Storage (GB)",
    advancedApps: "Advanced Apps Package",
    totalPrice: "Total Price",
    subscribe: "Subscribe Now",
    month: "/month",
    currency: "€",
    basicPlan: "Basic Plan",
    advancedPlan: "Advanced Apps Package",
    featuresTitle: "Included Features",
    features: {
      fileSync: "File Sync & Sharing",
      fileVersioning: "File Versioning & Recovery",
      twoFactor: "Two-Factor Authentication",
      onlyOffice: "OnlyOffice (Document Editing)",
      nextcloudTalk: "Nextcloud Talk (Chat & Video Calls)",
      whiteboard: "Whiteboard & Kanban (Deck)",
      tasksNotes: "Tasks & Notes",
      calendar: "Calendar & Appointments",
      maps: "Maps",
      cospend: "Cospend (Expense Tracking)",
      certificate24: "Certificate24 (Digital Verification)",
      collectives: "Collectives (Wiki Documentation)",
      tables: "Tables (Spreadsheet-like Tool)",
    },
    tooltips: {
      fileSync: "Securely store and share files across devices.",
      fileVersioning: "Restore previous versions of files in case of changes or deletion.",
      twoFactor: "Enhance security with an additional verification step during login.",
      onlyOffice: "Edit and collaborate on documents, spreadsheets, and presentations online.",
      nextcloudTalk: "Communicate with team members via chat and video conferencing.",
      whiteboard: "Organize tasks with kanban boards and collaborate using a whiteboard.",
      tasksNotes: "Manage personal and team tasks with to-do lists and notes.",
      calendar: "Schedule events, manage appointments, and share calendars.",
      maps: "Visualize location-based data and navigate with interactive maps.",
      cospend: "Track expenses, manage shared budgets, and split costs.",
      certificate24: "Digitally sign and verify documents with secure certification.",
      collectives: "Create and manage collaborative wiki-style documentation.",
      tables: "Work with structured spreadsheet-like tables for data management.",
    },
  },
  bg: {
    title: "Калкулатор на цените",
    users: "Брой потребители",
    storage: "Пространство (ГБ)",
    advancedApps: "Пакет с разширени приложения",
    totalPrice: "Обща цена",
    subscribe: "Абонирайте се сега",
    month: "/месец",
    currency: "лв",
    basicPlan: "Основен план",
    advancedPlan: "Пакет с разширени приложения",
    featuresTitle: "Включени функции",
    features: {
      fileSync: "Синхронизиране и споделяне на файлове",
      fileVersioning: "Версии на файлове и възстановяване",
      twoFactor: "Двуфакторна автентикация",
      onlyOffice: "OnlyOffice (Редактиране на документи)",
      nextcloudTalk: "Nextcloud Talk (Чат и видео разговори)",
      whiteboard: "Бяла дъска и Канбан (Deck)",
      tasksNotes: "Задачи и бележки",
      calendar: "Календар и срещи",
      maps: "Карти",
      cospend: "Cospend (Проследяване на разходи)",
      certificate24: "Certificate24 (Цифрово удостоверяване)",
      collectives: "Collectives (Wiki документация)",
      tables: "Tables (Инструмент тип електронна таблица)",
    },
    tooltips: {
      fileSync: "Сигурно съхранение и споделяне на файлове между устройства.",
      fileVersioning: "Възстановяване на предишни версии на файлове в случай на промени или изтриване.",
      twoFactor: "Подобрена сигурност с допълнителна стъпка за проверка при влизане.",
      onlyOffice: "Редактиране и съвместна работа по документи, електронни таблици и презентации онлайн.",
      nextcloudTalk: "Комуникация с членовете на екипа чрез чат и видео конференции.",
      whiteboard: "Организиране на задачи с канбан табла и съвместна работа с бяла дъска.",
      tasksNotes: "Управление на лични и екипни задачи със списъци и бележки.",
      calendar: "Планиране на събития, управление на срещи и споделяне на календари.",
      maps: "Визуализиране на данни, базирани на местоположение, и навигация с интерактивни карти.",
      cospend: "Проследяване на разходи, управление на споделени бюджети и разделяне на разходи.",
      certificate24: "Цифрово подписване и проверка на документи със сигурно удостоверяване.",
      collectives: "Създаване и управление на съвместна документация в стил уики.",
      tables: "Работа със структурирани таблици за управление на данни.",
    },
  },
}

const features = [
  "fileSync",
  "fileVersioning",
  "twoFactor",
  "onlyOffice",
  "nextcloudTalk",
  "whiteboard",
  "tasksNotes",
  "calendar",
  "maps",
  "cospend",
  "certificate24",
  "collectives",
  "tables",
]

export default function PricingCalculator() {
  const [users, setUsers] = useState(1)
  const [storage, setStorage] = useState(100)
  const [advancedApps, setAdvancedApps] = useState(false)
  const [language, setLanguage] = useState<"en" | "bg">("en")

  const calculatePrice = () => {
    const basePrice = 5 // Base price for 1 user and 100GB
    const additionalUserPrice = 1 // Price for each additional user
    const additionalStoragePrice = 2 // Price per additional 100GB of storage
    const advancedAppsPrice = 5 // Flat fee for Advanced Apps Package

    let total = basePrice
    if (users > 1) {
      total += (users - 1) * additionalUserPrice
    }
    if (storage > 100) {
      total += Math.floor((storage - 100) / 100) * additionalStoragePrice
    }
    if (advancedApps) {
      total += advancedAppsPrice
    }

    // Convert to BGN if Bulgarian is selected (multiply by 2)
    return (language === "bg" ? total * 2 : total).toFixed(2)
  }

  const handleSubscribe = async () => {
    try {
      console.log("🟢 Checkout button clicked")

      const requestData = {
        price: calculatePrice(),
        users,
        storage,
        advancedApps,
        language,
      }
      console.log("📤 Sending request data:", requestData)

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create checkout session")
      }

      const data = await response.json()
      console.log("📥 Received API response:", data)

      if (!data.url) {
        throw new Error("No checkout URL received from the API")
      }

      console.log("✅ Redirecting to Stripe checkout:", data.url)
      window.location.href = data.url
    } catch (error) {
      console.error("🚨 Checkout error:", error)
      // You might want to show an error message to the user here
    }
  }

  const t = translations[language]

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 p-8 rounded-lg shadow-xl w-full max-w-4xl border border-slate-700">
        <div className="flex flex-col items-center mb-8">
          <div className="w-full flex justify-end mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage((prev) => (prev === "en" ? "bg" : "en"))}
              className="text-sm"
            >
              {language === "en" ? "🇧🇬 БГ" : "🇪🇺 EN"}
            </Button>
          </div>
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Adobe%20Express%20-%20file-qT65bQrAcBmtYi4mvrKMI7AE3aXifp.png"
            alt="Nuvex Logo"
            width={120}
            height={60}
            className="mb-6"
          />
          <h1 className="text-2xl font-bold text-white">{t.title}</h1>
        </div>

        <div className="space-y-6 mb-8">
          <div>
            <Label htmlFor="users" className="text-slate-200 mb-2 block">
              {t.users}: {users}
            </Label>
            <Slider
              id="users"
              min={1}
              max={20}
              step={1}
              value={[users]}
              onValueChange={(value) => setUsers(value[0])}
              className="mb-2"
            />
          </div>

          <div>
            <Label htmlFor="storage" className="text-slate-200 mb-2 block">
              {t.storage}: {storage}GB
            </Label>
            <Slider
              id="storage"
              min={100}
              max={2000}
              step={100}
              value={[storage]}
              onValueChange={(value) => setStorage(value[0])}
              className="mb-2"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="advanced-apps" className="text-slate-200">
              {t.advancedApps}
            </Label>
            <Switch
              id="advanced-apps"
              checked={advancedApps}
              onCheckedChange={setAdvancedApps}
              className="data-[state=checked]:bg-blue-600"
            />
          </div>

          <div className="mt-6 bg-slate-900 p-4 rounded-lg border border-slate-700">
            <p className="text-lg font-semibold text-white">
              {t.totalPrice}: {t.currency}
              {calculatePrice()}
              {t.month}
            </p>
          </div>

          <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSubscribe}>
            {t.subscribe}
          </Button>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-200">
            <thead className="text-xs uppercase bg-slate-700">
              <tr>
                <th scope="col" className="px-6 py-3">
                  {t.featuresTitle}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t.basicPlan}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t.advancedPlan}
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr key={feature} className={index % 2 === 0 ? "bg-slate-800" : "bg-slate-700"}>
                  <th scope="row" className="px-6 py-4 font-medium">
                    <div className="flex items-center space-x-2">
                      <span className="whitespace-nowrap">{t.features[feature]}</span>
                      <div className="relative group">
                        <HelpCircle className="w-4 h-4 text-slate-400 cursor-help" />
                        <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                          <div className="bg-slate-900 text-slate-200 text-xs rounded p-2 shadow-lg border border-slate-700 max-w-xs">
                            {t.tooltips[feature]}
                          </div>
                          <div className="w-3 h-3 bg-slate-900 transform rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1.5 border-r border-b border-slate-700"></div>
                        </div>
                      </div>
                    </div>
                  </th>
                  <td className="px-6 py-4">
                    {index < 3 ? <Check className="text-green-500" /> : <X className="text-red-500" />}
                  </td>
                  <td className="px-6 py-4">
                    <Check className="text-green-500" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

