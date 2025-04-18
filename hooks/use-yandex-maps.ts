"use client"

import { useState, useEffect } from "react"

// API ключ для Яндекс Карт
const API_KEY = "c6cdb52a-f5dd-49e9-8419-a2f7edf78c2c"

interface YandexMapsHook {
  isLoaded: boolean
  isError: boolean
  errorMessage: string | null
}

export function useYandexMaps(): YandexMapsHook {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Защита от выполнения в SSR
    if (typeof window === "undefined") {
      return
    }

    // Проверяем, загружен ли уже API
    if (window.ymaps && window.ymaps.ready) {
      console.log("Яндекс Карты API уже загружен")

      // Проверяем, что API полностью инициализирован
      if (window.ymaps.geocode) {
        setIsLoaded(true)
      } else {
        // Если API загружен, но geocode не доступен, ждем полной инициализации
        window.ymaps.ready(() => {
          setIsLoaded(true)
        })
      }
      return
    }

    // Предотвращаем повторную загрузку
    if (isLoading) return

    setIsLoading(true)
    console.log("Начало загрузки Яндекс Карты API")

    try {
      // Создаем скрипт для загрузки API
      const script = document.createElement("script")
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=${API_KEY}&lang=ru_RU`
      script.async = true
      script.defer = true

      // Добавляем таймаут для обнаружения проблем с загрузкой
      const timeoutId = setTimeout(() => {
        if (!isLoaded && !isError) {
          console.error("Превышено время ожидания загрузки Яндекс Карты API")
          setIsError(true)
          setErrorMessage("Превышено время ожидания загрузки API")
          setIsLoading(false)
        }
      }, 10000) // 10 секунд таймаут

      // Обработчики событий загрузки
      script.onload = () => {
        console.log("Скрипт Яндекс Карты загружен, ожидание инициализации API")

        try {
          // Проверяем, доступен ли объект ymaps
          if (!window.ymaps) {
            console.error("Объект ymaps не найден после загрузки скрипта")
            setIsError(true)
            setErrorMessage("API не инициализирован корректно")
            setIsLoading(false)
            clearTimeout(timeoutId)
            return
          }

          // Инициализируем API после загрузки
          window.ymaps.ready(() => {
            console.log("Яндекс Карты API успешно загружен и инициализирован")
            setIsLoaded(true)
            setIsLoading(false)
            clearTimeout(timeoutId)
          })
        } catch (error) {
          console.error("Ошибка при инициализации API:", error)
          setIsError(true)
          setErrorMessage(`Ошибка инициализации: ${error instanceof Error ? error.message : "Неизвестная ошибка"}`)
          setIsLoading(false)
          clearTimeout(timeoutId)
        }
      }

      script.onerror = (error) => {
        console.error("Ошибка загрузки Яндекс Карты API:", error)
        setIsError(true)
        setErrorMessage("Не удалось загрузить API")
        setIsLoading(false)
        clearTimeout(timeoutId)
      }

      // Добавляем скрипт на страницу
      document.head.appendChild(script)

      // Очистка при размонтировании
      return () => {
        clearTimeout(timeoutId)
        // Удаляем скрипт только если он не был загружен
        if (!isLoaded && document.head.contains(script)) {
          try {
            document.head.removeChild(script)
          } catch (error) {
            console.error("Ошибка при удалении скрипта:", error)
          }
        }
      }
    } catch (error) {
      console.error("Непредвиденная ошибка при загрузке API:", error)
      setIsError(true)
      setErrorMessage(`Непредвиденная ошибка: ${error instanceof Error ? error.message : "Неизвестная ошибка"}`)
      setIsLoading(false)
    }
  }, [isLoaded, isError, isLoading])

  return { isLoaded, isError, errorMessage }
}

// Добавляем типы для глобального объекта window
declare global {
  interface Window {
    ymaps?: any
  }
}
