import { Topbar } from '@/components/layout/Topbar';
import { Card } from '@/components/ui/Card';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StatCard } from '@/components/ui/Card';
import { formatDate } from '@/utils/formatters';

interface Partner {
  id: string;
  stationName: string;
  brand: string;
  tier: 'Promoted Pin' | 'Deal Promotions';
  monthlyFee: number;
  renewalDate: string;
  active: boolean;
  dealText: string | null;
}

const MOCK_PARTNERS: Partner[] = [
  { id: '1', stationName: "Love's Travel Stop #442", brand: "Love's", tier: 'Deal Promotions', monthlyFee: 299, renewalDate: '2024-02-15T00:00:00Z', active: true, dealText: '$0.99 fountain drinks, free coffee with fill-up' },
  { id: '2', stationName: 'Pilot Flying J — Memphis', brand: 'Pilot', tier: 'Promoted Pin', monthlyFee: 149, renewalDate: '2024-02-01T00:00:00Z', active: true, dealText: null },
  { id: '3', stationName: "Casey's #1028", brand: "Casey's", tier: 'Promoted Pin', monthlyFee: 149, renewalDate: '2024-03-10T00:00:00Z', active: true, dealText: null },
  { id: '4', stationName: 'Kwik Trip #812', brand: 'Kwik Trip', tier: 'Deal Promotions', monthlyFee: 299, renewalDate: '2024-01-20T00:00:00Z', active: false, dealText: null },
];

export function Partners() {
  const totalMrr = MOCK_PARTNERS.filter((p) => p.active).reduce((sum, p) => sum + p.monthlyFee, 0);

  const columns: Column<Partner>[] = [
    {
      key: 'station', header: 'Station',
      render: (row) => (
        <div>
          <div style={{ color: 'var(--text)', fontWeight: 500, fontSize: 13 }}>{row.stationName}</div>
          <div style={{ fontSize: 11, color: 'var(--text3)' }}>{row.brand}</div>
        </div>
      ),
    },
    {
      key: 'tier', header: 'Tier', width: 140,
      render: (row) => <Badge variant={row.tier === 'Deal Promotions' ? 'blue' : 'green'}>{row.tier}</Badge>,
    },
    {
      key: 'deal', header: 'Active Deal',
      render: (row) => row.dealText
        ? <span style={{ fontSize: 12, color: 'var(--text2)' }}>{row.dealText}</span>
        : <span style={{ fontSize: 12, color: 'var(--text3)' }}>—</span>,
    },
    {
      key: 'fee', header: 'Monthly Fee', width: 110,
      render: (row) => <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>${row.monthlyFee}</span>,
    },
    {
      key: 'renewal', header: 'Renewal', width: 110,
      render: (row) => <span style={{ fontSize: 12, color: 'var(--text3)' }}>{formatDate(row.renewalDate)}</span>,
    },
    {
      key: 'status', header: 'Status', width: 90,
      render: (row) => <Badge variant={row.active ? 'green' : 'gray'}>{row.active ? 'Active' : 'Inactive'}</Badge>,
    },
    {
      key: 'actions', header: '', width: 80,
      render: (_row) => <Button size="sm" variant="secondary">Edit</Button>,
    },
  ];

  return (
    <>
      <Topbar title="Partner Stations" actions={<Button variant="primary" size="sm">+ Add Partner</Button>} />
      <main style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: '1.5rem' }}>
          <StatCard label="Active Partners" value={MOCK_PARTNERS.filter((p) => p.active).length} sub="Paying stations" />
          <StatCard label="Monthly Revenue" value={`$${totalMrr.toLocaleString()}`} sub="MRR" trend="up" />
          <StatCard label="AWS Bill Coverage" value={`${Math.round((totalMrr / 90) * 100)}%`} sub="vs ~$90/mo infra cost" trend="up" />
        </div>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', padding: '12px 20px', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>All Partners ({MOCK_PARTNERS.length})</span>
          </div>
          <DataTable columns={columns} rows={MOCK_PARTNERS} rowKey={(r) => r.id} />
        </Card>
      </main>
    </>
  );
}

// ── Flagged Content ────────────────────────────────────────────────────────────

interface FlaggedReview {
  id: string;
  location: string;
  restroomType: string;
  text: string;
  rating: number;
  flags: number;
  reviewer: string;
  distanceMetres: number;
  submittedAt: string;
}

const MOCK_FLAGGED: FlaggedReview[] = [
  { id: '1', location: 'Shell — Exit 42, I-90', restroomType: 'Male', text: 'Absolutely spotless, best bathroom in Illinois!', rating: 5, flags: 4, reviewer: 'NewUser_2024', distanceMetres: 2400, submittedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
  { id: '2', location: "Casey's — Exit 17, I-35", restroomType: 'Family', text: 'Disgusting, never again.', rating: 1, flags: 2, reviewer: 'RoadWarrior99', distanceMetres: 45, submittedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
  { id: '3', location: 'BP — Exit 88, I-75', restroomType: 'Female', text: 'Perfect 10/10 would recommend to everyone!!!', rating: 5, flags: 3, reviewer: 'GasStationOwner', distanceMetres: 8900, submittedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
];

export function FlaggedContent() {
  return (
    <>
      <Topbar title="Flagged Content" />
      <main style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
        <Card>
          <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>
              Needs Review ({MOCK_FLAGGED.length})
            </span>
          </div>
          {MOCK_FLAGGED.map((item, i) => (
            <div key={item.id} style={{
              padding: '16px 20px',
              borderBottom: i < MOCK_FLAGGED.length - 1 ? '1px solid var(--border)' : 'none',
              display: 'flex', gap: 16, alignItems: 'flex-start',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{item.location}</span>
                  <Badge variant="gray">{item.restroomType}</Badge>
                  <Badge variant="red">{item.flags} flags</Badge>
                  <Badge variant={item.distanceMetres > 500 ? 'red' : 'green'}>{item.distanceMetres}m away</Badge>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.5, marginBottom: 6 }}>
                  "{item.text}"
                </p>
                <div style={{ fontSize: 11, color: 'var(--text3)' }}>
                  By <strong style={{ color: 'var(--text2)' }}>{item.reviewer}</strong>
                  {' · '}Rating: {item.rating} ★
                  {' · '}
                  {new Date(item.submittedAt).toLocaleTimeString()}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                <Button size="sm" variant="secondary">Approve</Button>
                <Button size="sm" variant="danger">Delete</Button>
              </div>
            </div>
          ))}
        </Card>
      </main>
    </>
  );
}
