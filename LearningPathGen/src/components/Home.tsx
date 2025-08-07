import Start from './Start';
import Features from './Features';
import MyCarousel from './MyCarousel';
import Stats from './Stats';
import Footer from './Footer';

const Home : React.FC<{ navigateTo: (page: 'learn' | 'about') => void }> = ({ navigateTo }) => {
  return (
    <>
    <Start navigateTo={navigateTo}/>
    <Features/>
    <MyCarousel/>
    <Stats/>
    <Footer/>

    </>
  );
};

export default Home;
