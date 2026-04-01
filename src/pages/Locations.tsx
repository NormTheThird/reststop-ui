import { useState } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { Card } from '@/components/ui/Card';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/shared/SearchInput';
import { ConfirmDialog } from '@/components/ui/Modal';
import { formatRating } from '@/utils/formatters';
import type { LocationSummary } from '@/types/location';

const MOCK_LOCATIONS: LocationSummary[] = [
  { id: '1', name: 'Shell', brand: 'Shell', lat: 41.8781, lng: -87.6298, distanceMetres: 0, avgOverall: 4.2, totalReviews: 38, is24Hr: true },
  { id: '2', name: "Casey's General Store", brand: "Casey's", lat: 41.5, lng: -88.1, distanceMetres: 0, avgOverall: 3.1, totalReviews: 14, is24Hr: true },
  { id: '3', name: 'Pilot Travel Center', brand: 'Pilot', lat: 42.1, lng: -87.9, distanceMetres: 0, avgOverall: 3.8, totalReviews: 72, is24Hr: true },
  { id: '4', name: 'BP Gas Station', brand: 'BP', lat: 41.9, lng: -87.7, distanceMetres: 0, avgOverall: 2.4, totalReviews: 9, is24Hr: false },
  { id: '5', name: "Love's Travel Stop", brand: "Love's", lat: 41.7, lng: -88.3, distanceMetres: 0, avgOverall: 4.5, totalReviews: 103, is24Hr: true },
];

export default function Locations() {
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = MOCK_LOCATIONS.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    (l.brand ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<LocationSummary>[] = [
    {
      key: 'name', header: 'Station',
      render: (row) => (
        <div>
          <div style={{ color: 'var(--text)', fontWeight: 500, fontSize: 13 }}>{row.name}</div>
          {row.brand && <div style={{ fontSize: 11, color: 'var(--text3)' }}>{row.brand}</div>}
        </div>
      ),
    },
    {
      key: 'rating', header: 'Avg Rating', width: 110,
      render: (row) => (
        <span style={{ color: row.avgOverall >= 4 ? 'var(--accent)' : row.avgOverall >= 3 ? 'var(--warning)' : 'var(--danger)' }}>
          {formatRating(row.avgOverall)} ★
        </span>
      ),
    },
    {
      key: 'reviews', header: 'Reviews', width: 90,
      render: (row) => <span style={{ color: 'var(--text2)' }}>{row.totalReviews}</span>,
    },
    {
      key: 'hours', header: 'Hours', width: 90,
      render: (row) => <Badge variant={row.is24Hr ? 'green' : 'gray'}>{row.is24Hr ? '24hr' : 'Limited'}</Badge>,
    },
    {
      key: 'actions', header: '', width: 120,
      render: (row) => (
        <div style={{ display: 'flex', gap: 6 }}>
          <Button size="sm" variant="secondary">Edit</Button>
          <Button size="sm" variant="danger" onClick={() => setDeleteId(row.id)}>Remove</Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Topbar
        title="Locations"
        actions={<Button variant="primary" size="sm">+ Add Location</Button>}
      />
      <main style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', padding: '12px 20px', borderBottom: '1px solid var(--border)', gap: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>All Locations ({filtered.length})</span>
            <SearchInput value={search} onChange={setSearch} placeholder="Search stations..." />
          </div>
          <DataTable columns={columns} rows={filtered} rowKey={(r) => r.id} />
        </Card>
      </main>

      <ConfirmDialog
        open={!!deleteId}
        title="Remove Location"
        message="This will mark the location as inactive and hide it from all search results. This action can be reversed."
        confirmLabel="Remove"
        danger
        onConfirm={() => setDeleteId(null)}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
