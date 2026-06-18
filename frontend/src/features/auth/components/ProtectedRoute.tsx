import { Navigate } from "react-router-dom"
import { useStore } from "@/stores/root/store"
import { observer } from "mobx-react-lite"

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { accountStore } = useStore()

  if (!accountStore.isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default observer(ProtectedRoute)
