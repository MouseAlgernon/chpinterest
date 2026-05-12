import { useState, useEffect } from 'react';
import { Share2, MoreHorizontal, Heart, Download } from 'lucide-react';
import { Pin, useAppContext } from '../../AppContext';
import { usePinActions } from '../hooks/usePinActions';
import { downloadImage } from '../utils/download';

interface PinCardProps {
  pin: Pin;
}

export function PinCard({ pin }: PinCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { setSelectedPin, currentUser } = useAppContext();
  const { state, toggleSave, fetchState } = usePinActions(pin.pin_id, currentUser?.user_id);

  useEffect(() => {
    fetchState();
  }, [fetchState]);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    downloadImage(pin.image_url, `${pin.title || 'pin'}.jpg`);
  };

  return (
    <div
      className="relative overflow-hidden rounded-2xl cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setSelectedPin(pin)}
    >
      <img
        src={pin.image_url}
        alt={pin.title}
        className="w-full h-auto object-cover transition-all duration-300 group-hover:brightness-75"
      />
      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-between p-4">
          <div className="flex justify-end gap-2">
            <button 
              onClick={handleDownload}
              className={`bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full font-semibold transition-all flex items-center gap-2`}
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-white">
              <h3 className="font-semibold mb-1">{pin.title}</h3>
              <p className="text-sm text-white/80">{pin.category}</p>
            </div>
            <div className="flex gap-2">
              <button className="bg-white/90 hover:bg-white p-2 rounded-full transition-all">
                <Share2 className="w-4 h-4 text-black" />
              </button>
              <button className="bg-white/90 hover:bg-white p-2 rounded-full transition-all">
                <MoreHorizontal className="w-4 h-4 text-black" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}