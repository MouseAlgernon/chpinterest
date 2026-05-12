import { useRef, useState, useEffect } from "react";
import Masonry from "react-responsive-masonry";
import { PinCard } from './PinCard';
import { useAppContext } from "../../AppContext";

function getColumns(width: number) {
  if (width >= 1500) return 6;
  if (width >= 1200) return 5;
  if (width >= 900) return 4;
  if (width >= 750) return 3;
  return 2;
}

export default function GalleryTab() {
  const { filteredPins, loading, error } = useAppContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(3);

useEffect(() => {
  const updateColumns = () => {
    if (containerRef.current) {
      setColumns(getColumns(containerRef.current.offsetWidth));
    }
  };

  const observer = new ResizeObserver((entries) => {
    for (const entry of entries) {
      setColumns(getColumns(entry.contentRect.width));
    }
  });
  
  if (containerRef.current) {
    observer.observe(containerRef.current);
    updateColumns();
  }
  
  window.addEventListener('resize', updateColumns);
  
  return () => {
    observer.disconnect();
    window.removeEventListener('resize', updateColumns);
  };
}, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin mx-auto mb-3" />
          Загружаем пины...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-400">
        Ошибка: {error}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="px-4 py-4 overflow-auto h-full">
<Masonry columnsCount={columns} gutter="16px">
  {filteredPins.map((pin) => (
    <PinCard key={pin.pin_id} pin={pin} />
  ))}
</Masonry>
      {filteredPins.length === 0 && (
        <p className="text-center py-20 text-gray-500">No pins found.</p>
      )}
    </div>
  );
}