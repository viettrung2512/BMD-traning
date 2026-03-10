import { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Tabs,
  Card,
  Avatar,
  Button,
  Space,
  Descriptions,
  Table,
  Tag,
  Input,
  Form,
  message,
  Divider,
  Empty
} from "antd";
import {
  UserOutlined,
  ShoppingOutlined,
  EditOutlined,
  PhoneOutlined,
  MailOutlined,
  EyeOutlined,
} from "@ant-design/icons";

import getProfile, { updateProfile } from "../api/profile";
import { getOrders } from "../api/order";
import Header from "../components/Header";
import { Footer } from "@/components/Footer";
import { userStore } from "../store/user.mobx";
import { formatPhone } from "../utils/formatPhone";


const { Title, Text } = Typography;

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: string;
  total: number;
  itemsCount: number;
  paymentMethod: string;
}

const Profile = observer(() => {
  const [activeTab, setActiveTab] = useState("1");
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileForm] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const profileData = await getProfile();
        if (profileData && profileData.data) {
          userStore.setUser(profileData.data);
          profileForm.setFieldsValue(profileData.data);
        }
        console.log("Profile data:", profileData);
        const ordersData = await getOrders();
        // console.log("Orders data:", ordersData);
        if (ordersData && ordersData.data) {
          const formatted = ordersData.data.orders.map((order: any) => ({
            id: order.id,
            orderNumber: order.code || `BMD${order.id}`,
            date: order.createdAt,
            status: order.status || "pending",
            total: order.moneyFinal || 0,
            itemsCount: order.details?.length || 0,
            paymentMethod: order.paymentMethod || "COD"
          }));
          setOrders(formatted);
        }
      } catch (error) {
        console.error("Error loading profile data:", error);
        message.error("Không thể tải thông tin cá nhân");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [profileForm]);

  const handleSaveProfile = async (values: any) => {
    try {
      const response = await updateProfile(values);
      userStore.setUser(response.data);
      setIsEditing(false);
      message.success("Cập nhật thông tin thành công");
    } catch (error) {
      message.error("Cập nhật thất bại");
    }
  };


  const getStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; label: string }> = {
      pending: { color: "gold", label: "Chờ xác nhận" },
      processing: { color: "blue", label: "Đang xử lý" },
      delivering: { color: "cyan", label: "Giao hàng" },
      complete: { color: "green", label: "Hoàn thành" },
      cancel: { color: "red", label: "Đã hủy" },
      confirm: { color: "lime", label: "Đã xác nhận" }
    };
    const s = status.toLowerCase();
    const config = statusMap[s] || { color: "default", label: status };
    return <Tag color={config.color}>{config.label}</Tag>;
  };

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => new Date(parseInt(date) * 1000).toLocaleDateString("vi-VN"),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => <Text type="danger" strong>{total.toLocaleString("vi-VN")}đ</Text>,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Order) => (
        <Space size="middle">
          <Button
            type="text" 
            icon={<EyeOutlined />} 
            onClick={() => navigate(`/order/${record.id}`)}
          >
            Xem
          </Button>
        </Space>
      ),
    },
  ];

  const user = userStore.user;

  return (
    <div className="main-layout">
      <Header />
      <main className="main-layout-content" style={{ padding: '40px 0' }}>
        <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Profile Header Card */}
            <Card style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
                <Avatar 
                  size={100} 
                  src={user?.avatar || "https://i.pinimg.com/236x/5e/e0/82/5ee082781b8c41406a2a50a0f32d6aa6.jpg"} 
                  icon={<UserOutlined />}
                  style={{ border: '4px solid #fff', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                />
                <div style={{ flex: 1 }}>
                  <Title level={2} style={{ margin: 0 }}>{user?.fullName || "Khách hàng"}</Title>
                  <Space split={<Divider type="vertical" />} style={{ marginTop: '8px', color: '#666' }}>
                    <Text><MailOutlined /> {user?.email || "Chưa cập nhật"}</Text>
                    <Text><PhoneOutlined /> {user?.phone ? formatPhone(user.phone) : "Chưa cập nhật"}</Text>
                  </Space>
                </div>
              </div>
            </Card>

            {/* Content Tabs */}
            <Card style={{ borderRadius: '16px', minHeight: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <Tabs 
                activeKey={activeTab} 
                onChange={setActiveTab}
                size="large"
                items={[
                  {
                    key: "1",
                    label: <span><UserOutlined /> Thông tin cá nhân</span>,
                    children: (
                      <div style={{ padding: '20px 0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                          <Title level={4} style={{ margin: 0 }}>Chi tiết tài khoản</Title>
                          {!isEditing && (
                            <Button icon={<EditOutlined />} onClick={() => setIsEditing(true)}>Chỉnh sửa</Button>
                          )}
                        </div>

                        {isEditing ? (
                          <Form
                            form={profileForm}
                            layout="vertical"
                            onFinish={handleSaveProfile}
                            initialValues={user || {}}
                          >
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                              <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true }]}>
                                <Input size="large" />
                              </Form.Item>
                              <Form.Item name="email" label="Email" rules={[{ type: 'email' }]}>
                                <Input size="large" />
                              </Form.Item>
                              <Form.Item name="phone" label="Số điện thoại">
                                <Input size="large" disabled/>
                              </Form.Item>
                              <Form.Item name="address" label="Địa chỉ">
                                <Input size="large" />
                              </Form.Item>
                            </div>
                            <Space style={{ marginTop: '20px' }}>
                              <Button type="primary" htmlType="submit" size="large">Lưu thay đổi</Button>
                              <Button size="large" onClick={() => setIsEditing(false)}>Hủy</Button>
                            </Space>
                          </Form>
                        ) : (
                          <Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
                            <Descriptions.Item label="Họ và tên">{user?.fullName}</Descriptions.Item>
                            <Descriptions.Item label="Email">{user?.email}</Descriptions.Item>
                            <Descriptions.Item label="Số điện thoại">{user?.phone ? user.phone : "N/A"}</Descriptions.Item>
                            <Descriptions.Item label="Địa chỉ">{user?.address || "N/A"}</Descriptions.Item>
                            </Descriptions>
                        )}
                      </div>
                    )
                  },
                  {
                    key: "2",
                    label: <span><ShoppingOutlined /> Lịch sử đơn hàng</span>,
                    children: (
                      <div style={{ padding: '20px 0' }}>
                        <Title level={4} style={{ marginBottom: '24px' }}>Đơn hàng của bạn</Title>
                        <Table 
                          columns={columns} 
                          dataSource={orders} 
                          rowKey="id" 
                          loading={isLoading}
                          pagination={{ pageSize: 5 }}
                          locale={{ emptyText: <Empty description="Bạn chưa có đơn hàng nào" /> }}
                        />
                      </div>
                    )
                  }
                ]}
              />
            </Card>
          </Space>
        </div>
      </main>

      <Footer />
    </div>
  );
});

export default Profile;
