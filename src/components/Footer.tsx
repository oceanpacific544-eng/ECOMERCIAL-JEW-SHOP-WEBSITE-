import { HAPPYNESSLO_COMPANY } from '../data/seedData';
import { useStore } from '../store/useStore';
import type { RoutePath } from '../types/jewelry';

export function Footer() {
  const { navigate } = useStore();

  const links: { label: string; path: RoutePath }[] = [
    { label: 'Home', path: '/' },
    { label: 'Shop Collections', path: '/shop' },
    { label: 'Craft & Atelier', path: '/craft' },
    { label: 'HAPPYNESSLO & Care', path: '/company' },
    { label: 'Checkout', path: '/checkout' },
    { label: 'Collector Sign In', path: '/login' },
    { label: 'Admin Vault', path: '/admin' },
  ];

  return (
    <footer className="border-t border-[#1E1E1E]/10 bg-[#F1EBE0]/55 mt-20">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-5 space-y-3">
          <h3 className="font-serif text-2xl font-semibold text-[#1E1E1E]">
            Kala &amp; Karat
          </h3>
          <p className="text-xs font-semibold text-[#9E7C3B] tracking-wide">
            {HAPPYNESSLO_COMPANY.houseBrand}
          </p>
          <p className="text-sm text-[#1E1E1E]/75 max-w-md leading-relaxed">
            Heirloom 22k gold, uncut Polki, and Zambian emerald jewelry forged by third-generation karigars across Jaipur, Mumbai, and Bikaner.
          </p>
          <p className="text-xs text-[#1E1E1E]/60 pt-1">
            {HAPPYNESSLO_COMPANY.bisLicense} · Insured Delivery Across India
          </p>
        </div>

        <div className="md:col-span-4">
          <h4 className="text-xs font-semibold tracking-wider text-[#1E1E1E]/60 mb-4">
            Explore
          </h4>
          <ul className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-sm">
            {links.map((item) => (
              <li key={item.path}>
                <a
                  href={item.path}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.path);
                  }}
                  className="text-[#1E1E1E]/80 hover:text-[#1B3B2B] hover:underline underline-offset-4 transition-colors"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3 space-y-2.5">
          <h4 className="text-xs font-semibold tracking-wider text-[#1E1E1E]/60 mb-4">
            Customer Care · {HAPPYNESSLO_COMPANY.companyName}
          </h4>
          <p className="text-sm text-[#1E1E1E]/80 tabular-nums">
            Toll-Free: {HAPPYNESSLO_COMPANY.customerCare.tollFree}
          </p>
          <p className="text-sm text-[#1E1E1E]/80">
            <a
              href={`mailto:${HAPPYNESSLO_COMPANY.customerCare.email}`}
              className="hover:text-[#1B3B2B] hover:underline underline-offset-4"
            >
              {HAPPYNESSLO_COMPANY.customerCare.email}
            </a>
          </p>
          <p className="text-xs text-[#1E1E1E]/60 pt-1">
            {HAPPYNESSLO_COMPANY.customerCare.hours}
          </p>
          <button
            type="button"
            onClick={() => navigate('/company')}
            className="text-xs font-semibold text-[#1B3B2B] hover:underline underline-offset-4 pt-1 cursor-pointer"
          >
            Open Customer Care Desk →
          </button>
        </div>
      </div>

      <div className="border-t border-[#1E1E1E]/10">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#1E1E1E]/60">
          <span>© 2026 {HAPPYNESSLO_COMPANY.legalName}</span>
          <span>Jaipur · Mumbai · New Delhi</span>
        </div>
      </div>
    </footer>
  );
}
