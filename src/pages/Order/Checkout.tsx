import { useEffect, useState, useRef } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import {
  Result,
  Button,
  Card,
  Typography,
  Descriptions,
  Row,
  Col,
  Space,
  Divider,
  Tag,
} from "antd";
import {
  CheckCircleOutlined,
  HomeOutlined,
  ShoppingOutlined,
  LoadingOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

import { createOrder } from "../../api/order";
import { orderStore } from "../../store/order.mobx";
import { cartStore } from "../../store/cart.mobx";
import { toVND } from "../../utils/toVND";

const { Title, Text, Paragraph } = Typography;

interface CartConfirmContext {
  current: number;
  setCurrent: (step: number) => void;
}

interface OrderData {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  estimatedDelivery: string;
  paymentMethod: string;
  moneyDiscountCoupon: number;
}

const Checkout = observer(() => {
  const { current, setCurrent } = useOutletContext<CartConfirmContext>();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasCreatedOrder = useRef(false);

  const statusMap: Record<string, string> = {
  pending: "Chờ xác nhận",
};

  useEffect(() => {
    const createOrderAsync = async () => {
      // Prevent duplicate API calls
      if (hasCreatedOrder.current) {
        return;
      }

      try {
        hasCreatedOrder.current = true;
        setIsLoading(true);
        setError(null);

        const orderDetails = orderStore.order;
        const cartItems = cartStore.cartItems;
        // Create order
        const response = await createOrder({
          orderDetails,
          cart: cartItems,
          couponCampaignId: orderStore.order.couponCampaignId,
        });
        console.log("Order created successfully:", response);
        
        // Transform response data to our interface
        const transformedData: OrderData = {
          id: response.data?.id || Math.random().toString(36).substr(2, 9),
          orderNumber: response.data?.code || `BMD${Date.now()}`,
          total: orderStore.order.total || 0,
          moneyDiscountCoupon: response.data?.moneyDiscountCoupon || 0,
          status: statusMap[response.data?.status] || "Chờ xác nhận",
          estimatedDelivery:
            response.data?.estimatedDelivery ||
            new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          paymentMethod:
            response.data?.paymentMethod || orderDetails.paymentMethod || "COD",
        };

        setOrderData(transformedData);

        // Reset cart after successful order creation
        cartStore.clearCart();
        orderStore.resetOrder();
      } catch (error: any) {
        console.error("Error creating order:", error);
        setError(
          error?.response?.data?.message ||
            error?.message ||
            "Không thể tạo đơn hàng",
        );
        hasCreatedOrder.current = false; 
      } finally {
        setIsLoading(false);
      }
    };

    createOrderAsync();
  }, []);

  if (isLoading) {
    return (
      <div style={{ padding: "100px 0", textAlign: "center" }}>
        <Result
          icon={
            <LoadingOutlined style={{ fontSize: 48, color: "#1890ff" }} spin />
          }
          title="Đang xử lý đơn hàng"
          subTitle="Vui lòng đợi giây lát trong khi chúng tôi xác nhận đơn hàng của bạn..."
        />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Result
          status="error"
          title="Đã có lỗi xảy ra"
          subTitle={error}
          extra={[
            <Button
              type="primary"
              key="retry"
              onClick={() => window.location.reload()}
            >
              Quay lại
            </Button>,
            <Button key="back" onClick={() => setCurrent(current - 1)}>
              Quay lại bước trước
            </Button>,
          ]}
        />
      </div>
    );
  }

  return (
    <div
      className="checkout-success-page"
      style={{ maxWidth: "800px", margin: "0 auto" }}
    >
      <Result
        status="success"
        title={<Title level={2}>Đặt hàng thành công</Title>}
        subTitle={
          <Paragraph style={{ fontSize: "16px" }}>
            Cảm ơn bạn đã mua sắm tại Âu Lạc Shop. Chúng tôi đã nhận được đơn
            hàng của bạn.
          </Paragraph>
        }
        extra={[
          <Button
            type="primary"
            size="large"
            key="home"
            icon={<HomeOutlined />}
            onClick={() => navigate("/")}
            style={{ borderRadius: "8px", height: "48px", padding: "0 32px" }}
          >
            Về trang chủ
          </Button>,
          <Button
            size="large"
            key="order"
            icon={<ShoppingOutlined />}
            onClick={() => navigate("/profile")} // Or wherever order list is
            style={{ borderRadius: "8px", height: "48px", padding: "0 32px" }}
          >
            Đơn hàng của tôi
          </Button>,
        ]}
      />

      <Card
        style={{
          borderRadius: "16px",
          border: "none",
          boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
          marginTop: "24px",
        }}
        styles={{ body: { padding: "32px" } }}
      >
        <Title level={4} style={{ marginBottom: "24px" }}>
          Chi tiết đơn hàng
        </Title>

        <div
          style={{
            background: "#f9f9f9",
            padding: "24px",
            borderRadius: "12px",
            marginBottom: "24px",
          }}
        >
          <Row align="middle" justify="space-between">
            <Col>
              <Text type="secondary">Mã đơn hàng</Text>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "4px",
                }}
              >
                <Title
                  level={3}
                  style={{
                    margin: 0,
                    marginRight: "12px",
                    fontFamily: "monospace",
                  }}
                >
                  {orderData?.orderNumber}
                </Title>
              </div>
            </Col>
            <Col>
              <Tag
                color="success"
                icon={<CheckCircleOutlined />}
                style={{
                  padding: "4px 12px",
                  fontSize: "14px",
                  borderRadius: "20px",
                }}
              >
                {orderData?.status.toUpperCase()}
              </Tag>
            </Col>
          </Row>
        </div>

        <Descriptions column={{ xs: 1, sm: 2 }} bordered={false} size="middle">
          <Descriptions.Item label={<Text type="secondary">Tổng tiền</Text>}>
            <Text strong style={{ fontSize: "18px", color: "#ed1c24" }}>
              {toVND(orderData?.total || 0)}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label={<Text type="secondary">Thanh toán</Text>}>
            <Text strong>
              {orderData?.paymentMethod === "COD"
                ? "Thanh toán trực tuyến"
                : orderData?.paymentMethod}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item
            label={<Text type="secondary">Ngày giao dự kiến</Text>}
          >
            <Text strong>{orderData?.estimatedDelivery}</Text>
          </Descriptions.Item>
        </Descriptions>

        <Divider style={{ margin: "32px 0" }} />

        <div
          style={{
            background: "#e6f7ff",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <Space align="start">
            <ExclamationCircleOutlined
              style={{ color: "#1890ff", fontSize: "18px", marginTop: "3px" }}
            />
            <div>
              <Text strong style={{ display: "block", marginBottom: "8px" }}>
                Lưu ý tiếp theo
              </Text>
              <ul
                style={{
                  paddingLeft: "20px",
                  margin: 0,
                  color: "#595959",
                  fontSize: "14px",
                }}
              >
                <li>Một email xác nhận đã được gửi đến địa chỉ của bạn.</li>
                <li>Nhân viên sẽ gọi điện xác nhận trong vòng 30 phút.</li>
                <li>
                  Bạn có thể theo dõi trạng thái đơn hàng trong phần cá nhân.
                </li>
              </ul>
            </div>
          </Space>
        </div>
      </Card>
    </div>
  );
});

export default Checkout;
