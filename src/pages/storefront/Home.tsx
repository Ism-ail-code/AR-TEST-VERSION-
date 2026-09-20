import { Link } from 'react-router-dom';
import { demoProducts, demoStore } from '@/data/demo';
import { ProductCard } from '@/components/ui/ProductCard';
import { Badge } from '@/components/ui/Badge';
import {
  ArrowRight,
  Eye,
  Box,
  ScanLine,
  Truck,
  Shield,
  RotateCcw,
  Star,
  ChevronRight,
  Armchair,
  Lamp,
  Table,
} from 'lucide-react';

export function Home() {
  const featured = demoProducts.slice(0, 3);
  const categories = [
    { name: 'Seating', icon: Armchair, count: demoProducts.filter((p) => p.category === 'Seating').length, slug: 'Seating' },
    { name: 'Tables', icon: Table, count: demoProducts.filter((p) => p.category === 'Tables').length, slug: 'Tables' },
    { name: 'Lighting', icon: Lamp, count: demoProducts.filter((p) => p.category === 'Lighting').length, slug: 'Lighting' },
  ];

  return (
    <div>
      {/* ─── Hero ─── */}
      <section className="relative bg-brand-900 overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 0.5px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent-600/10 to-transparent" />

        <div className="container-page relative z-10 py-20 sm:py-28 lg:py-36">
          <div className="max-w-2xl">
            <Badge variant="accent" size="md" className="mb-6">
              Powered by Rapidify
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.08]">
              Furniture that fits
              <br />
              <span className="text-brand-300">before it arrives.</span>
            </h1>
            <p className="text-brand-400 text-lg sm:text-xl mt-6 max-w-lg leading-relaxed">
              Browse modern furniture, view it in 3D, and place it in your room with augmented reality &mdash; all from your phone.
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-8">
              <Link to="/products" className="inline-flex h-12 px-6 bg-white text-brand-900 rounded-xl text-sm font-semibold items-center gap-2 hover:bg-brand-100 transition-all shadow-lg shadow-black/10">
                Shop Collection <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/merchant" className="inline-flex h-12 px-6 bg-white border border-brand-200 text-brand-900 rounded-xl text-sm font-semibold items-center gap-2 hover:bg-brand-100 transition-all">
                Merchant Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Trust bar ─── */}
      <section className="bg-white border-b border-brand-200/50">
        <div className="container-page py-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-0 sm:divide-x sm:divide-brand-200/50">
            {[
              { icon: Box, label: '3D Preview', desc: 'Every product in 3D' },
              { icon: Eye, label: 'AR Placement', desc: 'See it in your room' },
              { icon: Truck, label: 'Free Shipping', desc: 'Orders over $500' },
              { icon: Shield, label: '2-Year Warranty', desc: 'Quality guaranteed' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-center gap-3 sm:px-5">
                <div className="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-accent-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-900 leading-tight">{item.label}</p>
                  <p className="text-xs text-brand-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Products ─── */}
      <section className="container-page py-16 sm:py-20 lg:py-24">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold text-accent-500 uppercase tracking-wider mb-2">Curated for you</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-900 tracking-tight">Featured Products</h2>
          </div>
          <Link
            to="/products"
            className="text-sm font-medium text-accent-600 hover:text-accent-700 flex items-center gap-1 transition-colors group"
          >
            View all <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ─── How AR Works ─── */}
      <section className="bg-brand-900 text-white overflow-hidden">
        <div className="container-page py-16 sm:py-20 lg:py-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="accent" size="md" className="mb-4">How it works</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Try before you buy &mdash; in your space
            </h2>
            <p className="text-brand-400 mt-3 text-base leading-relaxed">
              Our AR technology lets you preview every piece of furniture at true scale in your own room.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                step: '01',
                icon: ScanLine,
                title: 'Scan the QR code',
                desc: 'Each product has a unique QR code. Scan it with your phone camera to open the AR experience instantly.',
              },
              {
                step: '02',
                icon: Box,
                title: 'View in 3D',
                desc: 'Rotate, zoom, and inspect every detail of the product in a real-time 3D viewer right in your browser.',
              },
              {
                step: '03',
                icon: Eye,
                title: 'Place in your room',
                desc: 'Point your camera at your floor and watch the furniture appear at true scale. Move around it, see it from every angle.',
              },
            ].map((item) => (
              <div key={item.step} className="relative bg-white/5 rounded-2xl p-6 lg:p-8 border border-white/5">
                <div className="text-5xl font-extrabold text-white/[0.04] absolute top-4 right-6">{item.step}</div>
                <div className="w-12 h-12 rounded-xl bg-accent-500/20 flex items-center justify-center mb-5">
                  <item.icon className="w-6 h-6 text-accent-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-brand-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/products" className="inline-flex h-12 px-6 bg-accent-500 text-white rounded-xl text-sm font-semibold items-center gap-2 hover:bg-accent-600 transition-all">
              Try it now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Categories ─── */}
      <section className="container-page py-16 sm:py-20 lg:py-24">
        <div className="text-center max-w-xl mx-auto mb-10">
          <p className="text-xs font-semibold text-accent-500 uppercase tracking-wider mb-2">Browse by room</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-900 tracking-tight">Shop by Category</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${cat.slug}`}
              className="group relative bg-surface-100 rounded-2xl p-8 text-center hover:bg-brand-900 transition-colors duration-300 overflow-hidden"
            >
              <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
                <cat.icon className="w-7 h-7 text-brand-700 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-lg font-semibold text-brand-900 group-hover:text-white transition-colors">{cat.name}</h3>
              <p className="text-sm text-brand-500 group-hover:text-brand-400 mt-1 transition-colors">
                {cat.count} {cat.count === 1 ? 'product' : 'products'}
              </p>
              <ChevronRight className="w-5 h-5 text-brand-300 group-hover:text-white group-hover:translate-x-1 transition-all absolute right-5 top-1/2 -translate-y-1/2" />
            </Link>
          ))}
        </div>
      </section>

      {/* ─── All Products ─── */}
      <section className="bg-white border-t border-brand-200/50">
        <div className="container-page py-16 sm:py-20 lg:py-24">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold text-accent-500 uppercase tracking-wider mb-2">Full collection</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-brand-900 tracking-tight">All Products</h2>
            </div>
            <Link to="/products" className="text-sm font-medium text-accent-600 hover:text-accent-700 flex items-center gap-1 transition-colors group">
              Browse catalog <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {demoProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Reviews social proof ─── */}
      <section className="container-page py-16 sm:py-20 lg:py-24">
        <div className="text-center max-w-xl mx-auto mb-10">
          <p className="text-xs font-semibold text-accent-500 uppercase tracking-wider mb-2">What people say</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-900 tracking-tight">Customer Favorites</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { name: 'Mono Side Table', rating: 5, quote: 'The walnut grain is gorgeous. The AR preview let me confirm the height perfectly before ordering.', author: 'Marcus J.' },
            { name: 'Haven Sofa', rating: 5, quote: 'Deep seats, removable covers, and the AR feature saved us from a sizing mistake.', author: 'Priya M.' },
            { name: 'Oslo Lounge Chair', rating: 5, quote: 'Stunning in person. The oak frame has a beautiful grain. Assembly took 15 minutes.', author: 'Emily R.' },
          ].map((review) => (
            <div key={review.name} className="bg-surface-100 rounded-2xl p-6">
              <div className="flex items-center gap-0.5 mb-3" aria-label={`${review.rating} out of 5 stars`}>
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent-400 text-accent-400" />
                ))}
              </div>
              <p className="text-sm text-brand-700 leading-relaxed italic">&ldquo;{review.quote}&rdquo;</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-900 text-white flex items-center justify-center text-xs font-bold">
                  {review.author[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-brand-900">{review.author}</p>
                  <p className="text-2xs text-brand-500">on {review.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="bg-surface-100 border-t border-brand-200/50">
        <div className="container-page py-16 sm:py-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-900 tracking-tight">Ready to see it in your space?</h2>
          <p className="text-brand-500 mt-3 max-w-md mx-auto">
            Every Casa Living product supports AR preview. Scan a QR code or tap any product to try it.
          </p>
          <Link to="/products" className="mt-6 inline-flex h-12 px-6 bg-brand-900 text-white rounded-xl text-sm font-semibold items-center gap-2 hover:bg-brand-800 transition-all">
            Explore All Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
