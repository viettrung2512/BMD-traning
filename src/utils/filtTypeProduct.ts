
type ProductCardProps = {
    id: number;
    name: string;
    image: string;
    description: string;
    price: string;
    }

const filterProducts = (rawData: unknown[]): ProductCardProps[] => {
  return rawData.map(item => {
    const product = item as { id: number; name: string; image: string; description: string; unitPrice: string};
    return {
      id: product.id,
      name: product.name,
      image: product.image,
      description: product.description,
      price: product.unitPrice,
    };
  });
}

export { filterProducts };
export type { ProductCardProps };