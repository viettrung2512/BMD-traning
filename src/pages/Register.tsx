import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import signup from "../auth/register";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Input,
  Typography,
  Divider,
  Alert,
  Card,
  Form,
  Row,
  Col,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const signupSchema = z.object({
  email: z.string().email("Email không hợp lệ").min(3, "Email là bắt buộc"),
  phone: z
    .string()
    .min(10, "Số điện thoại phải có ít nhất 10 chữ số")
    .max(12, "Số điện thoại không hợp lệ")
    .startsWith("0", "Số điện thoại phải bắt đầu bằng 0"),
  name: z.string().min(3, "Tên phải có ít nhất 3 ký tự"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

type SignupSchemaType = z.infer<typeof signupSchema>;

const Register = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignupSchemaType>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<SignupSchemaType> = async (data) => {
    const { email, phone, name, password } = data;
    try {
      await signup(phone, password, email, name);
      setIsSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setError("root", {
        type: "manual",
        message:
          error instanceof Error
            ? error.message
            : "Đăng ký thất bại. Vui lòng thử lại.",
      });
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: "440px",
          borderRadius: "24px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
          border: "none",
          overflow: "hidden",
        }}
        styles={{ body: { padding: "30px" } }}
      >
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Title level={2} style={{ color: "#ed1c24", marginBottom: "8px" }}>
            Tạo tài khoản
          </Title>
        </div>

        {isSuccess && (
          <Alert
            message="Đăng ký thành công!"
            description="Bạn sẽ được chuyển đến trang đăng nhập sau giây lát."
            type="success"
            showIcon
            style={{ marginBottom: 24, borderRadius: "12px" }}
          />
        )}

        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Form.Item
            label={<Text strong>Họ và tên</Text>}
            validateStatus={errors.name ? "error" : ""}
            help={errors.name?.message}
          >
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  size="large"
                  placeholder="Nhập họ và tên"
                  prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
                  style={{ borderRadius: "10px" }}
                />
              )}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={<Text strong>Email</Text>}
                validateStatus={errors.email ? "error" : ""}
                help={errors.email?.message}
              >
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      size="large"
                      placeholder="Email"
                      prefix={<MailOutlined style={{ color: "#bfbfbf" }} />}
                      style={{ borderRadius: "10px" }}
                    />
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<Text strong>Số điện thoại</Text>}
                validateStatus={errors.phone ? "error" : ""}
                help={errors.phone?.message}
              >
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      size="large"
                      placeholder="Số điện thoại"
                      prefix={<PhoneOutlined style={{ color: "#bfbfbf" }} />}
                      style={{ borderRadius: "10px" }}
                    />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label={<Text strong>Mật khẩu</Text>}
            validateStatus={errors.password ? "error" : ""}
          >
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  size="large"
                  placeholder="Nhập mật khẩu"
                  prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
                  style={{ borderRadius: "10px" }}
                />
              )}
            />
          </Form.Item>

          {errors.root && (
            <Alert
              message={errors.root.message}
              type="error"
              showIcon
              style={{ marginBottom: 24, borderRadius: "12px" }}
            />
          )}

          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={isSubmitting}
            style={{
              height: "52px",
              fontSize: "16px",
              fontWeight: 600,
              marginTop: "8px",
              borderRadius: "12px",
              background: "#ed1c24",
              border: "none",
              boxShadow: "0 4px 14px rgba(237, 28, 36, 0.3)",
            }}
          >
            ĐĂNG KÝ NGAY
          </Button>

          <Divider>Hoặc tiếp tục với</Divider>

          <div style={{ marginTop: "16px", textAlign: "center" }}>
            <Text type="secondary">Đã có tài khoản? </Text>
            <Link to="/login" style={{ color: "#ed1c24", fontWeight: 600 }}>
              Đăng nhập tại đây
            </Link>
          </div>

          <div style={{ marginTop: "16px", textAlign: "center" }}>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/")}
              style={{ color: "#8c8c8c" }}
            >
              Về trang chủ
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
