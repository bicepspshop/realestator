import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { getServerClient } from "@/lib/supabase"
import { PropertyCarousel } from "./property-carousel"
import { YandexMap } from "@/components/yandex-map"
import { ChevronRight, Home, MapPin, Phone, Mail, MessageSquare, Copy, Star } from "lucide-react"

interface PropertyPageProps {
  params: {
    id: string
  }
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const propertyId = params.id
  const supabase = getServerClient()

  // Получаем данные объекта недвижимости
  const { data: property, error } = await supabase
    .from("properties")
    .select(`
      id, 
      property_type, 
      address, 
      rooms, 
      area, 
      price, 
      description,
      floor_plan_url,
      living_area,
      floor,
      total_floors,
      bathroom_count,
      renovation_type,
      property_images (id, image_url),
      collection_id
    `)
    .eq("id", propertyId)
    .single()

  if (error || !property) {
    notFound()
  }

  // Получаем данные о коллекции и агенте
  const { data: collection } = await supabase
    .from("collections")
    .select("id, name, user_id, share_id")
    .eq("id", property.collection_id)
    .single()

  const { data: agent } = await supabase.from("users").select("id, name, email").eq("id", collection?.user_id).single()

  // Форматирование цены
  const formattedPrice = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(property.price)

  // Определение типа объекта недвижимости
  const propertyTypeLabel =
    {
      apartment: "Квартира",
      house: "Дом",
      land: "Земельный участок",
    }[property.property_type] || "Объект"

  // Получаем изображения объекта
  const images = property.property_images?.map((img) => img.image_url) || []

  // Формирование заголовка объекта
  const propertyTitle = `${property.rooms ? `${property.rooms}-комн. ` : ""}${propertyTypeLabel.toLowerCase()}, ${property.area} м²`

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#2C2C2C] pb-16">
      {/* Hero section with property images */}
      <div className="relative h-[50vh] md:h-[65vh] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src={images[0] || "/images/house1.png"} 
            alt={propertyTitle}
            fill 
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60"></div>
        </div>
        
        {/* Floating navigation */}
        <div className="absolute top-0 left-0 right-0 z-30">
          <div className="container mx-auto px-6 md:px-12 py-6">
            <div className="flex items-center gap-2 text-white/90 bg-black/20 backdrop-blur-sm px-4 py-2 
              rounded-sm inline-block shadow-sm animate-fade-in-up">
              <Link href={`/share/${collection?.share_id}`} className="hover:text-white transition-colors flex items-center gap-1">
                <Home size={14} />
                <span>К списку объектов</span>
              </Link>
              <ChevronRight size={14} />
              <span className="text-white font-medium">{propertyTitle}</span>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-6 md:px-12 -mt-20 relative z-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_380px] animate-fade-in-up">
          {/* Main content */}
          <div>
            {/* Property info card */}
            <div className="bg-white rounded-sm shadow-elegant p-8 md:p-10 mb-10">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-serif font-medium text-[#2C2C2C] leading-tight">{propertyTitle}</h1>
                  <div className="flex items-center gap-2 text-[#2C2C2C]/70 mt-2">
                    <MapPin size={16} className="text-[#CBA135]" />
                    <span>{property.address}</span>
                  </div>
                </div>
                <div className="text-2xl md:text-3xl font-serif font-medium text-[#CBA135]">{formattedPrice}</div>
              </div>
              
              <div className="w-full h-0.5 bg-gray-100 my-6"></div>
              
              {/* Property images carousel */}
              <div className="aspect-[16/9] overflow-hidden rounded-sm mb-10 border border-gray-100">
                <PropertyCarousel images={images} propertyType={propertyTypeLabel} />
              </div>
              
              {/* Description */}
              <div className="mb-10">
                <h2 className="text-xl font-serif font-medium mb-4">Описание</h2>
                <div className="w-12 h-0.5 bg-[#CBA135] mb-6"></div>
                <div className="text-[#2C2C2C]/80 leading-relaxed">
                  {property.description ? (
                    <p>{property.description}</p>
                  ) : (
                    <p>Описание объекта недвижимости не представлено агентом.</p>
                  )}
                </div>
              </div>
              
              {/* Features */}
              <div className="mb-10">
                <h2 className="text-xl font-serif font-medium mb-4">Характеристики</h2>
                <div className="w-12 h-0.5 bg-[#CBA135] mb-6"></div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                  <div className="bg-[#FAF9F6] p-5 rounded-sm border border-gray-100">
                    <div className="text-sm text-[#2C2C2C]/60 mb-1">Площадь общая</div>
                    <div className="text-lg font-medium text-[#2C2C2C]">{property.area} м²</div>
                  </div>
                  
                  {property.living_area && (
                    <div className="bg-[#FAF9F6] p-5 rounded-sm border border-gray-100">
                      <div className="text-sm text-[#2C2C2C]/60 mb-1">Площадь жилая</div>
                      <div className="text-lg font-medium text-[#2C2C2C]">{property.living_area} м²</div>
                    </div>
                  )}
                  
                  {property.floor && property.total_floors && (
                    <div className="bg-[#FAF9F6] p-5 rounded-sm border border-gray-100">
                      <div className="text-sm text-[#2C2C2C]/60 mb-1">Этаж</div>
                      <div className="text-lg font-medium text-[#2C2C2C]">
                        {property.floor} из {property.total_floors}
                      </div>
                    </div>
                  )}
                  
                  {property.rooms !== null && (
                    <div className="bg-[#FAF9F6] p-5 rounded-sm border border-gray-100">
                      <div className="text-sm text-[#2C2C2C]/60 mb-1">Комнаты</div>
                      <div className="text-lg font-medium text-[#2C2C2C]">{property.rooms}</div>
                    </div>
                  )}
                  
                  {property.bathroom_count && (
                    <div className="bg-[#FAF9F6] p-5 rounded-sm border border-gray-100">
                      <div className="text-sm text-[#2C2C2C]/60 mb-1">Санузлы</div>
                      <div className="text-lg font-medium text-[#2C2C2C]">{property.bathroom_count}</div>
                    </div>
                  )}
                  
                  {property.renovation_type && (
                    <div className="bg-[#FAF9F6] p-5 rounded-sm border border-gray-100">
                      <div className="text-sm text-[#2C2C2C]/60 mb-1">Ремонт</div>
                      <div className="text-lg font-medium text-[#2C2C2C]">{property.renovation_type}</div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Floor plan */}
              {property.floor_plan_url && (
                <div className="mb-10">
                  <h2 className="text-xl font-serif font-medium mb-4">Планировка</h2>
                  <div className="w-12 h-0.5 bg-[#CBA135] mb-6"></div>
                  <div className="relative aspect-[4/3] rounded-sm overflow-hidden border border-gray-100">
                    <Image
                      src={property.floor_plan_url}
                      alt="Планировка"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
            
            {/* Map section */}
            <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-8 md:p-10">
              <h2 className="text-xl font-serif font-medium mb-4">Расположение</h2>
              <div className="w-12 h-0.5 bg-[#CBA135] mb-6"></div>
              <div className="h-[400px] rounded-sm overflow-hidden border border-gray-100">
                <YandexMap address={property.address} className="w-full h-full" />
              </div>
              <div className="mt-4 flex items-center gap-2 text-[#2C2C2C]/70">
                <MapPin size={16} className="text-[#CBA135]" />
                <span>{property.address}</span>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-8">
            {/* Agent card */}
            <div className="bg-white rounded-sm shadow-elegant p-6 sticky top-6 border border-gray-100">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FAF9F6] to-[#F5EDD7] 
                  flex items-center justify-center border-4 border-white shadow-sm">
                  <span className="text-xl font-serif text-[#CBA135]">{agent?.name?.charAt(0).toUpperCase() || "А"}</span>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-[#CBA135] mb-1 font-medium">Ваш консультант</div>
                  <div className="text-lg font-serif font-medium text-[#2C2C2C]">{agent?.name || "Агент недвижимости"}</div>
                  {agent?.email && <div className="text-sm text-[#2C2C2C]/70 mt-1">{agent.email}</div>}
                </div>
              </div>
              
              <div className="w-full h-0.5 bg-gray-100 mb-6"></div>
              
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-sm text-[#2C2C2C]/80">
                  <Star size={16} className="text-[#CBA135]" />
                  <span>Специализация: элитная недвижимость</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#2C2C2C]/80">
                  <Star size={16} className="text-[#CBA135]" />
                  <span>Опыт работы: более 5 лет</span>
                </div>
              </div>
              
              <div className="w-full h-0.5 bg-gray-100 my-6"></div>
              
              <div className="space-y-3 mb-6">
                <button className="w-full flex items-center justify-center gap-2 bg-[#CBA135] hover:bg-[#D4AF37] text-white 
                  font-medium py-3 px-4 rounded-sm transition-all duration-300 shadow-sm hover:shadow-md">
                  <Phone size={16} />
                  <span>Позвонить</span>
                </button>
                
                <a href={`mailto:${agent?.email}`} className="w-full flex items-center justify-center gap-2 border border-[#CBA135] 
                  text-[#CBA135] hover:bg-[#CBA135]/10 font-medium py-3 px-4 rounded-sm transition-all duration-300">
                  <Mail size={16} />
                  <span>Написать письмо</span>
                </a>
                
                <button className="w-full flex items-center justify-center gap-2 border border-gray-200 
                  text-[#2C2C2C]/80 hover:border-[#2C2C2C]/80 font-medium py-3 px-4 rounded-sm transition-all duration-300">
                  <MessageSquare size={16} />
                  <span>Telegram</span>
                </button>
              </div>
              
              <div className="text-sm text-[#2C2C2C]/60 text-center">
                <button className="inline-flex items-center gap-1 hover:text-[#CBA135] transition-colors">
                  <Copy size={14} />
                  <span>Скопировать контакты</span>
                </button>
              </div>
            </div>
            
            {/* Back to collection */}
            <div className="bg-white rounded-sm p-6 border border-gray-100 shadow-sm">
              <Link 
                href={`/share/${collection?.share_id}`}
                className="flex items-center justify-between text-[#2C2C2C]/80 hover:text-[#CBA135] transition-colors group"
              >
                <span className="font-medium">Вернуться к коллекции</span>
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white mt-20 border-t border-gray-100 py-8">
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
