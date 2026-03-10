import React from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { 
  Table, 
  Button, 
  Typography, 
  Card, 
  Row, 
  Col, 
  InputNumber, 
  Space, 
  Tooltip, 
  Modal, 
  message,
  Divider,
  Empty
} from "antd";
import { 
  DeleteOutlined, 
  ShoppingCartOutlined, 
  ArrowLeftOutlined, 
  ArrowRightOutlined,
  ExclamationCircleOutlined 
} from "@ant-design/icons";

import { cartStore } from "../../store/cart.mobx";
import { toVND } from "../../utils/toVND";

const { Title, Text } = Typography;

interface CartConfirmContext {
  current: number;
  setCurrent: (step: number) => void;
}

const CartConfirm: React.FC = observer(() => {
  const { current, setCurrent } = useOutletContext<CartConfirmContext>();
  const navigate = useNavigate();

  const subtotal = cartStore.cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleRemoveItem = (id: number) => {
    cartStore.cartItems = cartStore.cartItems.filter((item) => item.id !== id);
    message.success("Đã xóa sản phẩm khỏi giỏ hàng");
  };

  const showDeleteConfirm = (id: number) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        handleRemoveItem(id);
      },
    });
  };

  const handleUpdateQuantity = (id: number, newQuantity: number) => {
    cartStore.cartItems = cartStore.cartItems.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
  };

  const columns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <Space size="middle">
          <img 
            src={record.imageUrl}
            alt={text}
            style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #eee' }} 
          />
          <div>
            <Text strong style={{ display: 'block' }}>{text}</Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>Đơn giá: {toVND(record.price)}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 150,
      render: (val: number, record: any) => (
        <InputNumber 
          min={1} 
          value={val} 
          onChange={(v) => handleUpdateQuantity(record.id, v || 1)}
          style={{ borderRadius: '6px' }}
        />
      ),
    },
    {
      title: 'Tổng tiền',
      key: 'total',
      width: 150,
      align: 'right' as const,
      render: (_: any, record: any) => (
        <Text strong>{toVND(record.price * record.quantity)}</Text>
      ),
    },
    {
      title: '',
      key: 'action',
      width: 50,
      render: (_: any, record: any) => (
        <Tooltip title="Xóa">
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => showDeleteConfirm(record.id)} 
          />
        </Tooltip>
      ),
    },
  ];

  if (cartStore.cartItems.length === 0) {
    return (
      <Card style={{ borderRadius: '16px', textAlign: 'center', padding: '60px' }}>
        <Empty 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={<Text type="secondary">Giỏ hàng của bạn đang trống</Text>}
        >
          <Button type="primary" onClick={() => navigate("/products")}>Tiếp tục mua sắm</Button>
        </Empty>
      </Card>
    );
  }

  return (
    <div className="cart-confirm-page">
      <div style={{ marginBottom: '24px' }}>
        <Title level={4}><ShoppingCartOutlined /> Xác nhận giỏ hàng</Title>
        <Text type="secondary">Vui lòng kiểm tra lại danh sách sản phẩm trước khi tiếp tục.</Text>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card 
            styles={{ body: { padding: 0 } }} 
            style={{ borderRadius: '16px', overflow: 'hidden', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
          >
            <Table 
              dataSource={[...cartStore.cartItems]} 
              columns={columns} 
              pagination={false}
              rowKey="id"
            />
          </Card>
          
          <div style={{ marginTop: '20px' }}>
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={() => navigate("/products")}
            >
              Tiếp tục mua sắm
            </Button>
          </div>
        </Col>

        <Col xs={24} lg={8}>
          <Card 
            title="Tóm tắt đơn hàng" 
            style={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <Text type="secondary">Tạm tính ({cartStore.cartItems.length} sản phẩm)</Text>
              <Text strong>{toVND(subtotal)}</Text>
            </div>
            <Divider />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <Title level={4} style={{ margin: 0 }}>Tổng cộng</Title>
              <Title level={4} style={{ margin: 0, color: '#ed1c24' }}>{toVND(subtotal)}</Title>
            </div>

            <Button 
              type="primary" 
              block 
              size="large" 
              icon={<ArrowRightOutlined />}
              style={{ height: '52px', borderRadius: '10px', background: '#ed1c24', border: 'none', fontWeight: 600 }}
              onClick={() => setCurrent(current + 1)}
            >
              TIẾP TỤC GIAO HÀNG
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
});

export default CartConfirm;
