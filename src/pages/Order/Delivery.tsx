import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import {
  Form,
  Input,
  Select,
  Card,
  Button,
  Typography,
  Row,
  Col,
  Space,
  Divider,
  message,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  HomeOutlined,
  EnvironmentOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

import { toVND } from "../../utils/toVND";
import { cartStore } from "../../store/cart.mobx";
import { orderStore } from "../../store/order.mobx";
import { userStore } from "../../store/user.mobx";
import { getAllCities, getAllDistricts, getAllWards } from "../../api/address";

const { Title, Text } = Typography;
const { TextArea } = Input;

interface CartConfirmContext {
  current: number;
  setCurrent: (step: number) => void;
}

const Delivery = observer(() => {
  const { current, setCurrent } = useOutletContext<CartConfirmContext>();
  const [form] = Form.useForm();
  const [selectedCityCode, setSelectedCityCode] = useState<number | null>(null);
  const [selectedDistrictCode, setSelectedDistrictCode] = useState<
    number | null
  >(null);
  const [cities, setCities] = useState<
    { id: number; code: string; name: string }[]
  >([]);
  const [districts, setDistricts] = useState<
    { id: number; code: string; name: string }[]
  >([]);
  const [wards, setWards] = useState<
    { id: number; code: string; name: string }[]
  >([]);

  useEffect(() => {
    const fetchCitiesData = async () => {
      try {
        const response = await getAllCities();
        setCities(response.data.cities);
      } catch (error: any) {
        message.error(
          error?.response?.data?.message ||
            "Không tải được danh sách tỉnh/thành",
        );
      }
    };
    fetchCitiesData();
  }, []);

  useEffect(() => {
    if (selectedCityCode) {
      const fetchDistrictsData = async () => {
        try {
          const response = await getAllDistricts(selectedCityCode);
          setDistricts(response.data.districts);
        } catch (error: any) {
          message.error(
            error?.response?.data?.message ||
              "Không tải được danh sách quận/huyện",
          );
        }
      };
      fetchDistrictsData();
    }
  }, [selectedCityCode]);

  useEffect(() => {
    if (selectedDistrictCode) {
      const fetchWardsData = async () => {
        try {
          const response = await getAllWards(selectedDistrictCode);
          setWards(response.data.wards);
        } catch (error: any) {
          message.error(
            error?.response?.data?.message ||
              "Không tải được danh sách phường/xã",
          );
        }
      };
      fetchWardsData();
    }
  }, [selectedDistrictCode]);

  const onFinish = (values: any) => {
    const { receiverName, receiverPhone, receiverAddress, notes } = values;

    // Final address string construction if needed
    const fullAddress = `${receiverAddress}, Phường ${orderStore.order.wardName}, Quận ${orderStore.order.districtName}, Thành phố ${orderStore.order.cityName}`;

    orderStore.setOrder({
      receiverName,
      receiverPhone,
      receiverAddress: fullAddress,
      note: notes,
    });

    setCurrent(current + 1);
  };

  const subtotal = cartStore.cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return (
    <div className="delivery-page">
      <div style={{ marginBottom: "24px" }}>
        <Title level={4}>
          <EnvironmentOutlined /> Thông tin giao hàng
        </Title>
        <Text type="secondary">
          Cung cấp địa chỉ chính xác để chúng tôi phục vụ bạn tốt nhất.
        </Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
        initialValues={{
          receiverName: userStore.user?.fullName || "",
          receiverPhone: userStore.user?.phone || "",
        }}
      >
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card
              style={{
                borderRadius: "16px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
              }}
              styles={{ body: { padding: "32px" } }}
            >
              <Title level={5} style={{ marginBottom: "24px" }}>
                Người nhận
              </Title>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label={<Text strong>Họ và tên</Text>}
                    name="receiverName"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập tên người nhận",
                      },
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
                      placeholder="Nguyễn Văn A"
                      size="large"
                      style={{ borderRadius: "8px" }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={<Text strong>Số điện thoại</Text>}
                    name="receiverPhone"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập số điện thoại",
                      },
                    ]}
                  >
                    <Input
                      prefix={<PhoneOutlined style={{ color: "#bfbfbf" }} />}
                      placeholder="0xxx xxx xxx"
                      size="large"
                      style={{ borderRadius: "8px" }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Divider style={{ margin: "24px 0" }} />

              <Title level={5} style={{ marginBottom: "24px" }}>
                Địa chỉ nhận hàng
              </Title>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    label={<Text strong>Tỉnh / Thành phố</Text>}
                    name="cityId"
                    rules={[{ required: true, message: "Chọn tỉnh thành" }]}
                  >
                    <Select
                      placeholder="Chọn tỉnh/thành"
                      size="large"
                      style={{ borderRadius: "8px" }}
                      showSearch
                      optionFilterProp="children"
                      onChange={(id) => {
                        const city = cities.find((c) => c.id === id);
                        if (city) {
                          orderStore.setOrder({
                            cityId: id,
                            cityName: city.name,
                            districtId: null,
                            wardId: null,
                          });
                          setSelectedCityCode(parseInt(city.code));
                          form.setFieldsValue({
                            districtId: null,
                            wardId: null,
                          });
                          setDistricts([]);
                          setWards([]);
                        }
                      }}
                      options={cities.map((c) => ({
                        value: c.id,
                        label: c.name,
                      }))}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label={<Text strong>Quận / Huyện</Text>}
                    name="districtId"
                    rules={[{ required: true, message: "Chọn quận huyện" }]}
                  >
                    <Select
                      placeholder="Chọn quận/huyện"
                      size="large"
                      style={{ borderRadius: "8px" }}
                      showSearch
                      optionFilterProp="children"
                      disabled={!selectedCityCode}
                      onChange={(id) => {
                        const district = districts.find((d) => d.id === id);
                        if (district) {
                          orderStore.setOrder({
                            districtId: id,
                            districtName: district.name,
                            wardId: null,
                          });
                          setSelectedDistrictCode(parseInt(district.code));
                          form.setFieldsValue({ wardId: null });
                          setWards([]);
                        }
                      }}
                      options={districts.map((d) => ({
                        value: d.id,
                        label: d.name,
                      }))}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label={<Text strong>Phường / Xã</Text>}
                    name="wardId"
                    rules={[{ required: true, message: "Chọn phường xã" }]}
                  >
                    <Select
                      placeholder="Chọn phường/xã"
                      size="large"
                      style={{ borderRadius: "8px" }}
                      showSearch
                      optionFilterProp="children"
                      disabled={!selectedDistrictCode}
                      onChange={(id) => {
                        const ward = wards.find((w) => w.id === id);
                        if (ward) {
                          orderStore.setOrder({
                            wardId: id,
                            wardName: ward.name,
                          });
                        }
                      }}
                      options={wards.map((w) => ({
                        value: w.id,
                        label: w.name,
                      }))}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label={<Text strong>Địa chỉ chi tiết (Số nhà, tên đường)</Text>}
                name="receiverAddress"
                rules={[
                  { required: true, message: "Vui lòng nhập địa chỉ chi tiết" },
                ]}
              >
                <Input
                  prefix={<HomeOutlined style={{ color: "#bfbfbf" }} />}
                  placeholder="Ví dụ: 123 Đường ABC..."
                  size="large"
                  style={{ borderRadius: "8px" }}
                />
              </Form.Item>

              <Form.Item label={<Text strong>Ghi chú thêm</Text>} name="notes">
                <TextArea
                  rows={3}
                  placeholder="Ghi chú về thời gian giao hàng, chỉ dẫn tìm nhà..."
                  style={{ borderRadius: "8px" }}
                />
              </Form.Item>

              <div
                style={{
                  marginTop: "24px",
                  padding: "16px",
                  background: "#f9f9f9",
                  borderRadius: "12px",
                }}
              >
                <Space>
                  <InfoCircleOutlined style={{ color: "#1890ff" }} />
                  <Text type="secondary" style={{ fontSize: "13px" }}>
                    Chúng tôi sẽ liên hệ với bạn qua số điện thoại trên để xác
                    nhận đơn hàng trước khi giao.
                  </Text>
                </Space>
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card
              title="Tóm tắt thanh toán"
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
                  marginBottom: "16px",
                }}
              >
                <Text type="secondary">Tạm tính</Text>
                <Text strong>{toVND(subtotal)}</Text>
              </div>
              {/* <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "16px",
                }}
              >
                <Text type="secondary">Giảm giá</Text>
                <Text type="danger">{toVND(0)}</Text>
              </div> */}

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
                <Title level={4} style={{ margin: 0, color: "#ed1c24" }}>
                  {toVND(subtotal)}
                </Title>
              </div>

              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                icon={<ArrowRightOutlined />}
                style={{
                  height: "52px",
                  borderRadius: "10px",
                  background: "#ed1c24",
                  border: "none",
                  fontWeight: 600,
                }}
              >
                XÁC NHẬN ĐỊA CHỈ
              </Button>

              <Button
                block
                type="text"
                icon={<ArrowLeftOutlined />}
                style={{ marginTop: "12px" }}
                onClick={() => setCurrent(current - 1)}
              >
                Quay lại giỏ hàng
              </Button>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
});

export default Delivery;
