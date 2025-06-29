import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN } from './constants';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Sidebar from './layout/Sidebar'; 
import Footer from './layout/Footer';
import PaymentPage from './pages/PaymentPage';
import QRManagementPage from './pages/QrManagementPage';
import TableOrder from './pages/TableOrder';
import TableCart from './components/TableCart';
import TableOrderPage from './pages/TableOrderPage';
import MenuPage from './pages/MenuPage';
import OrderStatus from './pages/OrderStatus';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminPage';
import Reciept from './components/Reciept';

const Home = lazy(() => import('./components/Home'));
const FoodPage = lazy(() => import('./pages/FoodPage'));
const AddToCart = lazy(() => import('./pages/CartPage'));
const OrderPage = lazy(() => import('./pages/OrderPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const OrderConfirmationPage = lazy(() => import('./pages/ConfirmOrderPage'));
const Reservations = lazy(() => import('./pages/Reservations'));
const Login = lazy(() => import('./components/Auth/Login'));
const Register = lazy(() => import('./components/Auth/Register'));
const Header = lazy(() => import('./components/Header'));
const StarterSection = lazy(() => import('./components/StarterSection'));
const MenuSection = lazy(() => import('./components/MenuSection'));
const MenuDetail = lazy(() => import('./components/MenuDetail'));
const FoodDetail = lazy(() => import('./components/FoodDetail'));
const GallerySection = lazy(() => import('./components/GallerySection'));
const BookingSection = lazy(() => import('./components/BookingSection'));
const ReviewSection = lazy(() => import('./components/ReviewSection'));

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem(ACCESS_TOKEN);
    if (token) {
      setIsAuthenticated(true);
    }

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem(ACCESS_TOKEN);
    setIsAuthenticated(false);
    navigate('/login');
  };

  const loggedInUser = (status) => {
    setIsAuthenticated(status);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // Responsive margin based on screen width and sidebar state
  const getMainMargin = () => {
    if (windowWidth < 768) return 'ml-0';
    return isSidebarOpen ? 'ml-64' : 'ml-14';
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex flex-1">
        <Sidebar
          isAuthenticated={isAuthenticated}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          handleLogout={handleLogout}
          loggedInUser={loggedInUser}
          windowWidth={windowWidth}
        />
        <div
          className={`transition-all duration-300 border-l border-gray-300 p-4 w-full ${getMainMargin()}`}
        >
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/foods" element={<FoodPage />} />
              <Route path="/menu" element={<MenuSection />} />
              <Route path="/menu-detail/:id" element={<MenuDetail />} />
              <Route path="/food/:id" element={<FoodDetail />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/table_order" element={<TableOrder />} />
              <Route path="/table_order_page" element={<TableOrderPage />} />
              <Route path="/tablecart" element={<TableCart />} />
              <Route path="/menus" element={<MenuPage />} />
              <Route path="/order/:orderId" element={<OrderStatus />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/header" element={<Header />} />
              <Route path="/starter" element={<StarterSection />} />
              <Route path="/gallery" element={<GallerySection />} />
              <Route path="/reviews" element={<ReviewSection />} />

              {/* Protected Routes */}
              <Route path="/reciept" element={<ProtectedRoute><Reciept /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/users" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/cart" element={<ProtectedRoute><AddToCart /></ProtectedRoute>} />
              <Route path="/booking" element={<ProtectedRoute><BookingSection /></ProtectedRoute>} />
              <Route path="/order" element={<ProtectedRoute><OrderPage /></ProtectedRoute>} />
              <Route path="/order-confirmation" element={<ProtectedRoute><OrderConfirmationPage /></ProtectedRoute>} />
              <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
              <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
              <Route path="/reservations" element={<ProtectedRoute><Reservations /></ProtectedRoute>} />
              <Route path="/qr_code" element={<ProtectedRoute><QRManagementPage /></ProtectedRoute>} />
            </Routes>
          </Suspense>
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default App;
