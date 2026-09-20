import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ToastProvider } from '@/components/ui';
import { ExperienceSwitcher } from '@/components/ExperienceSwitcher';
import { StorefrontLayout } from '@/layouts/StorefrontLayout';
import { MerchantLayout } from '@/layouts/MerchantLayout';
import { Home } from '@/pages/storefront/Home';
import { ProductCatalog } from '@/pages/storefront/ProductCatalog';
import { MerchantDashboard } from '@/pages/merchant/Dashboard';
import { MerchantProducts } from '@/pages/merchant/MerchantProducts';
import { MerchantProductDetail } from '@/pages/merchant/MerchantProductDetail';
import { QRCodePage } from '@/pages/merchant/QRCodePage';
import { CustomerPreview } from '@/pages/merchant/CustomerPreview';
import { MerchantAnalytics } from '@/pages/merchant/MerchantAnalytics';
import { MerchantStore } from '@/pages/merchant/MerchantStore';
import { MerchantSettings } from '@/pages/merchant/MerchantSettings';

const ProductDetail = lazy(() =>
  import('@/pages/storefront/ProductDetail').then((m) => ({ default: m.ProductDetail }))
);
const ARExperience = lazy(() =>
  import('@/pages/ar/ARExperience').then((m) => ({ default: m.ARExperience }))
);

function PageSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50">
      <div className="w-8 h-8 rounded-full border-2 border-brand-200 border-t-accent-500 animate-spin" />
    </div>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-6xl font-bold text-brand-200 mb-4">404</p>
        <h1 className="text-2xl font-bold text-brand-900 mb-2">Page not found</h1>
        <p className="text-sm text-brand-500 mb-6">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <Link to="/" className="inline-flex h-10 px-5 bg-brand-900 text-white rounded-xl text-sm font-medium items-center gap-2 hover:bg-brand-800 transition-colors">
          Back to store
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Suspense fallback={<PageSpinner />}>
          <Routes>
            {/* Storefront */}
            <Route element={<StorefrontLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductCatalog />} />
              <Route path="/product/:productId" element={<ProductDetail />} />
            </Route>

            {/* Merchant */}
            <Route path="/merchant" element={<MerchantLayout />}>
              <Route index element={<MerchantDashboard />} />
              <Route path="products" element={<MerchantProducts />} />
              <Route path="products/:productId" element={<MerchantProductDetail />} />
              <Route path="products/:productId/qr" element={<QRCodePage />} />
              <Route path="products/:productId/preview" element={<CustomerPreview />} />
              <Route path="analytics" element={<MerchantAnalytics />} />
              <Route path="store" element={<MerchantStore />} />
              <Route path="settings" element={<MerchantSettings />} />
            </Route>

            {/* AR (full screen) */}
            <Route path="/ar/:productId" element={<ARExperience />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>

        {/* Experience switcher — visible on all pages except AR */}
        <ExperienceSwitcher />
      </BrowserRouter>
    </ToastProvider>
  );
}
