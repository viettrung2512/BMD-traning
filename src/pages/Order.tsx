import { observer } from "mobx-react-lite";
import Header from "../components/Header";
import { Footer } from "../components/Footer";
import { Steps, Layout } from "antd";
import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const { Content } = Layout;

const STEPS = [
  {
    title: "Giỏ hàng",
    description: "Xác nhận sản phẩm",
  },
  {
    title: "Giao hàng",
    description: "Thông tin nhận hàng",
  },
  {
    title: "Kiểm tra",
    description: "Kiểm tra đơn hàng",
  },
  {
    title: "Thanh toán",
    description: "Hoàn tất đặt hàng",
  },
];

const STEP_ROUTES = [
  "/order/cart-confirm",
  "/order/delivery",
  "/order/review",
  "/order/checkout",
];

const Order = observer(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const index = STEP_ROUTES.findIndex(route => location.pathname.includes(route));
    if (index !== -1) {
      setCurrent(index);
    }
  }, [location.pathname]);

  const goToStep = (step: number) => {
    const clamped = Math.max(0, Math.min(step, STEP_ROUTES.length - 1));
    setCurrent(clamped);
    navigate(STEP_ROUTES[clamped]);
  };

  const handleStepChange = (step: number) => {
    goToStep(step);
  };

  return (
    <Layout className="main-layout" style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      <Header />
      <Content style={{ padding: '20px 0' }}>
        <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '40px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: '32px' }}>
            <Steps
              current={current}
              onChange={handleStepChange}
              items={STEPS.map((step) => ({ 
                title: step.title,
                description: step.description
              }))}
              style={{ marginBottom: '0' }}
            />
          </div>
          <div className="order-content-wrapper">
            <Outlet context={{ current, setCurrent: goToStep }} />
          </div>
        </div>
      </Content>
      <Footer />
    </Layout>
  );
});

export default Order;
