import { useRef, useState } from "react";
import { Plus, Trash2, Upload } from "lucide-react";
import { useAppContext } from "../../AppContext";

// Keep this list in sync with gallery filters and API values.
const categories = ["Nature", "Food", "Architecture", "Fashion", "Other"];

export default function CreatePinTab() {
  const { currentUser, refetchPins } = useAppContext();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Nature");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Read dropped files and build local previews.
  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;

    setError(null);
    setSuccess(null);

    const acceptedFiles = Array.from(newFiles);
    setFiles((prev) => [...prev, ...acceptedFiles]);

    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = e.target?.result;
        if (typeof preview === "string") {
          setPreviews((prev) => [...prev, preview]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Reset after success or manual cancel.
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("Nature");
    setFiles([]);
    setPreviews([]);
    setError(null);
  };

  // Send one pin with one or more uploaded images.
  const handleSubmit = async () => {
    if (!title.trim() || files.length === 0) return;

    setUploading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("category", category);
    formData.append("board_id", "1");
    formData.append("user_id", String(currentUser.user_id));
    files.forEach((file) => formData.append("media[]", file));

    try {
      const res = await fetch("/api/upload.php", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error ?? "Failed to create pin");
      }

      refetchPins();
      resetForm();
      setSuccess("Pin published successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create pin");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="h-full overflow-auto">
      <div className="mx-auto max-w-4xl p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Create Pin</h2>
          <p className="mt-1 text-sm text-gray-500">
            Upload your images and publish a new pin as @{currentUser.username}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div
              className="rounded-2xl border-2 border-dashed border-gray-300 p-8 text-center transition-all hover:border-red-400"
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFiles(e.dataTransfer.files);
              }}
            >
              <Upload className="mx-auto mb-3 h-8 w-8 text-gray-400" />
              <p className="text-gray-600">
                Drag files here or click to upload
              </p>
              <p className="mt-1 text-sm text-gray-400">
                JPG, PNG, GIF up to 20MB
              </p>
              <input
                ref={inputRef}
                type="file"
                multiple
                accept="image/*,.gif"
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
            </div>

            {previews.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-3">
                {previews.map((src, index) => (
                  <div
                    key={`${src}-${index}`}
                    className="group relative overflow-hidden rounded-xl"
                  >
                    <img
                      src={src}
                      alt="Preview"
                      className="h-40 w-full object-cover"
                    />
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white opacity-0 transition-all hover:bg-black group-hover:opacity-100"
                      title="Remove file"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <div className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white">
                      {files[index]?.type.includes("gif") ? "GIF" : "IMG"}
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => inputRef.current?.click()}
                  className="flex h-40 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 text-gray-400 transition-all hover:border-red-400"
                >
                  <Plus className="h-6 w-6" />
                </button>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Pin title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  placeholder="Tell people what this pin is about"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              {error && (
                <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </p>
              )}

              {success && (
                <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-600">
                  {success}
                </p>
              )}

              <div className="mt-2 flex justify-end gap-2">
                <button
                  onClick={resetForm}
                  disabled={uploading}
                  className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-200 disabled:opacity-60"
                >
                  Reset
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={uploading || !title.trim() || files.length === 0}
                  className="rounded-full bg-red-600 px-6 py-2 text-sm font-semibold text-white transition-all hover:bg-red-700 disabled:bg-gray-300"
                >
                  {uploading ? "Publishing..." : "Publish Pin"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
