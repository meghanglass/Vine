import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2 } from 'lucide-react';
import type { Wine, WineType } from '../types';
import { StarRating } from './StarRating';
import { typeConfig } from './WineTypeIcon';
import { ImageUpload } from './ImageUpload';

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (wine: Omit<Wine, 'id' | 'dateAdded'>) => void;
  initial?: Wine | null;
}

const WINE_TYPES: WineType[] = ['red', 'white', 'rosé', 'sparkling', 'dessert', 'fortified'];
const COMMON_PAIRINGS = ['Beef', 'Lamb', 'Pork', 'Chicken', 'Fish', 'Seafood', 'Pasta', 'Pizza', 'Cheese', 'Charcuterie', 'Salad', 'Chocolate', 'Fruit', 'Nuts'];
const CURRENCIES = ['PLN', 'EUR', 'USD', 'GBP', 'CHF'];

function empty(): Omit<Wine, 'id' | 'dateAdded'> {
  return {
    name: '',
    winery: '',
    vintage: null,
    type: 'red',
    grapes: '',
    region: '',
    country: '',
    rating: 3,
    price: null,
    currency: 'PLN',
    notes: '',
    pairings: [],
    dateTasted: null,
    favorite: false,
    bottlesOwned: 1,
    photo: undefined,
  };
}

export function WineFormModal({ open, onClose, onSave, initial }: Props) {
  const [form, setForm] = useState(empty());
  const [pairingInput, setPairingInput] = useState('');
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (open) {
      setForm(initial ? { ...initial } : empty());
      setStep(0);
      setPairingInput('');
    }
  }, [open, initial]);

  const set = (key: keyof typeof form, value: unknown) =>
    setForm(f => ({ ...f, [key]: value }));

  const addPairing = (p: string) => {
    const trimmed = p.trim();
    if (trimmed && !form.pairings.includes(trimmed)) {
      set('pairings', [...form.pairings, trimmed]);
    }
    setPairingInput('');
  };

  const canProceed = step === 0 ? form.name.trim().length > 0 : true;

  const handleSave = () => {
    if (!form.name.trim()) return;
    onSave(form);
    onClose();
  };

  const steps = ['Essentials', 'Details', 'Tasting'];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
          onClick={e => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            className="w-full max-w-lg bg-white rounded-2xl overflow-hidden modal-scroll"
            style={{
              maxHeight: '90vh',
              border: '1px solid #E7E5E4',
              boxShadow: '0 20px 60px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.07)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-stone-100">
              <div>
                <h2 className="text-base font-semibold text-stone-900">
                  {initial ? 'Edit wine' : 'Add wine'}
                </h2>
                <p className="text-xs text-stone-400 mt-0.5">{steps[step]}</p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Step indicator */}
            <div className="flex gap-1.5 px-6 py-3">
              {steps.map((s, i) => (
                <button
                  key={s}
                  onClick={() => i < step || (i === step + 1 && canProceed) ? setStep(i) : null}
                  className={`flex-1 h-0.5 rounded-full transition-all duration-300 ${
                    i <= step ? 'bg-stone-900' : 'bg-stone-200'
                  }`}
                  aria-label={s}
                />
              ))}
            </div>

            {/* Form content */}
            <div className="px-6 pb-6 space-y-4 overflow-y-auto modal-scroll scrollbar-light" style={{ maxHeight: '60vh' }}>
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div
                    key="step0"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.18 }}
                    className="space-y-4"
                  >
                    <ImageUpload
                      value={form.photo}
                      onChange={v => set('photo', v)}
                    />

                    {/* Wine type selector */}
                    <div>
                      <label className="block text-xs text-stone-500 uppercase tracking-wider mb-2 font-medium">Type *</label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {WINE_TYPES.map(t => {
                          const cfg = typeConfig[t];
                          const active = form.type === t;
                          return (
                            <button
                              key={t}
                              type="button"
                              onClick={() => set('type', t)}
                              className={`flex flex-col items-center gap-1 py-2.5 rounded-lg border text-sm transition-all duration-150 ${
                                active ? 'font-medium' : 'border-stone-200 text-stone-600 hover:border-stone-300 bg-white'
                              }`}
                              style={active ? {
                                background: cfg.bg,
                                color: cfg.color,
                                borderColor: `${cfg.color}33`,
                              } : {}}
                            >
                              <span className="text-xl">{cfg.emoji}</span>
                              <span className="text-xs">{cfg.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-stone-500 uppercase tracking-wider mb-2 font-medium">Wine Name *</label>
                      <input
                        className="input-field"
                        placeholder="e.g. Château Margaux, Barolo Riserva…"
                        value={form.name}
                        onChange={e => set('name', e.target.value)}
                        autoFocus
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-stone-500 uppercase tracking-wider mb-2 font-medium">Winery / Producer</label>
                      <input
                        className="input-field"
                        placeholder="Producer name…"
                        value={form.winery}
                        onChange={e => set('winery', e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-stone-500 uppercase tracking-wider mb-2 font-medium">Vintage</label>
                        <input
                          className="input-field"
                          type="number"
                          placeholder="e.g. 2019"
                          min={1800}
                          max={new Date().getFullYear()}
                          value={form.vintage ?? ''}
                          onChange={e => set('vintage', e.target.value ? parseInt(e.target.value) : null)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-stone-500 uppercase tracking-wider mb-2 font-medium">Rating</label>
                        <div className="pt-2">
                          <StarRating value={form.rating} onChange={v => set('rating', v)} size="lg" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.18 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-xs text-stone-500 uppercase tracking-wider mb-2 font-medium">Grape Varieties</label>
                      <input
                        className="input-field"
                        placeholder="e.g. Cabernet Sauvignon, Merlot…"
                        value={form.grapes}
                        onChange={e => set('grapes', e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-stone-500 uppercase tracking-wider mb-2 font-medium">Region</label>
                        <input
                          className="input-field"
                          placeholder="e.g. Bordeaux…"
                          value={form.region}
                          onChange={e => set('region', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-stone-500 uppercase tracking-wider mb-2 font-medium">Country</label>
                        <input
                          className="input-field"
                          placeholder="e.g. France…"
                          value={form.country}
                          onChange={e => set('country', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-xs text-stone-500 uppercase tracking-wider mb-2 font-medium">Currency</label>
                        <select
                          className="input-field"
                          value={form.currency}
                          onChange={e => set('currency', e.target.value)}
                        >
                          {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs text-stone-500 uppercase tracking-wider mb-2 font-medium">Price</label>
                        <input
                          className="input-field"
                          type="number"
                          placeholder="0.00"
                          min={0}
                          step={0.01}
                          value={form.price ?? ''}
                          onChange={e => set('price', e.target.value ? parseFloat(e.target.value) : null)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-stone-500 uppercase tracking-wider mb-2 font-medium">Bottles in Collection</label>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => set('bottlesOwned', Math.max(0, (form.bottlesOwned || 1) - 1))}
                          className="w-9 h-9 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors flex items-center justify-center text-lg font-light"
                        >
                          −
                        </button>
                        <span className="text-stone-900 text-lg font-medium w-8 text-center tabular-nums">{form.bottlesOwned}</span>
                        <button
                          type="button"
                          onClick={() => set('bottlesOwned', (form.bottlesOwned || 1) + 1)}
                          className="w-9 h-9 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors flex items-center justify-center text-lg font-light"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.18 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-xs text-stone-500 uppercase tracking-wider mb-2 font-medium">Date Tasted</label>
                      <input
                        className="input-field"
                        type="date"
                        value={form.dateTasted ?? ''}
                        onChange={e => set('dateTasted', e.target.value || null)}
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-stone-500 uppercase tracking-wider mb-2 font-medium">Tasting Notes</label>
                      <textarea
                        className="input-field resize-none"
                        placeholder="Describe aromas, flavors, finish…"
                        rows={4}
                        value={form.notes}
                        onChange={e => set('notes', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-stone-500 uppercase tracking-wider mb-2 font-medium">Food Pairings</label>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {COMMON_PAIRINGS.map(p => {
                          const active = form.pairings.includes(p);
                          return (
                            <button
                              key={p}
                              type="button"
                              onClick={() =>
                                set('pairings', active
                                  ? form.pairings.filter(x => x !== p)
                                  : [...form.pairings, p])
                              }
                              className={`px-2.5 py-1 rounded-full text-xs border transition-all duration-150 ${
                                active
                                  ? 'bg-stone-900 border-stone-900 text-white font-medium'
                                  : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                              }`}
                            >
                              {p}
                            </button>
                          );
                        })}
                      </div>
                      <div className="flex gap-2">
                        <input
                          className="input-field text-sm"
                          placeholder="Add custom pairing…"
                          value={pairingInput}
                          onChange={e => setPairingInput(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addPairing(pairingInput))}
                        />
                        <button
                          type="button"
                          onClick={() => addPairing(pairingInput)}
                          className="px-3 bg-white border border-stone-200 rounded-lg text-stone-600 hover:bg-stone-50 hover:border-stone-300 transition-colors"
                        >
                          <Plus size={15} />
                        </button>
                      </div>
                      {form.pairings.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {form.pairings.map(p => (
                            <span key={p} className="flex items-center gap-1 px-2.5 py-1 bg-stone-100 rounded-full text-xs text-stone-700">
                              {p}
                              <button
                                onClick={() => set('pairings', form.pairings.filter(x => x !== p))}
                                className="text-stone-400 hover:text-stone-600"
                              >
                                <Trash2 size={10} />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <button
                        type="button"
                        onClick={() => set('favorite', !form.favorite)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all duration-150 ${
                          form.favorite
                            ? 'bg-red-50 border-red-200 text-red-600'
                            : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                        }`}
                      >
                        ♥ {form.favorite ? 'In Favorites' : 'Add to Favorites'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center px-6 py-4 border-t border-stone-100">
              <button
                onClick={() => step > 0 ? setStep(step - 1) : onClose()}
                className="btn-secondary text-sm px-4 py-2"
              >
                {step === 0 ? 'Cancel' : '← Back'}
              </button>
              {step < 2 ? (
                <button
                  onClick={() => canProceed && setStep(step + 1)}
                  disabled={!canProceed}
                  className="btn-primary text-sm px-5 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  disabled={!form.name.trim()}
                  className="btn-primary text-sm px-5 py-2 disabled:opacity-40"
                >
                  {initial ? 'Save changes' : 'Add to cellar'}
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
