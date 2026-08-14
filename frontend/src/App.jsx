import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';

// Auth Page
import Login from './pages/auth/Login';

// Dashboard
import Dashboard from './pages/dashboard/Dashboard';

// Master Data Pages
import Products from './pages/master-data/Products';
import Categories from './pages/master-data/Categories';
import Suppliers from './pages/master-data/Suppliers';
import Customers from './pages/master-data/Customers';
import Warehouses from './pages/master-data/Warehouses';
import Locations from './pages/master-data/Locations';
import Units from './pages/master-data/Units';

// Inventory Pages
import Stock from './pages/inventory/Stock';
import StockMovement from './pages/inventory/StockMovement';
import StockOpname from './pages/inventory/StockOpname';
import StockAdjustment from './pages/inventory/StockAdjustment';
import SlowMoving from './pages/inventory/SlowMoving';

// Procurement Pages
import PurchaseRequest from './pages/procurement/PurchaseRequest';
import PurchaseOrder from './pages/procurement/PurchaseOrder';
import GoodsReceipt from './pages/procurement/GoodsReceipt';
import SupplierPerformance from './pages/procurement/SupplierPerformance';

// Outbound Pages
import MaterialRequest from './pages/outbound/MaterialRequest';
import Picking from './pages/outbound/Picking';
import Packing from './pages/outbound/Packing';
import DeliveryOrder from './pages/outbound/DeliveryOrder';
import Shipment from './pages/outbound/Shipment';

// Analytics Pages
import InventoryAnalytics from './pages/analytics/InventoryAnalytics';
import DemandForecast from './pages/analytics/DemandForecast';
import ReorderRecommendation from './pages/analytics/ReorderRecommendation';
import InventoryHealth from './pages/analytics/InventoryHealth';

// Reports Pages
import StockReport from './pages/reports/StockReport';
import InboundReport from './pages/reports/InboundReport';
import OutboundReport from './pages/reports/OutboundReport';
import PurchaseReport from './pages/reports/PurchaseReport';

// Import / Export Pages
import ImportExcel from './pages/import-export/ImportExcel';
import ExportData from './pages/import-export/ExportData';

// Administration Pages
import Users from './pages/administration/Users';
import RolesPermissions from './pages/administration/RolesPermissions';
import AuditLogs from './pages/administration/AuditLogs';
import AccountSettings from './pages/administration/AccountSettings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Auth Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected App Routes wrapped in MainLayout */}
        <Route
          path="/*"
          element={
            <MainLayout>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />

                {/* Master Data */}
                <Route path="/master-data" element={<Navigate to="/master-data/products" replace />} />
                <Route path="/master-data/products" element={<Products />} />
                <Route path="/master-data/categories" element={<Categories />} />
                <Route path="/master-data/suppliers" element={<Suppliers />} />
                <Route path="/master-data/customers" element={<Customers />} />
                <Route path="/master-data/warehouses" element={<Warehouses />} />
                <Route path="/master-data/locations" element={<Locations />} />
                <Route path="/master-data/units" element={<Units />} />

                {/* Inventory */}
                <Route path="/inventory" element={<Navigate to="/inventory/stock" replace />} />
                <Route path="/inventory/stock" element={<Stock />} />
                <Route path="/inventory/movement" element={<StockMovement />} />
                <Route path="/inventory/opname" element={<StockOpname />} />
                <Route path="/inventory/adjustment" element={<StockAdjustment />} />
                <Route path="/inventory/slow-moving" element={<SlowMoving />} />

                {/* Procurement */}
                <Route path="/procurement" element={<Navigate to="/procurement/purchase-request" replace />} />
                <Route path="/procurement/purchase-request" element={<PurchaseRequest />} />
                <Route path="/procurement/purchase-order" element={<PurchaseOrder />} />
                <Route path="/procurement/goods-receipt" element={<GoodsReceipt />} />
                <Route path="/procurement/supplier-performance" element={<SupplierPerformance />} />

                {/* Outbound */}
                <Route path="/outbound" element={<Navigate to="/outbound/material-request" replace />} />
                <Route path="/outbound/material-request" element={<MaterialRequest />} />
                <Route path="/outbound/picking" element={<Picking />} />
                <Route path="/outbound/packing" element={<Packing />} />
                <Route path="/outbound/delivery-order" element={<DeliveryOrder />} />
                <Route path="/outbound/shipment" element={<Shipment />} />

                {/* Analytics */}
                <Route path="/analytics" element={<Navigate to="/analytics/inventory-analytics" replace />} />
                <Route path="/analytics/inventory-analytics" element={<InventoryAnalytics />} />
                <Route path="/analytics/demand-forecast" element={<DemandForecast />} />
                <Route path="/analytics/reorder-recommendation" element={<ReorderRecommendation />} />
                <Route path="/analytics/inventory-health" element={<InventoryHealth />} />

                {/* Reports */}
                <Route path="/reports" element={<Navigate to="/reports/stock-report" replace />} />
                <Route path="/reports/stock-report" element={<StockReport />} />
                <Route path="/reports/inbound-report" element={<InboundReport />} />
                <Route path="/reports/outbound-report" element={<OutboundReport />} />
                <Route path="/reports/purchase-report" element={<PurchaseReport />} />

                {/* Import / Export */}
                <Route path="/import-export" element={<Navigate to="/import-export/import" replace />} />
                <Route path="/import-export/import" element={<ImportExcel />} />
                <Route path="/import-export/export" element={<ExportData />} />

                {/* Administration */}
                <Route path="/administration" element={<Navigate to="/administration/account-settings" replace />} />
                <Route path="/administration/users" element={<Users />} />
                <Route path="/administration/roles" element={<RolesPermissions />} />
                <Route path="/administration/audit-logs" element={<AuditLogs />} />
                <Route path="/administration/account-settings" element={<AccountSettings />} />
                <Route path="/administration/profile" element={<AccountSettings />} />
                <Route path="/settings/account" element={<AccountSettings />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </MainLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
