import { Routes, Route } from 'react-router-dom';
import { AppProviders } from '@/app/providers';
import ScrollToTop from '@/components/ScrollToTop';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ErrorBoundary from '@/components/ErrorBoundary';
import Home from '@/features/home/pages/Home';
import Explore from '@/features/courses/pages/Explore';
import FAQ from '@/features/faq/pages/FAQ';
import About from '@/features/marketing/pages/About';
import Contact from '@/features/marketing/pages/Contact';
import RecommendStart from '@/features/recommend/pages/RecommendStart';
import RecommendQuiz from '@/features/recommend/pages/RecommendQuiz';
import RecommendLoading from '@/features/recommend/pages/RecommendLoading';
import RecommendResult from '@/features/recommend/pages/RecommendResult';
import Cart from '@/features/cart/pages/Cart';
import Checkout from '@/features/cart/pages/Checkout';
import PaymentProcessing from '@/features/cart/pages/PaymentProcessing';
import PaymentResult from '@/features/cart/pages/PaymentResult';
import CourseDetail from '@/features/courses/pages/CourseDetail';
import Profile from '@/features/profile/pages/Profile';

function App() {
  return (
    <AppProviders>
      <div className="App">
        <ScrollToTop />
        <Navbar />
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/FAQ" element={<FAQ />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/recommend" element={<RecommendStart />} />
            <Route path="/recommend/quiz/:step" element={<RecommendQuiz />} />
            <Route path="/recommend/loading" element={<RecommendLoading />} />
            <Route path="/recommend/result" element={<RecommendResult />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/checkout/processing" element={<PaymentProcessing />} />
            <Route path="/checkout/:status" element={<PaymentResult />} />
            <Route path="/course/:id" element={<CourseDetail />} />
          </Routes>
        </ErrorBoundary>
        <Footer />
      </div>
    </AppProviders>
  );
}

export default App;
