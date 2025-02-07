import { User, GraduationCap, Building2, ShieldCheck } from "lucide-react"

interface RoleIconProps {
  role: string
}

export function RoleIcon({ role }: RoleIconProps) {
  switch (role) {
    case "student":
      return <GraduationCap className="w-6 h-6" />
    case "college":
      return <Building2 className="w-6 h-6" />
    case "company":
      return <Building2 className="w-6 h-6" />
    case "admin":
      return <ShieldCheck className="w-6 h-6" />
    default:
      return <User className="w-6 h-6" />
  }
}

