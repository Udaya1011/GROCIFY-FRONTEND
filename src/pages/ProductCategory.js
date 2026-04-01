import { categories } from "../assets/assets";
import ProductCard from "../components/ProductCard";
import { useAppContext } from "../context/AppContext";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
const ProductCategory = ({ categoryOverride }) => {
  const { products, navigate } = useAppContext();
  const { category: paramCategory } = useParams();
  const category = categoryOverride || paramCategory;

  const specialRoutes = {
    'chocolate-sweets': '/chocolate-sweets',
    'chocolate & sweets': '/chocolate-sweets',
    'ketchup-dips-spreads': '/ketchup-dips-spreads',
    'ketchup, dips & spreads': '/ketchup-dips-spreads',
    'noodles-pasta': '/noodles-pasta',
    'noodles & pasta': '/noodles-pasta',
    'breakfast-essentials': '/breakfast-essentials',
    'pickles-chutney': '/pickles-chutney',
    'pickles & chutney': '/pickles-chutney',
    'ready-to-cook': '/ready-to-cook',
    'ready to cook': '/ready-to-cook',
    'baking-essentials': '/baking-essentials',
    'baking essentials': '/baking-essentials',
    'masalas-spices': '/masalas-spices',
    'masalas & spices': '/masalas-spices'
  };

  useEffect(() => {
    if (!category) return;
    const normalizedCat = category.toLowerCase();
    if (specialRoutes[normalizedCat]) {
      navigate(specialRoutes[normalizedCat]);
      return;
    }
  }, [category, navigate]);

  const searchCategory = categories.find(
    (item) => item.path.toLowerCase() === category.toLowerCase()
  );

  console.log("Current Category:", category);
  console.log("All Products:", products);
  const filteredProducts = products.filter(
    (product) => {
      console.log(`Checking product: ${product.name}, category: ${product.category}`);
      return product.category?.toLowerCase() === category.toLowerCase();
    }
  );
  console.log("Filtered Products:", filteredProducts);
  return (
    <div className="mt-16">
      {searchCategory ? (
        <div className="flex flex-col items-end w-max">
          <h1 className="text-3xl md:text-4xl font-medium">
            {searchCategory.text?.toUpperCase()}
          </h1>
        </div>
      ) : (
        <div className="flex flex-col items-end w-max">
          <h1 className="text-3xl md:text-4xl font-medium">
            {category?.toUpperCase()}
          </h1>
        </div>
      )}
      {filteredProducts.length > 0 ? (
        <div>
          <div className="my-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 items-center justify-center">
            {filteredProducts.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h1 className="text-3xl md:text-4xl font-medium">
            No products found
          </h1>
        </div>
      )}
    </div>
  );
};
export default ProductCategory;
