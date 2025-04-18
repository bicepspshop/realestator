import Link from "next/link"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NavBar } from "@/components/nav-bar"
import { getSession } from "@/lib/auth"
import { getServerClient } from "@/lib/supabase"
import { PropertyCard } from "./property-card"
import { AddPropertyForm } from "./add-property-form"
import { ArrowLeft, Plus, HomeIcon } from "lucide-react"

interface CollectionPageProps {
  params: {
    id: string
  }
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  console.log("CollectionPage: Начало загрузки страницы для коллекции ID:", params.id)

  try {
    const session = await getSession()

    if (!session) {
      console.log("CollectionPage: Сессия не найдена, перенаправление на страницу входа")
      redirect("/login")
    }

    const user = session
    const collectionId = params.id

    console.log("CollectionPage: Сессия найдена для пользователя ID:", user.id)
    console.log("CollectionPage: Получение данных коллекции ID:", collectionId)

    const supabase = getServerClient()

    // Получение данных коллекции с проверкой на ошибки
    const { data: collection, error: collectionError } = await supabase
      .from("collections")
      .select("id, name")
      .eq("id", collectionId)
      .eq("user_id", user.id)
      .single()

    if (collectionError) {
      console.error("CollectionPage: Ошибка при получении коллекции:", collectionError)
      throw new Error(`Не удалось получить данные коллекции: ${collectionError.message}`)
    }

    if (!collection) {
      console.error("CollectionPage: Коллекция не найдена или нет доступа")
      redirect("/dashboard")
    }

    console.log("CollectionPage: Коллекция найдена:", collection.name)
    console.log("CollectionPage: Получение объектов для коллекции ID:", collectionId)

    // Получение объектов в этой коллекции с проверкой на ошибки
    const { data: properties, error: propertiesError } = await supabase
      .from("properties")
      .select(`
        id, 
        property_type, 
        address, 
        rooms, 
        area, 
        price, 
        description,
        living_area,
        floor,
        total_floors,
        balcony,
        year_built,
        renovation_type,
        bathroom_count,
        has_parking,
        property_status,
        property_images (id, image_url)
      `)
      .eq("collection_id", collectionId)
      .order("created_at", { ascending: false })

    if (propertiesError) {
      console.error("CollectionPage: Ошибка при получении объектов:", propertiesError)
      throw new Error(`Не удалось получить объекты недвижимости: ${propertiesError.message}`)
    }

    console.log(`CollectionPage: Получено ${properties?.length || 0} объектов`)

    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-white to-gray-100">
        <NavBar userName={user.name} />

        <main className="flex-1 container-luxury py-8">
          <div className="flex justify-between items-center mb-10">
            <div>
              <div className="flex items-center gap-2 text-sm text-luxury-black/60 mb-2">
                <Link href="/dashboard" className="flex items-center gap-1 hover:text-luxury-gold transition-colors">
                  <HomeIcon size={14} />
                  Коллекции
                </Link>
                <span className="px-1">/</span>
                <span>{collection.name}</span>
              </div>
              <h1 className="text-3xl font-serif font-medium text-luxury-black">{collection.name}</h1>
              <div className="w-20 h-0.5 bg-luxury-gold mt-2 mb-3"></div>
              <p className="text-luxury-black/60">Управление объектами недвижимости в этой коллекции</p>
            </div>
            <Link href="/dashboard">
              <Button variant="outline" className="border-luxury-black/20 hover:bg-luxury-black/5 hover:border-luxury-black/30 rounded-sm flex items-center gap-2" animation="scale">
                <ArrowLeft size={16} />
                Назад к коллекциям
              </Button>
            </Link>
          </div>

          <Tabs defaultValue="properties" className="w-full">
            <TabsList className="mb-8 bg-white border border-luxury-black/10 p-1 rounded-sm">
              <TabsTrigger 
                value="properties" 
                className="data-[state=active]:bg-luxury-black data-[state=active]:text-white rounded-sm py-2.5 px-4"
              >
                Объекты ({properties?.length || 0})
              </TabsTrigger>
              <TabsTrigger 
                value="add" 
                className="data-[state=active]:bg-luxury-black data-[state=active]:text-white rounded-sm py-2.5 px-4"
              >
                <Plus size={16} className="mr-1" />
                Добавить объект
              </TabsTrigger>
            </TabsList>

            <TabsContent value="properties">
              {properties && properties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map((property) => (
                    <PropertyCard key={property.id} property={property} collectionId={collectionId} userId={user.id} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-sm shadow-elegant p-12 text-center max-w-xl mx-auto mt-8 animate-fade-in-up border border-gray-100 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('/images/background.png')] bg-cover bg-center opacity-[0.2] z-0"></div>
                  <div className="relative z-10">
                    <div className="mb-8">
                      <div className="w-20 h-20 mx-auto rounded-full bg-luxury-gold/10 flex items-center justify-center">
                        <HomeIcon className="h-10 w-10 text-luxury-gold" />
                      </div>
                      <div className="w-16 h-0.5 bg-luxury-gold mx-auto mt-4"></div>
                    </div>
                    
                    <h2 className="text-2xl font-serif font-medium mb-4 text-luxury-black">В этой коллекции пока нет объектов</h2>
                    <p className="text-luxury-black/70 mb-8 max-w-lg mx-auto leading-relaxed">
                      Добавьте объекты недвижимости, чтобы начать формировать коллекцию.
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="add" className="relative animate-fade-in">
              <AddPropertyForm collectionId={collectionId} />
            </TabsContent>
          </Tabs>
        </main>

        <footer className="bg-luxury-black py-10 text-white/60 mt-auto border-t border-white/5">
          <div className="container-luxury flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center">
              <h2 className="text-xl font-serif text-white mr-2">РиелторПро</h2>
              <span className="text-sm">• Платформа для риелторов</span>
            </div>
            <p>&copy; {new Date().getFullYear()} Все права защищены</p>
          </div>
        </footer>
      </div>
    )
  } catch (error) {
    console.error("CollectionPage: Непредвиденная ошибка:", error)

    // Перенаправляем на страницу ошибки с информацией об ошибке
    redirect(`/error?message=${encodeURIComponent("Произошла ошибка при загрузке коллекции")}`)
  }
}
