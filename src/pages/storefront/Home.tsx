import { Link } from 'react-router-dom';
import {
  demoProducts,
  demoStore,
  demoStats,
  demoReviews,
  getProductUrl,
} from '@/data/products';
import { ProductCard, ProductQRCode, Badge } from '@/components/ui';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import {
  ArrowRight,
  Eye,
  Box,
  ScanLine,
  Truck,
  Shield,
  Store,
  Star,
  ChevronRight,
  Armchair,
  Lamp,
  Table,
  Package,
  Check,
  QrCode,
} from 'lucide-react';

/** The hero product — the one with the richest AR experience. */
const HERO = demoProducts[0];

export function Home() {
  useDocumentTitle();
  const featured = demoProducts.filter((p) => p.arReady);

  const categories = [
    { name: 'Seating', icon: Armchair, slug: 'Seating' },
    { name: 'Tables', icon: Table, slug: 'Tables' },
    { name: 'Lighting', icon: Lamp, slug: 'Lighting' },
  ].map((c) => ({
    ...c,
    count: demoProducts.filter((p) => p.category === c.name).length,
  }));

  /* The full demo story, told without a narrator. */
  const story = [
    {
      step: '01',
      icon: Store,
      title: 'A merchant has products',
      desc: `${demoStore.name} syncs its catalogue — ${demoStats.productsSynced} furniture pieces, one static source of truth.`,
    },
    {
      step: '02',
      icon: Package,
      title: 'Rapidify turns them into 3D',
      desc: `Each product gets a production-ready 3D model. ${demoStats.arReady} of ${demoStats.productsSynced} are AR-ready today.`,
    },
    {
      step: '03',
      icon: QrCode,
      title: 'Every product gets a QR code',
      desc: `${demoStats.qrReady} unique codes, each pointing at its own product page — printable for the showroom floor.`,
    },
    {
      step: '04',
      icon: ScanLine,
      title: 'The customer opens it',
      desc: 'A scan or a tap opens the product page with the 3D viewer right there on the phone.',
    },
    {
      step: '05',
      icon: Eye,
      title: 'They hit “View in AR”',
      desc: 'Camera on, flat surface detected, furniture placed at true scale in their actual room.',
    },
    {
      step: '06',
      icon: Check,
      title: 'They buy with confidence',
      desc: 'No sizing surprises, fewer returns. The merchant sees exactly what happened.',
    },
  ];

  return (
    <div>
      {/* ─── Hero ─── */}
      <section className="relative bg-brand-900 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, white 0.5px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent-600/12 to-transparent" />

        <div className="container-page relative z-10 py-16 sm:py-24 lg:py-32">
          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-center">
            <div>
              <Badge variant="accent" size="md" className="mb-6">
                Powered by Rapidify
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.06]">
                Furniture that fits
                <br />
                <span className="text-accent-400">before it arrives.</span>
              </h1>
              <p className="text-brand-400 text-lg sm:text-xl mt-6 max-w-xl leading-relaxed">
                {demoStore.name} sells modern furniture. Every piece can be opened in 3D and
                placed in your actual room with augmented reality &mdash; straight from the
                product page or a QR code on the shop floor.
              </p>

              <div className="flex flex-wrap items-center gap-3 mt-8">
                <Link
                  to="/products"
                  className="inline-flex h-12 px-6 bg-white text-brand-900 rounded-xl text-sm font-semibold items-center gap-2 hover:bg-brand-100 transition-all shadow-lg shadow-black/10"
                >
                  Shop Collection <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to={`/ar/${HERO.id}`}
                  className="inline-flex h-12 px-6 bg-accent-500 text-white rounded-xl text-sm font-semibold items-center gap-2 hover:bg-accent-600 transition-all shadow-lg shadow-accent-600/25"
                >
                  <Eye className="w-4 h-4" /> View in AR
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-8 pt-8 border-t border-white/10">
                {[
                  { value: demoStats.productsSynced, label: 'products synced' },
                  { value: demoStats.arReady, label: 'AR ready' },
                  { value: demoStats.qrReady, label: 'QR ready' },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-2xl font-bold text-white leading-none">{s.value}</p>
                    <p className="text-2xs text-brand-500 uppercase tracking-wider mt-1">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero product card */}
            <div className="hidden lg:block">
              <div className="relative rounded-3xl overflow-hidden bg-brand-800 border border-white/10 shadow-2xl">
                <div className="aspect-[4/3] bg-surface-100">
                  <img
                    src={HERO.images[0]?.url}
                    alt={HERO.images[0]?.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="inline-flex items-center gap-1 bg-accent-500 text-white text-2xs font-semibold px-2.5 py-1.5 rounded-lg shadow-sm">
                    <Eye className="w-3 h-3" /> AR ready
                  </span>
                  <span className="inline-flex items-center gap-1 bg-white/90 text-brand-800 text-2xs font-semibold px-2.5 py-1.5 rounded-lg backdrop-blur-sm">
                    <Box className="w-3 h-3" /> 3D model
                  </span>
                </div>
                <div className="p-5 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wider text-accent-400 font-semibold">
                      {HERO.category}
                    </p>
                    <p className="text-lg font-bold text-white truncate">{HERO.name}</p>
                    <p className="text-sm text-brand-400">${HERO.price.toLocaleString()}</p>
                  </div>
                  <Link
                    to={`/product/${HERO.slug}`}
                    className="shrink-0 h-10 px-4 bg-white text-brand-900 rounded-xl text-xs font-semibold hover:bg-brand-100 transition-colors inline-flex items-center gap-1.5"
                  >
                    View Product <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Trust bar ─── */}
      <section className="bg-white border-b border-brand-200/50">
        <div className="container-page py-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-0 sm:divide-x sm:divide-brand-200/50">
            {[
              { icon: Box, label: '3D Preview', desc: 'Every activated product' },
              { icon: Eye, label: 'AR Placement', desc: 'True scale, real room' },
              { icon: Truck, label: 'Free Shipping', desc: 'Orders over $500' },
              { icon: Shield, label: '2-Year Warranty', desc: 'Quality guaranteed' },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-center gap-3 sm:px-5"
              >
                <div className="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-accent-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-900 leading-tight">
                    {item.label}
                  </p>
                  <p className="text-xs text-brand-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── The demo story ─── */}
      <section className="bg-surface-100 border-b border-brand-200/50">
        <div className="container-page py-16 sm:py-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-semibold text-accent-500 uppercase tracking-wider mb-2">
              The Rapidify flow
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-900 tracking-tight">
              From a merchant&apos;s shelf to your living room
            </h2>
            <p className="text-brand-500 mt-3 text-base leading-relaxed">
              One product record drives the storefront, the QR code, the merchant dashboard and
              the AR experience. Nothing is duplicated.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {story.map((item) => (
              <div
                key={item.step}
                className="bg-white rounded-2xl p-6 border border-brand-200/60 relative overflow-hidden"
              >
                <div className="text-5xl font-extrabold text-brand-900/[0.04] absolute top-3 right-5">
                  {item.step}
                </div>
                <div className="w-11 h-11 rounded-xl bg-accent-50 border border-accent-100 flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-accent-600" />
                </div>
                <h3 className="text-base font-semibold text-brand-900 mb-1.5">
                  {item.title}
                </h3>
                <p className="text-sm text-brand-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured (AR-ready) products ─── */}
      <section className="container-page py-16 sm:py-20 lg:py-24">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold text-accent-500 uppercase tracking-wider mb-2">
              Live in 3D &amp; AR
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-900 tracking-tight">
              Featured Products
            </h2>
          </div>
          <Link
            to="/products"
            className="text-sm font-medium text-accent-600 hover:text-accent-700 flex items-center gap-1 transition-colors group"
          >
            View all{' '}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ─── QR feature ─── */}
      <section className="bg-brand-900 text-white overflow-hidden">
        <div className="container-page py-16 sm:py-20 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <Badge variant="accent" size="md" className="mb-5">
                QR commerce
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-snug">
                Put a code next to the real thing.
              </h2>
              <p className="text-brand-400 mt-4 text-base leading-relaxed max-w-lg">
                Print the poster, place it beside the product on the shop floor, and a phone
                camera takes the customer straight to that product&apos;s AR experience. No app
                to install, no code to write.
              </p>

              <ul className="mt-6 space-y-3">
                {[
                  `${demoStats.qrReady} unique, per-product codes`,
                  'Printable A5 poster with the product name and price',
                  'Encodes the exact product URL — nothing generic',
                ].map((line) => (
                  <li key={line} className="flex items-start gap-2.5 text-sm text-brand-300">
                    <span className="w-5 h-5 rounded-full bg-accent-500/20 text-accent-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </span>
                    {line}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-3 mt-8">
                <Link
                  to={`/product/${HERO.slug}`}
                  className="inline-flex h-11 px-5 bg-accent-500 text-white rounded-xl text-sm font-semibold items-center gap-2 hover:bg-accent-600 transition-all"
                >
                  Open product page <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to={`/merchant/products/${HERO.id}/qr`}
                  className="inline-flex h-11 px-5 bg-white/10 border border-white/15 text-white rounded-xl text-sm font-semibold items-center gap-2 hover:bg-white/15 transition-all"
                >
                  <ScanLine className="w-4 h-4" /> See the poster
                </Link>
              </div>
            </div>

            {/* Poster preview */}
            <div className="justify-self-center lg:justify-self-end">
              <div className="bg-white text-brand-900 rounded-3xl p-7 w-[300px] sm:w-[330px] shadow-2xl shadow-black/40">
                <div className="flex items-center justify-between mb-5">
                  <span className="text-2xs font-bold uppercase tracking-widest text-brand-400">
                    {demoStore.name}
                  </span>
                  <span className="text-2xs font-bold text-accent-600">Rapidify</span>
                </div>

                <p className="text-xl font-extrabold leading-[1.1] tracking-tight">
                  SCAN TO SEE IT
                  <br />
                  IN YOUR SPACE
                </p>

                <div className="mt-5 flex justify-center">
                  <ProductQRCode url={getProductUrl(HERO)} size={168} />
                </div>

                <div className="mt-5 pt-4 border-t border-brand-200/70 flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="font-bold text-sm truncate">{HERO.name}</p>
                    <p className="text-brand-500 text-xs">
                      ${HERO.price.toLocaleString()} · {HERO.material}
                    </p>
                  </div>
                  <span className="shrink-0 inline-flex items-center gap-1.5 bg-accent-500 text-white text-2xs font-semibold px-2.5 py-1.5 rounded-lg">
                    <Eye className="w-3 h-3" /> View in AR
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── How AR works ─── */}
      <section className="container-page py-16 sm:py-20 lg:py-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="accent" size="md" className="mb-4">
            How it works
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-900 tracking-tight">
            Try before you buy &mdash; in your space
          </h2>
          <p className="text-brand-500 mt-3 text-base leading-relaxed">
            Our AR layer lets you preview every activated piece of furniture at true scale in
            your own room.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {[
            {
              step: '01',
              icon: ScanLine,
              title: 'Scan the QR code',
              desc: 'Each activated product has its own QR code. Scan it with your phone camera to open that product instantly.',
            },
            {
              step: '02',
              icon: Box,
              title: 'View in 3D',
              desc: 'Rotate, zoom and inspect every detail in a real-time 3D viewer right in your browser.',
            },
            {
              step: '03',
              icon: Eye,
              title: 'Place in your room',
              desc: 'Point your camera at the floor and watch the furniture appear at true scale. Move around it, see it from every angle.',
            },
          ].map((item) => (
            <div
              key={item.step}
              className="relative bg-surface-100 rounded-2xl p-6 lg:p-8 border border-brand-200/60"
            >
              <div className="text-5xl font-extrabold text-brand-900/[0.05] absolute top-4 right-6">
                {item.step}
              </div>
              <div className="w-12 h-12 rounded-xl bg-accent-100 flex items-center justify-center mb-5">
                <item.icon className="w-6 h-6 text-accent-600" />
              </div>
              <h3 className="text-lg font-semibold text-brand-900 mb-2">{item.title}</h3>
              <p className="text-sm text-brand-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to={`/ar/${HERO.id}`}
            className="inline-flex h-12 px-6 bg-accent-500 text-white rounded-xl text-sm font-semibold items-center gap-2 hover:bg-accent-600 transition-all"
          >
            Try the live AR demo <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ─── Categories ─── */}
      <section className="bg-white border-y border-brand-200/50">
        <div className="container-page py-16 sm:py-20">
          <div className="text-center max-w-xl mx-auto mb-10">
            <p className="text-xs font-semibold text-accent-500 uppercase tracking-wider mb-2">
              Browse by room
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-900 tracking-tight">
              Shop by Category
            </h2>
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
                <h3 className="text-lg font-semibold text-brand-900 group-hover:text-white transition-colors">
                  {cat.name}
                </h3>
                <p className="text-sm text-brand-500 group-hover:text-brand-400 mt-1 transition-colors">
                  {cat.count} {cat.count === 1 ? 'product' : 'products'}
                </p>
                <ChevronRight className="w-5 h-5 text-brand-300 group-hover:text-white group-hover:translate-x-1 transition-all absolute right-5 top-1/2 -translate-y-1/2" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── All Products ─── */}
      <section className="container-page py-16 sm:py-20 lg:py-24">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold text-accent-500 uppercase tracking-wider mb-2">
              Full collection
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-900 tracking-tight">
              All Products
            </h2>
          </div>
          <Link
            to="/products"
            className="text-sm font-medium text-accent-600 hover:text-accent-700 flex items-center gap-1 transition-colors group"
          >
            Browse catalog{' '}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {demoProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ─── Reviews social proof ─── */}
      <section className="bg-surface-100 border-t border-brand-200/50">
        <div className="container-page py-16 sm:py-20">
          <div className="text-center max-w-xl mx-auto mb-10">
            <p className="text-xs font-semibold text-accent-500 uppercase tracking-wider mb-2">
              What people say
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-900 tracking-tight">
              Customer Favorites
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {demoReviews
              .filter((r) => r.helpfulCount >= 30)
              .slice(0, 3)
              .map((review) => {
                const product = demoProducts.find((p) => p.id === review.productId);
                if (!product) return null;
                return (
                  <div key={review.id} className="bg-white rounded-2xl p-6 border border-brand-200/60">
                    <div
                      className="flex items-center gap-0.5 mb-3"
                      aria-label={`${review.rating} out of 5 stars`}
                    >
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-accent-400 text-accent-400" />
                      ))}
                    </div>
                    <p className="text-sm text-brand-700 leading-relaxed italic">
                      &ldquo;{review.body}&rdquo;
                    </p>
                    <div className="mt-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-900 text-white flex items-center justify-center text-xs font-bold">
                        {review.authorName[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-brand-900">
                          {review.authorName}
                        </p>
                        <p className="text-2xs text-brand-500">on {product.name}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>

      {/* ─── Merchant CTA ─── */}
      <section className="bg-white border-t border-brand-200/50">
        <div className="container-page py-16 sm:py-20">
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 items-center bg-brand-900 rounded-3xl p-8 sm:p-10 overflow-hidden relative">
            <div
              className="absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, white 0.5px, transparent 0)',
                backgroundSize: '28px 28px',
              }}
            />
            <div className="relative">
              <p className="text-xs font-semibold text-accent-400 uppercase tracking-wider mb-2">
                For merchants
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Turn a product catalogue into AR experiences.
              </h2>
              <p className="text-brand-400 mt-3 text-sm leading-relaxed max-w-lg">
                Connect a store, sync products, generate 3D models, and print QR codes for the
                showroom floor &mdash; all from one dashboard. See exactly how it works with
                Casa Living&apos;s {demoStats.productsSynced} products.
              </p>
              <Link
                to="/merchant"
                className="mt-6 inline-flex h-12 px-6 bg-accent-500 text-white rounded-xl text-sm font-semibold items-center gap-2 hover:bg-accent-600 transition-all"
              >
                Open Merchant Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="relative grid grid-cols-2 gap-3">
              {[
                { label: 'Products synced', value: demoStats.productsSynced },
                { label: 'AR ready', value: demoStats.arReady },
                { label: 'QR codes', value: demoStats.qrReady },
                { label: 'AR views', value: demoStats.totalArViews.toLocaleString() },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm"
                >
                  <p className="text-2xl font-bold text-white leading-none">{s.value}</p>
                  <p className="text-2xs text-brand-400 uppercase tracking-wider mt-1.5">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="bg-surface-100 border-t border-brand-200/50">
        <div className="container-page py-16 sm:py-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-900 tracking-tight">
            Ready to see it in your space?
          </h2>
          <p className="text-brand-500 mt-3 max-w-md mx-auto">
            {demoStats.arReady} of {demoStats.productsSynced} Casa Living products support AR
            preview. Tap any product to try it.
          </p>
          <Link
            to="/products"
            className="mt-6 inline-flex h-12 px-6 bg-brand-900 text-white rounded-xl text-sm font-semibold items-center gap-2 hover:bg-brand-800 transition-all"
          >
            Explore All Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
