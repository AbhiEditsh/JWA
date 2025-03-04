import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { AuthGuard } from 'src/auth/guard';
import DashboardLayout from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';


// ----------------------------------------------------------------------

const IndexPage = lazy(() => import('src/pages/dashboard/Index'));
const Order = lazy(() => import('src/pages/dashboard/order'));
const Payment = lazy(() => import('src/pages/dashboard/payment'));

const ProductListPage = lazy(() => import('src/pages/dashboard/product/list'));
const ProductCreatePage = lazy(() => import('src/pages/dashboard/product/new'));
const ProductEditPage = lazy(() => import('src/pages/dashboard/product/edit'));

const CategoryListPage = lazy(() => import('src/pages/dashboard/category/list'));
const CategoryCreatePage = lazy(() => import('src/pages/dashboard/category/new'));
const CategoryEditPage = lazy(() => import('src/pages/dashboard/category/edit'));
// ----------------------------------------------------------------------

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      { element: <IndexPage />, index: true },
      {
        path: 'category',
        children: [
          { element: <CategoryListPage />, index: true },
          { path: 'list', element: <CategoryListPage /> },
          { path: 'new', element: <CategoryCreatePage /> },
          { path: 'edit', element: <CategoryEditPage /> },
        ],
      },
      { path: 'order', element: <Order /> },
      { path: 'payment', element: <Payment /> },
      {
        path: 'product',
        children: [
          { element: <ProductListPage />, index: true },
          { path: 'list', element: <ProductListPage /> },
          { path: 'new', element: <ProductCreatePage /> },
          { path: 'edit', element: <ProductEditPage /> },
        ],
      },
    ],
  },
];
