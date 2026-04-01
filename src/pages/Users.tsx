import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Topbar } from '@/components/layout/Topbar';
import { Card } from '@/components/ui/Card';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal, ConfirmDialog } from '@/components/ui/Modal';
import { SearchInput } from '@/components/shared/SearchInput';
import { formatTrustWeight, formatDate } from '@/utils/formatters';
import * as api from '@/api';
import { useAuth } from '@/context/AuthContext';
import type { User, UserRole, UserType } from '@/types/review';

const ROLES: UserRole[] = ['User', 'Moderator', 'Admin', 'SuperAdmin'];
const USER_TYPES: UserType[] = ['Unknown', 'Traveler', 'Trucker', 'CityDriver', 'Owner'];

const fieldStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 4 };
const labelStyle: React.CSSProperties = { fontSize: 12, color: 'var(--text2)', fontWeight: 500 };
const inputStyle: React.CSSProperties = {
  fontSize: 13, padding: '7px 10px', borderRadius: 'var(--radius)',
  border: '1px solid var(--border)', background: 'var(--surface2)',
  color: 'var(--text)', outline: 'none', width: '100%', boxSizing: 'border-box',
};

// ── Create User Modal ─────────────────────────────────────────────────────────

interface CreateModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { email: string; password: string; username: string; role: UserRole; userType: UserType }) => void;
  saving: boolean;
}

function CreateUserModal({ open, onClose, onSave, saving }: CreateModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<UserRole>('User');
  const [userType, setUserType] = useState<UserType>('Unknown');

  function handleSave() {
    if (!email || !password) return;
    onSave({ email, password, username, role, userType });
  }

  function handleClose() {
    setEmail(''); setPassword(''); setUsername(''); setRole('User'); setUserType('Unknown');
    onClose();
  }

  return (
    <Modal
      title="Create User"
      open={open}
      onClose={handleClose}
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={handleClose}>Cancel</Button>
          <Button variant="primary" size="sm" onClick={handleSave} disabled={!email || !password || saving}>
            {saving ? 'Creating…' : 'Create User'}
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={fieldStyle}>
          <label style={labelStyle}>Email *</label>
          <input style={inputStyle} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@example.com" />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Password *</label>
          <input style={inputStyle} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 8 characters" />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Username</label>
          <input style={inputStyle} type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Optional" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Role</label>
            <select style={inputStyle} value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>User Type</label>
            <select style={inputStyle} value={userType} onChange={(e) => setUserType(e.target.value as UserType)}>
              {USER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </div>
    </Modal>
  );
}

// ── Edit User Modal ───────────────────────────────────────────────────────────

interface EditModalProps {
  user: User | null;
  onClose: () => void;
  onSave: (id: string, data: { username: string; email: string; phone: string; role: UserRole; userType: UserType; trustWeight: number }) => void;
  saving: boolean;
}

function EditUserModal({ user, onClose, onSave, saving }: EditModalProps) {
  const [username, setUsername] = useState(user?.username ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [role, setRole] = useState<UserRole>(user?.role ?? 'User');
  const [userType, setUserType] = useState<UserType>(user?.userType ?? 'Unknown');
  const [trustWeight, setTrustWeight] = useState(String(user?.trustWeight ?? 1));

  if (!user) return null;

  return (
    <Modal
      title="Edit User"
      open={!!user}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
          <Button
            variant="primary" size="sm" disabled={saving}
            onClick={() => onSave(user.id, { username, email, phone, role, userType, trustWeight: parseFloat(trustWeight) || 1 })}
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={fieldStyle}>
          <label style={labelStyle}>Username</label>
          <input style={inputStyle} type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Optional" />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Email</label>
          <input style={inputStyle} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Phone</label>
          <input style={inputStyle} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="E.164 format, e.g. +12125551234" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Role</label>
            <select style={inputStyle} value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>User Type</label>
            <select style={inputStyle} value={userType} onChange={(e) => setUserType(e.target.value as UserType)}>
              {USER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Trust Weight</label>
          <input style={inputStyle} type="number" step="0.1" min="0" max="5" value={trustWeight} onChange={(e) => setTrustWeight(e.target.value)} />
        </div>
      </div>
    </Modal>
  );
}

// ── Reset Password Modal ──────────────────────────────────────────────────────

interface ResetPwdModalProps {
  user: User | null;
  onClose: () => void;
  onSave: (id: string, password: string) => void;
  saving: boolean;
}

function ResetPasswordModal({ user, onClose, onSave, saving }: ResetPwdModalProps) {
  const [password, setPassword] = useState('');

  if (!user) return null;

  function handleClose() { setPassword(''); onClose(); }

  return (
    <Modal
      title="Reset Password"
      open={!!user}
      onClose={handleClose}
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={handleClose}>Cancel</Button>
          <Button variant="danger" size="sm" disabled={!password || saving} onClick={() => onSave(user.id, password)}>
            {saving ? 'Resetting…' : 'Reset Password'}
          </Button>
        </>
      }
    >
      <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 14 }}>
        Set a new password for <strong style={{ color: 'var(--text)' }}>{user.username ?? user.email ?? 'this user'}</strong>.
      </p>
      <div style={fieldStyle}>
        <label style={labelStyle}>New Password</label>
        <input style={inputStyle} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 8 characters" />
      </div>
    </Modal>
  );
}

// ── Reviews Modal ─────────────────────────────────────────────────────────────

interface ReviewsModalProps {
  user: User | null;
  onClose: () => void;
}

function ReviewsModal({ user, onClose }: ReviewsModalProps) {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['user-reviews', user?.id, page],
    queryFn: () => api.getUserReviews(user!.id, { page, pageSize: 10 }),
    enabled: !!user,
  });

  if (!user) return null;

  const reviews = data?.items ?? [];
  const total = data?.total ?? 0;

  return (
    <Modal title={`Reviews — ${user.username ?? user.email ?? 'User'}`} open={!!user} onClose={onClose} width={640}>
      {isLoading ? (
        <p style={{ fontSize: 13, color: 'var(--text2)', textAlign: 'center', padding: 20 }}>Loading…</p>
      ) : reviews.length === 0 ? (
        <p style={{ fontSize: 13, color: 'var(--text2)', textAlign: 'center', padding: 20 }}>No reviews yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr',
            padding: '6px 0', borderBottom: '1px solid var(--border)',
            fontSize: 11, color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em',
          }}>
            <span>Date</span>
            <span style={{ textAlign: 'center' }}>Overall</span>
            <span style={{ textAlign: 'center' }}>Clean</span>
            <span style={{ textAlign: 'center' }}>Smell</span>
            <span style={{ textAlign: 'center' }}>Supplies</span>
            <span style={{ textAlign: 'center' }}>Votes</span>
          </div>
          {reviews.map((r: any) => (
            <div key={r.id} style={{
              display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr',
              padding: '8px 0', borderBottom: '1px solid var(--border)',
              fontSize: 12, color: 'var(--text2)',
            }}>
              <span>{formatDate(r.createdAt)}</span>
              <span style={{ textAlign: 'center', color: 'var(--text)', fontWeight: 500 }}>{r.overall}/5</span>
              <span style={{ textAlign: 'center' }}>{r.cleanliness}/5</span>
              <span style={{ textAlign: 'center' }}>{r.smell}/5</span>
              <span style={{ textAlign: 'center' }}>{r.supplies}/5</span>
              <span style={{ textAlign: 'center' }}>{r.helpfulVotes}</span>
            </div>
          ))}
          {total > 10 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, fontSize: 12, color: 'var(--text2)' }}>
              <span>Page {page} of {Math.ceil(total / 10)}</span>
              <div style={{ display: 'flex', gap: 6 }}>
                <Button size="sm" variant="secondary" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
                <Button size="sm" variant="secondary" disabled={page >= Math.ceil(total / 10)} onClick={() => setPage(p => p + 1)}>Next</Button>
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}

// ── Actions Dropdown ──────────────────────────────────────────────────────────

interface ActionsMenuProps {
  user: User;
  open: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onResetPwd: () => void;
  onRevoke: () => void;
  onDeactivate: () => void;
  onReactivate: () => void;
  onDelete: () => void;
  onReviews: () => void;
}

function ActionsMenu({ user, open, onToggle, onEdit, onResetPwd, onRevoke, onDeactivate, onReactivate, onDelete, onReviews }: ActionsMenuProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; right: number } | null>(null);

  const menuItemStyle: React.CSSProperties = {
    display: 'block', width: '100%', textAlign: 'left', padding: '7px 14px',
    fontSize: 13, background: 'none', border: 'none', cursor: 'pointer',
    color: 'var(--text)', whiteSpace: 'nowrap',
  };

  function handleToggle() {
    if (!open && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
    }
    onToggle();
  }

  function action(fn: () => void) {
    return () => { onToggle(); fn(); };
  }

  return (
    <div ref={containerRef} style={{ display: 'inline-block' }}>
      <Button size="sm" variant="ghost" onClick={handleToggle}>•••</Button>
      {open && pos && (
        <div style={{
          position: 'fixed', top: pos.top, right: pos.right, zIndex: 1001,
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          minWidth: 160, padding: '4px 0',
        }}>
          <button style={menuItemStyle} onClick={action(onEdit)}>Edit</button>
          <button style={menuItemStyle} onClick={action(onReviews)}>View Reviews ({user.reviewCount})</button>
          <button style={menuItemStyle} onClick={action(onResetPwd)}>Reset Password</button>
          <button style={menuItemStyle} onClick={action(onRevoke)}>Revoke Sessions</button>
          <div style={{ borderTop: '1px solid var(--border)', margin: '4px 0' }} />
          {user.isActive
            ? <button style={menuItemStyle} onClick={action(onDeactivate)}>Deactivate</button>
            : <button style={menuItemStyle} onClick={action(onReactivate)}>Reactivate</button>
          }
          <button style={{ ...menuItemStyle, color: 'var(--danger)' }} onClick={action(onDelete)}>Delete</button>
        </div>
      )}
    </div>
  );
}

// ── Users Page ────────────────────────────────────────────────────────────────

export default function Users() {
  const qc = useQueryClient();
  const { user: currentUser, logout } = useAuth();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [menuId, setMenuId] = useState<string | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [resetPwdUser, setResetPwdUser] = useState<User | null>(null);
  const [reviewsUser, setReviewsUser] = useState<User | null>(null);
  const [deactivateId, setDeactivateId] = useState<string | null>(null);
  const [reactivateId, setReactivateId] = useState<string | null>(null);
  const [revokeId, setRevokeId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin-users'] });

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', page, search],
    queryFn: () => api.getUsers({ page, pageSize: 20, search }),
  });

  const createMutation = useMutation({
    mutationFn: (d: Parameters<typeof api.createUser>[0]) => api.createUser(d),
    onSuccess: () => { invalidate(); setCreateOpen(false); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof api.updateUser>[1] }) => api.updateUser(id, data),
    onSuccess: () => { invalidate(); setEditUser(null); },
  });

  const resetPwdMutation = useMutation({
    mutationFn: ({ id, password }: { id: string; password: string }) => api.resetUserPassword(id, password),
    onSuccess: () => setResetPwdUser(null),
  });

  const deactivateMutation = useMutation({
    mutationFn: (id: string) => api.deactivateUser(id),
    onSuccess: (_, id) => {
      setDeactivateId(null);
      if (id === currentUser?.userId) { logout(); return; }
      invalidate();
    },
  });

  const reactivateMutation = useMutation({
    mutationFn: (id: string) => api.reactivateUser(id),
    onSuccess: () => { invalidate(); setReactivateId(null); },
  });

  const revokeMutation = useMutation({
    mutationFn: (id: string) => api.revokeUserSessions(id),
    onSuccess: (_, id) => {
      setRevokeId(null);
      if (id === currentUser?.userId) logout();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteUser(id),
    onSuccess: () => { invalidate(); setDeleteId(null); },
  });

  const users = data?.items ?? [];
  const total = data?.total ?? 0;

  const columns: Column<User>[] = [
    {
      key: 'identity', header: 'User',
      render: (row) => (
        <div>
          <div style={{ color: 'var(--text)', fontWeight: 500, fontSize: 13 }}>
            {row.username ?? row.email ?? row.phone ?? 'Anonymous'}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text2)' }}>{row.email ?? row.phone ?? ''}</div>
        </div>
      ),
    },
    {
      key: 'phone', header: 'Phone', width: 130,
      render: (row) => <span style={{ fontSize: 12, color: 'var(--text2)' }}>{row.phone ?? '—'}</span>,
    },
    {
      key: 'status', header: 'Status', width: 80,
      render: (row) => <Badge variant={row.isActive ? 'green' : 'red'}>{row.isActive ? 'Active' : 'Inactive'}</Badge>,
    },
    {
      key: 'role', header: 'Role', width: 140,
      render: (row) => (
        <select
          value={row.role}
          onChange={(e) => updateMutation.mutate({ id: row.id, data: { role: e.target.value as UserRole } })}
          style={{
            fontSize: 12, padding: '3px 6px', borderRadius: 'var(--radius)',
            border: '1px solid var(--border)', background: 'var(--surface2)',
            color: 'var(--text)', cursor: 'pointer',
          }}
        >
          {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      ),
    },
    {
      key: 'type', header: 'Type', width: 100,
      render: (row) => <span style={{ fontSize: 12, color: 'var(--text2)' }}>{row.userType}</span>,
    },
    {
      key: 'trust', header: 'Trust', width: 70,
      render: (row) => (
        <span style={{
          fontSize: 12, fontWeight: 500,
          color: row.trustWeight >= 1.5 ? 'var(--accent)' : row.trustWeight < 0.8 ? 'var(--danger)' : 'var(--text2)',
        }}>
          {formatTrustWeight(row.trustWeight)}
        </span>
      ),
    },
    {
      key: 'reviews', header: 'Reviews', width: 74,
      render: (row) => <span style={{ fontSize: 12, color: 'var(--text2)' }}>{row.reviewCount}</span>,
    },
    {
      key: 'joined', header: 'Joined', width: 100,
      render: (row) => <span style={{ fontSize: 12, color: 'var(--text2)' }}>{formatDate(row.createdAt)}</span>,
    },
    {
      key: 'actions', header: '', width: 60,
      render: (row) => (
        <ActionsMenu
          user={row}
          open={menuId === row.id}
          onToggle={() => setMenuId(menuId === row.id ? null : row.id)}
          onEdit={() => setEditUser(row)}
          onResetPwd={() => setResetPwdUser(row)}
          onRevoke={() => setRevokeId(row.id)}
          onDeactivate={() => setDeactivateId(row.id)}
          onReactivate={() => setReactivateId(row.id)}
          onDelete={() => setDeleteId(row.id)}
          onReviews={() => setReviewsUser(row)}
        />
      ),
    },
  ];

  return (
    <>
      {menuId && <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setMenuId(null)} />}

      <Topbar
        title="Users"
        actions={<Button size="sm" variant="primary" onClick={() => setCreateOpen(true)}>+ New User</Button>}
      />

      <main style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', padding: '12px 20px', borderBottom: '1px solid var(--border)', gap: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>
              All Users ({isLoading ? '…' : total})
            </span>
            <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search users..." />
          </div>
          <DataTable
            columns={columns}
            rows={users}
            rowKey={(r) => r.id}
            loading={isLoading}
            page={page}
            pageSize={20}
            total={total}
            onPageChange={setPage}
          />
        </Card>
      </main>

      <CreateUserModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSave={(d) => createMutation.mutate(d)}
        saving={createMutation.isPending}
      />

      <EditUserModal
        key={editUser?.id}
        user={editUser}
        onClose={() => setEditUser(null)}
        onSave={(id, d) => updateMutation.mutate({ id, data: d })}
        saving={updateMutation.isPending}
      />

      <ResetPasswordModal
        user={resetPwdUser}
        onClose={() => setResetPwdUser(null)}
        onSave={(id, password) => resetPwdMutation.mutate({ id, password })}
        saving={resetPwdMutation.isPending}
      />

      <ReviewsModal user={reviewsUser} onClose={() => setReviewsUser(null)} />

      <ConfirmDialog
        open={!!revokeId}
        title="Revoke Sessions"
        message="All active sessions for this user will be invalidated. They will need to log in again."
        confirmLabel="Revoke"
        onConfirm={() => revokeId && revokeMutation.mutate(revokeId)}
        onCancel={() => setRevokeId(null)}
      />

      <ConfirmDialog
        open={!!deactivateId}
        title="Deactivate User"
        message="This account will be deactivated and all active sessions revoked. The user cannot log in until reactivated."
        confirmLabel="Deactivate"
        danger
        onConfirm={() => deactivateId && deactivateMutation.mutate(deactivateId)}
        onCancel={() => setDeactivateId(null)}
      />

      <ConfirmDialog
        open={!!reactivateId}
        title="Reactivate User"
        message="This will restore access for the account. The user will be able to log in again."
        confirmLabel="Reactivate"
        onConfirm={() => reactivateId && reactivateMutation.mutate(reactivateId)}
        onCancel={() => setReactivateId(null)}
      />

      <ConfirmDialog
        open={!!deleteId}
        title="Delete User"
        message="This will permanently delete the user and all associated data. This cannot be undone."
        confirmLabel="Delete"
        danger
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
