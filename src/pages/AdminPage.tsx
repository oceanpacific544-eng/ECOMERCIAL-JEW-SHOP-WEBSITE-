import {
  AlertTriangle,
  Minus,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { ResilientImage } from '../components/ResilientImage';
import { IMAGES, formatInr } from '../data/seedData';
import { useStore } from '../store/useStore';
import type { Category, Order, SupportTicket } from '../types/jewelry';

const IMAGE_PRESETS: { label: string; url: string }[] = [
  { label: 'Kundan Emerald Choker', url: IMAGES.kundanChoker },
  { label: 'Hammered 22k Gold Band', url: IMAGES.hammeredBand },
  { label: 'Moonstone Drop Earrings', url: IMAGES.moonstoneEarrings },
  { label: 'Zari Woven Cuff', url: IMAGES.zariCuff },
  { label: 'Heritage Polki Signet', url: IMAGES.polkiSignet },
  { label: 'Meenakari Jhumka Earrings', url: IMAGES.meenakariJhumka },
  { label: 'Jadau & Pearl Haar', url: IMAGES.jadauHaar },
  { label: 'Temple Lakshmi Kemp Necklace', url: IMAGES.templeLakshmi },
  { label: 'Maharani Polki Rani Haar', url: IMAGES.raniHaar },
  { label: 'Nizam Emerald Cocktail Ring', url: IMAGES.emeraldCocktail },
  { label: 'Twisted Rope Polki Band', url: IMAGES.twistedEternity },
  { label: 'Rajwada Kundan Chandbali', url: IMAGES.kundanChandbali },
  { label: 'Octagonal Emerald Polki Studs', url: IMAGES.emeraldStuds },
  { label: 'Navratna Meenakari Kada', url: IMAGES.navratnaBangle },
  { label: 'Fluted Hammered Gold Kada', url: IMAGES.hammeredKada },
];

export function AdminPage() {
  const {
    products,
    orders,
    supportTickets,
    adjustProductStock,
    deleteProduct,
    addProduct,
    updateOrderStatus,
    updateTicketStatus,
    navigate,
  } = useStore();

  const [chartMode, setChartMode] = useState<'orders' | 'category'>('orders');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Add New Jewelry Piece form state
  const [newName, setNewName] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('22k Hallmarked Gold · Handcrafted');
  const [newCategory, setNewCategory] = useState<Category>('Necklaces');
  const [newPrice, setNewPrice] = useState('125000');
  const [newStock, setNewStock] = useState('4');
  const [newKarat, setNewKarat] = useState('22k BIS Hallmarked Gold (916)');
  const [newGemstones, setNewGemstones] = useState('Zambian Emerald & Uncut Polki');
  const [newWeight, setNewWeight] = useState('32.5');
  const [newHours, setNewHours] = useState('72');
  const [newOrigin, setNewOrigin] = useState('Johari Bazaar Atelier, Jaipur');
  const [newImageUrl, setNewImageUrl] = useState<string>(IMAGE_PRESETS[0].url);
  const [newDescription, setNewDescription] = useState('');

  // KPI Metrics (Live synced with orders & products)
  const totalRevenue = useMemo(
    () => orders.reduce((sum, o) => sum + o.totalInr, 0),
    [orders]
  );
  const totalOrders = orders.length;
  const lowStockItems = useMemo(
    () => products.filter((p) => p.stock <= 3),
    [products]
  );
  const avgOrderValue =
    totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  // Chart series data
  const chartData = useMemo(() => {
    if (chartMode === 'orders') {
      const chronological = [...orders].reverse();
      return chronological.map((ord) => ({
        label: ord.orderNumber,
        value: ord.totalInr,
        subLabel: `${ord.customerName} (${ord.paymentMethod})`,
      }));
    }

    const categories: Category[] = ['Necklaces', 'Rings', 'Earrings', 'Bracelets'];
    return categories.map((cat) => {
      const value = orders.reduce((sum, ord) => {
        const catTotal = ord.items.reduce((iSum, item) => {
          const prod = products.find((p) => p.id === item.productId);
          return prod?.category === cat
            ? iSum + item.priceInr * item.quantity
            : iSum;
        }, 0);
        return sum + catTotal;
      }, 0);
      return {
        label: cat,
        value,
        subLabel: `Cumulative ${cat} sales`,
      };
    });
  }, [chartMode, orders, products]);

  const maxChartVal = Math.max(
    100000,
    ...chartData.map((d) => d.value)
  );

  const handlePublishProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    addProduct({
      name: newName.trim(),
      subtitle: newSubtitle.trim() || '22k Gold · Handcrafted',
      category: newCategory,
      priceInr: Math.max(1000, Number(newPrice) || 75000),
      stock: Math.max(1, Number(newStock) || 1),
      karat: newKarat.trim(),
      gemstones: newGemstones.trim(),
      weightGrams: Number(newWeight) || 20,
      craftHours: Number(newHours) || 40,
      origin: newOrigin.trim(),
      imageUrl: newImageUrl,
      description:
        newDescription.trim() ||
        'Hand-forged in our Jaipur atelier using 22k hallmarked gold and ethically sourced stones.',
    });

    setNewName('');
    setNewDescription('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="border-b border-[#1E1E1E]/10 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium tracking-wider text-[#9E7C3B]">
            Atelier Operations &amp; Vault Telemetry
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#1E1E1E] mt-1">
            Admin Inventory &amp; Sales Dashboard
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1B3B2B] text-[#FAF7F2] text-sm font-medium rounded-md hover:bg-[#142D20] transition-colors whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#C5A059]" />
          <span>Add New Jewelry Piece</span>
        </button>
      </div>

      {/* 1. 4-Column KPI Strip */}
      <section aria-label="Key Performance Indicators" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-[#1E1E1E]/10 rounded-lg p-6 space-y-2">
          <p className="text-xs font-medium text-[#1E1E1E]/60">Total Revenue</p>
          <p className="font-serif text-2xl sm:text-3xl font-semibold text-[#1E1E1E] tabular-nums">
            {formatInr(totalRevenue)}
          </p>
          <p className="text-xs text-[#1B3B2B] font-medium">
            Synced live with Checkout
          </p>
        </div>

        <div className="bg-white border border-[#1E1E1E]/10 rounded-lg p-6 space-y-2">
          <p className="text-xs font-medium text-[#1E1E1E]/60">Total Orders</p>
          <p className="font-serif text-2xl sm:text-3xl font-semibold text-[#1E1E1E] tabular-nums">
            {totalOrders}
          </p>
          <p className="text-xs text-[#1E1E1E]/60">
            UPI, Card, Razorpay &amp; Stripe
          </p>
        </div>

        <div className="bg-white border border-[#1E1E1E]/10 rounded-lg p-6 space-y-2">
          <p className="text-xs font-medium text-[#1E1E1E]/60">Low Stock Alerts</p>
          <p className="font-serif text-2xl sm:text-3xl font-semibold text-[#9E7C3B] tabular-nums flex items-center gap-2">
            <span>{lowStockItems.length}</span>
            {lowStockItems.length > 0 && (
              <AlertTriangle className="w-5 h-5 text-[#9E7C3B]" />
            )}
          </p>
          <p className="text-xs text-[#1E1E1E]/60">
            Pieces with 3 or fewer in vault
          </p>
        </div>

        <div className="bg-white border border-[#1E1E1E]/10 rounded-lg p-6 space-y-2">
          <p className="text-xs font-medium text-[#1E1E1E]/60">
            Average Order Value
          </p>
          <p className="font-serif text-2xl sm:text-3xl font-semibold text-[#1E1E1E] tabular-nums">
            {formatInr(avgOrderValue)}
          </p>
          <p className="text-xs text-[#1E1E1E]/60">
            Heirloom transaction average
          </p>
        </div>
      </section>

      {/* 2. Interactive Sales Analytics Bar & Trend Chart */}
      <section className="bg-white border border-[#1E1E1E]/10 rounded-xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#1E1E1E]">
              Sales Analytics (₹ INR)
            </h2>
            <p className="text-xs text-[#1E1E1E]/65 mt-0.5">
              Hover any bar to inspect exact transaction or category revenue.
            </p>
          </div>

          <div className="inline-flex p-1 bg-[#F1EBE0] rounded-lg self-start">
            <button
              type="button"
              onClick={() => setChartMode('orders')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                chartMode === 'orders'
                  ? 'bg-[#1B3B2B] text-[#FAF7F2]'
                  : 'text-[#1E1E1E]/75 hover:text-[#1E1E1E]'
              }`}
            >
              By Order Timeline
            </button>
            <button
              type="button"
              onClick={() => setChartMode('category')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                chartMode === 'category'
                  ? 'bg-[#1B3B2B] text-[#FAF7F2]'
                  : 'text-[#1E1E1E]/75 hover:text-[#1E1E1E]'
              }`}
            >
              By Category
            </button>
          </div>
        </div>

        {/* SVG + Interactive Bar Chart */}
        <div className="relative pt-8 pb-2">
          <div className="grid items-end gap-4 sm:gap-6 h-64 border-b border-l border-[#1E1E1E]/15 pl-4 pb-2"
            style={{
              gridTemplateColumns: `repeat(${Math.max(1, chartData.length)}, minmax(0, 1fr))`,
            }}
          >
            {chartData.map((bar, idx) => {
              const heightPct = Math.max(
                6,
                Math.round((bar.value / maxChartVal) * 100)
              );
              const isHovered = hoveredIdx === idx;
              return (
                <div
                  key={bar.label}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className="relative h-full flex flex-col justify-end items-center group"
                >
                  {isHovered && (
                    <div className="absolute -top-9 z-10 px-2.5 py-1.5 rounded bg-[#1E1E1E] text-[#FAF7F2] text-xs whitespace-nowrap shadow-lg pointer-events-none">
                      <span className="font-semibold tabular-nums">
                        {formatInr(bar.value)}
                      </span>{' '}
                      · {bar.subLabel}
                    </div>
                  )}

                  <div className="w-full max-w-[68px] h-full flex items-end">
                    <div
                      className={`w-full rounded-t-md transition-all duration-300 ${
                        isHovered ? 'bg-[#C5A059]' : 'bg-[#1B3B2B]'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* X-Axis Labels */}
          <div
            className="grid gap-4 sm:gap-6 pl-4 pt-2.5"
            style={{
              gridTemplateColumns: `repeat(${Math.max(1, chartData.length)}, minmax(0, 1fr))`,
            }}
          >
            {chartData.map((bar) => (
              <div key={bar.label} className="text-center">
                <p className="text-xs font-medium text-[#1E1E1E]/80 truncate">
                  {bar.label}
                </p>
                <p className="text-[11px] text-[#1E1E1E]/55 tabular-nums truncate">
                  {formatInr(bar.value)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Live Inventory Management Table */}
      <section className="bg-white border border-[#1E1E1E]/10 rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-[#1E1E1E]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#1E1E1E]">
              Live Vault Inventory
            </h2>
            <p className="text-xs text-[#1E1E1E]/65 mt-0.5">
              Adjust stock counts, remove pieces, or publish new additions directly to the Shop page.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/shop')}
            className="text-xs font-semibold text-[#1B3B2B] hover:underline underline-offset-4 cursor-pointer self-start sm:self-auto"
          >
            Preview Live Shop →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1E1E1E]/10 bg-[#FAF7F2] text-xs font-semibold text-[#1E1E1E]/65">
                <th className="py-3.5 px-6">Piece</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price (INR)</th>
                <th className="py-3.5 px-4">Vault Stock</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E1E1E]/8 text-sm">
              {products.map((prod) => {
                const statusText =
                  prod.stock === 0
                    ? 'Out of Stock'
                    : prod.stock <= 3
                      ? 'Low Stock Alert'
                      : 'Healthy';

                return (
                  <tr key={prod.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-10 rounded overflow-hidden bg-[#F1EBE0] shrink-0">
                          <ResilientImage
                            src={prod.imageUrl}
                            alt={prod.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-serif font-semibold text-[#1E1E1E] truncate max-w-[240px]">
                            {prod.name}
                          </p>
                          <p className="text-xs text-[#1E1E1E]/55 truncate max-w-[240px]">
                            {prod.origin}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-medium text-[#1E1E1E]/75">
                      {prod.category}
                    </td>
                    <td className="py-3.5 px-4 font-semibold tabular-nums">
                      {formatInr(prod.priceInr)}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="inline-flex items-center border border-[#1E1E1E]/15 rounded-md bg-white">
                        <button
                          type="button"
                          aria-label={`Decrease stock for ${prod.name}`}
                          onClick={() => adjustProductStock(prod.id, -1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-[#F1EBE0] cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-9 text-center text-xs font-semibold tabular-nums">
                          {prod.stock}
                        </span>
                        <button
                          type="button"
                          aria-label={`Increase stock for ${prod.name}`}
                          onClick={() => adjustProductStock(prod.id, 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-[#F1EBE0] cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-medium">
                      <span
                        className={
                          prod.stock === 0
                            ? 'text-[#9E2A2B]'
                            : prod.stock <= 3
                              ? 'text-[#9E7C3B]'
                              : 'text-[#1B3B2B]'
                        }
                      >
                        {statusText}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <button
                        type="button"
                        aria-label={`Delete ${prod.name}`}
                        onClick={() => deleteProduct(prod.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#9E2A2B] hover:bg-[#9E2A2B]/10 rounded transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. Live Orders Ledger */}
      <section className="bg-white border border-[#1E1E1E]/10 rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-[#1E1E1E]/10">
          <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#1E1E1E]">
            Recent Collector Orders
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1E1E1E]/10 bg-[#FAF7F2] text-xs font-semibold text-[#1E1E1E]/65">
                <th className="py-3.5 px-6">Order</th>
                <th className="py-3.5 px-4">Collector</th>
                <th className="py-3.5 px-4">Items</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Total (INR)</th>
                <th className="py-3.5 px-6">Fulfillment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E1E1E]/8 text-sm">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                  <td className="py-3.5 px-6 font-semibold tabular-nums text-[#1B3B2B]">
                    {ord.orderNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-medium text-[#1E1E1E]">{ord.customerName}</p>
                    <p className="text-xs text-[#1E1E1E]/55">{ord.customerEmail}</p>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-[#1E1E1E]/80">
                    {ord.items
                      .map((i) => `${i.name} × ${i.quantity}`)
                      .join(', ')}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-[#1E1E1E]/70">
                    {ord.paymentMethod}
                  </td>
                  <td className="py-3.5 px-4 font-semibold tabular-nums">
                    {formatInr(ord.totalInr)}
                  </td>
                  <td className="py-3.5 px-6">
                    <select
                      aria-label={`Update status for ${ord.orderNumber}`}
                      value={ord.status}
                      onChange={(e) =>
                        updateOrderStatus(
                          ord.id,
                          e.target.value as Order['status']
                        )
                      }
                      className="px-2.5 py-1.5 text-xs font-medium bg-[#FAF7F2] border border-[#1E1E1E]/15 rounded-md cursor-pointer focus:outline-none focus:border-[#1B3B2B]"
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Crafting">Crafting</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. HAPPYNESSLO Customer Care Support Queue */}
      <section className="bg-white border border-[#1E1E1E]/10 rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-[#1E1E1E]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#1E1E1E]">
              HAPPYNESSLO Customer Care Queue
            </h2>
            <p className="text-xs text-[#1E1E1E]/65 mt-0.5">
              Live support inquiries &amp; boutique salon appointments submitted from the Company &amp; Care page.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/company')}
            className="text-xs font-semibold text-[#1B3B2B] hover:underline underline-offset-4 cursor-pointer self-start sm:self-auto"
          >
            View Customer Care Page →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1E1E1E]/10 bg-[#FAF7F2] text-xs font-semibold text-[#1E1E1E]/65">
                <th className="py-3.5 px-6">Ticket</th>
                <th className="py-3.5 px-4">Collector</th>
                <th className="py-3.5 px-4">Topic &amp; Order</th>
                <th className="py-3.5 px-4">Message</th>
                <th className="py-3.5 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E1E1E]/8 text-sm">
              {supportTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                  <td className="py-3.5 px-6 font-semibold tabular-nums text-[#1B3B2B]">
                    {ticket.ticketNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-medium text-[#1E1E1E]">{ticket.customerName}</p>
                    <p className="text-xs text-[#1E1E1E]/55">
                      {ticket.customerEmail} · {ticket.customerPhone}
                    </p>
                  </td>
                  <td className="py-3.5 px-4 text-xs">
                    <p className="font-semibold text-[#1E1E1E]">{ticket.topic}</p>
                    <p className="text-[#1E1E1E]/55 tabular-nums">
                      {ticket.orderNumber || 'General Inquiry'}
                    </p>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-[#1E1E1E]/80 max-w-xs">
                    <p className="line-clamp-2">{ticket.message}</p>
                  </td>
                  <td className="py-3.5 px-6">
                    <select
                      aria-label={`Update status for ${ticket.ticketNumber}`}
                      value={ticket.status}
                      onChange={(e) =>
                        updateTicketStatus(
                          ticket.id,
                          e.target.value as SupportTicket['status']
                        )
                      }
                      className="px-2.5 py-1.5 text-xs font-medium bg-[#FAF7F2] border border-[#1E1E1E]/15 rounded-md cursor-pointer focus:outline-none focus:border-[#1B3B2B]"
                    >
                      <option value="Open">Open</option>
                      <option value="In Review">In Review</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Add New Jewelry Piece Modal */}
      {isAddModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Add New Jewelry Piece"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E1E1E]/75 backdrop-blur-sm"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="bg-[#FAF7F2] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#1E1E1E]/15"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-5 border-b border-[#1E1E1E]/10 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-2xl font-semibold text-[#1E1E1E]">
                  Publish New Jewelry Piece
                </h3>
                <p className="text-xs text-[#1E1E1E]/65 mt-0.5">
                  Publishes immediately to the Shop catalog and Inventory Vault.
                </p>
              </div>
              <button
                type="button"
                aria-label="Close modal"
                onClick={() => setIsAddModalOpen(false)}
                className="w-9 h-9 rounded-md flex items-center justify-center text-[#1E1E1E]/70 hover:bg-[#F1EBE0] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePublishProduct} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#1E1E1E]/75 mb-1">
                    Piece Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Nizam Emerald Polki Pendant"
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#1E1E1E]/15 rounded-md focus:outline-none focus:border-[#1B3B2B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#1E1E1E]/75 mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as Category)}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#1E1E1E]/15 rounded-md focus:outline-none focus:border-[#1B3B2B]"
                  >
                    <option value="Necklaces">Necklaces</option>
                    <option value="Rings">Rings</option>
                    <option value="Earrings">Earrings</option>
                    <option value="Bracelets">Bracelets</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#1E1E1E]/75 mb-1">
                    Price (₹ INR)
                  </label>
                  <input
                    type="number"
                    min={1000}
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#1E1E1E]/15 rounded-md tabular-nums focus:outline-none focus:border-[#1B3B2B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#1E1E1E]/75 mb-1">
                    Initial Vault Stock
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#1E1E1E]/15 rounded-md tabular-nums focus:outline-none focus:border-[#1B3B2B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#1E1E1E]/75 mb-1">
                    Subtitle / Material Summary
                  </label>
                  <input
                    type="text"
                    value={newSubtitle}
                    onChange={(e) => setNewSubtitle(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#1E1E1E]/15 rounded-md focus:outline-none focus:border-[#1B3B2B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#1E1E1E]/75 mb-1">
                    Atelier Photography
                  </label>
                  <select
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#1E1E1E]/15 rounded-md focus:outline-none focus:border-[#1B3B2B]"
                  >
                    {IMAGE_PRESETS.map((preset) => (
                      <option key={preset.url} value={preset.url}>
                        {preset.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#1E1E1E]/75 mb-1">
                    Gold Karat &amp; Hallmark
                  </label>
                  <input
                    type="text"
                    value={newKarat}
                    onChange={(e) => setNewKarat(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#1E1E1E]/15 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#1E1E1E]/75 mb-1">
                    Gemstones
                  </label>
                  <input
                    type="text"
                    value={newGemstones}
                    onChange={(e) => setNewGemstones(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#1E1E1E]/15 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#1E1E1E]/75 mb-1">
                    Weight (grams)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#1E1E1E]/15 rounded-md tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#1E1E1E]/75 mb-1">
                    Craft Hours &amp; Origin
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={newHours}
                      onChange={(e) => setNewHours(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#1E1E1E]/15 rounded-md tabular-nums"
                    />
                    <input
                      type="text"
                      value={newOrigin}
                      onChange={(e) => setNewOrigin(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#1E1E1E]/15 rounded-md"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#1E1E1E]/75 mb-1">
                  Provenance &amp; Craft Description
                </label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Describe the hand-forging, stone origin, and setting technique..."
                  className="w-full px-3.5 py-2 text-sm bg-white border border-[#1E1E1E]/15 rounded-md focus:outline-none focus:border-[#1B3B2B]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 text-sm font-medium text-[#1E1E1E]/75 hover:bg-[#F1EBE0] rounded-md cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-semibold bg-[#1B3B2B] text-[#FAF7F2] rounded-md hover:bg-[#142D20] transition-colors cursor-pointer"
                >
                  Publish Piece to Shop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
