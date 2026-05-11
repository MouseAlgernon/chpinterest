import { useState, useRef } from "react";
import { X, Upload, Plus, Trash2 } from "lucide-react";
import { useAppContext } from "../../AppContext";

const UploadModal = () => {
  const { uploadOpen, setUploadOpen, refetchPins } = useAppContext();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Nature");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const categories = ["Nature", "Food", "Architecture", "Fashion"];

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const arr = Array.from(newFiles);
    setFiles((prev) => [...prev, ...arr]);
    arr.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title || files.length === 0) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("board_id", "1");
    formData.append("user_id", "1"); // TODO: заменить на реальную сессию
    files.forEach((file) => formData.append("media[]", file));

    try {
      const res = await fetch("/api/upload.php", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        refetchPins();
        setUploadOpen(false);
        setTitle("");
        setDescription("");
        setFiles([]);
        setPreviews([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  if (!uploadOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && setUploadOpen(false)}
    >
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        {/* шапка */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Создать пин</h2>
          <button onClick={() => setUploadOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-4">
          {/* зона перетаскивания */}
          <div
            className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center cursor-pointer hover:border-red-400 transition-all"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
          >
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Перетащи файлы или нажми для выбора</p>
            <p className="text-sm text-gray-400 mt-1">JPG, PNG, GIF до 20MB</p>
            <input
              ref={inputRef}
              type="file"
              multiple
              accept="image/*,.gif"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>

          {/* превью */}
          {previews.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {previews.map((src, i) => (
                <div key={i} className="relative group rounded-xl overflow-hidden">
                  <img src={src} className="w-full h-32 object-cover" />
                  <button
                    onClick={() => removeFile(i)}
                    className="absolute top-2 right-2 bg-black/60 hover:bg-black text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                  <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                    {files[i]?.type.includes('gif') ? 'GIF' : 'IMG'}
                  </div>
                </div>
              ))}
              <div
                className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-red-400 transition-all"
                onClick={() => inputRef.current?.click()}
              >
                <Plus className="w-6 h-6 text-gray-400" />
              </div>
            </div>
          )}

          {/* поля */}
          <input
            type="text"
            placeholder="Название"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          <textarea
            placeholder="Описание"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setUploadOpen(false)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-all"
            >
              Отмена
            </button>
            <button
              onClick={handleSubmit}
              disabled={uploading || !title || files.length === 0}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white rounded-full font-semibold transition-all"
            >
              {uploading ? "Загружаем..." : "Опубликовать"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;