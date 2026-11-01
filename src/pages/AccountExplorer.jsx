import React, { useState, useMemo } from 'react';
import {
  Search,
  Fingerprint,
  ChevronRight,
  ChevronLeft,
  Shield,
  ArrowRight,
  SlidersHorizontal,
  Filter
} from 'lucide-react';

const ACCOUNTS_DATA = [
  {
    id: 'a91f7c2e9b8841fd',
    events: 1868,
    repos: 1,
    activeHours: '100%',
    activeFraction: 1.0,
    score: 0.820,
    cluster: 'C2',
    clusterId: 2,
    block: 'block-a',
    isAnomaly: true,
  },
  {
    id: 'f82b9d1a3c77102e',
    events: 566,
    repos: 1,
    activeHours: '98.7%',
    activeFraction: 0.987,
    score: 0.781,
    cluster: 'C1',
    clusterId: 1,
    block: 'block-a',
    isAnomaly: true,
  },
  {
    id: 'b31e4f9011deaa54',
    events: 151,
    repos: 19,
    activeHours: '56.3%',
    activeFraction: 0.563,
    score: 0.690,
    cluster: 'C3',
    clusterId: 3,
    block: 'block-b',
    isAnomaly: true,
  },
  {
    id: 'c7d2a6e144fe9821',
    events: 438,
    repos: 2,
    activeHours: '94.1%',
    activeFraction: 0.941,
    score: 0.677,
    cluster: 'C2',
    clusterId: 2,
    block: 'block-a',
    isAnomaly: true,
  },
  {
    id: 'e4a0b9c87890bc11',
    events: 1204,
    repos: 1,
    activeHours: '100%',
    activeFraction: 1.0,
    score: 0.671,
    cluster: 'C0',
    clusterId: 0,
    block: 'block-b',
    isAnomaly: true,
  },
  {
    id: '78ab31df5512ae30',
    events: 892,
    repos: 3,
    activeHours: '88.4%',
    activeFraction: 0.884,
    score: 0.612,
    cluster: 'C1',
    clusterId: 1,
    block: 'block-a',
    isAnomaly: true,
  },
  {
    id: '45e2c90a12bb56fa',
    events: 2410,
    repos: 1,
    activeHours: '99.2%',
    activeFraction: 0.992,
    score: 0.742,
    cluster: 'C2',
    clusterId: 2,
    block: 'block-b',
    isAnomaly: true,
  },
  {
    id: '9012f84b67ddcc89',
    events: 320,
    repos: 5,
    activeHours: '42.1%',
    activeFraction: 0.421,
    score: 0.548,
    cluster: 'C3',
    clusterId: 3,
    block: 'block-a',
    isAnomaly: false,
  },
  {
    id: '12a9bc44ef338901',
    events: 98,
    repos: 14,
    activeHours: '21.0%',
    activeFraction: 0.21,
    score: 0.412,
    cluster: 'C3',
    clusterId: 3,
    block: 'block-b',
    isAnomaly: false,
  },
  {
    id: '67f082ed990145ef',
    events: 645,
    repos: 4,
    activeHours: '76.8%',
    activeFraction: 0.768,
    score: 0.518,
    cluster: 'C1',
    clusterId: 1,
    block: 'block-a',
    isAnomaly: false,
  },
  {
    id: '34bc90fa1288cd76',
    events: 42,
    repos: 2,
    activeHours: '14.5%',
    activeFraction: 0.145,
    score: 0.384,
    cluster: 'C1',
    clusterId: 1,
    block: 'block-a',
    isAnomaly: false,
  },
  {
    id: '55df81ac9833ee22',
    events: 78,
    repos: 6,
    activeHours: '32.1%',
    activeFraction: 0.321,
    score: 0.435,
    cluster: 'C5',
    clusterId: 5,
    block: 'block-b',
    isAnomaly: false,
  },
];

export default function AccountExplorer({ onOpenAnalyzeModal }) {
  const [search, setSearch] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('all');
  const [selectedCluster, setSelectedCluster] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter accounts
  const filteredAccounts = useMemo(() => {
    return ACCOUNTS_DATA.filter((acc) => {
      // Search by ID
      if (search && !acc.id.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      // Block
      if (selectedBlock !== 'all' && acc.block !== selectedBlock) {
        return false;
      }
      // Cluster
      if (selectedCluster !== 'all' && acc.cluster.toLowerCase() !== selectedCluster.toLowerCase()) {
        return false;
      }
      // Status
      if (selectedStatus === 'anomaly' && !acc.isAnomaly) {
        return false;
      }
      if (selectedStatus === 'normal' && acc.isAnomaly) {
        return false;
      }
      return true;
    });
  }, [search, selectedBlock, selectedCluster, selectedStatus]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredAccounts.length / itemsPerPage));
  const paginatedAccounts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAccounts.slice(start, start + itemsPerPage);
  }, [filteredAccounts, currentPage, itemsPerPage]);

  return (
    <div className="w-full max-w-[1440px] px-4 sm:px-margin py-margin flex flex-col gap-space-lg mx-auto">
      {/* Header Section */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
        <div className="flex flex-col gap-space-xs">
          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-semibold">
            Account Explorer
          </h1>
          <p className="font-body-md text-body-md text-secondary">
            Browse and filter accounts based on behavioral features and anomaly scores across observation blocks.
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-space-sm">
          <button
            onClick={onOpenAnalyzeModal}
            className="inline-flex items-center gap-space-xs bg-primary text-on-primary hover:bg-primary-container px-3.5 py-1.5 rounded-lg font-label-md text-label-md transition-all shadow-sm active:scale-95"
            type="button"
          >
            <span>Analyze an account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Filters & Query Bar */}
      <section className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-md">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[280px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search account ID (e.g. a91f, c7d2)..."
            className="w-full bg-surface-container-lowest text-on-surface font-code-md text-code-md pl-9 pr-3.5 py-2 rounded-lg outline-none border border-border-subtle focus:border-primary/50 transition-colors shadow-2xs"
          />
        </div>

        {/* Dropdown Selectors */}
        <div className="flex flex-wrap items-center gap-space-sm">
          {/* Block Selector */}
          <div className="relative inline-block">
            <select
              value={selectedBlock}
              onChange={(e) => {
                setSelectedBlock(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none bg-surface-container-lowest hover:bg-surface-hover text-on-surface font-label-md text-label-md py-2 pl-3.5 pr-8 rounded-lg outline-none border border-border-subtle cursor-pointer transition-colors shadow-2xs"
            >
              <option value="all">Block: All</option>
              <option value="block-a">Block: Block A</option>
              <option value="block-b">Block: Block B</option>
            </select>
            <SlidersHorizontal className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-secondary" />
          </div>

          {/* Cluster Selector */}
          <div className="relative inline-block">
            <select
              value={selectedCluster}
              onChange={(e) => {
                setSelectedCluster(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none bg-surface-container-lowest hover:bg-surface-hover text-on-surface font-label-md text-label-md py-2 pl-3.5 pr-8 rounded-lg outline-none border border-border-subtle cursor-pointer transition-colors shadow-2xs"
            >
              <option value="all">Cluster: All</option>
              <option value="c0">Cluster: C0 (Burst Push)</option>
              <option value="c1">Cluster: C1 (Moderate Push)</option>
              <option value="c2">Cluster: C2 (Multi-repo Push)</option>
              <option value="c3">Cluster: C3 (Automated CI)</option>
              <option value="c5">Cluster: C5 (Push & Create)</option>
            </select>
            <Filter className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-secondary" />
          </div>

          {/* Status Filter */}
          <div className="relative inline-block">
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none bg-surface-container-lowest hover:bg-surface-hover text-on-surface font-label-md text-label-md py-2 pl-3.5 pr-8 rounded-lg outline-none border border-border-subtle cursor-pointer transition-colors shadow-2xs"
            >
              <option value="all">Status: All</option>
              <option value="anomaly">Anomaly candidate (≥ 0.5514)</option>
              <option value="normal">Normal behavior</option>
            </select>
            <Shield className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-secondary" />
          </div>
        </div>
      </section>

      {/* Data Table Container */}
      <section className="w-full bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm border border-border-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-muted text-secondary font-label-md text-label-md select-none border-b border-border-subtle">
                <th className="py-3 px-4 uppercase tracking-wider font-semibold" scope="col">
                  Account ID
                </th>
                <th className="py-3 px-4 uppercase tracking-wider font-semibold text-right" scope="col">
                  Events
                </th>
                <th className="py-3 px-4 uppercase tracking-wider font-semibold text-right" scope="col">
                  Repositories
                </th>
                <th className="py-3 px-4 uppercase tracking-wider font-semibold text-right" scope="col">
                  Active Hours
                </th>
                <th className="py-3 px-4 uppercase tracking-wider font-semibold text-right" scope="col">
                  Anomaly Score
                </th>
                <th className="py-3 px-4 uppercase tracking-wider font-semibold text-center" scope="col">
                  Cluster
                </th>
                <th className="py-3 px-4 uppercase tracking-wider font-semibold text-right w-12" scope="col">
                  <span className="sr-only">Inspect</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/50 text-on-surface font-body-sm text-body-sm">
              {paginatedAccounts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-secondary">
                    No matching accounts found for the selected query filters.
                  </td>
                </tr>
              ) : (
                paginatedAccounts.map((account) => (
                  <tr
                    key={account.id}
                    onClick={onOpenAnalyzeModal}
                    className="hover:bg-surface-hover/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4 font-code-md text-code-md text-on-surface">
                      <div className="flex items-center gap-space-xs">
                        <Fingerprint className="w-4 h-4 text-secondary shrink-0" />
                        <span className="font-medium">{account.id.slice(0, 8)}...</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-code-md text-code-md text-right tabular-nums">
                      {account.events.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-code-md text-code-md text-right tabular-nums">
                      {account.repos}
                    </td>
                    <td className="py-3 px-4 font-code-md text-code-md text-right tabular-nums">
                      {account.activeHours}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`inline-flex items-center font-code-md text-code-md font-semibold px-2 py-0.5 rounded ${
                          account.isAnomaly
                            ? 'text-accent-anomaly bg-rose-50 border border-rose-200'
                            : 'text-on-surface bg-surface-container'
                        }`}
                      >
                        {account.score.toFixed(3)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center justify-center font-code-sm text-code-sm font-medium px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
                        {account.cluster}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <ChevronRight className="w-4 h-4 text-secondary group-hover:text-primary transition-colors inline-block" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Toolbar */}
        <div className="px-4 py-3 bg-surface-container-lowest border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-space-sm select-none">
          <div className="font-body-sm text-body-sm text-secondary">
            Showing{' '}
            <span className="font-medium text-on-surface">
              {filteredAccounts.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}–
              {Math.min(currentPage * itemsPerPage, filteredAccounts.length)}
            </span>{' '}
            of <span className="font-medium text-on-surface">{filteredAccounts.length}</span> accounts
          </div>

          <nav aria-label="Pagination Navigation" className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-secondary hover:bg-surface-hover hover:text-on-surface transition-colors disabled:opacity-30 disabled:pointer-events-none"
              type="button"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }).map((_, idx) => {
              const page = idx + 1;
              const isCurrent = page === currentPage;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg font-label-md text-label-md transition-colors ${
                    isCurrent
                      ? 'bg-primary text-on-primary font-semibold'
                      : 'text-on-surface-variant hover:bg-surface-hover hover:text-on-surface'
                  }`}
                  type="button"
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-secondary hover:bg-surface-hover hover:text-on-surface transition-colors disabled:opacity-30 disabled:pointer-events-none"
              type="button"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </nav>
        </div>
      </section>

      {/* Bottom Disclaimer & Methodology note */}
      <footer className="pt-space-xs flex items-center gap-space-sm text-secondary">
        <Shield className="w-4 h-4 shrink-0 text-secondary" />
        <p className="font-body-sm text-body-sm text-secondary">
          Account IDs are pseudonymized for privacy preservation. Unobserved accounts outside the 152-hour window are excluded.
        </p>
      </footer>
    </div>
  );
}
