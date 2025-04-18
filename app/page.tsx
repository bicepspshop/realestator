import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Платформа для риелторов</h1>
          <div className="space-x-4">
            <Link href="/login">
              <Button variant="outline">Войти</Button>
            </Link>
            <Link href="/register">
              <Button>Регистрация</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 bg-gradient-to-b from-white to-gray-100">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">Упростите презентацию объектов недвижимости</h2>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Создавайте коллекции объектов недвижимости и делитесь ими с клиентами в один клик. Профессиональный способ
              презентации недвижимости.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/register">
                <Button size="lg">Начать</Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline">
                  Войти
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Возможности для профессионалов недвижимости</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4">Организация объектов</h3>
                <p className="text-gray-600">Создавайте коллекции для разных клиентов и типов недвижимости.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4">Мгновенный обмен</h3>
                <p className="text-gray-600">Генерируйте уникальные ссылки для обмена коллекциями с клиентами.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4">Эффективное управление</h3>
                <p className="text-gray-600">Редактируйте и обновляйте информацию об объектах в реальном времени.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Платформа для риелторов</p>
        </div>
      </footer>
    </div>
  )
}
