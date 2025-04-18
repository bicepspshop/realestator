import Image from "next/image"

interface AgentInfoProps {
  name: string
  email?: string
  phone?: string
}

export function AgentInfo({ name, email, phone }: AgentInfoProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row items-center gap-6">
      <div className="w-24 h-24 relative rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
        <Image src={`/placeholder.svg?height=96&width=96&query=agent`} alt={name} fill className="object-cover" />
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-1">Ваш агент по недвижимости</h2>
        <p className="text-2xl font-bold text-gray-900 mb-3">{name}</p>
        <div className="space-y-1">
          {email && (
            <p className="text-gray-600 flex items-center gap-2">
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
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              {email}
            </p>
          )}
          {phone && (
            <p className="text-gray-600 flex items-center gap-2">
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
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              {phone}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
