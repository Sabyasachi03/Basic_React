import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import api from "../services/api";

const cartItemSchema = z.object({
  name: z.string().min(2, "Item name must be at least 2 characters"),
  price: z
    .coerce
    .number({ invalid_type_error: "Price must be a number" })
    .nonnegative("Price cannot be negative"),
});

function CartPage() {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [items, setItems] = useState([]);
  const [editingItemId, setEditingItemId] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(cartItemSchema),
    defaultValues: {
      name: "",
      price: "",
    },
  });

  const fetchItems = async () => {
    if (!user) return;

    try {
      const response = await api.get(`/cart/${user.id}`);
      setItems(response.data);
    } catch (err) {
      toast.error(err.response?.data?.detail ?? err.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const resetForm = () => {
    reset({ name: "", price: "" });
    setEditingItemId(null);
  };

  const onSubmit = async (values) => {
    if (!user) return;

    const payload = {
      name: values.name,
      price: values.price,
    };

    try {
      if (editingItemId) {
        const response = await api.put(`/cart/${user.id}/${editingItemId}`, payload);
        toast.success(response.data.message);
      } else {
        const response = await api.post(`/cart/${user.id}`, payload);
        toast.success(response.data.message);
      }

      resetForm();
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.detail ?? err.response?.data?.message);
    }
  };

  const onInvalid = () => {};

  const handleEdit = (item) => {
    reset({ name: item.name, price: item.price });
    setEditingItemId(item.id);
  };

  const handleDelete = async (itemId) => {
    if (!user) return;

    try {
      const response = await api.delete(`/cart/${user.id}/${itemId}`);
      toast.success(response.data.message);
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.detail ?? err.response?.data?.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">{user?.name}&apos;s Cart</h2>
          <p className="text-sm text-slate-600">Add, edit, and manage your cart items.</p>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          Logout
        </button>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-4">
        <div className="sm:col-span-2">
          <input
            type="text"
            placeholder="Item name"
            {...register("name")}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500"
          />
        </div>

        <div>
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="Price"
            {...register("price")}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500"
          />
        </div>

        <button
          type="button"
          onClick={handleSubmit(onSubmit, onInvalid)}
          disabled={isSubmitting}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Saving..." : editingItemId ? "Update Item" : "Add Item"}
        </button>

        {editingItemId && (
          <button
            type="button"
            onClick={resetForm}
            className="sm:col-span-4 rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
          >
            Cancel Editing
          </button>
        )}
      </div>

      <div className="mt-6 space-y-3">
        {items.length === 0 && (
          <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
            No items in cart yet.
          </p>
        )}

        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-base font-medium text-slate-900">{item.name}</p>
              <p className="text-sm text-slate-600">${item.price.toFixed(2)}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(item)}
                className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm text-blue-700 transition hover:bg-blue-100"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm text-red-700 transition hover:bg-red-100"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CartPage;
