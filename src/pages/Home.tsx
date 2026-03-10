import Header from "../components/Header"
import Landing from "../components/Landing"
import Outstanding from "../components/Outstanding"
import { Footer } from "../components/Footer"

const Home = () => {
  return (
    <div className="w-full h-full flex flex-col  bg-gray-100">
      <Header />
      <Landing />
      <div className="h-6 bg-white" />
      <Outstanding />
      <div className="h-6 bg-white" />
      <Footer />
    </div>
  )
}

export default Home
