import { Mail } from "lucide-react"

interface AgentInfoProps {
  name: string
  email?: string
}

export function AgentInfo({ name, email }: AgentInfoProps) {
  return (
    <div className="bg-[#141414] rounded-xl p-6 border border-[#222222] shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="w-24 h-24 rounded-full bg-[#222222] flex items-center justify-center text-[#4370FF] text-2xl font-bold">
          {name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-xl font-semibold text-white mb-2">Ваш агент по недвижимости</h2>
          <p className="text-xl font-bold text-white mb-3">{name}</p>
          {email && <p className="text-[#CCCCCC] mb-4">{email}</p>}
          <p className="text-[#888888]">
            Профессиональный агент, который поможет вам найти идеальный вариант недвижимости.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          {email && (
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center bg-[#4370FF] hover:bg-[#3060FF] text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 hover:shadow-[0_2px_8px_rgba(67,112,255,0.4)] active:scale-[0.98]"
            >
              <Mail className="mr-2 h-4 w-4" />
              Связаться
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
