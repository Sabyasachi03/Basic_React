import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { Pencil, Trash2, LogOut } from "lucide-react";
import api from "../services/api";
import { API_ENDPOINTS } from "../services/endpoints";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    formState: { errors },
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
      const response = await api.get(API_ENDPOINTS.cart.listByUser(user.id));
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
        const response = await api.put(
          API_ENDPOINTS.cart.updateByUser(user.id, editingItemId),
          payload
        );
        toast.success(response.data.message);
      } else {
        const response = await api.post(API_ENDPOINTS.cart.createByUser(user.id), payload);
        toast.success(response.data.message);
      }

      resetForm();
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.detail ?? err.response?.data?.message);
    }
  };

  const handleEdit = (item) => {
    reset({ name: item.name, price: item.price });
    setEditingItemId(item.id);
  };

  const handleDelete = async (itemId) => {
    if (!user) return;

    try {
      const response = await api.delete(API_ENDPOINTS.cart.deleteByUser(user.id, itemId));
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
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>{user?.name}&apos;s Cart</CardTitle>
          <CardDescription>Add, edit, and manage your cart items.</CardDescription>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="h-4 w-4" /> Logout
        </Button>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 sm:grid-cols-4">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="item-name">Item Name</Label>
            <Input id="item-name" type="text" placeholder="Item name" {...register("name")} />
            {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="item-price">Price</Label>
            <Input id="item-price" type="number" step="0.01" min="0" placeholder="Price" {...register("price")} />
            {errors.price && <p className="text-xs text-red-600">{errors.price.message}</p>}
          </div>

          <div className="flex items-end">
            <Button type="submit" className="w-full">{editingItemId ? "Update Item" : "Add Item"}</Button>
          </div>

          {editingItemId && (
            <div className="sm:col-span-4">
              <Button type="button" variant="secondary" onClick={resetForm}>Cancel Editing</Button>
            </div>
          )}
        </form>

        <div className="space-y-3">
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
                <Button type="button" variant="secondary" onClick={() => handleEdit(item)}>
                  <Pencil className="h-4 w-4" /> Edit
                </Button>
                <Button type="button" variant="destructive" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="h-4 w-4" /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default CartPage;
