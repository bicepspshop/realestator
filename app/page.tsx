import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar with transparent background */}
      <header className="absolute top-0 left-0 right-0 z-10 py-6">
        <div className="container-luxury flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <h1 className="text-2xl font-serif font-medium tracking-tight text-white text-shadow-md">
              РиелторПро
            </h1>
          </Link>
          <div className="flex items-center space-x-8">
            <nav className="hidden md:flex space-x-8">
              <Link href="#features" className="text-white hover:text-luxury-gold transition-colors duration-300 font-medium">
                Возможности
              </Link>
              <Link href="#about" className="text-white hover:text-luxury-gold transition-colors duration-300 font-medium">
                О платформе
              </Link>
              <Link href="#contact" className="text-white hover:text-luxury-gold transition-colors duration-300 font-medium">
                Контакты
              </Link>
            </nav>
            <div className="flex space-x-4">
              <Link href="/login">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-luxury-black">
                  Войти
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="luxury" animation="scale">
                  Регистрация
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section with full-screen image */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          {/* Background image */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 z-10"></div>
            <Image 
              src="/images/house1.png" 
              alt="Современная недвижимость" 
              fill 
              className="object-cover"
              priority
            />
          </div>
          
          {/* Hero content */}
          <div className="container-luxury relative z-20 mt-16 animate-fade-in-up">
            <div className="max-w-3xl">
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif font-medium mb-6 text-white leading-tight text-shadow-md">
                Превосходный опыт для ваших клиентов
              </h2>
              <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl leading-relaxed">
                Создавайте элегантные коллекции объектов недвижимости и делитесь ими с клиентами. Простой и профессиональный способ презентации недвижимости.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <Link href="/register">
                  <Button size="lg" animation="scale" className="w-full sm:w-auto bg-luxury-gold text-luxury-black hover:bg-luxury-gold/90">
                    Начать бесплатно
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline" animation="scale" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-luxury-black">
                    Узнать больше
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Scroll down indicator */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-white">
          <div className="container-luxury">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="text-3xl md:text-4xl font-display font-medium mb-4">Возможности для профессионалов недвижимости</h2>
              <div className="w-24 h-1 bg-luxury-gold mx-auto mb-6"></div>
              <p className="text-lg text-luxury-black/70 max-w-2xl mx-auto">
                Наша платформа создана для того, чтобы помочь вам выстраивать более глубокие и персонализированные отношения с клиентами.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="group p-8 rounded-sm border border-gray-100 shadow-subtle transition-all duration-500 hover:shadow-elegant hover:-translate-y-2 animate-fade-in-up">
                <div className="w-16 h-16 bg-luxury-gold/10 rounded-sm flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-luxury-gold/20">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 11H5M19 11C19.5523 11 20 11.4477 20 12V19C20 19.5523 19.5523 20 19 20H5C4.44772 20 4 19.5523 4 19V12C4 11.4477 4.44772 11 5 11M19 11V9C19 8.44772 18.5523 8 18 8M5 11V9C5 8.44772 5.44772 8 6 8M18 8V7C18 6.44772 17.5523 6 17 6H7C6.44772 6 6 6.44772 6 7V8M18 8H6" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4 transition-all duration-300 group-hover:text-luxury-gold">Организация коллекций</h3>
                <p className="text-luxury-black/70 leading-relaxed">Создавайте отдельные коллекции для каждого клиента, группируйте объекты по локации, цене или типу недвижимости.</p>
              </div>
              
              <div className="group p-8 rounded-sm border border-gray-100 shadow-subtle transition-all duration-500 hover:shadow-elegant hover:-translate-y-2 animate-fade-in-up" style={{animationDelay: '100ms'}}>
                <div className="w-16 h-16 bg-luxury-gold/10 rounded-sm flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-luxury-gold/20">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.68439 10.6578L5.32155 7.29496M5.32155 7.29496L8.68439 3.93213M5.32155 7.29496L16.3947 7.29496C18.6118 7.29496 20.4105 9.09371 20.4105 11.3108C20.4105 13.5279 18.6118 15.3266 16.3947 15.3266L10.9474 15.3266M15.3156 20.0683L18.6785 16.7055M18.6785 16.7055L15.3156 13.3426M18.6785 16.7055L7.60533 16.7055C5.38818 16.7055 3.58943 14.9068 3.58943 12.6897C3.58943 10.4725 5.38818 8.67377 7.60533 8.67377L13.0527 8.67377" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4 transition-all duration-300 group-hover:text-luxury-gold">Мгновенный обмен</h3>
                <p className="text-luxury-black/70 leading-relaxed">Генерируйте уникальные ссылки для обмена коллекциями с клиентами. Одним нажатием отправьте подборку недвижимости.</p>
              </div>
              
              <div className="group p-8 rounded-sm border border-gray-100 shadow-subtle transition-all duration-500 hover:shadow-elegant hover:-translate-y-2 animate-fade-in-up" style={{animationDelay: '200ms'}}>
                <div className="w-16 h-16 bg-luxury-gold/10 rounded-sm flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-luxury-gold/20">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.2322 5.23223L18.7677 8.76777M16.7322 3.73223C17.7085 2.75592 19.2914 2.75592 20.2677 3.73223C21.244 4.70854 21.244 6.29146 20.2677 7.26777L6.5 21.0355H3V17.4644L16.7322 3.73223Z" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4 transition-all duration-300 group-hover:text-luxury-gold">Управление в реальном времени</h3>
                <p className="text-luxury-black/70 leading-relaxed">Редактируйте и обновляйте информацию об объектах в реальном времени. Клиент всегда видит актуальную информацию.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Property Showcase Section */}
        <section className="py-20 bg-white overflow-hidden">
          <div className="container-luxury">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="text-3xl md:text-4xl font-display font-medium mb-4">Примеры объектов недвижимости</h2>
              <div className="w-24 h-1 bg-luxury-gold mx-auto mb-6"></div>
              <p className="text-lg text-luxury-black/70 max-w-2xl mx-auto">
                Представляйте свои объекты недвижимости в выгодном свете с нашей платформой.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="group rounded-sm overflow-hidden shadow-subtle hover:shadow-elegant transition-all duration-500 animate-fade-in-up">
                <div className="relative h-64 overflow-hidden">
                  <Image 
                    src="/images/house3.png" 
                    alt="Современный дом" 
                    fill 
                    className="object-cover transition-all duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-6 bg-white">
                  <h3 className="text-xl font-semibold mb-2">Современный дом с террасой</h3>
                  <p className="text-luxury-black/70">Просторный дом с панорамными окнами и минималистичным интерьером.</p>
                </div>
              </div>
              
              <div className="group rounded-sm overflow-hidden shadow-subtle hover:shadow-elegant transition-all duration-500 animate-fade-in-up" style={{animationDelay: '100ms'}}>
                <div className="relative h-64 overflow-hidden">
                  <Image 
                    src="/images/house4.png" 
                    alt="Классический особняк" 
                    fill 
                    className="object-cover transition-all duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-6 bg-white">
                  <h3 className="text-xl font-semibold mb-2">Классический особняк</h3>
                  <p className="text-luxury-black/70">Элегантный дом с классическим дизайном и просторным участком.</p>
                </div>
              </div>
              
              <div className="group rounded-sm overflow-hidden shadow-subtle hover:shadow-elegant transition-all duration-500 animate-fade-in-up" style={{animationDelay: '200ms'}}>
                <div className="relative h-64 overflow-hidden">
                  <Image 
                    src="/images/house5.png" 
                    alt="Люкс-апартаменты" 
                    fill 
                    className="object-cover transition-all duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-6 bg-white">
                  <h3 className="text-xl font-semibold mb-2">Люкс-апартаменты</h3>
                  <p className="text-luxury-black/70">Премиальные апартаменты с изысканным интерьером и панорамным видом.</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button size="lg" variant="outline" animation="scale" className="border-luxury-black text-luxury-black hover:bg-luxury-black hover:text-white">
                Посмотреть все объекты
              </Button>
            </div>
          </div>
        </section>

        {/* About Section with Parallax */}
        <section id="about" className="py-24 bg-gray-50 overflow-hidden">
          <div className="container-luxury relative">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              <div className="w-full lg:w-1/2 order-2 lg:order-1">
                <div className="animate-fade-in-up">
                  <h2 className="text-3xl md:text-4xl font-display font-medium mb-6">О платформе РиелторПро</h2>
                  <div className="w-24 h-1 bg-luxury-gold mb-8"></div>
                  <p className="text-lg text-luxury-black/70 mb-6 leading-relaxed">
                    Мы создали РиелторПро с мыслью о том, как сделать работу риелторов более эффективной и при этом повысить удовлетворенность клиентов.
                  </p>
                  <p className="text-lg text-luxury-black/70 mb-8 leading-relaxed">
                    Наша платформа позволяет структурировать работу с объектами недвижимости, делать персонализированные подборки для клиентов и поддерживать профессиональную коммуникацию на всех этапах сделки.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-8">
                    <div className="relative aspect-[3/2] rounded-sm overflow-hidden shadow-subtle hover:shadow-elegant transition-all duration-300 hover:scale-105">
                      <Image src="/images/house6.png" alt="Пример интерьера" fill className="object-cover" />
                    </div>
                    <div className="relative aspect-[3/2] rounded-sm overflow-hidden shadow-subtle hover:shadow-elegant transition-all duration-300 hover:scale-105">
                      <Image src="/images/house7.png" alt="Пример интерьера" fill className="object-cover" />
                    </div>
                    <div className="relative aspect-[3/2] rounded-sm overflow-hidden shadow-subtle hover:shadow-elegant transition-all duration-300 hover:scale-105">
                      <Image src="/images/house8.png" alt="Пример интерьера" fill className="object-cover" />
                    </div>
                    <div className="relative aspect-[3/2] rounded-sm overflow-hidden shadow-subtle hover:shadow-elegant transition-all duration-300 hover:scale-105">
                      <Image src="/images/house9.png" alt="Пример интерьера" fill className="object-cover" />
                    </div>
                    <div className="relative aspect-[3/2] rounded-sm overflow-hidden shadow-subtle hover:shadow-elegant transition-all duration-300 hover:scale-105">
                      <Image src="/images/house10.png" alt="Пример интерьера" fill className="object-cover" />
                    </div>
                    <div className="relative aspect-[3/2] rounded-sm overflow-hidden shadow-subtle hover:shadow-elegant transition-all duration-300 hover:scale-105">
                      <Image src="/images/house11.png" alt="Пример интерьера" fill className="object-cover" />
                    </div>
                  </div>
                  <Link href="/register">
                    <Button size="lg" className="bg-luxury-black text-white">
                      Начать работу
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="w-full lg:w-1/2 order-1 lg:order-2 relative">
                <div className="relative h-[400px] md:h-[500px] animate-fade-in-up overflow-hidden rounded-sm">
                  <Image 
                    src="/images/house2.png" 
                    alt="Работа на платформе" 
                    fill 
                    className="object-cover transition-all duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-luxury-black/30 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="contact" className="py-20 bg-luxury-black text-white">
          <div className="container-luxury text-center">
            <div className="max-w-3xl mx-auto animate-fade-in-up">
              <h2 className="text-3xl md:text-4xl font-serif font-medium mb-6">Готовы улучшить свой бизнес?</h2>
              <p className="text-lg text-white/80 mb-10">
                Присоединяйтесь к сотням риелторов, которые уже используют РиелторПро для повышения эффективности своей работы и улучшения клиентского опыта.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto bg-luxury-gold text-luxury-black hover:bg-luxury-gold/90" animation="scale">
                    Создать аккаунт
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-luxury-black" animation="scale">
                    Войти в систему
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-luxury-black text-white pt-16 pb-8 border-t border-white/10">
        <div className="container-luxury">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-xl font-serif mb-6">РиелторПро</h3>
              <p className="text-white/70 mb-6">Платформа для риелторов, которая упрощает работу с клиентами и делает презентацию недвижимости более профессиональной.</p>
            </div>
            <div>
              <h4 className="font-medium mb-6">Навигация</h4>
              <ul className="space-y-3">
                <li><Link href="#features" className="text-white/70 hover:text-luxury-gold transition-colors duration-300">Возможности</Link></li>
                <li><Link href="#about" className="text-white/70 hover:text-luxury-gold transition-colors duration-300">О платформе</Link></li>
                <li><Link href="#contact" className="text-white/70 hover:text-luxury-gold transition-colors duration-300">Контакты</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-6">Правовая информация</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="text-white/70 hover:text-luxury-gold transition-colors duration-300">Условия использования</Link></li>
                <li><Link href="#" className="text-white/70 hover:text-luxury-gold transition-colors duration-300">Политика конфиденциальности</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-6">Контакты</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-luxury-gold">
                    <path d="M22 12C22 10.6868 21.7413 9.38647 21.2388 8.1731C20.7363 6.95996 19.9997 5.85742 19.0711 4.92893C18.1425 4.00043 17.04 3.26374 15.8269 2.7612C14.6138 2.25866 13.3132 2 12 2C10.6868 2 9.38647 2.25866 8.1731 2.7612C6.95996 3.26374 5.85742 4.00043 4.92893 4.92893C4.00043 5.85742 3.26374 6.95996 2.7612 8.1731C2.25866 9.38647 2 10.6868 2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 13H9.67C9.67 13 10 13 10.25 12.8C10.5 12.6 10.5 12.5 10.5 12.5C10.5 12.5 10.5 12.4 10.25 12.2C10 12 9.67 12 9.67 12H8.5C8.5 12 7.83 12 7.33 12.5C6.83 13 6.83 13.67 6.83 13.67V16.33C6.83 16.33 6.83 17 7.33 17.5C7.83 18 8.5 18 8.5 18H9.67C9.67 18 10 18 10.25 17.8C10.5 17.6 10.5 17.5 10.5 17.5C10.5 17.5 10.5 17.4 10.25 17.2C10 17 9.67 17 9.67 17H8V16H9.4C9.4 16 9.73 16 9.98 15.8C10.23 15.6 10.23 15.5 10.23 15.5C10.23 15.5 10.23 15.4 9.98 15.2C9.73 15 9.4 15 9.4 15H8V13Z" fill="currentColor"/>
                    <path d="M12.5 17V13.5V13M12.5 17V13.5C12.5 13 13 12.5 13.5 12.5C14 12.5 14.5 13 14.5 13.5V17M12.5 17H11.5M14.5 17H15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17.5 17V13C17.5 12.6 17.6 12.3 17.8 12C18 11.7 18.2 11.5 18.6 11.5C19 11.5 19.2 11.7 19.4 12C19.6 12.3 19.7 12.6 19.7 13V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17.5 13C17.5 13 17.5 12 18.5 12C19.5 12 19.5 13 19.5 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-white/70">support@rieltorpro.ru</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-luxury-gold">
                    <path d="M3 5C3 3.89543 3.89543 3 5 3H8.27924C8.70967 3 9.09181 3.27543 9.22792 3.68377L10.7257 8.17721C10.8831 8.64932 10.6694 9.16531 10.2243 9.38787L7.96701 10.5165C9.06925 12.9612 11.0388 14.9308 13.4835 16.033L14.6121 13.7757C14.8347 13.3306 15.3507 13.1169 15.8228 13.2743L20.3162 14.7721C20.7246 14.9082 21 15.2903 21 15.7208V19C21 20.1046 20.1046 21 19 21H18C9.71573 21 3 14.2843 3 6V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-white/70">+7 (495) 123-45-67</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 text-center text-white/50">
            <p>&copy; {new Date().getFullYear()} РиелторПро. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
