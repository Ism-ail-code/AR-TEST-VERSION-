import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { demoProducts, departments, departmentKeys, rooms as roomNames } from '@/data/products';
import { ProductCard } from '@/components/ui/ProductCard';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { Search, SlidersHorizontal, Grid3X3, List, X, Package } from 'lucide-react';

export function ProductCatalog() {
  useDocumentTitle('Products');
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedDept, setSelectedDept] = useState(searchParams.get('dept') || 'All');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedRoom, setSelectedRoom] = useState(searchParams.get('room') || 'All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Sync URL params on mount / navigation
  useEffect(() => {
    setSelectedDept(searchParams.get('dept') ?? 'All');
    setSelectedCategory(searchParams.get('category') ?? 'All');
    setSelectedRoom(searchParams.get('room') ?? 'All');
    const q = searchParams.get('search');
    if (q) setSearch(q);
  }, [searchParams]);

  const allCategories = ['All', ...new Set(demoProducts.map((p) => p.category))];
  const allRooms = [
    'All',
    ...roomNames.filter(
      (r) => !departmentKeys.includes(r) && demoProducts.some((p) => p.rooms.includes(r)),
    ),
  ];

  let filtered = demoProducts.filter((product) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      product.name.toLowerCase().includes(q) ||
      product.shortDescription.toLowerCase().includes(q) ||
      product.material.toLowerCase().includes(q) ||
      product.category.toLowerCase().includes(q) ||
      product.tags.some((t) => t.toLowerCase().includes(q));
    const matchesDept = selectedDept === 'All' || product.rooms.includes(selectedDept);
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesRoom = selectedRoom === 'All' || product.rooms.includes(selectedRoom);
    return matchesSearch && matchesDept && matchesCategory && matchesRoom;
  });

  if (sortBy === 'price-asc') filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sortBy === 'price-desc') filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sortBy === 'rating') filtered = [...filtered].sort((a, b) => b.rating - a.rating);

  /** Writes one filter into the URL — the single source of truth for the view. */
  const setFilter = (key: 'dept' | 'category' | 'room', value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === 'All') params.delete(key);
    else params.set(key, value);
    setSearchParams(params, { replace: true });
  };

  const handleDeptChange = (dept: string) => {
    setSelectedDept(dept);
    setFilter('dept', dept);
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setFilter('category', cat);
  };

  const handleRoomChange = (room: string) => {
    setSelectedRoom(room);
    setFilter('room', room);
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedDept('All');
    setSelectedCategory('All');
    setSelectedRoom('All');
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  const heading =
    selectedDept !== 'All'
      ? departments.find((d) => d.key === selectedDept)?.label ?? selectedDept
      : selectedRoom !== 'All'
        ? selectedRoom
        : selectedCategory !== 'All'
          ? selectedCategory
          : 'Shop';
  const hasFilters =
    Boolean(search) ||
    selectedDept !== 'All' ||
    selectedCategory !== 'All' ||
    selectedRoom !== 'All';

  return (
    <div className="container-page py-8 sm:py-10 lg:py-12">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Shop', href: '/products' },
          ...(hasFilters ? [{ label: heading }] : []),
        ]}
        className="mb-6"
      />

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-brand-900 tracking-tight">{heading}</h1>
          <p className="text-sm text-brand-500 mt-1.5">
            {filtered.length} {filtered.length === 1 ? 'product' : 'products'} &middot; free
            shipping over $500
          </p>
        </div>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
          <input
            type="text"
            placeholder="Search by name, material, or style..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-white border border-brand-200/60 rounded-xl text-sm text-brand-900 placeholder:text-brand-400 focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-400 transition-all shadow-xs"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-brand-400 hover:text-brand-700 hover:bg-brand-100 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-brand-400 hidden sm:block" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="h-12 px-4 bg-white border border-brand-200/60 rounded-xl text-sm text-brand-700 focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-400 transition-all"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>

          {/* View toggle */}
          <div className="hidden sm:flex items-center bg-white border border-brand-200/60 rounded-xl overflow-hidden h-12">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 h-full transition-colors ${viewMode === 'grid' ? 'bg-brand-900 text-white' : 'text-brand-400 hover:text-brand-700'}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <div className="w-px h-5 bg-brand-200" />
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 h-full transition-colors ${viewMode === 'list' ? 'bg-brand-900 text-white' : 'text-brand-400 hover:text-brand-700'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Store departments */}
      <div className="flex gap-2 mb-3 overflow-x-auto pb-1 -mx-1 px-1">
        {['All', ...departments.map((d) => d.label)].map((label) => {
          const key = label === 'All' ? 'All' : departments.find((d) => d.label === label)!.key;
          return (
            <button
              key={label}
              onClick={() => handleDeptChange(key)}
              className={`px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedDept === key
                  ? 'bg-accent-500 text-white shadow-sm'
                  : 'bg-white border border-brand-200/60 text-brand-600 hover:border-accent-300 hover:text-accent-700'
              }`}
            >
              {label === 'All' ? 'All departments' : label}
            </button>
          );
        })}
      </div>

      {/* Room departments */}
      <div className="flex gap-2 mb-3 overflow-x-auto pb-1 -mx-1 px-1">
        {allRooms.map((room) => (
          <button
            key={room}
            onClick={() => handleRoomChange(room)}
            className={`px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              selectedRoom === room
                ? 'bg-accent-500 text-white shadow-sm'
                : 'bg-white border border-brand-200/60 text-brand-600 hover:border-accent-300 hover:text-accent-700'
            }`}
          >
            {room === 'All' ? 'All rooms' : room}
          </button>
        ))}
      </div>

      {/* Category pills */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-1 -mx-1 px-1">
        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-brand-900 text-white shadow-sm'
                : 'bg-white border border-brand-200/60 text-brand-600 hover:border-brand-400 hover:text-brand-900'
            }`}
          >
            {cat === 'All' ? 'All products' : cat}
          </button>
        ))}
      </div>

      {/* Active filters indicator */}
      {hasFilters && (
        <div className="flex items-center gap-2 mb-6 text-sm flex-wrap">
          <span className="text-brand-500">Filters:</span>
          {search && (
            <span className="inline-flex items-center gap-1.5 bg-accent-50 text-accent-700 px-2.5 py-1 rounded-lg font-medium">
              &ldquo;{search}&rdquo;
              <button onClick={() => setSearch('')} className="hover:text-accent-900"><X className="w-3 h-3" /></button>
            </span>
          )}
          {selectedDept !== 'All' && (
            <span className="inline-flex items-center gap-1.5 bg-accent-50 text-accent-700 px-2.5 py-1 rounded-lg font-medium">
              {departments.find((d) => d.key === selectedDept)?.label ?? selectedDept}
              <button onClick={() => handleDeptChange('All')} className="hover:text-accent-900"><X className="w-3 h-3" /></button>
            </span>
          )}
          {selectedRoom !== 'All' && (
            <span className="inline-flex items-center gap-1.5 bg-accent-50 text-accent-700 px-2.5 py-1 rounded-lg font-medium">
              {selectedRoom}
              <button onClick={() => handleRoomChange('All')} className="hover:text-accent-900"><X className="w-3 h-3" /></button>
            </span>
          )}
          {selectedCategory !== 'All' && (
            <span className="inline-flex items-center gap-1.5 bg-accent-50 text-accent-700 px-2.5 py-1 rounded-lg font-medium">
              {selectedCategory}
              <button onClick={() => handleCategoryChange('All')} className="hover:text-accent-900"><X className="w-3 h-3" /></button>
            </span>
          )}
          <button
            onClick={clearFilters}
            className="text-brand-400 hover:text-brand-700 ml-1 underline"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Product grid/list */}
      {filtered.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} layout="list" />
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-brand-100 flex items-center justify-center mx-auto mb-4">
            <Package className="w-7 h-7 text-brand-400" />
          </div>
          <h3 className="text-lg font-semibold text-brand-900">No products found</h3>
          <p className="text-sm text-brand-500 mt-1.5 max-w-sm mx-auto">
            Try adjusting your search or filters to find what you&apos;re looking for.
          </p>
          <button
            onClick={clearFilters}
            className="mt-5 h-10 px-5 bg-brand-100 text-brand-700 rounded-xl text-sm font-medium hover:bg-brand-200 transition-colors"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
