import Link from "next/link"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NavBar } from "@/components/nav-bar"
import { getSession } from "@/lib/auth"
import { getServerClient } from "@/lib/supabase"
import { PropertyCard } from "./property-card"
import { AddPropertyForm } from "./add-property-form"

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
      <div className="flex flex-col min-h-screen">
        <NavBar userName={user.name} />

        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">{collection.name}</h1>
              <p className="text-gray-600">Управление объектами недвижимости в этой коллекции</p>
            </div>
            <Link href="/dashboard">
              <Button variant="outline">Назад к коллекциям</Button>
            </Link>
          </div>

          <Tabs defaultValue="properties" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="properties">Объекты ({properties?.length || 0})</TabsTrigger>
              <TabsTrigger value="add">Добавить объект</TabsTrigger>
            </TabsList>

            <TabsContent value="properties">
              {properties && properties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map((property) => (
                    <PropertyCard key={property.id} property={property} collectionId={collectionId} userId={user.id} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h2 className="text-2xl font-semibold mb-4">В этой коллекции пока нет объектов</h2>
                  <p className="text-gray-600 mb-6">
                    Добавьте объекты недвижимости, чтобы начать формировать коллекцию.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="add">
              <AddPropertyForm collectionId={collectionId} />
            </TabsContent>
          </Tabs>
        </main>

        <footer className="bg-gray-100 py-6">
          <div className="container mx-auto px-4 text-center text-gray-600">
            <p>&copy; {new Date().getFullYear()} Платформа для риелторов</p>
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
