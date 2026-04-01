import Banner from "../components/Banner";
import BestSeller from "../components/BestSeller";
import NewsLetter from "../components/NewsLetter";
import SmartPacks from "../components/SmartPacks";
import ContentGrid from "../components/ContentGrid";
import { packagedFood, categories } from "../assets/assets";

const Home = () => {
  return (
    <div className="mt-10">
      <Banner />

      <ContentGrid title="Packaged Food" items={packagedFood} bgColor="#F5EEFF" />

      <ContentGrid title="Shop by Category" items={categories} />

      <BestSeller />
      <SmartPacks />
      <NewsLetter />
    </div>
  );
};

export default Home;
