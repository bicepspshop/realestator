import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { getServerClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { PropertyMap } from "../../components/property-map"

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

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white py-6 border-b">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-blue-600">
              Главная
            </Link>
            <span>/</span>
            <Link href={`/share/${collection?.share_id}`} className="hover:text-blue-600">
              Недвижимость
            </Link>
            <span>/</span>
            <span>
              {property.rooms}-комнатная {propertyTypeLabel.toLowerCase()}, {property.area} м²
            </span>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
          <div className="space-y-8">
            {/* Галерея изображений */}
            <div>
              <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
                <Image
                  src={images[0] || "/placeholder.svg"}
                  alt={`Фото ${propertyTypeLabel}`}
                  fill
                  className="object-cover"
                />
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-4 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-4 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </Button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
                  1 / {images.length || 1}
                </div>
              </div>

              {/* Миниатюры изображений */}
              {images.length > 1 && (
                <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      className={`h-16 w-24 flex-shrink-0 overflow-hidden rounded-md ${
                        index === 0 ? "ring-2 ring-blue-600" : "opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Фото ${index + 1}`}
                        width={96}
                        height={64}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Информация об объекте */}
            <div>
              <h1 className="font-heading text-3xl font-bold">
                {property.rooms}-комнатная {propertyTypeLabel.toLowerCase()}, {property.area} м²
              </h1>
              <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
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
              <div className="mt-4 text-3xl font-bold text-blue-600">{formattedPrice}</div>
            </div>

            {/* Характеристики объекта */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="flex items-center gap-3 p-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 text-blue-600"
                  >
                    <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z" />
                    <path d="m14.5 12.5 2-2" />
                    <path d="m11.5 9.5 2-2" />
                    <path d="m8.5 6.5 2-2" />
                    <path d="m17.5 15.5 2-2" />
                  </svg>
                  <div>
                    <div className="text-sm font-medium">Площадь</div>
                    <div className="text-lg font-semibold">{property.area} м²</div>
                  </div>
                </div>
              </div>

              {property.floor && property.total_floors && (
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                  <div className="flex items-center gap-3 p-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-blue-600"
                    >
                      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
                      <path d="M9 22v-4h6v4" />
                      <path d="M8 6h.01" />
                      <path d="M16 6h.01" />
                      <path d="M12 6h.01" />
                      <path d="M12 10h.01" />
                      <path d="M12 14h.01" />
                      <path d="M16 10h.01" />
                      <path d="M16 14h.01" />
                      <path d="M8 10h.01" />
                      <path d="M8 14h.01" />
                    </svg>
                    <div>
                      <div className="text-sm font-medium">Этаж</div>
                      <div className="text-lg font-semibold">
                        {property.floor}/{property.total_floors}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {property.renovation_type && (
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                  <div className="flex items-center gap-3 p-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-blue-600"
                    >
                      <path d="m14.622 17.897-10.68-2.913" />
                      <path d="M18.376 2.622a1 1 0 1 1 3.002 3.002L17.36 9.643a.5.5 0 0 0 0 .707l.944.944a2.41 2.41 0 0 1 0 3.408l-.944.944a.5.5 0 0 1-.707 0L8.354 7.348a.5.5 0 0 1 0-.707l.944-.944a2.41 2.41 0 0 1 3.408 0l.944.944a.5.5 0 0 0 .707 0z" />
                      <path d="M9 8c-1.804 2.71-3.97 3.46-6.583 3.948a.507.507 0 0 0-.302.819l7.32 8.883a1 1 0 0 0 1.185.204C12.735 20.405 16 16.792 16 15" />
                    </svg>
                    <div>
                      <div className="text-sm font-medium">Ремонт</div>
                      <div className="text-lg font-semibold">{property.renovation_type}</div>
                    </div>
                  </div>
                </div>
              )}

              {property.bathroom_count && (
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                  <div className="flex items-center gap-3 p-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-blue-600"
                    >
                      <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
                      <line x1="10" x2="8" y1="5" y2="7" />
                      <line x1="2" x2="22" y1="12" y2="12" />
                      <line x1="7" x2="7" y1="19" y2="21" />
                      <line x1="17" x2="17" y1="19" y2="21" />
                    </svg>
                    <div>
                      <div className="text-sm font-medium">Санузлы</div>
                      <div className="text-lg font-semibold">{property.bathroom_count}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Описание объекта */}
            {property.description && (
              <div className="prose max-w-none">
                <h2>Описание</h2>
                <p>{property.description}</p>
              </div>
            )}

            {/* Карта */}
            <div>
              <h2 className="mb-4 text-xl font-semibold">Расположение</h2>
              <div className="h-[400px] rounded-lg overflow-hidden border">
                <PropertyMap address={property.address} />
              </div>
            </div>
          </div>

          {/* Информация об агенте */}
          <div className="space-y-6">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm sticky top-24">
              <div className="p-6">
                <div className="flex flex-col items-center text-center">
                  <span className="relative flex shrink-0 overflow-hidden rounded-full h-24 w-24 border-4 border-background mb-4">
                    <span className="flex h-full w-full items-center justify-center rounded-full bg-muted text-lg">
                      {agent?.name?.substring(0, 2) || "АН"}
                    </span>
                  </span>
                  <h3 className="text-xl font-semibold">{agent?.name || "Агент недвижимости"}</h3>
                  <p className="text-sm text-muted-foreground mb-4">Риелтор</p>
                  <p className="text-sm mb-6">
                    Специалист по недвижимости с большим опытом работы. Помогу подобрать идеальный вариант для вас и
                    вашей семьи.
                  </p>
                  <div className="grid w-full gap-2">
                    <Button className="gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      Позвонить
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                      Написать в Telegram
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t py-8">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-blue-600"
              >
                <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              </svg>
              <span className="font-heading font-bold">РиелторПро</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} РиелторПро. Все права защищены.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
