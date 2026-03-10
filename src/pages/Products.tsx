import { useEffect, useState } from "react";
import { getAllProductsByCategory } from "../api/products";
import Header from "../components/Header";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import Card from "../components/Card";
import { filterProducts } from "../utils/filtTypeProduct";
import type { ProductCardProps } from "../utils/filtTypeProduct";
import { getAllCategories } from "../api/products.category";

type MenuItem = Required<MenuProps>["items"][number];

type Category = {
  id: number;
  name: string;
};

const Products = () => {
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [selectedKeys, setSelectedKeys] = useState<number>( 0);
  const [products, setProducts] = useState<ProductCardProps[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);

  // useEffect to get all categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        const categories: Category[] = data.data.productCategories;
        const addAll: Category[] = [
          { id: 0, name: "Tất cả sản phẩm" },
          ...categories,
        ];
        setItems(
          addAll.map((category) => ({
            key: category.id,
            label: category.name,
          }))
        );

        console.log("items:", items);
        console.log("all cat:", data.data.productCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // useEffect to fetch products based on selected category
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProductsByCategory(selectedKeys);
        // console.log(data);
        const filteredProducts = filterProducts(data.data.products);
        setProducts(filteredProducts);
        setLoadingProducts(false);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedKeys]);

  return (
    <div>
      <Header />
      {loading ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
          <span className="text-lg text-gray-500">Loading...</span>
        </div>
      ) : (
        <div className="flex gap-6 px-6 py-8">
          {/* menu side bar */}
          <aside className="w-64 shrink-0">
            <div className="sticky top-24">
              <Menu
                items={items}
                onClick={(e) => {
                  setSelectedKeys(parseInt(e.key, 10));
                  setLoadingProducts(true);
                  console.log(selectedKeys);
                }}
                selectedKeys={[selectedKeys.toString()]}
                style={{ borderRadius: "10px" }}
              />
            </div>
          </aside>

          {/* content */}
          <div className="flex-1 min-w-0 min-h-150">
            <h1 className="text-2xl font-bold mb-4">Sản phẩm</h1>
            {loadingProducts ? (
              <div className="w-full h-full flex items-center justify-center min-h-150">
                <span className="text-lg text-gray-500">
                  Loading products...
                </span>
              </div>
            ) : (
              <div className="flex flex-wrap gap-10">
                {products.map((product) => (
                  <Card
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    image={product.image}
                    description={product.description}
                    price={product.price}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
