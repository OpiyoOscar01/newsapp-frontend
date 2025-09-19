
import { authRoutes } from "../features/authentication/routes/authRoutes"
import { guestRoutes } from "../features/authentication/routes/guestRoutes"
import  { newsRoutes } from "../features/news/routes/newsRoutes"
const routes=[
  authRoutes,guestRoutes,newsRoutes,
]
export default routes