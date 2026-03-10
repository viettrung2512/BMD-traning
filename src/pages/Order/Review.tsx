import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useOutletContext } from "react-router-dom";
import {
  Card,
  Button,
  Typography,
  Row,
  Col,
  Space,
  Divider,
  Table,
  Descriptions,
  message,
  Spin,
  Alert,
  Tag,
} from "antd";
import {
  CheckCircleOutlined,
  EditOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  EnvironmentOutlined,
  CreditCardOutlined,
  LoadingOutlined,
  ArrowLeftOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";

import { estimateOrder } from "../../api/estimate";
import { getCouponCampaign } from "../../api/coupon";
import { orderStore } from "../../store/order.mobx";
import { cartStore } from "../../store/cart.mobx";
import { toVND } from "../../utils/toVND";

const { Title, Text } = Typography;

interface ReviewResponse {
  moneyProduct: number;
  shipFee: number;
  moneyFinal: number;
  moneyTax: number;
  moneyDiscountCoupon: number;
  totalPoints: number;
  moneyVat: number;
  paymentMethod: string;
  status: string;
}

interface CartConfirmContext {
  current: number;
  setCurrent: (step: number) => void;
}

const Review = observer(() => {
  const { current, setCurrent } = useOutletContext<CartConfirmContext>();
  const [money, setMoney] = useState<ReviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingCoupon, setIsLoadingCoupon] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponCampaign, setCouponCampaign] = useState<any[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<any>(null);

  // useEffect(() => {
  //   const estimate = async () => {
  //     try {
  //       setIsLoading(true);
  //       setError(null);

  //       if (!orderStore.order || !cartStore.cartItems.length) {
  //         throw new Error("Thông tin đơn hàng hoặc giỏ hàng trống");
  //       }

  //       const response = await estimateOrder({
  //         orderDetails: orderStore.order,
  //         cart: cartStore.cartItems,
  //         couponCampaignId: selectedCoupon?.id,
  //       });
  //       // console.log("Estimate response:", response);
  //       const {
  //         moneyProduct,
  //         shipFee,
  //         moneyFinal,
  //         moneyTax,
  //         moneyDiscountCoupon,
  //         totalPoints,
  //         moneyVat,
  //         paymentMethod,
  //         status,
  //       } = response.data;

  //       console.log("Estimate response:", response.data);

  //       setMoney({
  //         moneyProduct,
  //         shipFee,
  //         moneyFinal,
  //         moneyTax,
  //         moneyDiscountCoupon,
  //         totalPoints,
  //         moneyVat,
  //         paymentMethod,
  //         status,
  //       });
  //       orderStore.order.total = moneyFinal;
  //       // orderStore.order.total = moneyProduct + shipFee - moneyDiscountCoupon;
  //       // console.log("Total: ", orderStore.order.total);
  //     } catch (error: any) {
  //       console.error("Error estimating order:", error);
  //       setError(error.message || "Không thể tính toán đơn hàng");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   estimate();
  // }, [cartStore.cartItems, selectedCoupon]);

  // useEffect(() => {
  //   const fetchCoupon = async () => {
  //     try {
  //       setIsLoadingCoupon(true);
  //       setCouponError(null);

  //       const campaign = await getCouponCampaign();
  //       console.log("campaign:", campaign);
  //       setCouponCampaign(campaign?.data?.couponCampaigns || []);
  //     } catch (error: any) {
  //       console.error("Error fetching coupon:", error);
  //       setCouponError("Không tải được coupon");
  //     } finally {
  //       setIsLoadingCoupon(false);
  //     }
  //   };

  //   fetchCoupon();
  // }, []);

  // const handleSelectCoupon = async (coupon: any) => {
  //   try {
  //     setSelectedCoupon(coupon);
  //     orderStore.order.couponCampaignId = coupon.id;
  //     setIsLoading(true);

  //     const response = await estimateOrder({
  //       orderDetails: orderStore.order,
  //       cart: cartStore.cartItems,
  //       couponCampaignId: coupon.id,
  //     });

  //     const data = response.data;

  //     setMoney({
  //       moneyProduct: data.moneyProduct,
  //       shipFee: data.shipFee,
  //       moneyFinal: data.moneyFinal,
  //       moneyTax: data.moneyTax,
  //       moneyDiscountCoupon: data.moneyDiscountCoupon,
  //       totalPoints: data.totalPoints,
  //       moneyVat: data.moneyVat,
  //       paymentMethod: data.paymentMethod,
  //       status: data.status,
  //     });

  //     orderStore.order.total = data.moneyFinal;

  //     message.success("Áp dụng coupon thành công");
  //   } catch (error) {
  //     message.error("Không áp dụng được coupon");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const handlePlaceOrder = async () => {
  //   setIsPlacingOrder(true);
  //   try {
  //     // Logic for placing order would go here
  //     console.log("Order placed successfully!");
  //     setCurrent(3); // Move to checkout/success step
  //   } catch (error) {
  //     console.error("Error placing order:", error);
  //     message.error("Đã có lỗi xảy ra khi đặt hàng");
  //   } finally {
  //     setIsPlacingOrder(false);
  //   }
  // };

  // const moneyFinal = money?.moneyFinal || 0;
  useEffect(() => {
    const estimate = async () => {
    try {
      setIsLoading(true);
      setError(null);
      if (!orderStore.order || !cartStore.cartItems.length) {
        throw new Error("Thông tin đơn hàng hoặc giỏ hàng trống");
      }
      const response = await estimateOrder({
        orderDetails: orderStore.order,
        cart: cartStore.cartItems,
        couponCampaignId: selectedCoupon?.id,
      });
      const data = response.data;
      setMoney(data);
      orderStore.order.total = data.moneyFinal;
    } catch (err: any) {
      console.error("Estimate error:", err);
      setError(err.message || "Không thể tính toán đơn hàng");
    } finally {
      setIsLoading(false);
    }
  };
  estimate();
  }, [cartStore.cartItems, orderStore.order,selectedCoupon]);


  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        setIsLoadingCoupon(true);
        setCouponError(null);

        const campaign = await getCouponCampaign();

        setCouponCampaign(campaign?.data?.couponCampaigns || []);
      } catch (err) {
        console.error(err);
        setCouponError("Không tải được coupon");
      } finally {
        setIsLoadingCoupon(false);
      }
    };

    fetchCoupon();
  }, []);


  const handleSelectCoupon = (coupon: any) => {
    setSelectedCoupon(coupon);
    orderStore.order.couponCampaignId = coupon.id;
    message.success("Áp dụng coupon thành công");
  };


  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    try {
      console.log("Order placed successfully");
      setCurrent(3);
    } catch (error) {
      console.error(error);
      message.error("Đã có lỗi xảy ra khi đặt hàng");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const moneyFinal = money?.moneyFinal ?? 0;

  const productColumns = [
    {
      title: "Sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: any) => (
        <Space>
          <img
            src={record.imageUrl}
            alt={text}
            style={{
              width: 40,
              height: 40,
              borderRadius: 4,
              objectFit: "cover",
            }}
          />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
      align: "center" as const,
    },
    {
      title: "Thành tiền",
      key: "subtotal",
      width: 120,
      align: "right" as const,
      render: (_: any, record: any) => (
        <Text strong color="orange">
          {toVND(record.price * record.quantity)}
        </Text>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div style={{ padding: "100px 0", textAlign: "center" }}>
        <Spin
          indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
          tip="Đang tính toán đơn hàng..."
        />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "40px 0" }}>
        <Alert
          message="Lỗi tính toán đơn hàng"
          description={error}
          type="error"
          showIcon
          action={
            <Button
              size="small"
              type="primary"
              onClick={() => window.location.reload()}
            >
              Thử lại
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="review-order-page">
      <div style={{ marginBottom: "24px" }}>
        <Title level={4}>
          <CheckCircleOutlined /> Xem lại đơn hàng
        </Title>
        <Text type="secondary">Cơ hội cuối cùng để kiểm tra lại mọi thứ!</Text>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            {/* Products Card */}
            <Card
              title={
                <Space>
                  <ShoppingCartOutlined /> Sản phẩm (
                  {cartStore.cartItems.length})
                </Space>
              }
              extra={
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => setCurrent(0)}
                >
                  Chỉnh sửa
                </Button>
              }
              style={{
                borderRadius: "16px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
              }}
              styles={{ body: { padding: 0 } }}
            >
              <Table
                dataSource={[...cartStore.cartItems]}
                columns={productColumns}
                pagination={false}
                rowKey="id"
                size="middle"
              />
            </Card>

            {/* Information Grid */}
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card
                  title={
                    <Space>
                      <UserOutlined /> Người nhận
                    </Space>
                  }
                  extra={
                    <Button
                      type="link"
                      icon={<EditOutlined />}
                      onClick={() => setCurrent(1)}
                    >
                      Chỉnh sửa
                    </Button>
                  }
                  style={{
                    height: "100%",
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                  }}
                >
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="Họ tên">
                      {orderStore.order.receiverName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại">
                      {orderStore.order.receiverPhone}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
              <Col span={12}>
                <Card
                  title={
                    <Space>
                      <EnvironmentOutlined /> Địa chỉ
                    </Space>
                  }
                  extra={
                    <Button
                      type="link"
                      icon={<EditOutlined />}
                      onClick={() => setCurrent(1)}
                    >
                      Chỉnh sửa
                    </Button>
                  }
                  style={{
                    height: "100%",
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                  }}
                >
                  <Text>{orderStore.order.receiverAddress}</Text>
                  {orderStore.order.note && (
                    <div style={{ marginTop: 8 }}>
                      <Tag color="blue">Ghi chú: {orderStore.order.note}</Tag>
                    </div>
                  )}
                </Card>
              </Col>
            </Row>

            {/* Payment Method */}
            <Card
              title={
                <Space>
                  <CreditCardOutlined /> Phương thức thanh toán
                </Space>
              }
              style={{
                borderRadius: "16px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
              }}
            >
              <Row align="middle" gutter={16}>
                <Col>
                  <div
                    style={{
                      background: "#f5f5f5",
                      padding: "12px",
                      borderRadius: "8px",
                    }}
                  >
                    <CreditCardOutlined
                      style={{ fontSize: "24px", color: "#1890ff" }}
                    />
                  </div>
                </Col>
                <Col>
                  <Text strong style={{ display: "block" }}>
                    {money?.paymentMethod === "COD"
                      ? "Thanh toán khi nhận hàng (COD)"
                      : "Thanh toán trực tuyến"}
                  </Text>
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    {money?.paymentMethod === "COD"
                      ? "Trả tiền mặt khi Shipper giao hàng tới"
                      : "Hỗ trợ Visa, Mastercard, ví điện tử"}
                  </Text>
                </Col>
              </Row>
            </Card>
          </Space>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title="Mã giảm giá"
            style={{
              borderRadius: "16px",
              border: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              marginBottom: 16,
            }}
          >
            {isLoadingCoupon && <Spin />}

            {couponError && <Alert type="error" message={couponError} />}

            {!isLoadingCoupon && couponCampaign.length === 0 && (
              <Text type="secondary">Không có coupon</Text>
            )}

            <Space direction="vertical" style={{ width: "100%" }}>
              {couponCampaign.map((c: any) => (
                <Card
                  key={c.id}
                  size="small"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSelectCoupon(c)}
                >
                  <Row justify="space-between">
                    <Col>
                      <Text strong>{c.code}</Text>
                      <div>
                        <Text type="secondary">
                          Giảm{" "}
                          {c.discountType === "PERCENT"
                            ? `${c.discountValue}%`
                            : toVND(c.discountValue)}
                        </Text>
                      </div>
                    </Col>

                    {selectedCoupon?.id === c.id && (
                      <Tag color="green">Đã chọn</Tag>
                    )}
                  </Row>
                </Card>
              ))}
            </Space>
          </Card>
          <Card
            title="Tổng kết đơn hàng"
            style={{
              borderRadius: "16px",
              border: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "12px",
              }}
            >
              <Text type="secondary">Tạm tính</Text>
              <Text strong>{toVND(money?.moneyProduct || 0)}</Text>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "12px",
              }}
            >
              <Text type="secondary">Phí vận chuyển</Text>
              <Text strong>{toVND(money?.shipFee || 0)}</Text>
            </div>
            {(money?.moneyDiscountCoupon ?? 0) > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <Text type="secondary">Coupon</Text>
                <Text strong type="danger">
                  -{toVND(money?.moneyDiscountCoupon ?? 0)}
                </Text>
              </div>
            )}

            {money && money.moneyDiscountCoupon > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
              </div>
            )}

            <Divider />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "24px",
              }}
            >
              <Title level={4} style={{ margin: 0 }}>
                Tổng cộng
              </Title>
              <Title level={3} style={{ margin: 0, color: "#ed1c24" }}>
                {toVND(moneyFinal)}
              </Title>
            </div>

            <Button
              type="primary"
              block
              size="large"
              icon={
                isPlacingOrder ? (
                  <LoadingOutlined />
                ) : (
                  <SafetyCertificateOutlined />
                )
              }
              disabled={ isPlacingOrder}
              style={{
                height: "52px",
                borderRadius: "10px",
                background: "#ed1c24",
                border: "none",
                fontWeight: 600,
              }}
              onClick={handlePlaceOrder}
            >
              {isPlacingOrder ? "ĐANG TIẾN HÀNH..." : "XÁC NHẬN ĐẶT HÀNG"}
            </Button>

            <Button
              block
              type="text"
              icon={<ArrowLeftOutlined />}
              style={{ marginTop: "12px" }}
              onClick={() => setCurrent(current - 1)}
            >
              Quay lại giao hàng
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
});

export default Review;
