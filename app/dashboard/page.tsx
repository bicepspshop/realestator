import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { NavBar } from "@/components/nav-bar"
import { getSession } from "@/lib/auth"
import { getServerClient, executeWithRetry } from "@/lib/supabase"
import { CreateCollectionDialog } from "./create-collection-dialog"
import { CollectionActions } from "./collection-actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, WifiOff } from "lucide-react"

export default async function DashboardPage() {
  console.log("DashboardPage: Начало загрузки страницы")

  // Получаем сессию
  const session = await getSession()

  // Если нет сессии, отображаем сообщение об ошибке вместо перенаправления
  if (!session) {
    console.log("DashboardPage: Сессия не найдена, отображение сообщения об ошибке")
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h2 className="text-2xl font-bold mb-4">Требуется авторизация</h2>
        <p className="text-gray-600 mb-6">Для доступа к этой странице необходимо войти в систему.</p>
        <div className="flex flex-col gap-4">
          <Link href="/login">
            <Button className="w-full">Войти в систему</Button>
          </Link>
          <Link href="/register">
            <Button variant="outline" className="w-full">
              Зарегистрироваться
            </Button>
          </Link>
          <Link href="/v0-debug">
            <Button variant="secondary" className="w-full">
              Отладка v0
            </Button>
          </Link>
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
      <div className="flex flex-col min-h-screen">
        <NavBar userName={user.name} isOfflineMode={isOfflineMode} />

        <main className="flex-1 container mx-auto px-4 py-8">
          {isOfflineMode && (
            <Alert variant="warning" className="mb-6">
              <WifiOff className="h-4 w-4" />
              <AlertTitle>Режим офлайн</AlertTitle>
              <AlertDescription>
                Обнаружены проблемы с подключением к базе данных. Вы находитесь в режиме офлайн с ограниченной
                функциональностью. Попробуйте обновить страницу позже, когда соединение будет восстановлено.
              </AlertDescription>
            </Alert>
          )}

          {fetchError && !isOfflineMode && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Ошибка загрузки данных</AlertTitle>
              <AlertDescription>
                Не удалось загрузить ваши коллекции. Пожалуйста, попробуйте обновить страницу.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Ваши коллекции недвижимости</h1>
            {!isOfflineMode && !fetchError && <CreateCollectionDialog userId={user.id} />}
          </div>

          {(!fetchError || isOfflineMode) && collections.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-4">
                {isOfflineMode ? "Коллекции недоступны в режиме офлайн" : "Пока нет коллекций"}
              </h2>
              <p className="text-gray-600 mb-6">
                {isOfflineMode
                  ? "Для доступа к коллекциям необходимо подключение к интернету. Попробуйте обновить страницу позже."
                  : "Создайте свою первую коллекцию, чтобы начать организацию объектов."}
              </p>
              {!isOfflineMode && <CreateCollectionDialog userId={user.id} buttonText="Создать первую коллекцию" />}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections.map((collection) => (
                <Card key={collection.id}>
                  <CardHeader>
                    <CardTitle>{collection.name}</CardTitle>
                    <CardDescription>
                      {collection.share_id ? "Есть ссылка для обмена" : "Нет ссылки для обмена"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={`/dashboard/collections/${collection.id}`}>
                      <Button variant="outline" className="w-full">
                        Просмотр объектов
                      </Button>
                    </Link>
                  </CardContent>
                  <CardFooter>
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

        <footer className="bg-gray-100 py-6">
          <div className="container mx-auto px-4 text-center text-gray-600">
            <p>&copy; {new Date().getFullYear()} Платформа для риелторов</p>
          </div>
        </footer>
      </div>
    )
  } catch (error) {
    console.error("DashboardPage: Ошибка:", error)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h2 className="text-2xl font-bold mb-4">Что-то пошло не так</h2>
        <p className="text-gray-600 mb-6">Произошла ошибка при загрузке вашей панели управления.</p>
        <div className="flex flex-col gap-4">
          <Link href="/login">
            <Button className="w-full">Вернуться на страницу входа</Button>
          </Link>
          <Link href="/debug">
            <Button variant="outline" className="w-full">
              Отладка аутентификации
            </Button>
          </Link>
          <Link href="/v0-debug">
            <Button variant="secondary" className="w-full">
              Отладка v0
            </Button>
          </Link>
        </div>
      </div>
    )
  }
}
