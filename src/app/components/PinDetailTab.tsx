import { useState } from "react";
import { useAppContext } from "../../AppContext";


export default function PinDetailTab() {
  const { selectedPin } = useAppContext();
  const [scale, setScale] = useState(100);

  if (!selectedPin) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Выбери пин из галереи
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* слайдер */}
      <div className="flex items-center gap-3 px-6 py-3 border-b border-gray-100">
        <span className="text-sm text-gray-400">25%</span>
        <input
          type="range"
          min={25}
          max={100}
          value={scale}
          onChange={(e) => setScale(Number(e.target.value))}
          className="flex-1"
        />
        <span className="text-sm text-gray-400">100%</span>
        <span className="text-sm font-medium w-12 text-right">{scale}%</span>
        <button
          onClick={() => setScale(100)}
          className="text-sm text-gray-400 hover:text-black transition-all"
        >
          reset 
        </button>
      </div>

      {/* картинка */}
      <div className="flex-1 overflow-auto p-6">
            <img
                src={selectedPin.image_url}
                alt={selectedPin.title}
                style={{ width: `${scale}%`, height: 'auto' }}
                className="rounded-2xl"
            />
            <h2 className="text-2xl font-bold mt-4">{selectedPin.title}</h2>
            <p className="text-gray-500 mt-1">{selectedPin.category}</p>
            <p className="text-gray-700 mt-3 leading-relaxed">{selectedPin.description}</p>
            </div>
    </div>
  );
}