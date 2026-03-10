import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Modal } from "antd";
import { userStore } from "../store/user.mobx";
import { cartStore } from "../store/cart.mobx";
import logout from "../auth/logout";
import useCookie from "../hooks/useCookie";
import Search from "./Search";
import "@/styles/main.scss";

const Header = observer(() => {
  // const [searchValue, setSearchValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { clearCookie } = useCookie("access_token");
  
  const handleLogout = async () => {
    try {
      setIsModalOpen(true);
      await logout();
    } catch (error) {
      console.error('Logout request failed', error);
    } finally {
      userStore.clearUser();
      clearCookie();
      navigate("/", { replace: true });
    }
  };

  // const handleSearch = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (searchValue.trim()) {
  //     navigate(`/products?=${encodeURIComponent(searchValue.trim())}`);
  //   }
  // };

  const logoUrl = "https://aulacshop.com/images/logo.png";
  const isSignedIn = userStore.isLoggedIn;
  const user = userStore.user;

  return (
    <header className="site-header">
      <Modal
        title="Bạn có chắc muốn đăng xuất?"
        open={isModalOpen}
        onOk={handleLogout}
        onCancel={() => setIsModalOpen(false)}
        okType="danger"
        okText="Đăng xuất"
        cancelText="Hủy"
      />
      
      <div className="header-top">
        <Link to="/" className="header-logo">
          <img src={logoUrl} alt="BMD Vegan" />
        </Link>

        <form className="header-search">
          {/* <input
            type="search"
            placeholder="Tìm kiếm sản phẩm chay..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <button className="search-btn" type="submit" aria-label="Tìm kiếm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </button> */}
          <Search />
        </form>

        <div className="header-actions">
          <nav className="header-nav header-nav-desktop">
            <Link to="/products">Sản phẩm</Link>
            <Link to="/">Tin tức</Link>
            <Link to="/">Hệ thống</Link>
            <Link to="/">Liên hệ</Link>
          </nav>

          <Link to="/order/cart-confirm" className="cart-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            <span className="hidden sm:inline">Giỏ hàng</span>
            {cartStore.cartItems.length > 0 && (
              <span className="cart-count">
                {cartStore.cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            )}
          </Link>
          {isSignedIn ? (
            <div className="user-greeting">
              <Link className="user-name" to="/profile">
                {user?.fullName?.split(" ").pop() || "Cá nhân"}
              </Link>
              <button className="logout-btn" onClick={() => setIsModalOpen(true)}>
                Đăng xuất
              </button>
            </div>
          ) : (
            <button className="auth-btn" onClick={() => navigate("/login")}>
              Đăng nhập
            </button>
          )}
        </div>
      </div>
    </header>
  );
});

export default Header;
