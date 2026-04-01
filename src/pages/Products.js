import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { useAppContext } from "../context/AppContext";

import { useSearchParams } from "react-router-dom";

const Products = () => {
  const { products, searchQuery } = useAppContext();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const brand = searchParams.get("brand");

  useEffect(() => {
    let tempProducts = products;

    if (brand) {
      tempProducts = tempProducts.filter((product) =>
        product.name.toLowerCase().includes(brand.toLowerCase())
      );
    }

    if (searchQuery.length > 0) {
      tempProducts = tempProducts.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(tempProducts);
  }, [products, searchQuery, brand]);
  return (
    <div className="mt-16">
      <h1 className="text-3xl lg:text-4xl font-medium">All Products</h1>
      <div className="my-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 items-center justify-center">
        {filteredProducts
          .filter((product) => product.inStock)
          .map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
      </div>
    </div>
  );
};
export default Products;
