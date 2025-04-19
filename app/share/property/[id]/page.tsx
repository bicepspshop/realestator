import { notFound } from "next/navigation"
import Link from "next/link"
import { getServerClient } from "@/lib/supabase"
import { PropertyCarousel } from "./property-carousel"
import { YandexMap } from "@/components/yandex-map"

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
    <div className="min-h-screen bg-[#0D0D0D] text-white pb-8">
      <main className="container py-8">
        {/* Хлебные крошки */}
        <div className="flex items-center gap-2 text-sm text-[#CCCCCC] mb-4">
          <Link href="/" className="hover:text-[#4370FF] transition-colors">
            Главная
          </Link>
          <span>/</span>
          <Link href={`/share/${collection?.share_id}`} className="hover:text-[#4370FF] transition-colors">
            Недвижимость
          </Link>
          <span>/</span>
          <span className="text-white">{propertyTitle}</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
          {/* Галерея и информация об объекте */}
          <div className="space-y-8">
            {/* Галерея изображений */}
            <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-[#141414] shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
              <PropertyCarousel images={images} propertyType={propertyTypeLabel} />
            </div>

            {/* Планировка - если есть */}
            {property.floor_plan_url && (
              <div className="bg-[#141414] rounded-xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
                <h2 className="text-xl font-bold text-white mb-4">Планировка</h2>
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                  <img
                    src={property.floor_plan_url || "/placeholder.svg"}
                    alt="Планировка"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}

            {/* Информация об объекте */}
            <div className="bg-[#141414] rounded-xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
              <h1 className="text-2xl font-bold text-white mb-2">{propertyTitle}</h1>
              <div className="flex items-center gap-2 text-[#CCCCCC] mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>{property.address}</span>
              </div>
              <div className="text-2xl font-bold text-[#4370FF] mb-4">{formattedPrice}</div>

              {/* Описание объекта */}
              <div className="text-[#CCCCCC] mb-6">
                {property.description ? <p>{property.description}</p> : <p>Нет описания</p>}
              </div>
            </div>

            {/* Характеристики объекта */}
            <div className="bg-[#141414] rounded-xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
              <h2 className="text-xl font-bold text-white mb-4">Характеристики</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                <div className="bg-[#1A1A1A] p-4 rounded-lg">
                  <div className="text-sm text-[#CCCCCC]">Площадь</div>
                  <div className="text-lg font-semibold text-white">{property.area} м²</div>
                </div>

                {property.floor && property.total_floors && (
                  <div className="bg-[#1A1A1A] p-4 rounded-lg">
                    <div className="text-sm text-[#CCCCCC]">Этаж</div>
                    <div className="text-lg font-semibold text-white">
                      {property.floor}/{property.total_floors}
                    </div>
                  </div>
                )}

                {property.renovation_type && (
                  <div className="bg-[#1A1A1A] p-4 rounded-lg">
                    <div className="text-sm text-[#CCCCCC]">Ремонт</div>
                    <div className="text-lg font-semibold text-white">{property.renovation_type}</div>
                  </div>
                )}

                {property.bathroom_count && (
                  <div className="bg-[#1A1A1A] p-4 rounded-lg">
                    <div className="text-sm text-[#CCCCCC]">Санузлы</div>
                    <div className="text-lg font-semibold text-white">{property.bathroom_count}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Карта */}
            <div className="bg-[#141414] rounded-xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
              <h2 className="text-xl font-bold text-white mb-4">Расположение</h2>
              <div className="h-[400px] rounded-lg overflow-hidden">
                <YandexMap address={property.address} className="w-full h-full" />
              </div>
            </div>
          </div>

          {/* Карточка агента */}
          <div className="rounded-xl bg-[#141414] text-white shadow-[0_4px_12px_rgba(0,0,0,0.4)] p-6 sticky top-24 h-fit">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-[#1A1A1A] flex items-center justify-center text-lg font-semibold">
                {agent?.name?.substring(0, 2) || "АН"}
              </div>
              <div>
                <div className="text-sm text-[#CCCCCC]">Ваш агент по недвижимости</div>
                <div className="text-lg font-semibold">{agent?.name || "Агент недвижимости"}</div>
                <div className="text-sm text-[#CCCCCC]">{agent?.email || "agent@example.com"}</div>
                <p className="mt-2 text-sm text-[#CCCCCC]">
                  Специалист по недвижимости с большим опытом работы. Помогу подобрать идеальный вариант для вас и вашей
                  семьи.
                </p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="flex-1 rounded-lg bg-[#4370FF] hover:bg-[#3060FF] text-white h-10 transition-all duration-200 hover:shadow-[0_2px_8px_rgba(67,112,255,0.4)] active:scale-[0.98]">
                Позвонить
              </button>
              <button className="flex-1 rounded-lg border border-[#333333] hover:border-[#4370FF] hover:text-[#4370FF] h-10 transition-all duration-200">
                Написать в Telegram
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
