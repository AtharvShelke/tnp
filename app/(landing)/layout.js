import Footer from "@/components/landing page/Footer"
import Navbar from "@/components/landing page/Navbar"


const Layout = ({children}) => {
  return (
    <>
        <Navbar/>
        {children}
        <Footer/>
    </>
  )
}

export default Layout