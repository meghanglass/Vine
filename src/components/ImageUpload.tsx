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
      <label className="block text-xs text-stone-500 uppercase tracking-wider mb-2 font-medium">
        Photo
      </label>

      <AnimatePresence mode="wait">
        {value ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="relative rounded-xl overflow-hidden"
            style={{ height: 180 }}
          >
            <img
              src={value}
              alt="Wine photo"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

            <div className="absolute bottom-3 right-3 flex gap-1.5">
              <button
                type="button"
                onClick={() => galleryRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-black/40 text-white hover:bg-black/60 transition-colors backdrop-blur-sm"
                aria-label="Change photo from gallery"
              >
                <Images size={12} />
                Change
              </button>
              <button
                type="button"
                onClick={() => onChange(undefined)}
                className="p-1.5 rounded-lg bg-black/40 text-white/80 hover:text-red-300 hover:bg-black/60 transition-colors backdrop-blur-sm"
                aria-label="Remove photo"
              >
                <X size={13} />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="picker"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
          >
            {loading ? (
              <div
                className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-stone-300 bg-stone-50"
                style={{ height: 120 }}
              >
                <Loader2 size={20} className="text-stone-400 animate-spin" />
                <span className="text-xs text-stone-400">Processing…</span>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-stone-300 hover:border-stone-400 transition-colors bg-stone-50">
                <div className="flex flex-col items-center gap-1.5 py-4 pointer-events-none select-none">
                  <ImagePlus size={22} className="text-stone-400" strokeWidth={1.5} />
                  <p className="text-xs text-stone-400">Add a photo of the label or bottle</p>
                </div>

                <div className="flex gap-2 px-4 pb-4">
                  <button
                    type="button"
                    onClick={() => galleryRef.current?.click()}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-stone-200 text-stone-600 text-sm hover:bg-white hover:border-stone-300 transition-all bg-white"
                  >
                    <Images size={14} className="text-stone-500" strokeWidth={1.5} />
                    Gallery
                  </button>
                  <button
                    type="button"
                    onClick={() => cameraRef.current?.click()}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-stone-200 text-stone-600 text-sm hover:bg-white hover:border-stone-300 transition-all bg-white"
                  >
                    <Camera size={14} className="text-stone-500" strokeWidth={1.5} />
                    Camera
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p className="mt-1.5 text-xs text-red-500">{error}</p>
      )}

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
