import { lazy } from "react";
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";

const AuthLayout = lazy(() => import("@/layouts/AuthLayout"));
const ProtectedLayout = lazy(() => import("@/layouts/ProtectedLayout"));
const MasterLayout = lazy(() => import("@/layouts/MasterLayout"));
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const MasterDashboard = lazy(() => import("@/pages/master/Dashboard"));
const CountryMasterPage = lazy(() => import("@/pages/master/country/index"));
const StateMasterPage = lazy(() => import("@/pages/master/state/index"));
const StateMasterFormPage = lazy(() => import("@/pages/master/state/form"));
const DistrictMasterPage = lazy(() => import("@/pages/master/district/index"));
const DistrictMasterFormPage = lazy(() => import("@/pages/master/district/form"));
const CityMasterPage = lazy(() => import("@/pages/master/city/index"));
const CityMasterFormPage = lazy(() => import("@/pages/master/city/form"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/master" replace />,
  },
  {
    element: <AuthLayout />,
    children: [{ path: "/login", element: <LoginPage /> }],
  },
  {
    element: <ProtectedLayout />,
    children: [
      {
        path: "/master",
        element: <MasterLayout />,
        children: [
          { index: true, element: <MasterDashboard /> },
          { path: "country", element: <CountryMasterPage /> },
          {
            path: "state",
            element: <Outlet />,
            children: [
              { index: true, element: <StateMasterPage /> },
              { path: "state-form/:encryptedId", element: <StateMasterFormPage /> },
            ],
          },
          {
            path: "district",
            element: <Outlet />,
            children: [
              { index: true, element: <DistrictMasterPage /> },
              { path: "district-form/:encryptedId", element: <DistrictMasterFormPage /> },
            ],
          },
          {
            path: "city",
            element: <Outlet />,
            children: [
              { index: true, element: <CityMasterPage /> },
              { path: "city-form/:encryptedId", element: <CityMasterFormPage /> },
            ],
          },
        ],
      },
    ],
  },
]);