import { Route } from "react-router-dom";

import AdminLayout from "../pages/public/admin/AdminLayout";
import AdminDashboard from "../pages/public/admin/AdminDashboard";
import AdminHomepage from "../pages/public/admin/AdminHomepage";

function AdminRoutes() {
  return (
    <Route path="/admin" element={<AdminLayout />}>
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="homepage" element={<AdminHomepage />} />
    </Route>
  );
}

export default AdminRoutes;