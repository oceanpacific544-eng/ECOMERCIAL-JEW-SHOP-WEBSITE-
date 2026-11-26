import {
  Building2,
  CheckCircle2,
  Clock,
  Headphones,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { useState } from 'react';
import { ResilientImage } from '../components/ResilientImage';
import { HAPPYNESSLO_COMPANY, IMAGES } from '../data/seedData';
import { useStore } from '../store/useStore';
import type { SupportTicket, SupportTopic } from '../types/jewelry';

const SUPPORT_TOPICS: SupportTopic[] = [
  'Order & Insured Shipping',
  'Resizing & Repair',
  'Private Boutique Visit',
  'Hallmark & Appraisal',
  'Custom Bridal Commission',
];

export function CompanyPage() {
  const { user, orders, supportTickets, submitSupportTicket, navigate } = useStore();

  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState('+91 98201 44120');
  const [topic, setTopic] = useState<SupportTopic>('Private Boutique Visit');
  const [orderNumber, setOrderNumber] = useState(orders[0]?.orderNumber || '');
  const [message, setMessage] = useState('');
  const [submittedTicket, setSubmittedTicket] = useState<SupportTicket | null>(null);
  const [formError, setFormError] = useState('');

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!customerName.trim() || !customerEmail.trim() || message.trim().length < 10) {
      setFormError('Please enter your name, email, and a message of at least 10 characters.');
      return;
    }

    const ticket = submitSupportTicket({
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      customerPhone: customerPhone.trim(),
      topic,
      orderNumber: orderNumber.trim() || undefined,
      message: message.trim(),
    });

    setSubmittedTicket(ticket);
    setMessage('');
  };

  return (
    <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* 1. Flagship Boutique Shop Photograph Showcase */}
      <section className="relative rounded-xl overflow-hidden bg-[#1B3B2B] text-[#FAF7F2]">
        <div className="relative h-[420px] sm:h-[480px] lg:h-[520px] w-full">
          <ResilientImage
            src={IMAGES.happynessloShop}
            alt="HAPPYNESSLO flagship fine jewelry boutique interior with emerald alcoves and brushed brass vitrines"
            className="w-full h-full object-cover object-center"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#12261C]/92 via-[#12261C]/45 to-[#12261C]/15"
          />
          <div className="absolute inset-0 p-8 sm:p-12 lg:p-14 flex flex-col justify-end max-w-3xl space-y-3">
            <p className="text-xs sm:text-sm font-medium tracking-wider text-[#C5A059]">
              House of {HAPPYNESSLO_COMPANY.companyName} <span aria-hidden="true">·</span> Est.{' '}
              {HAPPYNESSLO_COMPANY.foundedYear}
            </p>
            <h1 className="font-serif text-3xl sm:text-5xl font-semibold leading-tight [text-wrap:balance]">
              {HAPPYNESSLO_COMPANY.companyName} Flagship Boutiques &amp; Heritage
            </h1>
            <p className="text-sm sm:text-base text-[#FAF7F2]/85 leading-relaxed max-w-2xl">
              {HAPPYNESSLO_COMPANY.legalName} is the parent jewelry house behind Kala &amp; Karat—uniting 42 master karigars across Jaipur and Mumbai under strict BIS 916 HUID provenance and lifetime collector care.
            </p>
          </div>
        </div>
      </section>

      {/* 2. HAPPYNESSLO Company Details & Private Salon Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left: Company Profile & Registry */}
        <div className="lg:col-span-7 bg-white border border-[#1E1E1E]/10 rounded-xl p-7 sm:p-10 flex flex-col justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-[#1B3B2B]">
              <Building2 className="w-5 h-5 text-[#C5A059]" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Company Dossier
              </span>
            </div>
            <h2 className="font-serif text-3xl font-semibold text-[#1E1E1E]">
              About {HAPPYNESSLO_COMPANY.companyName}
            </h2>
            <p className="text-sm sm:text-base text-[#1E1E1E]/75 leading-relaxed">
              Founded in {HAPPYNESSLO_COMPANY.foundedYear} in Jaipur’s historic Johari Bazaar,{' '}
              <strong className="font-semibold text-[#1E1E1E]">
                {HAPPYNESSLO_COMPANY.legalName}
              </strong>{' '}
              preserves hand-forged Indian goldsmithing—from Jadau Kundan foil setting to kiln-fired emerald Meenakari—while giving collectors modern HUID hallmark traceability and direct atelier pricing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#1E1E1E]/10 text-xs">
            <div className="bg-[#FAF7F2] rounded-lg p-4 border border-[#1E1E1E]/8 space-y-1">
              <p className="text-[#1E1E1E]/55">Registered Company</p>
              <p className="font-semibold text-[#1E1E1E]">
                {HAPPYNESSLO_COMPANY.legalName}
              </p>
            </div>
            <div className="bg-[#FAF7F2] rounded-lg p-4 border border-[#1E1E1E]/8 space-y-1">
              <p className="text-[#1E1E1E]/55">BIS Hallmark License</p>
              <p className="font-semibold text-[#1E1E1E] tabular-nums">
                {HAPPYNESSLO_COMPANY.bisLicense}
              </p>
            </div>
            <div className="bg-[#FAF7F2] rounded-lg p-4 border border-[#1E1E1E]/8 space-y-1">
              <p className="text-[#1E1E1E]/55">Corporate Identity (CIN)</p>
              <p className="font-semibold text-[#1E1E1E] tabular-nums">
                {HAPPYNESSLO_COMPANY.cin}
              </p>
            </div>
            <div className="bg-[#FAF7F2] rounded-lg p-4 border border-[#1E1E1E]/8 space-y-1">
              <p className="text-[#1E1E1E]/55">GSTIN &amp; Artisan Guild</p>
              <p className="font-semibold text-[#1E1E1E] tabular-nums">
                {HAPPYNESSLO_COMPANY.gstin} · {HAPPYNESSLO_COMPANY.masterArtisans}
              </p>
            </div>
          </div>

          {/* Physical Shop Locations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            {HAPPYNESSLO_COMPANY.boutiques.map((shop) => (
              <div
                key={shop.city}
                className="border border-[#1E1E1E]/10 rounded-lg p-4 space-y-2"
              >
                <p className="font-serif text-base font-semibold text-[#1B3B2B] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <span>{shop.city}</span>
                </p>
                <p className="text-xs text-[#1E1E1E]/75 leading-relaxed">
                  {shop.address}
                </p>
                <p className="text-xs text-[#1E1E1E]/60 tabular-nums">
                  {shop.timings} · {shop.phone}
                </p>
                <p className="text-[11px] text-[#9E7C3B] font-medium pt-1">
                  {shop.services}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Private Consultation Salon Image Card */}
        <div className="lg:col-span-5 bg-[#1B3B2B] text-[#FAF7F2] rounded-xl overflow-hidden flex flex-col justify-between">
          <div className="aspect-[4/3] w-full overflow-hidden">
            <ResilientImage
              src={IMAGES.happynessloSalon}
              alt="HAPPYNESSLO private fine jewelry consultation salon"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-7 sm:p-8 space-y-4 flex-1 flex flex-col justify-between">
            <div className="space-y-2">
              <p className="text-xs font-medium tracking-wider text-[#C5A059]">
                In-Boutique Hospitality
              </p>
              <h3 className="font-serif text-2xl font-semibold">
                Private Collector Salon
              </h3>
              <p className="text-sm text-[#FAF7F2]/80 leading-relaxed">
                Visit our Jaipur or Mumbai shops to inspect uncut Polki windows under a 10x loupe, verify HUID laser hallmarks, or commission bespoke bridal heirlooms with our head karigars.
              </p>
            </div>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate('/shop')}
                className="px-4 py-2.5 text-xs font-semibold bg-[#C5A059] text-[#1E1E1E] rounded-md hover:bg-[#d3b16d] transition-colors cursor-pointer"
              >
                Explore Vault Collection
              </button>
              <a
                href="#customer-care"
                className="px-4 py-2.5 text-xs font-medium border border-[#FAF7F2]/30 text-[#FAF7F2] rounded-md hover:bg-[#FAF7F2]/10 transition-colors"
              >
                Book Salon Visit ↓
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Connected Customer Care & Support Desk */}
      <section
        id="customer-care"
        className="border-t border-[#1E1E1E]/10 pt-14 space-y-10"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs font-medium tracking-wider text-[#9E7C3B]">
              {HAPPYNESSLO_COMPANY.companyName} Concierge Desk
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#1E1E1E]">
              Customer Care &amp; Support
            </h2>
            <p className="text-sm sm:text-base text-[#1E1E1E]/70">
              Direct assistance for insured shipping, bespoke resizing, BIS hallmark verification, and private shop appointments.
            </p>
          </div>
          <p className="text-xs text-[#1B3B2B] font-medium flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#C5A059]" />
            <span>{HAPPYNESSLO_COMPANY.customerCare.hours}</span>
          </p>
        </div>

        {/* Direct Support Channels Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <a
            href={`tel:${HAPPYNESSLO_COMPANY.customerCare.tollFree.replace(/\s+/g, '')}`}
            className="bg-white border border-[#1E1E1E]/10 rounded-lg p-6 hover:border-[#1B3B2B] transition-colors space-y-2"
          >
            <div className="flex items-center gap-2.5 text-[#1B3B2B]">
              <Phone className="w-4 h-4 text-[#C5A059]" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Toll-Free Support
              </span>
            </div>
            <p className="font-serif text-xl font-semibold text-[#1E1E1E] tabular-nums">
              {HAPPYNESSLO_COMPANY.customerCare.tollFree}
            </p>
            <p className="text-xs text-[#1E1E1E]/60">
              Direct line: {HAPPYNESSLO_COMPANY.customerCare.directLine}
            </p>
          </a>

          <a
            href={`mailto:${HAPPYNESSLO_COMPANY.customerCare.email}`}
            className="bg-white border border-[#1E1E1E]/10 rounded-lg p-6 hover:border-[#1B3B2B] transition-colors space-y-2"
          >
            <div className="flex items-center gap-2.5 text-[#1B3B2B]">
              <Mail className="w-4 h-4 text-[#C5A059]" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Customer Care Email
              </span>
            </div>
            <p className="font-serif text-xl font-semibold text-[#1E1E1E]">
              {HAPPYNESSLO_COMPANY.customerCare.email}
            </p>
            <p className="text-xs text-[#1E1E1E]/60">
              {HAPPYNESSLO_COMPANY.customerCare.responseSla}
            </p>
          </a>

          <div className="bg-white border border-[#1E1E1E]/10 rounded-lg p-6 space-y-2">
            <div className="flex items-center gap-2.5 text-[#1B3B2B]">
              <Headphones className="w-4 h-4 text-[#C5A059]" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                WhatsApp &amp; Video Concierge
              </span>
            </div>
            <p className="font-serif text-xl font-semibold text-[#1E1E1E] tabular-nums">
              {HAPPYNESSLO_COMPANY.customerCare.whatsappConcierge}
            </p>
            <p className="text-xs text-[#1E1E1E]/60">
              Live 4K macro showcase from Jaipur &amp; Mumbai boutiques
            </p>
          </div>
        </div>

        {/* Connected Support Ticket Form + Live Ticket Tracker */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <form
            onSubmit={handleSupportSubmit}
            className="lg:col-span-7 bg-white border border-[#1E1E1E]/10 rounded-xl p-6 sm:p-8 space-y-5"
          >
            <div>
              <h3 className="font-serif text-2xl font-semibold text-[#1E1E1E]">
                Connect with HAPPYNESSLO Customer Care
              </h3>
              <p className="text-xs text-[#1E1E1E]/65 mt-1">
                Submit a request linked to your order or book a private boutique visit. Tickets route directly to our Atelier Care Desk.
              </p>
            </div>

            {submittedTicket && (
              <div className="bg-[#1B3B2B] text-[#FAF7F2] rounded-lg p-4 flex items-start gap-3 text-xs">
                <CheckCircle2 className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-sm">
                    Ticket {submittedTicket.ticketNumber} Logged
                  </p>
                  <p className="text-[#FAF7F2]/80">
                    Our concierge team at {HAPPYNESSLO_COMPANY.customerCare.email} will respond to{' '}
                    {submittedTicket.customerEmail} within 2 hours.
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#1E1E1E]/75 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ananya Deshmukh"
                  className="w-full px-3.5 py-2.5 text-sm border border-[#1E1E1E]/15 rounded-md focus:outline-none focus:border-[#1B3B2B]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#1E1E1E]/75 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="collector@domain.in"
                  className="w-full px-3.5 py-2.5 text-sm border border-[#1E1E1E]/15 rounded-md focus:outline-none focus:border-[#1B3B2B]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#1E1E1E]/75 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-[#1E1E1E]/15 rounded-md focus:outline-none focus:border-[#1B3B2B]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#1E1E1E]/75 mb-1.5">
                  Support Topic
                </label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value as SupportTopic)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#1E1E1E]/15 rounded-md focus:outline-none focus:border-[#1B3B2B]"
                >
                  {SUPPORT_TOPICS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#1E1E1E]/75 mb-1.5">
                Link Existing Order (Optional)
              </label>
              <select
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#1E1E1E]/15 rounded-md focus:outline-none focus:border-[#1B3B2B]"
              >
                <option value="">General Inquiry (No Order Linked)</option>
                {orders.map((o) => (
                  <option key={o.id} value={o.orderNumber}>
                    {o.orderNumber} — {o.customerName} ({o.items[0]?.name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#1E1E1E]/75 mb-1.5">
                How can our customer care specialists help?
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share resizing measurements, preferred salon appointment time, or insured dispatch questions..."
                className="w-full px-3.5 py-2.5 text-sm border border-[#1E1E1E]/15 rounded-md focus:outline-none focus:border-[#1B3B2B]"
              />
            </div>

            {formError && (
              <p role="alert" className="text-xs font-medium text-[#9E2A2B]">
                {formError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 px-6 bg-[#1B3B2B] text-[#FAF7F2] text-sm font-semibold rounded-md hover:bg-[#142D20] transition-colors cursor-pointer"
            >
              Send to Customer Care
            </button>
          </form>

          {/* Right: Live Connected Support Desk Queue */}
          <div className="lg:col-span-5 bg-white border border-[#1E1E1E]/10 rounded-xl p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between gap-2 border-b border-[#1E1E1E]/10 pb-4">
              <div>
                <h3 className="font-serif text-xl font-semibold text-[#1E1E1E]">
                  Recent Care Requests
                </h3>
                <p className="text-xs text-[#1E1E1E]/60 mt-0.5">
                  Synced live with HAPPYNESSLO Admin Care Desk
                </p>
              </div>
              <ShieldCheck className="w-5 h-5 text-[#1B3B2B]" />
            </div>

            <div className="space-y-4">
              {supportTickets.slice(0, 4).map((t) => (
                <article
                  key={t.id}
                  className="bg-[#FAF7F2] border border-[#1E1E1E]/8 rounded-lg p-4 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-semibold text-[#1B3B2B] tabular-nums">
                      {t.ticketNumber}
                      {t.orderNumber ? ` · ${t.orderNumber}` : ''}
                    </span>
                    <span
                      className={`font-medium ${
                        t.status === 'Resolved'
                          ? 'text-[#1B3B2B]'
                          : t.status === 'In Review'
                            ? 'text-[#9E7C3B]'
                            : 'text-[#1E1E1E]/75'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#1E1E1E]">{t.topic}</p>
                  <p className="text-xs text-[#1E1E1E]/75 leading-relaxed line-clamp-2">
                    {t.message}
                  </p>
                  <p className="text-[11px] text-[#1E1E1E]/55">
                    {t.customerName} · {t.createdAt}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
