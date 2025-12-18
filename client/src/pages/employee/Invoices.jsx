import React, { useState, useMemo, useEffect } from 'react';

const createEmptyItem = () => ({
  id: Date.now() + Math.random(),
  description: '',
  quantity: 1,
  rate: 0,
});

const formatCurrency = (value, currency = 'USD') =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(isNaN(value) ? 0 : value);

const Invoices = () => {
  const [theme, setTheme] = useState('classic');
  const [currency, setCurrency] = useState('USD');

  const [invoiceInfo, setInvoiceInfo] = useState({
    from: '',
    billTo: '',
    shipTo: '',
    invoiceNumber: '1',
    date: '',
    paymentTerms: '',
    dueDate: '',
    poNumber: '',
    notes: '',
    terms: '',
    taxPercent: 0,
    discount: 0,
    shipping: 0,
    amountPaid: 0,
  });

  const [logoPreview, setLogoPreview] = useState(null);
  const [items, setItems] = useState([
    createEmptyItem(),
    createEmptyItem(),
    createEmptyItem(),
  ]);

  // Load saved preferences on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('invoicePreferences');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.theme) setTheme(parsed.theme);
        if (parsed.currency) setCurrency(parsed.currency);
      }
    } catch (e) {
      // ignore parse errors
    }
  }, []);

  const currencySymbols = {
    USD: '$',
    EUR: 'EUR',
    INR: 'INR',
  };

  const currencySymbol = currencySymbols[currency] || '$';

  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setInvoiceInfo((prev) => ({
      ...prev,
      [name]: name === 'taxPercent' ||
        name === 'discount' ||
        name === 'shipping' ||
        name === 'amountPaid'
        ? value.replace(/[^0-9.]/g, '')
        : value,
    }));
  };

  const handleItemChange = (id, field, value) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]:
                field === 'quantity' || field === 'rate'
                  ? value.replace(/[^0-9.]/g, '')
                  : value,
            }
          : item
      )
    );
  };

  const handleAddItem = () => {
    setItems((prev) => [...prev, createEmptyItem()]);
  };

  const handleRemoveItem = (id) => {
    setItems((prev) => (prev.length > 1 ? prev.filter((item) => item.id !== id) : prev));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const { subTotal, taxAmount, total, balanceDue } = useMemo(() => {
    const subTotalCalc = items.reduce((sum, item) => {
      const qty = parseFloat(item.quantity) || 0;
      const rate = parseFloat(item.rate) || 0;
      return sum + qty * rate;
    }, 0);

    const taxPercent = parseFloat(invoiceInfo.taxPercent) || 0;
    const discount = parseFloat(invoiceInfo.discount) || 0;
    const shipping = parseFloat(invoiceInfo.shipping) || 0;
    const amountPaid = parseFloat(invoiceInfo.amountPaid) || 0;

    const taxAmountCalc = (subTotalCalc * taxPercent) / 100;
    const totalCalc = subTotalCalc + taxAmountCalc + shipping - discount;
    const balanceDueCalc = totalCalc - amountPaid;

    return {
      subTotal: subTotalCalc,
      taxAmount: taxAmountCalc,
      total: totalCalc,
      balanceDue: balanceDueCalc,
    };
  }, [items, invoiceInfo]);

  const handleDownload = () => {
    // Simple implementation - opens browser print dialog for PDF export
    window.print();
  };

  const handleSaveDefaults = () => {
    const prefs = {
      theme,
      currency,
    };
    localStorage.setItem('invoicePreferences', JSON.stringify(prefs));
  };

  const handleReset = () => {
    setInvoiceInfo((prev) => ({
      ...prev,
      from: '',
      billTo: '',
      shipTo: '',
      notes: '',
      terms: '',
      taxPercent: 0,
      discount: 0,
      shipping: 0,
      amountPaid: 0,
    }));
    setItems([createEmptyItem()]);
    setLogoPreview(null);
  };

  const cardThemeClass =
    theme === 'modern'
      ? 'bg-slate-50'
      : theme === 'minimal'
      ? 'bg-white'
      : 'bg-white';

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-8">
      <div className="w-full max-w-7xl flex gap-6">
        <div
          className={`flex-1 ${cardThemeClass} shadow-xl rounded-xl border border-gray-200 p-8`}
        >
          <div className="flex flex-wrap items-start justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <label className="border-2 border-dashed border-gray-300 rounded-lg w-32 h-32 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 transition">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <React.Fragment>
                    <span className="text-xl text-gray-400 mb-2">+</span>
                    <span className="text-xs font-medium text-gray-500 text-center">
                      Add Your Logo
                    </span>
                  </React.Fragment>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoChange}
                />
              </label>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Who is this from?
                  </label>
                  <input
                    type="text"
                    name="from"
                    value={invoiceInfo.from}
                    onChange={handleInfoChange}
                    placeholder="Your company or name"
                    className="w-80 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Bill To
                    </label>
                    <input
                      type="text"
                      name="billTo"
                      value={invoiceInfo.billTo}
                      onChange={handleInfoChange}
                      placeholder="Client name or company"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Ship To
                    </label>
                    <input
                      type="text"
                      name="shipTo"
                      value={invoiceInfo.shipTo}
                      onChange={handleInfoChange}
                      placeholder="(optional)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right space-y-3">
              <div>
                <p className="text-sm tracking-widest text-gray-500">INVOICE</p>
              </div>
              <div className="flex items-center justify-end gap-2">
                <span className="text-xs font-medium text-gray-500">#</span>
                <input
                  type="text"
                  name="invoiceNumber"
                  value={invoiceInfo.invoiceNumber}
                  onChange={handleInfoChange}
                  className="w-28 px-3 py-1.5 border border-gray-300 rounded-md text-sm text-right focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                <label className="flex flex-col gap-1">
                  <span>Date</span>
                  <input
                    type="date"
                    name="date"
                    value={invoiceInfo.date}
                    onChange={handleInfoChange}
                    className="px-2 py-1.5 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span>Payment Terms</span>
                  <input
                    type="text"
                    name="paymentTerms"
                    value={invoiceInfo.paymentTerms}
                    onChange={handleInfoChange}
                    className="px-2 py-1.5 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span>Due Date</span>
                  <input
                    type="date"
                    name="dueDate"
                    value={invoiceInfo.dueDate}
                    onChange={handleInfoChange}
                    className="px-2 py-1.5 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span>PO Number</span>
                  <input
                    type="text"
                    name="poNumber"
                    value={invoiceInfo.poNumber}
                    onChange={handleInfoChange}
                    className="px-2 py-1.5 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden mb-6">
            <div className="grid grid-cols-12 bg-slate-900 text-white text-xs font-semibold px-4 py-3">
              <div className="col-span-6">Item</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-center">Rate</div>
              <div className="col-span-2 text-right">Amount</div>
            </div>

            {items.map((item) => {
              const qty = parseFloat(item.quantity) || 0;
              const rate = parseFloat(item.rate) || 0;
              const amount = qty * rate;

              return (
                <div
                  key={item.id}
                  className="grid grid-cols-12 gap-2 px-4 py-3 border-t border-gray-100 items-center bg-white"
                >
                  <div className="col-span-6">
                    <input
                      type="text"
                      placeholder="Description of item/service..."
                      value={item.description}
                      onChange={(e) =>
                        handleItemChange(item.id, 'description', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="text"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(item.id, 'quantity', e.target.value)
                      }
                      className="w-20 mx-auto px-2 py-1.5 border border-gray-200 rounded-md text-sm text-center focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="col-span-2 flex items-center justify-center gap-1">
                    <span className="text-xs text-gray-500">{currencySymbol}</span>
                    <input
                      type="text"
                      value={item.rate}
                      onChange={(e) =>
                        handleItemChange(item.id, 'rate', e.target.value)
                      }
                      className="w-20 px-2 py-1.5 border border-gray-200 rounded-md text-sm text-right focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="col-span-2 flex items-center justify-end gap-3">
                    <span className="text-sm text-gray-700 min-w-[80px] text-right">
                      {formatCurrency(amount, currency)}
                    </span>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-xs text-red-500 hover:text-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
              <button
                type="button"
                onClick={handleAddItem}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-emerald-700 bg-white border border-emerald-500 rounded-md hover:bg-emerald-50"
              >
                + Line Item
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                value={invoiceInfo.notes}
                onChange={handleInfoChange}
                rows={3}
                placeholder="Notes - any relevant information not already covered"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Terms
              </label>
              <textarea
                name="terms"
                value={invoiceInfo.terms}
                onChange={handleInfoChange}
                rows={3}
                placeholder="Terms and conditions - late fees, payment methods, delivery schedule"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className="w-full max-w-md space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">
                  {formatCurrency(subTotal, currency)}
                </span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-gray-600">Tax</span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    name="taxPercent"
                    value={invoiceInfo.taxPercent}
                    onChange={handleInfoChange}
                    className="w-16 px-2 py-1 border border-gray-300 rounded-md text-xs text-right focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <span className="text-xs text-gray-500">%</span>
                  <span className="font-medium min-w-[80px] text-right">
                    {formatCurrency(taxAmount, currency)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center gap-2">
                <button
                  type="button"
                  className="text-xs text-emerald-600 hover:text-emerald-700"
                >
                  + Discount
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{currencySymbol}</span>
                  <input
                    type="text"
                    name="discount"
                    value={invoiceInfo.discount}
                    onChange={handleInfoChange}
                    className="w-20 px-2 py-1 border border-gray-300 rounded-md text-xs text-right focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="flex justify-between items-center gap-2">
                <button
                  type="button"
                  className="text-xs text-emerald-600 hover:text-emerald-700"
                >
                  + Shipping
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{currencySymbol}</span>
                  <input
                    type="text"
                    name="shipping"
                    value={invoiceInfo.shipping}
                    onChange={handleInfoChange}
                    className="w-20 px-2 py-1 border border-gray-300 rounded-md text-xs text-right focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="border-t border-gray-200 my-2" />
              <div className="flex justify-between">
                <span className="font-semibold text-gray-800">Total</span>
                <span className="font-semibold text-lg">
                  {formatCurrency(total, currency)}
                </span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-gray-600">Amount Paid</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{currencySymbol}</span>
                  <input
                    type="text"
                    name="amountPaid"
                    value={invoiceInfo.amountPaid}
                    onChange={handleInfoChange}
                    className="w-24 px-2 py-1 border border-gray-300 rounded-md text-xs text-right focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="font-semibold text-gray-800">Balance Due</span>
                <span className="font-semibold text-lg">
                  {formatCurrency(balanceDue, currency)}
                </span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700"
              >
                Download / Print
              </button>
            </div>
          </div>
        </div>

        <aside className="hidden md:block w-64 bg-white shadow-md rounded-xl border border-gray-200 p-4 self-start">
          <button
            type="button"
            onClick={handleDownload}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium py-2.5 rounded-md mb-4"
          >
            Download
          </button>

          <hr className="border-gray-200 mb-4" />

          <div className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Theme
              </label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              >
                <option value="classic">Classic</option>
                <option value="modern">Modern</option>
                <option value="minimal">Minimal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              >
                <option value="USD">USD (USD)</option>
                <option value="EUR">EUR (EUR)</option>
                <option value="INR">INR (INR)</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSaveDefaults}
            className="mt-6 w-full text-center text-xs font-semibold text-emerald-600 hover:text-emerald-700"
          >
            Save Default
          </button>
        </aside>
      </div>
    </div>
  );
};

export default Invoices;


