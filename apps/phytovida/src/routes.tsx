import { Navigate, Route, Routes } from 'react-router';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import CommonLayout from './layouts/common-layout';
import SignInPage from './pages/auth/SignIn';
import SignUpPage from './pages/auth/SignUp';
import AuthLayout from './layouts/auth-layout';

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path='auth'
        element={<AuthLayout />}
      >
        <Route
          index
          element={<Navigate to='/auth/sign-in' />}
        />
        <Route
          path='sign-in'
          element={<SignInPage />}
        />
        <Route
          path='sign-up'
          element={<SignUpPage />}
        />
      </Route>
      <Route
        path='/'
        element={<CommonLayout />}
      >
        <Route
          index
          element={<Home />}
        />
        <Route
          path='dashboard'
          element={<Dashboard />}
        />
        <Route
          path='test'
          element={<p>Test</p>}
        />
      </Route>
      <Route
        path='*'
        element={<NotFound />}
      />
    </Routes>
  );
}
