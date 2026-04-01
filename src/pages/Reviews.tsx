import { useState } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { Card } from '@/components/ui/Card';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/shared/SearchInput';
import { ConfirmDialog } from '@/components/ui/Modal';
import { formatRating, timeAgo } from '@/utils/formatters';
import type { Review } from '@/types/review';

const MOCK_REVIEWS: Review[] = [
  { id: '1', restroomId: 'r1', reviewerName: 'TruckerMike', cleanliness: 4, smell: 3, supplies: 5, overall: 4, photoAttached: true, helpfulVotes: 7, flaggedCount: 0, distanceFromLocation: 12, weightApplied: 1.4, createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
  { id: '2', restroomId: 'r2', reviewerName: 'RoadWarrior99', cleanliness: 1, smell: 1, supplies: 1, overall: 1, photoAttached: false, helpfulVotes: 2, flaggedCount: 3, distanceFromLocation: 45, weightApplied: 0.8, createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  { id: '3', restroomId: 'r1', reviewerName: 'FamilyDriver', cleanliness: 5, smell: 5, supplies: 4, overall: 5, photoAttached: true, helpfulVotes: 12, flaggedCount: 0, distanceFromLocation: 8, weightApplied: 1.8, createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString() },
  { id: '4', restroomId: 'r3', reviewerName: 'Anonymous', cleanliness: 3, smell: 3, supplies: 2, overall: 3, photoAttached: false, helpfulVotes: 0, flaggedCount: 1, distanceFromLocation: 180, weightApplied: 1.0, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() },
];

export default function Reviews() {
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [flaggedOnly, setFlaggedOnly] = useState(false);

  const filtered = MOCK_REVIEWS
    .filter((r) => !flaggedOnly || r.flaggedCount > 0)
    .filter((r) => r.reviewerName.toLowerCase().includes(search.toLowerCase()));

  const columns: Column<Review>[] = [
    {
      key: 'reviewer', header: 'Reviewer',
      render: (row) => <span style={{ color: 'var(--text)', fontWeight: 500 }}>{row.reviewerName}</span>,
    },
    {
      key: 'ratings', header: 'Ratings', width: 160,
      render: (row) => (
        <div style={{ fontSize: 11, color: 'var(--text3)', display: 'flex', gap: 8 }}>
          <span>C: {formatRating(row.cleanliness)}</span>
          <span>S: {formatRating(row.smell)}</span>
          <span>Sp: {formatRating(row.supplies)}</span>
          <span style={{ color: 'var(--text2)', fontWeight: 500 }}>★ {formatRating(row.overall)}</span>
        </div>
      ),
    },
    {
      key: 'distance', header: 'Distance', width: 90,
      render: (row) => (
        <Badge variant={row.distanceFromLocation <= 200 ? 'green' : 'red'}>
          {row.distanceFromLocation}m
        </Badge>
      ),
    },
    {
      key: 'flags', header: 'Flags', width: 80,
      render: (row) => row.flaggedCount > 0
        ? <Badge variant="red">{row.flaggedCount} flags</Badge>
        : <span style={{ color: 'var(--text3)', fontSize: 12 }}>—</span>,
    },
    {
      key: 'weight', header: 'Weight', width: 80,
      render: (row) => <span style={{ fontSize: 12, color: 'var(--text3)' }}>{row.weightApplied.toFixed(2)}</span>,
    },
    {
      key: 'time', header: 'Submitted', width: 120,
      render: (row) => <span style={{ fontSize: 12, color: 'var(--text3)' }}>{timeAgo(row.createdAt)}</span>,
    },
    {
      key: 'actions', header: '', width: 120,
      render: (row) => (
        <div style={{ display: 'flex', gap: 6 }}>
          {row.flaggedCount > 0 && <Button size="sm" variant="secondary">Approve</Button>}
          <Button size="sm" variant="danger" onClick={() => setDeleteId(row.id)}>Delete</Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Topbar title="Reviews" />
      <main style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', padding: '12px 20px', borderBottom: '1px solid var(--border)', gap: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>All Reviews ({filtered.length})</span>
            <Button
              size="sm"
              variant={flaggedOnly ? 'danger' : 'secondary'}
              onClick={() => setFlaggedOnly((v) => !v)}
            >
              {flaggedOnly ? '✕ Flagged Only' : '⚑ Flagged Only'}
            </Button>
            <SearchInput value={search} onChange={setSearch} placeholder="Search reviewer..." />
          </div>
          <DataTable columns={columns} rows={filtered} rowKey={(r) => r.id} />
        </Card>
      </main>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Review"
        message="This will permanently delete the review and recalculate the restroom's average scores. This cannot be undone."
        confirmLabel="Delete Review"
        danger
        onConfirm={() => setDeleteId(null)}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
