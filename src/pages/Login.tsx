import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Button, 
  Checkbox, 
  Form, 
  Input, 
  Typography, 
  Divider, 
  Card, 
  message,
  Layout,
  Alert,
  Row,
  Col
} from "antd";
import { 
  FacebookFilled, 
  GoogleOutlined, 
  UserOutlined, 
  LockOutlined,
  ArrowLeftOutlined
} from "@ant-design/icons";
import useCookie from "../hooks/useCookie";
import login from "../auth/login";
import getProfile from "../auth/getProfile";
import { userStore } from "../store/user.mobx";

const { Title, Text } = Typography;

const Login = () => {
  const { setCookie } = useCookie("access_token");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const navigate = useNavigate();

  const handleLogin = async (values: any) => {
    setLoginError("");
    setIsLoading(true);

    try {
      const { account, password } = values;
      const fomattedPhone = "84" + account.slice(1);
      const response = await login(fomattedPhone, password);
      setCookie(response.token, 7);
      // tại sao phải truyền token(vì trên header cần truyền token)
      const userProfile = await getProfile(response.token);
      userStore.setUser(userProfile); 

      message.success("Đăng nhập thành công!");
      setTimeout(() => navigate("/"), 1000);
    } catch (error: unknown) {
      let errorMessage = "Đăng nhập thất bại. Vui lòng thử lại.";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as any;
        errorMessage = apiError.response?.data?.message || apiError.message || errorMessage;
      }
      
      setLoginError(errorMessage);
      message.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card 
        style={{ 
          width: '100%', 
          maxWidth: '440px', 
          borderRadius: '16px', 
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          border: 'none',
          padding: '24px',
        }}
        styles={{ body: { padding: 0 } }}
      >
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Title level={2} style={{ margin: '0 0 8px 0',color: "#ed1c24" }}>Đăng nhập</Title>
          <Text type="secondary">Vui lòng đăng nhập vào tài khoản của bạn</Text>
        </div>
        
        <Form 
          layout="vertical" 
          onFinish={handleLogin}
          requiredMark={false}
        >
          <Form.Item
            label={<Text strong>Số điện thoại</Text>}
            name="account"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
          >
            <Input 
              prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
              size="large" 
              placeholder="0xxx xxx xxx" 
              style={{ borderRadius: '8px', height: '48px' }}
            />
          </Form.Item>

          <Form.Item 
            label={<Text strong>Mật khẩu</Text>}
            name="password" 
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
          >
            <Input.Password 
              prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
              size="large" 
              placeholder="••••••••" 
              style={{ borderRadius: '8px', height: '48px' }}
            />
          </Form.Item>

          {loginError && (
            <Alert
              message={loginError}
              type="error"
              showIcon
              style={{ marginBottom: '24px', borderRadius: '8px' }}
            />
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Ghi nhớ đăng nhập</Checkbox>
            </Form.Item>
            <Button type="link" style={{ padding: 0, height: 'auto' }}>
              Quên mật khẩu?
            </Button>
          </div>

          <Button 
            type="primary" 
            htmlType="submit" 
            block 
            size="large" 
            loading={isLoading} 
            style={{ 
              height: '52px', 
              fontSize: '16px', 
              fontWeight: 700, 
              borderRadius: '12px',
              background: '#ed1c24',
              borderColor: '#ed1c24',
              boxShadow: '0 4px 12px rgba(237, 28, 36, 0.2)'
            }}
          >
            ĐĂNG NHẬP
          </Button>

          <Divider plain style={{ margin: '10px 0' }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>HOẶC TIẾP TỤC VỚI</Text>
          </Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Button
                icon={<FacebookFilled />}
                block
                size="large"
                style={{
                  borderRadius: "10px",
                  height: "48px",
                  color: "#1877f2",
                }}
              >
                Facebook
              </Button>
            </Col>
            <Col span={12}>
              <Button
                icon={<GoogleOutlined />}
                block
                size="large"
                style={{ borderRadius: "10px", height: "48px" }}
              >
                Google
              </Button>
            </Col>
          </Row>

          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <Text type="secondary">Chưa có tài khoản? </Text>
            <Link to="/register" style={{ fontWeight: 600, color: '#ed1c24' }}>
              Đăng ký ngay
            </Link>
          </div>
          <div style={{ marginTop: "24px", textAlign: "center" }}>
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
    </Layout>
  );
};

export default Login;
