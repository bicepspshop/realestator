import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { NavBar } from "@/components/nav-bar"
import { getSession } from "@/lib/auth"
import { getServerClient, executeWithRetry } from "@/lib/supabase"
import { CreateCollectionDialog } from "./create-collection-dialog"
import { CollectionActions } from "./collection-actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, WifiOff, FolderPlus, Home } from "lucide-react"

export default async function DashboardPage() {
  console.log("DashboardPage: Начало загрузки страницы")

  // Получаем сессию
  const session = await getSession()

  // Если нет сессии, отображаем сообщение об ошибке вместо перенаправления
  if (!session) {
    console.log("DashboardPage: Сессия не найдена, отображение сообщения об ошибке")
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-luxury p-4 py-16">
        <div className="bg-white rounded-sm shadow-elegant p-12 max-w-lg w-full animate-fade-in-up">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-serif font-medium tracking-tight text-luxury-black mb-2">
              РиелторПро
            </h1>
            <div className="w-16 h-0.5 bg-luxury-gold mx-auto mb-6"></div>
            <h2 className="text-2xl font-display font-medium mb-4 text-luxury-black">Требуется авторизация</h2>
            <p className="text-luxury-black/70 mb-8">Для доступа к этой странице необходимо войти в систему.</p>
          </div>
          <div className="flex flex-col gap-4">
            <Link href="/login">
              <Button className="w-full bg-luxury-black hover:bg-black text-white py-6" animation="scale">
                Войти в систему
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" className="w-full border-luxury-black/20 hover:bg-luxury-black/5 rounded-sm py-6" animation="scale">
                Зарегистрироваться
              </Button>
            </Link>
            <Link href="/v0-debug" className="mt-4">
              <Button 
                variant="minimal" 
                className="w-full text-luxury-black/50 hover:text-luxury-black underline underline-offset-4 py-4 text-sm"
              >
                Отладка v0
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Теперь мы знаем, что у нас есть сессия, можем безопасно использовать её
  const user = session
  console.log("DashboardPage: Сессия найдена для пользователя:", user.name)

  // Проверяем, является ли сессия временной (офлайн режим)
  const isOfflineMode = "isOfflineMode" in user && user.isOfflineMode === true

  try {
    // Получаем коллекции пользователя
    console.log("DashboardPage: Получение коллекций для пользователя ID:", user.id)
    const supabase = getServerClient()

    let collections = []
    let fetchError = null

    try {
      // Проверяем, находимся ли мы в офлайн-режиме
      if (isOfflineMode) {
        console.log("DashboardPage: Работа в офлайн-режиме, пропускаем запрос к базе данных")
        collections = [] // В офлайн-режиме возвращаем пустой массив
      } else {
        // Используем функцию с повторными попытками и таймаутом
        const { data, error } = await executeWithRetry(
          () =>
            supabase
              .from("collections")
              .select("id, name, share_id")
              .eq("user_id", user.id)
              .order("created_at", { ascending: false }),
          3, // Максимальное количество попыток
          2000, // Увеличенный таймаут между попытками
        )

        if (error) {
          console.error("DashboardPage: Ошибка при получении коллекций:", error)
          fetchError = error
        } else {
          collections = data || []
          console.log(`DashboardPage: Получено ${collections.length} коллекций`)
        }
      }
    } catch (error) {
      console.error("DashboardPage: Ошибка при получении коллекций:", error)
      fetchError = error
    }

    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-white to-gray-100 relative">
        
        <NavBar userName={user.name} isOfflineMode={isOfflineMode} />

        <main className="flex-1 container-luxury py-8 relative z-10">
          {isOfflineMode && (
            <Alert variant="warning" className="mb-8 rounded-sm border-amber-200 bg-amber-50">
              <WifiOff className="h-4 w-4 text-amber-600" />
              <AlertTitle className="font-medium text-amber-700">Режим офлайн</AlertTitle>
              <AlertDescription className="text-amber-700/80">
                Обнаружены проблемы с подключением к базе данных. Вы находитесь в режиме офлайн с ограниченной
                функциональностью. Попробуйте обновить страницу позже, когда соединение будет восстановлено.
              </AlertDescription>
            </Alert>
          )}

          {fetchError && !isOfflineMode && (
            <Alert variant="destructive" className="mb-8 rounded-sm border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertTitle className="font-medium text-red-700">Ошибка загрузки данных</AlertTitle>
              <AlertDescription className="text-red-700/80">
                Не удалось загрузить ваши коллекции. Пожалуйста, попробуйте обновить страницу.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-3xl font-serif font-medium text-luxury-black">Ваши коллекции</h1>
              <div className="w-20 h-0.5 bg-luxury-gold mt-2 mb-3"></div>
              <p className="text-luxury-black/60">Управляйте коллекциями объектов недвижимости для ваших клиентов</p>
            </div>
            {!isOfflineMode && !fetchError && <CreateCollectionDialog userId={user.id} />}
          </div>

          {(!fetchError || isOfflineMode) && collections.length === 0 ? (
            <div className="bg-white rounded-sm shadow-elegant p-16 text-center max-w-xl mx-auto mt-12 animate-fade-in-up">
              <div className="mb-8">
                <div className="w-40 h-40 mx-auto mb-6 overflow-hidden rounded-sm border border-gray-100">
                  <Image 
                    src="/images/house3.png"
                    alt="Изображение недвижимости"
                    width={160}
                    height={160}
                    className="w-full h-full object-cover transition-all duration-700"
                  />
                </div>
                <div className="w-20 h-20 -mt-10 mx-auto rounded-full bg-white border border-gray-100 shadow-md flex items-center justify-center">
                  <FolderPlus className="h-8 w-8 text-luxury-gold" />
                </div>
                <div className="w-16 h-0.5 bg-luxury-gold mx-auto mt-4"></div>
              </div>
              
              <h2 className="text-2xl font-display font-medium mb-4 text-luxury-black">
                {isOfflineMode ? "Коллекции недоступны в режиме офлайн" : "Пока нет коллекций"}
              </h2>
              <p className="text-luxury-black/70 mb-8 max-w-lg mx-auto leading-relaxed">
                {isOfflineMode
                  ? "Для доступа к коллекциям необходимо подключение к интернету. Попробуйте обновить страницу позже."
                  : "Создайте свою первую коллекцию, чтобы начать организацию объектов недвижимости для ваших клиентов."}
              </p>
              {!isOfflineMode && <CreateCollectionDialog userId={user.id} buttonText="Создать первую коллекцию" />}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections.map((collection, index) => (
                <Card 
                  key={collection.id} 
                  className="overflow-hidden rounded-sm border border-gray-100 shadow-subtle hover:shadow-elegant transition-all duration-500 animate-fade-in-up hover:-translate-y-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader className="bg-white border-b border-gray-100 pb-4">
                    <CardTitle className="font-display">{collection.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1.5 text-luxury-black/60">
                      {collection.share_id ? (
                        <>
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          Есть ссылка для просмотра
                        </>
                      ) : (
                        <>
                          <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                          Нет ссылки для просмотра
                        </>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 pb-4">
                    <div className="mb-4 aspect-[3/2] rounded-sm overflow-hidden border border-gray-100">
                      <Image 
                        src={`/images/house${(parseInt(collection.id, 10) % 11) + 1}.png`}
                        alt="Недвижимость"
                        width={400}
                        height={266}
                        className="w-full h-full object-cover transition-all duration-700 hover:scale-105"
                      />
                    </div>
                    <Link href={`/dashboard/collections/${collection.id}`}>
                      <Button 
                        variant="outline" 
                        className="w-full border-luxury-black/20 hover:bg-luxury-black/5 hover:border-luxury-black/30 rounded-sm flex items-center justify-center gap-2 py-5" 
                        animation="scale"
                      >
                        <Home size={16} />
                        Просмотр объектов
                      </Button>
                    </Link>
                  </CardContent>
                  <CardFooter className="bg-gray-50 pt-4 border-t border-gray-100">
                    {!isOfflineMode && (
                      <CollectionActions
                        collectionId={collection.id}
                        userId={user.id}
                        hasShareLink={!!collection.share_id}
                        shareId={collection.share_id}
                      />
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
                
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
    console.error("DashboardPage: Ошибка:", error)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-luxury p-4 py-16">
        <div className="bg-white rounded-sm shadow-elegant p-12 max-w-lg w-full animate-fade-in-up">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-serif font-medium tracking-tight text-luxury-black mb-2">
              РиелторПро
            </h1>
            <div className="w-16 h-0.5 bg-luxury-gold mx-auto mb-6"></div>
            <h2 className="text-2xl font-display font-medium mb-4 text-luxury-black">Что-то пошло не так</h2>
            <p className="text-luxury-black/70 mb-8">Произошла ошибка при загрузке вашей панели управления.</p>
          </div>
          <div className="flex flex-col gap-4">
            <Link href="/login">
              <Button className="w-full bg-luxury-black hover:bg-black text-white py-6" animation="scale">
                Вернуться на страницу входа
              </Button>
            </Link>
            <Link href="/debug" className="mt-4">
              <Button 
                variant="minimal" 
                className="w-full text-luxury-black/50 hover:text-luxury-black underline underline-offset-4 py-4 text-sm"
              >
                Отладка аутентификации
              </Button>
            </Link>
            <Link href="/v0-debug" className="mt-1">
              <Button 
                variant="minimal" 
                className="w-full text-luxury-black/50 hover:text-luxury-black underline underline-offset-4 py-4 text-sm"
              >
                Отладка v0
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }
}
