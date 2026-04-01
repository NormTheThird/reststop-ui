import { Topbar } from '@/components/layout/Topbar';
import { StatCard } from '@/components/ui/Card';
import { Card, CardHeader } from '@/components/ui/Card';
import { timeAgo } from '@/utils/formatters';

const STATS = [
  { label: 'Total Locations', value: '247', sub: '+3 this week', trend: 'up' as const },
  { label: 'Total Reviews', value: '1,842', sub: '+128 this week', trend: 'up' as const },
  { label: 'Active Users', value: '934', sub: '+47 this week', trend: 'up' as const },
  { label: 'Partner Stations', value: '12', sub: '$1,788 MRR', trend: 'up' as const },
];

const ACTIVITY = [
  { color: 'var(--accent)', text: 'New review submitted at Shell — Exit 42, I-90', time: '2 minutes ago' },
  { color: 'var(--danger)', text: 'Review flagged at Casey\'s — Exit 17, I-35', time: '14 minutes ago' },
  { color: 'var(--info)', text: 'New user registered via Google OAuth', time: '31 minutes ago' },
  { color: 'var(--accent)', text: 'Location claimed by owner: Pilot Travel Center, Memphis', time: '1 hour ago' },
  { color: 'var(--warning)', text: 'Partner station renewal due: Love\'s #0442', time: '2 hours ago' },
  { color: 'var(--danger)', text: '3 reviews flagged at BP — Exit 88, I-75', time: '3 hours ago' },
  { color: 'var(--accent)', text: 'New partner station signed: Kwik Trip #812', time: '5 hours ago' },
];

const FLAGGED = [
  { location: 'Shell — Exit 42, I-90', flags: 4, rating: 1.2, age: '2024-01-15T10:30:00Z' },
  { location: "Casey's — Exit 17, I-35", flags: 2, rating: 5.0, age: '2024-01-15T09:15:00Z' },
  { location: 'BP — Exit 88, I-75', flags: 3, rating: 4.8, age: '2024-01-15T07:00:00Z' },
];

export default function Overview() {
  return (
    <>
      <Topbar title="Overview" />
      <main style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: '1.5rem' }}>
          {STATS.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        {/* Activity + Flagged */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Card>
            <CardHeader title="Recent Activity" />
            {ACTIVITY.map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                padding: '9px 20px', borderBottom: i < ACTIVITY.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: item.color, marginTop: 5, flexShrink: 0,
                }} />
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>{item.text}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{item.time}</div>
                </div>
              </div>
            ))}
          </Card>

          <Card>
            <CardHeader title="Flagged Reviews — Needs Attention" />
            {FLAGGED.map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 20px', borderBottom: i < FLAGGED.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: 'var(--text)', marginBottom: 2 }}>{item.location}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>{timeAgo(item.age)}</div>
                </div>
                <span style={{
                  background: 'var(--danger-bg)', color: 'var(--danger)',
                  fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 20,
                }}>
                  {item.flags} flags
                </span>
                <span style={{
                  background: item.rating >= 4 ? 'var(--warning-bg)' : 'var(--surface2)',
                  color: item.rating >= 4 ? 'var(--warning)' : 'var(--text3)',
                  fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 20,
                }}>
                  {item.rating} ★
                </span>
              </div>
            ))}
          </Card>
        </div>

      </main>
    </>
  );
}
