import { useEffect, useState } from "react";

import { filterProducts } from "../utils/filtTypeProduct";
import type { ProductCardProps } from "../utils/filtTypeProduct";

import { getAllProductsByCategory } from "../api/products";
import { getAllCategories } from "../api/products.category";
import Card from "./Card";

type Category = {
  id: number;
  name: string;
};

type CategorySection = {
  category: Category;
  products: ProductCardProps[];
};

const Outstanding = () => {
  const [sections, setSections] = useState<CategorySection[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllCategories();
        const categories: Category[] =
        response.data.productCategories || [];
        console.log("response", response);
        // chạy api song song
        const category = await Promise.all(
          categories.map(async (category) => {
            const products = await getAllProductsByCategory(category.id);
            const filter = filterProducts(products.data.products || []);
            console.log("products", products);
            return {
              category,
              products: filter,
            };
          }),
        );

        setSections(category.filter((s) => s.products.length > 0));
      } catch (error) {
        console.error("Error fetching outstanding products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
  return (
    <div className="w-full bg-white pt-20 mt-10 relative z-10">
      {loading ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-white">
          <span className="text-lg text-gray-500">Loading...</span>
        </div>
      ) : (
        sections.map((section) => (
          <section key={section.category.id} className="w-full mb-12">
            <div className="w-full px-6 flex items-center justify-between">
              <div className="text-2xl sm:text-3xl font-bold text-[#d11a2a] uppercase ml-4!">
                {section.category.name}
              </div>
            </div>
            <div className="h-6"></div>
            <div className="flex flex-wrap justify-center gap-4 mb-4!">
              {section.products.map((product) => (
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
          </section>
        ))
      )}
    </div>
  );
};

export default Outstanding;
