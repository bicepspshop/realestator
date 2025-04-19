"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import Image from "next/image"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { getBrowserClient } from "@/lib/supabase"

interface FloorPlanUploadProps {
  onImageChange: (imageUrl: string | null) => void
  initialImage?: string | null
}

export function FloorPlanUpload({ onImageChange, initialImage = null }: FloorPlanUploadProps) {
  const [file, setFile] = useState<{ file?: File; preview: string; uploading: boolean; url?: string } | null>(
    initialImage
      ? {
          preview: initialImage,
          uploading: false,
          url: initialImage,
        }
      : null,
  )
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const supabase = getBrowserClient()

  // Функция для загрузки файла
  const uploadFile = useCallback(
    async (file: File) => {
      try {
        const fileExt = file.name.split(".").pop()
        const fileName = `floorplan-${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`

        console.log(`Начало загрузки планировки: ${fileName}`)

        // Загружаем файл в Supabase Storage
        const { data, error } = await supabase.storage.from("property-images").upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        })

        if (error) {
          console.error("Ошибка загрузки планировки:", error)
          toast({
            variant: "destructive",
            title: "Ошибка загрузки",
            description: `Не удалось загрузить планировку: ${error.message}`,
          })
          return null
        }

        console.log(`Планировка успешно загружена: ${fileName}`)

        // Получаем публичный URL
        const { data: urlData } = supabase.storage.from("property-images").getPublicUrl(fileName)
        console.log(`Получен публичный URL для планировки: ${urlData.publicUrl}`)

        return urlData.publicUrl
      } catch (err) {
        console.error("Непредвиденная ошибка при загрузке планировки:", err)
        toast({
          variant: "destructive",
          title: "Ошибка загрузки",
          description: "Произошла непредвиденная ошибка при загрузке планировки",
        })
        return null
      }
    },
    [toast, supabase],
  )

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setError(null)

      // Берем только первый файл
      const newFile = acceptedFiles[0]
      if (!newFile) return

      // Создаем превью для файла
      const preview = URL.createObjectURL(newFile)

      // Добавляем файл в состояние
      setFile({
        file: newFile,
        preview,
        uploading: true,
      })

      // Загружаем файл
      const url = await uploadFile(newFile)

      // Обновляем состояние файла после загрузки
      if (url) {
        setFile((prev) =>
          prev
            ? {
                ...prev,
                uploading: false,
                url,
              }
            : null,
        )

        // Обновляем родительский компонент с URL
        onImageChange(url)
      } else {
        // Если загрузка не удалась, удаляем файл из состояния
        setFile(null)
        onImageChange(null)
      }
    },
    [uploadFile, onImageChange],
  )

  const removeFile = useCallback(async () => {
    if (file?.url) {
      try {
        const filePath = file.url.split("/").pop()
        if (filePath) {
          console.log(`Удаление планировки из хранилища: ${filePath}`)
          await supabase.storage.from("property-images").remove([filePath])
        }
      } catch (err) {
        console.error("Ошибка при удалении планировки из хранилища:", err)
      }
    }

    // Освобождаем URL объекта для предотвращения утечек памяти
    if (file?.preview && file.file) {
      URL.revokeObjectURL(file.preview)
    }

    setFile(null)
    onImageChange(null)
  }, [file, supabase, onImageChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxSize: 10485760, // 10MB
    maxFiles: 1,
  })

  return (
    <div className="space-y-4">
      {!file ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive ? "border-primary bg-primary/10" : "border-gray-300 hover:border-primary"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="rounded-full bg-primary/10 p-3">
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
                className="text-primary"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M3 14h18" />
                <path d="M3 9h18" />
                <path d="M9 19v-5" />
                <path d="M14 19v-5" />
              </svg>
            </div>
            <div className="text-sm font-medium">Перетащите планировку сюда или нажмите для выбора</div>
            <div className="text-xs text-gray-500">Загрузите изображение планировки (макс. 10МБ)</div>
          </div>
        </div>
      ) : (
        <div className="relative rounded-md overflow-hidden bg-gray-100 border aspect-[4/3]">
          <Image src={file.preview || "/placeholder.svg"} alt="Планировка" fill className="object-contain" />
          {file.uploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-t-primary border-r-primary border-b-primary border-l-transparent rounded-full animate-spin" />
            </div>
          )}
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 w-6 h-6 rounded-full"
            onClick={removeFile}
            disabled={file.uploading}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
