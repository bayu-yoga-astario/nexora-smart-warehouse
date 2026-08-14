import React from 'react';
import { DataTable } from '../common/DataTable';
import { StatusBadge } from '../common/StatusBadge';

export const StockTable = ({ items = [], loading = false }) => {
  const columns = [
    { header: 'SKU', accessor: 'sku', cell: (row) => <span className="font-mono text-cyan-400 font-bold">{row.sku}</span> },
    { header: 'Product Name', accessor: 'name' },
    { header: 'Warehouse', accessor: 'warehouse' },
    { header: 'Location Bin', accessor: 'location' },
    { header: 'Quantity', accessor: 'quantity', cell: (row) => <span className="font-mono font-bold text-white">{row.quantity} {row.unit}</span> },
    { header: 'Status', accessor: 'status', cell: (row) => <StatusBadge status={row.quantity <= 15 ? 'LOW STOCK' : 'NORMAL'} /> }
  ];

  return <DataTable columns={columns} data={items} loading={loading} />;
};
