import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  Row, 
  Col, 
  Typography, 
  Button, 
  InputNumber, 
  Space, 
  Divider, 
  Tag, 
  Alert, 
  Card,
  Breadcrumb,
  message,
  Rate
} from "antd";
import { 
  ShoppingCartOutlined, 
  ThunderboltOutlined, 
  CheckCircleOutlined,
  HeartOutlined,
  ShareAltOutlined
} from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import { getDetail, type Data } from "../api/detail";
import { getAllProductsByCategory } from "../api/products";
import { cartStore } from "../store/cart.mobx";
import Header from "../components/Header";
import { Footer } from "../components/Footer";


const { Title, Text, Paragraph } = Typography;

interface RelatedProduct {
  id: number;
  name: string;
  image: string;
  unitPrice: number;
}

const DetailPage = observer(() => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [loadingRelated, setLoadingRelated] = useState<boolean>(false);
  const [qty, setQty] = useState(1);
  const [addedMessage, setAddedMessage] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const detail = await getDetail(parseInt(id || "0", 10));
        setData(detail.data);
      } catch (error) {
        console.error("Error fetching product detail:", error);
        message.error("Không thể tải thông tin sản phẩm");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (data?.productCategory?.id) {
        try {
          setLoadingRelated(true);
          const response = await getAllProductsByCategory(data.productCategory.id);
          const filtered = response.data.products.filter((product: RelatedProduct) => product.id !== data.id).slice(0, 4);
          setRelatedProducts(filtered);
        } catch (error) {
          console.error("Error fetching related products:", error);
        } finally {
          setLoadingRelated(false);
        }
      }
    };
    fetchRelatedProducts();
  }, [data]);

  function handleAddToCart() {
    if (!data) return;
  //1  
      cartStore.addToCart({
        id: data.id,
        name: data.name,
        imageUrl: data.image,
        price: data.finalPrice || data.unitPrice,
        quantity: qty,
      });
    
    setAddedMessage(`Đã thêm ${qty} sản phẩm vào giỏ hàng`);
    setTimeout(() => setAddedMessage(""), 3000);
    setQty(1);
  }

  if (loading) {
    return (
      <div className="main-layout">
        <Header />
        <main className="main-layout-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!data) return (
    <div className="main-layout">
      <Header />
      <main className="main-layout-content">
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <Title level={4}>Không tìm thấy sản phẩm.</Title>
          <Button type="primary" onClick={() => navigate("/products")}>Quay lại cửa hàng</Button>
        </div>
      </main>
      <Footer />
    </div>
  );

  const images = [data.image, data.image, data.image, data.image];
  const displayPrice = data.unitPrice;

  return (
    <div className="main-layout">
      <Header />
      <main className="main-layout-content" style={{ background: '#fff', paddingBottom: '60px' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
          <Breadcrumb
            style={{ marginBottom: '24px' }}
            items={[
              { title: <Link to="/">Trang chủ</Link> },
              { title: <Link to="/products">Sản phẩm</Link> },
              { title: data.name }
            ]}
          />

          <Row gutter={[40, 40]}>
            <Col xs={24} md={12}>
              <div style={{ position: 'sticky', top: '20px' }}>
                <Card 
                  styles={{ body: { padding: 0 } }} 
                  style={{ borderRadius: '16px', overflow: 'hidden', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
                >
                  <img
                    alt={data.name}
                    src={images[selectedImage] || "https://placehold.co/600x600?text=No+Image"}
                    style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover' }}
                  />
                </Card>
                <Row gutter={[12, 12]} style={{ marginTop: '16px' }}>
                  {images.map((img, id) => (
                    <Col span={6} key={id}>
                      <div 
                        onClick={() => setSelectedImage(id)}
                        style={{
                          borderRadius: '8px',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          border: selectedImage === id ? '2px solid #ed1c24' : '1px solid #eee',
                          transition: 'all 0.3s'
                        }}
                      >
                        <img src={img} alt="" style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover' }} />
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            </Col>

            <Col xs={24} md={12}>
              <div className="product-info-content">
                <Tag color="green" style={{ marginBottom: '12px' }}>BMD VEGAN</Tag>
                <Title level={2} style={{ margin: '0 0 12px 0', fontSize: '32px', fontWeight: 400 }}>{data.name}</Title>
                
                <Space split={<Divider type="vertical" />} style={{ marginBottom: '20px' }}>
                  <Space><Rate disabled defaultValue={5} style={{ fontSize: '14px' }} /><Text type="secondary">(12 đánh giá)</Text></Space>
                  <Text type="secondary">Mã: <Text strong>{data.code || "N/A"}</Text></Text>
                  <Text type="secondary">Đã bán: <Text strong>452</Text></Text>
                </Space>

                <div style={{ background: '#fcf2f2', padding: '24px', borderRadius: '16px', marginBottom: '24px' }}>
                  <Space align="baseline" size="large">
                    <Title level={2} style={{ color: '#ed1c24', margin: 0 }}>{displayPrice.toLocaleString("vi-VN")}đ</Title>
                    {data.importPrice && data.importPrice > data.unitPrice && (
                      <Text delete type="secondary" style={{ fontSize: '18px' }}>
                        {data.importPrice.toLocaleString("vi-VN")}đ
                      </Text>
                    )}
                  </Space>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <Text strong style={{ display: 'block', marginBottom: '8px' }}>Mô tả ngắn:</Text>
                  <Paragraph style={{ color: '#666', fontSize: '15px' }}>
                    {data.description || "Sản phẩm thực phẩm chay cao cấp, được chế biến từ nguyên liệu tự nhiên, chuẩn vị và giàu dinh dưỡng."}
                  </Paragraph>
                </div>

                <Divider style={{ margin: '24px 0' }} />

                <div style={{ marginBottom: '32px' }}>
                  <Text strong style={{ display: 'block', marginBottom: '12px' }}>Số lượng:</Text>
                  <Space size="large">
                    <InputNumber 
                      min={1} 
                      value={qty} 
                      onChange={(v) => setQty(v || 1)} 
                      size="large"
                      style={{ width: '80px', borderRadius: '8px' }}
                    />
                  </Space>
                </div>

                <Row gutter={16}>
                  <Col span={12}>
                    <Button 
                      type="primary" 
                      size="large" 
                      block 
                      icon={<ThunderboltOutlined />}
                      style={{ height: '56px', borderRadius: '12px', background: '#ed1c24', border: 'none', fontWeight: 700 }}
                      onClick={() => {
                        handleAddToCart();
                        setTimeout(() => navigate("/order/cart-confirm"), 500);
                      }}
                    >
                      MUA NGAY
                    </Button>
                  </Col>
                  <Col span={12}>
                    <Button 
                      size="large"
                      block 
                      icon={<ShoppingCartOutlined />}
                      style={{ height: '56px', borderRadius: '12px', color: '#ed1c24', borderColor: '#ed1c24', fontWeight: 700 }}
                      onClick={handleAddToCart}
                    >
                      THÊM GIỎ HÀNG
                    </Button>
                  </Col>
                </Row>

                <div style={{ marginTop: '24px' }}>
                  <Space size="middle">
                    <Button type="text" icon={<HeartOutlined />}>Yêu thích</Button>
                    <Button type="text" icon={<ShareAltOutlined />}>Chia sẻ</Button>
                  </Space>
                </div>

                {addedMessage && (
                  <Alert 
                    message={addedMessage} 
                    type="success" 
                    showIcon 
                    icon={<CheckCircleOutlined />}
                    style={{ marginTop: '20px', borderRadius: '8px' }} 
                  />
                )}

                <div style={{padding: '20px', background: '#f9f9f9', borderRadius: '12px' }}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Text strong><CheckCircleOutlined style={{ color: '#52c41a' }} /> Giao hàng nhanh toàn quốc</Text>
                    <Text strong><CheckCircleOutlined style={{ color: '#52c41a' }} /> Đổi trả trong 7 ngày nếu có lỗi</Text>
                    <Text strong><CheckCircleOutlined style={{ color: '#52c41a' }} /> Cam kết 100% thuần chay cao cấp</Text>
                  </Space>
                </div>
              </div>
            </Col>
          </Row>

          {/* Related Products */}
          <section style={{ marginTop: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <Title level={3} style={{ margin: 0 }}>Sản phẩm cùng danh mục</Title>
              <Link to="/products" style={{ color: '#ed1c24' }}>Xem tất cả</Link>
            </div>
            {loadingRelated ? (
              <div style={{ textAlign: 'center', padding: '40px' }}><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div></div>
            ) : (
              <Row gutter={[20, 20]}>
                {relatedProducts.map(product => (
                  <Col xs={12} sm={8} md={6} key={product.id}>
                    <Card
                      hoverable
                      styles={{ body: { padding: '12px' } }}
                      style={{ borderRadius: '12px', overflow: 'hidden' }}
                      cover={<img alt={product.name} src={product.image} style={{ aspectRatio: '1/1', objectFit: 'cover' }} />}
                      onClick={() => navigate(`/detail/${product.id}`)}
                    >
                      <Text strong style={{ display: 'block', fontSize: '15px' }} ellipsis>{product.name}</Text>
                      <Text style={{ color: '#ed1c24', fontSize: '16px', fontWeight: 700 }}>{product.unitPrice.toLocaleString("vi-VN")}đ</Text>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
});

export default DetailPage;
