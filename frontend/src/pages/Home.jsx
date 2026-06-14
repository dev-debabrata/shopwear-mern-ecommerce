import "../index.css";

import Container from "../layout/Container";
import Hero from "../components/Hero";
import LatestCollections from "../components/LatestCollections";
import BestSeller from "../components/BestSeller";
import OurPolicy from "../components/OurPolicy";
import SearchItem from "../components/SearchItem";

const Home = () => {


  return (
    <Container>
      {/* <SearchItem /> */}
      <Hero />
      <LatestCollections />
      <BestSeller />
      <OurPolicy />
    </Container>
  );
};

export default Home;




