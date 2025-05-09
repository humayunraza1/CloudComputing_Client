import { ThemeProvider } from "@/components/theme-provider"
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "@/contexts/auth-context"
import { CartProvider } from "@/contexts/cart-context"
import { MainLayout } from "@/components/layout/main-layout"
import Home from "@/pages/home"
import Products from "@/pages/products"
import Dashboard from "@/pages/dashboard"
import Login from "@/pages/login"
import Register from "@/pages/register"
import Checkout from "@/pages/checkout"
import OrderHistory from "./pages/order-history"

function ProtectedDashboardRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'User') return <Navigate to="/order-history" replace />;
  return children;
}

function AppRoutes() {
  const location = useLocation()
  const isAuthPage = ["/login", "/register"].includes(location.pathname)
  const isCheckoutPage = location.pathname === "/checkout"

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    )
  }
  if (isCheckoutPage) {
    return (
      <Routes>
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    )
  }
  if (location.pathname === "/order-history") {
    return (
      <Routes>
        <Route path="/order-history" element={<OrderHistory />} />
      </Routes>
    )
  }
  if (location.pathname === "/dashboard") {
    return (
      <Routes>
        <Route path="/dashboard" element={
          <ProtectedDashboardRoute>
            <Dashboard />
          </ProtectedDashboardRoute>
        } />
      </Routes>
    )
  }

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
      </Routes>
    </MainLayout>
  )
}

function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Router>
        <AuthProvider>
          <CartProvider>
            <AppRoutes />
          </CartProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  )
}

export default App 