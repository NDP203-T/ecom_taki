import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import FeaturedProducts from './components/FeaturedProducts';
import Categories from './components/Categories';
import CTASection from './components/CTASection';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <Hero />
        <FeaturedProducts />
        <Categories />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
