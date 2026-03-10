import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { 
  Typography, 
  Card, 
  Button, 
  Space, 
  Steps, 
  Descriptions, 
  Table, 
  Tag, 
  Modal, 
  message, 
  Divider,
  Alert,
  Result,
  Breadcrumb
} from "antd";
import { 
  ArrowLeftOutlined, 
  CloseOutlined, 
  ShoppingOutlined,
  EnvironmentOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";

import { getOrderById, cancelOrder } from "../api/order";
import Header from "../components/Header";
import { Footer } from "../components/Footer";
import type { Order } from "../interfaces/order";
import { toVND } from "../utils/toVND";


const { Title, Text } = Typography;

const statusTranslation: Record<string, { label: string; color: string; step: number }> = {
  PENDING: { label: "Chờ xác nhận", color: "gold", step: 0 },
  CONFIRM: { label: "Xác nhận", color: "lime", step: 1 },
  PROCESSING: { label: "Đang xử lý", color: "blue", step: 2 },
  DELIVERING: { label: "Giao hàng", color: "cyan", step: 3 },
  COMPLETE: { label: "Hoàn thành", color: "green", step: 4 },
  RETURN_REFUND: { label: "Yêu cầu hoàn trả", color: "orange", step: 4 },
  CANCEL: { label: "Đã hủy", color: "red", step: -1 },
};

const DetailOrder = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order>();
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const orderDetails = await getOrderById(id);
        setOrder(orderDetails.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
        message.error("Không thể tải thông tin đơn hàng");
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [id]);

  const handleCancelOrder = async () => {
    if (!order) return;
    try {
      setCancelling(true);
      await cancelOrder(order.id);
      message.success("Đơn hàng đã được hủy thành công!");
      const orderDetails = await getOrderById(order.id.toString());
      setOrder(orderDetails.data);
    } catch (error) {
      message.error("Có lỗi xảy ra khi hủy đơn hàng");
    } finally {
      setCancelling(false);
      setConfirmCancel(false);
    }
  };

  if (loading) {
    return (
      <div className="main-layout">
        <Header />
        <main className="main-layout-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Space direction="vertical" align="center">
            <ShoppingOutlined style={{ fontSize: '48px', color: '#ccc' }} />
            <Text>Đang tải thông tin đơn hàng...</Text>
          </Space>
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="main-layout">
        <Header />
        <main className="main-layout-content">
          <Result
            status="404"
            title="404"
            subTitle="Không tìm thấy đơn hàng"
            extra={<Button type="primary" onClick={() => navigate("/profile")}>Quay lại tài khoản</Button>}
          />
        </main>
        <Footer />
      </div>
    );
  }

  const currentStatus = statusTranslation[order.status] || { label: order.status, color: "default", step: 0 };

  const columns = [
    {
      title: 'Sản phẩm',
      key: 'product',
      render: (_:any, record:any) => (
        <Space size="middle">
          <img 
            src={record.product.image || "https://placehold.co/60"} 
            alt={record.name} 
            style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: '8px' }} 
          />
          <div>
            <Text strong>{record.name}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>Đơn giá: {record.finalPrice.toLocaleString()}đ</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center' as const,
      render: (q: number) => <Text>x{q}</Text>
    },
    {
      title: 'Tổng cộng',
      key: 'total',
      align: 'right' as const,
      render: (_: any, record: any) => <Text strong>{(record.finalPrice * record.quantity).toLocaleString()}đ</Text>
    },
  ];

  return (
    <div className="main-layout">
      <Header />
      <main className="main-layout-content" style={{ backgroundColor: '#f5f7fa', padding: '40px 0' }}>
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
          
          <Breadcrumb
            style={{ marginBottom: '24px' }}
            items={[
              { title: <Link to="/">Trang chủ</Link> },
              { title: <Link to="/profile">Tài khoản</Link> },
              { title: 'Chi tiết đơn hàng' }
            ]}
          />

          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <Space>
                <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} />
                <Title level={3} style={{ margin: 0 }}>Đơn hàng #{order.code}</Title>
                <Tag color={currentStatus.color} style={{ fontSize: '14px', padding: '4px 12px', borderRadius: '4px' }}>
                  {currentStatus.label.toUpperCase()}
                </Tag>
              </Space>
              <Space className="print-hidden">
                {order.status === "PENDING" && (
                  <Button danger icon={<CloseOutlined />} onClick={() => setConfirmCancel(true)}>Hủy đơn hàng</Button>
                )}
              </Space>
            </div>

            {order.cancelBy === "CUSTOMER" && (
              <Alert
                message="Đơn hàng đã bị hủy bởi bạn"
                type="error"
                showIcon
                style={{ borderRadius: '8px' }}
              />
            )}

            {order.status !== "CANCEL" && (
              <Card style={{ borderRadius: '16px', border: 'none', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                <Steps
                  current={currentStatus.step}
                  items={[
                    { title: 'Chờ xác nhận' },
                    { title: 'Xác nhận' },
                    { title: 'Đang xử lý' },
                    { title: 'Giao hàng' },
                    { title: 'Hoàn thành' },
                  ]}
                />
              </Card>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              {/* Customer Info */}
              <Card 
                title={<span><EnvironmentOutlined /> Thông tin nhận hàng</span>} 
                style={{ borderRadius: '16px', border: 'none', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
              >
                <Descriptions column={1}>
                  <Descriptions.Item label="Người nhận">{order.receiverName}</Descriptions.Item>
                  <Descriptions.Item label="Điện thoại">{order.receiverPhone}</Descriptions.Item>
                  <Descriptions.Item label="Địa chỉ">{order.receiverAddress}</Descriptions.Item>
                </Descriptions>
              </Card>

              {/* Payment Info */}
              <Card 
                title={<span><CreditCardOutlined /> Thanh toán</span>} 
                style={{ borderRadius: '16px', border: 'none', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
              >
                <Descriptions column={1}>
                  <Descriptions.Item label="Phương thức">Thanh toán Online</Descriptions.Item>
                  <Descriptions.Item label="Dự kiến giao hàng">
                     {order.estimatedDeliveryAt
                      ? new Date(1000 * (Number(order.estimatedDeliveryAt) + 3*24*60*60)).toLocaleDateString("vi-VN")
                      : "N/A"}
                  </Descriptions.Item>
                </Descriptions>
                <Divider style={{ margin: '12px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text strong>Tổng thanh toán:</Text>
                  <Text type="danger" strong style={{ fontSize: '20px' }}>{toVND(order.moneyFinal || 0)}</Text>
                </div>
              </Card>
            </div>

            {/* Products Table */}
            <Card 
              title={<span><ShoppingOutlined /> Danh sách sản phẩm</span>}
              style={{ borderRadius: '16px', border: 'none', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
              styles={{ body: { padding: 0 } }}
            >
              <Table 
                columns={columns} 
                dataSource={order.details} 
                rowKey="id" 
                pagination={false}
                summary={() => (
                  <Table.Summary fixed>
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0} colSpan={2} align="right">
                        <Text>Phí vận chuyển:</Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1} align="right">
                        <Text strong>30.000đ</Text>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0} colSpan={2} align="right">
                        <Text>Giảm giá:</Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1} align="right">
                        <Text>{toVND(order.moneyDiscountCoupon || 0)}</Text>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0} colSpan={2} align="right">
                        <Title level={4} style={{ margin: 0 }}>Tổng cộng:</Title>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1} align="right">
                        <Title level={4} style={{ margin: 0, color: '#ed1c24' }}>{toVND(order.moneyFinal || 0)}</Title>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </Table.Summary>
                )}
              />
            </Card>

            <Alert
              message="Lưu ý"
              description="Bạn chỉ có thể hủy đơn hàng khi trạng thái là 'Chờ xác nhận'. Mọi thắc mắc vui lòng liên hệ bộ phận hỗ trợ."
              type="info"
              showIcon
            />
          </Space>
        </div>
      </main>

      <Footer />

      <Modal
        title="Xác nhận hủy đơn hàng"
        open={confirmCancel}
        onOk={handleCancelOrder}
        confirmLoading={cancelling}
        onCancel={() => setConfirmCancel(false)}
        okText="Hủy đơn ngay"
        cancelText="Quay lại"
        okType="danger"
      >
        <p>Bạn có chắc chắn muốn hủy đơn hàng này? Thao tác này không thể hoàn tác.</p>
      </Modal>
    </div>
  );
};

export default DetailOrder;
