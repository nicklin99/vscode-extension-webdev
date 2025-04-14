import { create } from "domain"
import { useRouter } from "vue-router"

export const useNav = () => {
    const router = useRouter()
    return {
        navToCreate() {
            router.replace({ name: 'Home' })
        }
    }
}