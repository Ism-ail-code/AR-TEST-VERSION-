import { useState } from 'react';
import { Link } from 'react-router-dom';
import { demoProducts, departments, getReviewsForProduct } from '@/data/products';
import { ProductCard, useToast } from '@/components/ui';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import {
  ArrowRight,
  Eye,
  Star,
  Truck,
  RotateCcw,
  Shield,
  MapPin,
  Armchair,
  Tv,
  Refrigerator,
  CookingPot,
  Speaker,
  Wifi,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const DEPT_ICONS: Record<string, LucideIcon> = {
  Home: Armchair,
  Electronics: Tv,
  Appliances: Refrigerator,
  Kitchen: CookingPot,
  Audio: Speaker,
  'Smart Home': Wifi,
};

/** Furniture rooms and categories — secondary entry points under the departments. */
const ROOM_LINKS = [
  { label: 'Living Room', to: '/products?room=Living%20Room' },
  { label: 'Bedroom', to: '/products?room=Bedroom' },
  { label: 'Dining', to: '/products?room=Dining' },
  { label: 'Seating', to: '/products?category=Seating' },
  { label: 'Tables', to: '/products?category=Tables' },
  { label: 'Lighting', to: '/products?category=Lighting' },
];

const HERO_PRODUCT = demoProducts.find((p) => p.id === 'prod-002')!;

/** A curated cross-section of the catalogue — furniture, appliances and electronics. */
const FEATURED_IDS = [
  'prod-002',
  'prod-006',
  'prod-014',
  'prod-001',
  'prod-018',
  'prod-012',
  'prod-020',
  'prod-004',
  'prod-021',
];

const featured = FEATURED_IDS.map((id) => demoProducts.find((p) => p.id === id)).filter(
  (p): p is (typeof demoProducts)[number] => Boolean(p),
);

const QUOTES = ['prod-001', 'prod-014', 'prod-018'].map((id) => ({
  review: getReviewsForProduct(id)[0],
  product: demoProducts.find((p) => p.id === id)!,
}));

export function Home() {
  useDocumentTitle();
  const { toast } = useToast();
  const [email, setEmail] = useState('');

  return (
    <div>
      {/* ───────────────── Hero ───────────────── */}
      <section className="container-page pt-6 sm:pt-8 lg:pt-10 pb-14 sm:pb-16">
        <div className="rounded-3xl overflow-hidden bg-brand-900">
          <div className="grid lg:grid-cols-2">
            <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center order-2 lg:order-1">
              <span className="text-2xs font-semibold uppercase tracking-[0.3em] text-accent-400">
                Autumn Collection
              </span>

              <h1 className="mt-5 text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-white tracking-tight leading-[1.05]">
                Furniture, appliances and tech for modern living.
              </h1>

              <p className="mt-5 text-base sm:text-lg text-brand-300 leading-relaxed max-w-md">
                Everything for the modern home — from the sofa to the smart TV — chosen to last
                and previewable in your own room before you buy.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to="/products"
                  className="h-12 px-7 bg-white text-brand-900 rounded-xl text-sm font-semibold hover:bg-brand-100 transition-colors inline-flex items-center gap-2"
                >
                  Shop Collection <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/products?dept=Appliances"
                  className="h-12 px-7 border border-white/25 text-white rounded-xl text-sm font-semibold hover:bg-white/10 transition-colors inline-flex items-center"
                >
                  Shop appliances
                </Link>
              </div>

              <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap gap-x-6 gap-y-2 text-2xs text-brand-400">
                <span>Free shipping over $500</span>
                <span>30-day returns</span>
                <span>2-year warranty</span>
              </div>
            </div>

            <div className="relative min-h-[300px] sm:min-h-[380px] lg:min-h-[600px] order-1 lg:order-2">
              <img
                src="/images/haven-velvet-sofa-1.jpg"
                alt="Haven velvet sofa in cobalt"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-950/60 via-transparent to-transparent lg:bg-gradient-to-r lg:from-brand-900 lg:via-brand-900/10 lg:to-transparent" />

              <Link
                to={`/ar/${HERO_PRODUCT.id}`}
                className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 inline-flex items-center gap-2 bg-white/95 backdrop-blur text-brand-900 text-xs font-semibold pl-3 pr-4 py-2.5 rounded-full shadow-lg hover:bg-white transition-colors"
              >
                <Eye className="w-4 h-4 text-accent-600" /> View in AR
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── Shop by department ───────────────── */}
      <section className="container-page pb-16 sm:pb-20">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-900 tracking-tight">
              Shop by department
            </h2>
            <p className="text-sm text-brand-500 mt-1.5">
              Six departments, one catalogue — every product is AR-ready.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept) => {
            const Icon = DEPT_ICONS[dept.key] ?? Armchair;
            return (
              <Link
                key={dept.key}
                to={`/products?dept=${encodeURIComponent(dept.key)}`}
                className="group relative rounded-2xl overflow-hidden bg-brand-100 aspect-[4/5] sm:aspect-[4/3]"
              >
                <img
                  src={dept.image}
                  alt={dept.label}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 via-brand-950/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm sm:text-base font-semibold text-white">
                      {dept.label}
                    </span>
                    <Icon className="w-4 h-4 text-white/70 shrink-0" />
                  </div>
                  <p className="text-2xs text-white/70 mt-1">{dept.blurb}</p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Furniture rooms and categories */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-2xs uppercase tracking-wider text-brand-400 mr-1">Also in furniture</span>
          {ROOM_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="px-3.5 py-1.5 rounded-full bg-white border border-brand-200/60 text-xs font-medium text-brand-600 hover:border-accent-300 hover:text-accent-700 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>

      {/* ───────────────── Featured ───────────────── */}
      <section className="bg-white border-y border-brand-200/60">
        <div className="container-page py-16 sm:py-20">
          <div className="flex items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-brand-900 tracking-tight">
                Featured this season
              </h2>
              <p className="text-sm text-brand-500 mt-1.5">
                {featured.length} products, ready to ship.
              </p>
            </div>
            <Link
              to="/products"
              className="text-sm font-medium text-accent-600 hover:text-accent-700 flex items-center gap-1 transition-colors group shrink-0"
            >
              View all{' '}
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── AR feature ───────────────── */}
      <section className="container-page py-16 sm:py-20">
        <div className="rounded-3xl bg-surface-100 overflow-hidden grid md:grid-cols-2">
          <div className="relative min-h-[260px] md:min-h-[420px]">
            <img
              src="/images/refrigerator-1.jpg"
              alt="Aurora French-Door Refrigerator in brushed steel"
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-950/40 to-transparent" />
          </div>

          <div className="p-8 sm:p-10 lg:p-14 flex flex-col justify-center">
            <span className="text-2xs font-semibold uppercase tracking-[0.3em] text-accent-600">
              Before you buy
            </span>
            <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-brand-900 tracking-tight">
              See it in your space
            </h2>
            <p className="mt-3 text-brand-600 leading-relaxed max-w-md">
              Open any product on your phone and place it in your own room at true scale. Check
              the clearance around a fridge, the depth of a sofa on a shelf or how a TV fills the
              wall — then order with the confidence of having already seen it there.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/ar/prod-006"
                className="h-11 px-5 bg-accent-500 text-white rounded-xl text-sm font-semibold hover:bg-accent-600 transition-colors inline-flex items-center gap-2 shadow-sm shadow-accent-500/25"
              >
                <Eye className="w-4 h-4" /> View in AR
              </Link>
              <Link
                to="/products"
                className="h-11 px-5 bg-white border border-brand-200 text-brand-800 rounded-xl text-sm font-semibold hover:border-brand-400 transition-colors inline-flex items-center"
              >
                Shop all products
              </Link>
            </div>

            <p className="mt-6 text-2xs text-brand-400">AR by Rapidify</p>
          </div>
        </div>
      </section>

      {/* ───────────────── Reviews ───────────────── */}
      <section className="bg-white border-y border-brand-200/60">
        <div className="container-page py-16 sm:py-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-900 tracking-tight mb-8">
            What people are saying
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {QUOTES.map(({ review, product }) =>
              review ? (
                <figure
                  key={review.id}
                  className="rounded-2xl border border-brand-200/60 p-6 flex flex-col"
                >
                  <div className="flex items-center gap-0.5 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < review.rating ? 'fill-accent-400 text-accent-400' : 'text-brand-200'
                        }`}
                      />
                    ))}
                  </div>
                  <blockquote className="text-sm text-brand-600 leading-relaxed flex-1">
                    &ldquo;{review.body}&rdquo;
                  </blockquote>
                  <figcaption className="mt-5 pt-4 border-t border-brand-200/60 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-brand-900">{review.authorName}</p>
                      <p className="text-2xs text-brand-400 truncate">{product.name}</p>
                    </div>
                    <Link
                      to={`/product/${product.slug}`}
                      className="text-2xs font-semibold text-accent-600 hover:text-accent-700 shrink-0"
                    >
                      Shop it
                    </Link>
                  </figcaption>
                </figure>
              ) : null,
            )}
          </div>
        </div>
      </section>

      {/* ───────────────── Service promises ───────────────── */}
      <section className="container-page py-14 sm:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: Truck, title: 'Free shipping', body: 'On every order over $500' },
            { icon: RotateCcw, title: '30-day returns', body: 'Free collection, no questions' },
            { icon: Shield, title: '2-year warranty', body: 'On furniture, appliances and tech' },
            { icon: MapPin, title: 'Austin showroom', body: '247 Design District Blvd' },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-brand-200/60 p-5">
              <item.icon className="w-5 h-5 text-accent-600 mb-3" />
              <h3 className="text-sm font-semibold text-brand-900">{item.title}</h3>
              <p className="text-xs text-brand-500 mt-1 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────── Newsletter ───────────────── */}
      <section className="container-page pb-16 sm:pb-24">
        <div className="rounded-3xl bg-brand-900 px-8 py-12 sm:px-12 sm:py-14 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            10% off your first order
          </h2>
          <p className="text-sm text-brand-400 mt-2.5 max-w-md mx-auto">
            New arrivals, restocks and the occasional lookbook. No noise.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!email.trim()) return;
              setEmail('');
              toast('success', 'Thanks — check your inbox for the code');
            }}
            className="mt-7 flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              aria-label="Email address"
              className="flex-1 h-12 px-4 bg-white/10 border border-white/15 rounded-xl text-sm text-white placeholder:text-brand-500 focus:outline-none focus:border-accent-400 transition-colors"
            />
            <button
              type="submit"
              className="h-12 px-6 bg-white text-brand-900 rounded-xl text-sm font-semibold hover:bg-brand-100 transition-colors"
            >
              Sign up
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
