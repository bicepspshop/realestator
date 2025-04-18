import { notFound } from "next/navigation"
import { getServerClient } from "@/lib/supabase"
import { PropertyList } from "../components/property-list"
import { AgentInfo } from "../components/agent-info"

interface SharePageProps {
  params: {
    id: string
  }
}

export default async function SharePage({ params }: SharePageProps) {
  const shareId = params.id
  const supabase = getServerClient()

  // Find collection by share_id
  const { data: collection, error: collectionError } = await supabase
    .from("collections")
    .select("id, name, user_id")
    .eq("share_id", shareId)
    .single()

  if (collectionError || !collection) {
    notFound()
  }

  // Get agent info
  const { data: agent } = await supabase.from("users").select("name, email").eq("id", collection.user_id).single()

  // Fetch properties in this collection
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
      bathroom_count,
      property_images (id, image_url)
    `)
    .eq("collection_id", collection.id)
    .order("created_at", { ascending: false })

  if (propertiesError) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Шапка */}
      <header className="bg-white py-6 border-b">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{collection.name}</h1>
          <p className="text-gray-600">Подборка от {agent?.name || "Агента недвижимости"}</p>
        </div>
      </header>

      {/* Основной контент */}
      <main className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        {properties.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-700">В этой подборке пока нет объектов</h2>
            <p className="text-gray-500 mt-2">Агент еще не добавил объекты недвижимости в эту коллекцию</p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex justify-between items-center">
              <div>
                <p className="text-gray-500">Найдено объектов: {properties.length}</p>
              </div>
            </div>

            <PropertyList properties={properties} />

            {/* Информация об агенте */}
            <div className="mt-12 md:mt-16">
              <AgentInfo name={agent?.name || "Агент недвижимости"} email={agent?.email} />
            </div>
          </>
        )}
      </main>

      {/* Подвал */}
      <footer className="bg-white border-t py-8 mt-auto">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-gray-600">&copy; {new Date().getFullYear()} Платформа для риелторов</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
