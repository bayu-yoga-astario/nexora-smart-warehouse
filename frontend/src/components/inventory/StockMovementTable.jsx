import React from 'react';
import { DataTable } from '../common/DataTable';
import { StatusBadge } from '../common/StatusBadge';

export const StockMovementTable = ({ movements = [], loading = false }) => {
  const columns = [
    { header: 'Reference', accessor: 'reference', cell: (row) => <span className="font-mono text-slate-200">{row.reference}</span> },
    { header: 'Type', accessor: 'type', cell: (row) => <StatusBadge status={row.type} /> },
    { header: 'SKU', accessor: 'sku', cell: (row) => <span className="font-mono text-cyan-400">{row.sku}</span> },
    { header: 'Product', accessor: 'product' },
    { header: 'Quantity', accessor: 'qty', cell: (row) => <span className={`font-mono font-bold ${row.type === 'INBOUND' ? 'text-emerald-400' : 'text-amber-400'}`}>{row.type === 'INBOUND' ? `+${row.qty}` : `-${row.qty}`}</span> },
    { header: 'Date & Time', accessor: 'date' },
    { header: 'User', accessor: 'user' }
  ];

  return <DataTable columns={columns} data={movements} loading={loading} />;
};
