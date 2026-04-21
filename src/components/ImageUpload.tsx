import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Images, X, Loader2, ImagePlus } from 'lucide-react';
import { compressImage } from '../utils/imageUtils';

interface Props {
  value: string | undefined;
  onChange: (base64: string | undefined) => void;
}

export function ImageUpload({ value, onChange }: Props) {
  const galleryRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const compressed = await compressImage(file);
      onChange(compressed);
    } catch {
      setError('Could not process this image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <label className="block text-xs text-wine-400 uppercase tracking-wider mb-2">
        Photo
      </label>

      <AnimatePresence mode="wait">
        {value ? (
          /* ── Preview ── */
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative rounded-2xl overflow-hidden"
            style={{ height: 180 }}
          >
            <img
              src={value}
              alt="Wine photo"
              className="w-full h-full object-cover"
            />
            {/* dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

            {/* action buttons */}
            <div className="absolute bottom-3 right-3 flex gap-1.5">
              <button
                type="button"
                onClick={() => galleryRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-black/50 text-cream hover:bg-black/70 transition-colors backdrop-blur-sm"
                aria-label="Change photo from gallery"
              >
                <Images size={13} />
                Change
              </button>
              <button
                type="button"
                onClick={() => onChange(undefined)}
                className="p-1.5 rounded-xl bg-black/50 text-cream/70 hover:text-red-400 hover:bg-black/70 transition-colors backdrop-blur-sm"
                aria-label="Remove photo"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        ) : (
          /* ── Empty picker ── */
          <motion.div
            key="picker"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            {loading ? (
              <div
                className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-wine-700"
                style={{ height: 120 }}
              >
                <Loader2 size={22} className="text-gold animate-spin" />
                <span className="text-xs text-wine-400">Processing…</span>
              </div>
            ) : (
              <div
                className="rounded-2xl border border-dashed border-wine-800 hover:border-wine-600 transition-colors"
                style={{ background: 'rgba(45,15,19,0.5)' }}
              >
                {/* Drop hint */}
                <div className="flex flex-col items-center gap-2 py-5 pointer-events-none select-none">
                  <ImagePlus size={26} className="text-wine-600" />
                  <p className="text-xs text-wine-400">Add a photo of the label or bottle</p>
                </div>

                {/* Source buttons */}
                <div className="flex gap-2 px-4 pb-4">
                  <button
                    type="button"
                    onClick={() => galleryRef.current?.click()}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-wine-800 text-cream/70 text-sm hover:border-gold/50 hover:text-cream hover:bg-gold/5 transition-all"
                  >
                    <Images size={16} className="text-gold" />
                    Gallery
                  </button>
                  <button
                    type="button"
                    onClick={() => cameraRef.current?.click()}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-wine-800 text-cream/70 text-sm hover:border-gold/50 hover:text-cream hover:bg-gold/5 transition-all"
                  >
                    <Camera size={16} className="text-gold" />
                    Camera
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p className="mt-1.5 text-xs text-red-400">{error}</p>
      )}

      {/* Hidden inputs */}
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => handleFile(e.target.files?.[0])}
        onClick={e => ((e.target as HTMLInputElement).value = '')}
      />
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={e => handleFile(e.target.files?.[0])}
        onClick={e => ((e.target as HTMLInputElement).value = '')}
      />
    </div>
  );
}
