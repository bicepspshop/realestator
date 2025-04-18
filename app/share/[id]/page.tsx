import { notFound } from "next/navigation"
import { getServerClient } from "@/lib/supabase"
import { PropertyList } from "../components/property-list"
import { AgentInfo } from "../components/agent-info"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

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
    <div className="min-h-screen bg-[#FAF9F6] text-[#2C2C2C] font-sans">
      {/* Hero Section - Brightened background image */}
      <div className="relative h-[40vh] md:h-[60vh] w-full overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[#FAF9F6]">
          <Image 
            src="/images/background1.png" 
            alt="Premium Real Estate" 
            fill 
            className="object-cover opacity-80 brightness-125 contrast-105"
            priority
          />
          {/* Subtle gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/30"></div>
        </div>
        <div className="container mx-auto px-6 md:px-12 relative z-10 h-full flex flex-col justify-end pb-20">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-medium text-white mb-4 animate-fade-in-up text-shadow-md">{collection.name}</h1>
          <div className="w-20 h-0.5 bg-[#CBA135] mb-6 animate-fade-in-up" style={{animationDelay: '100ms'}}></div>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl animate-fade-in-up text-shadow-sm" style={{animationDelay: '200ms'}}>
            Представляем вашему вниманию эксклюзивную подборку премиальной недвижимости от {agent?.name || "Агента недвижимости"}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 md:px-12 py-16 md:py-24">
        {/* Agent Info Card - Redesigned with glass effect */}
        <div className="mb-20 animate-fade-in-up">
          <AgentInfo name={agent?.name || "Агент недвижимости"} email={agent?.email} />
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-12 bg-white/70 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm animate-fade-in-up">
            <Image 
              src="/images/house3.png" 
              alt="No properties" 
              width={120} 
              height={120} 
              className="mx-auto mb-6 rounded-full object-cover border-4 border-[#FAF9F6]"
            />
            <h2 className="text-2xl font-serif font-medium text-[#2C2C2C] mb-3">В этой подборке пока нет объектов</h2>
            <div className="w-16 h-0.5 bg-[#CBA135] mx-auto mb-4"></div>
            <p className="text-[#2C2C2C]/70 max-w-md mx-auto">
              Агент ещё не добавил объекты недвижимости в эту коллекцию. Пожалуйста, свяжитесь с агентом для получения дополнительной информации.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-12 flex justify-between items-center">
              <div className="animate-fade-in-up">
                <h2 className="text-2xl md:text-3xl font-serif font-medium text-[#2C2C2C]">Представленные объекты</h2>
                <div className="w-16 h-0.5 bg-[#CBA135] mt-3 mb-2"></div>
                <p className="text-[#2C2C2C]/70">Найдено эксклюзивных предложений: {properties.length}</p>
              </div>
              
              <div className="hidden md:flex items-center gap-2 text-[#CBA135] font-medium animate-fade-in-up">
                <span>Просмотреть все</span>
                <ArrowRight size={18} />
              </div>
            </div>

            <PropertyList properties={properties} />
          </>
        )}
      </main>

      {/* Footer with luxury design */}
      <footer className="bg-white mt-20 border-t border-gray-100 py-12">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-xl font-serif font-medium text-[#2C2C2C] mb-2">РиелторПро</h3>
              <div className="w-10 h-0.5 bg-[#CBA135] mb-3"></div>
              <p className="text-[#2C2C2C]/60 text-sm">&copy; {new Date().getFullYear()} Эксклюзивная платформа для риелторов</p>
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="text-[#2C2C2C]/60 hover:text-[#CBA135] transition-colors">Правила использования</a>
              <a href="#" className="text-[#2C2C2C]/60 hover:text-[#CBA135] transition-colors">Конфиденциальность</a>
              <a href="#" className="text-[#2C2C2C]/60 hover:text-[#CBA135] transition-colors">Контакты</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
