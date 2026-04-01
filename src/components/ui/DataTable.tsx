import type { ReactNode } from 'react';

export interface Column<T> {
  key: string;
  header: string;
  width?: string | number;
  render: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  emptyMessage?: string;
  loading?: boolean;
  page?: number;
  pageSize?: number;
  total?: number;
  onPageChange?: (page: number) => void;
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  emptyMessage = 'No results found.',
  loading = false,
  page,
  pageSize,
  total,
  onPageChange,
}: DataTableProps<T>) {
  const showPagination = onPageChange && total !== undefined && pageSize !== undefined && page !== undefined;
  const totalPages = showPagination ? Math.ceil(total! / pageSize!) : 1;

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  textAlign: 'left',
                  padding: '9px 20px',
                  fontSize: 10,
                  fontWeight: 600,
                  color: 'var(--text3)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  borderBottom: '1px solid var(--border)',
                  background: 'var(--surface2)',
                  width: col.width,
                  whiteSpace: 'nowrap',
                }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{ padding: '2rem', textAlign: 'center', color: 'var(--text3)', fontSize: 13 }}
              >
                Loading...
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{ padding: '2rem', textAlign: 'center', color: 'var(--text3)', fontSize: 13 }}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={rowKey(row)}
                style={{ transition: 'background var(--transition)' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface2)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    style={{
                      padding: '10px 20px',
                      borderBottom: '1px solid var(--border)',
                      color: 'var(--text2)',
                      verticalAlign: 'middle',
                    }}
                  >
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {showPagination && totalPages > 1 && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          gap: 8, padding: '10px 20px', borderTop: '1px solid var(--border)',
          fontSize: 12, color: 'var(--text2)',
        }}>
          <button
            onClick={() => onPageChange!(page! - 1)}
            disabled={page === 1}
            style={{
              padding: '4px 10px', borderRadius: 'var(--radius)',
              border: '1px solid var(--border)', background: 'var(--surface2)',
              color: 'var(--text)', cursor: page === 1 ? 'not-allowed' : 'pointer',
              opacity: page === 1 ? 0.4 : 1,
            }}
          >←</button>
          <span>Page {page} of {totalPages}</span>
          <button
            onClick={() => onPageChange!(page! + 1)}
            disabled={page === totalPages}
            style={{
              padding: '4px 10px', borderRadius: 'var(--radius)',
              border: '1px solid var(--border)', background: 'var(--surface2)',
              color: 'var(--text)', cursor: page === totalPages ? 'not-allowed' : 'pointer',
              opacity: page === totalPages ? 0.4 : 1,
            }}
          >→</button>
        </div>
      )}
    </div>
  );
}
