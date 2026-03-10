import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Home from "./pages/Home";
import DetailPage from "./pages/DetailPage";
import ProductsPage from "./pages/ProductsPage";
import OrderPage from "./pages/OrderPage";
import CartConfirmPage from "./pages/Order/CartConfirmPage";
import DeliveryPage from "./pages/Order/DeliveryPage";
import ReviewPage from "./pages/Order/ReviewPage";
import CheckoutPage from "./pages/Order/CheckoutPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoutes from "./pages/ProtectedRoutes";
import DetailOrderPage from "./pages/DetailOrderPage";
import RegisterPage from "./pages/RegisterPage";
import { NotFoundPage } from "./pages/404/NotFoundPage";

function App() {
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/detail/:id" element={<DetailPage />} />
        <Route path="/products" element={<ProductsPage  />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/order/:id" element={<DetailOrderPage />} />
        <Route path="*" element={<NotFoundPage/>} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/order" element={<OrderPage />}>
            <Route path="cart-confirm" element={<CartConfirmPage />} />
            <Route path="delivery" element={<DeliveryPage />} />
            <Route path="review" element={<ReviewPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            </Route>
          </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
