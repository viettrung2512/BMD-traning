import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import Products from "./pages/Products";
import Order from "./pages/Order";
import CartConfirm from "./pages/Order/CartConfirm";
import Delivery from "./pages/Order/Delivery";
import Review from "./pages/Order/Review";
import Checkout from "./pages/Order/Checkout";
import Profile from "./pages/Profile";
import ProtectedRoutes from "./pages/ProtectedRoutes";
import DetailOrder from "./pages/DetailOrder";
import Register from "./pages/Register";

function App() {
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/detail/:id" element={<Detail  />} />
        <Route path="/products" element={<Products  />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/order/:id" element={<DetailOrder />} />
        
        <Route element={<ProtectedRoutes />}>
          <Route path="/order" element={<Order />}>
            <Route path="cart-confirm" element={<CartConfirm />} />
            <Route path="delivery" element={<Delivery />} />
            <Route path="review" element={<Review />} />
            <Route path="checkout" element={<Checkout />} />
            </Route>
          </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
