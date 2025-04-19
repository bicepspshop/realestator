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
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      {/* Шапка */}
      <header className="bg-[#141414] py-6 border-b border-[#222222]">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white">{collection.name}</h1>
          <p className="text-[#CCCCCC]">Подборка от {agent?.name || "Агента недвижимости"}</p>
        </div>
      </header>

      {/* Основной контент */}
      <main className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Информация об агенте - перемещена в начало */}
        <div className="mb-8">
          <AgentInfo name={agent?.name || "Агент недвижимости"} email={agent?.email} />
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-white">В этой подборке пока нет объектов</h2>
            <p className="text-[#CCCCCC] mt-2">Агент еще не добавил объекты недвижимости в эту коллекцию</p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex justify-between items-center">
              <div>
                <p className="text-[#888888]">Найдено объектов: {properties.length}</p>
              </div>
            </div>

            <PropertyList properties={properties} />
          </>
        )}
      </main>

      {/* Подвал */}
      <footer className="bg-[#141414] border-t border-[#222222] py-8 mt-auto">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-[#888888]">&copy; {new Date().getFullYear()} Платформа для риелторов</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
