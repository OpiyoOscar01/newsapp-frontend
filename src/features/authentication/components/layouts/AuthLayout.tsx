import AuthNavbar from '../widgets/AuthNavbar'
import { Outlet } from 'react-router-dom'
import Footer from '../widgets/Footer'
import { Helmet } from 'react-helmet-async'

function AuthLayout() {
  return (
    <>

      <Helmet>
        <title>Auth - DefinePress</title>
        <meta name="description" content="Your account on DefinePress" />
      </Helmet>
      <AuthNavbar />
      <Outlet />
      <Footer />
    </>
  )
}

export default AuthLayout