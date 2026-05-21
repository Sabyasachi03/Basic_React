import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CartTable from "@/components/modules/CartTable";
import ActivityTable from "@/components/modules/ActivityTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { DEFAULT_COUNTRIES } from "@/constants/appConstants";
import { clearStoredUser, getStoredUser } from "@/services/authService";
import {
  clearActivities,
  createCart,
  createCountry,
  deleteCart,
  deleteCountry,
  fetchActivities,
  fetchCartById,
  fetchCarts,
  fetchCountries,
  updateCart,
} from "@/services/dashboardService";
import { useNavigate } from "react-router-dom";

const cartSchema = z.object({
  cartName: z.string().min(2, "Cart name must be at least 2 characters"),
  budget: z.coerce.number().min(0, "Budget must be 0 or more"),
});

function DashboardPage() {
  const navigate = useNavigate();
  const [user] = useState(() => getStoredUser());

  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [selectedCountryId, setSelectedCountryId] = useState(null);
  const [carts, setCarts] = useState([]);
  const [activities, setActivities] = useState([]);
  const [editingCartId, setEditingCartId] = useState(null);
  const [editingItemLoadingId, setEditingItemLoadingId] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);
  const countryDataCacheRef = useRef({});

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(cartSchema),
    defaultValues: { cartName: "", budget: 0 },
  });

  const selectedCountry = useMemo(
    () => countries.find((country) => country.id === selectedCountryId),
    [countries, selectedCountryId]
  );

  const loadCountryData = async (countryId, options = {}) => {
    const { force = false, showLoading = true } = options;
    if (!user || !countryId) return;
    if (!force && countryDataCacheRef.current[countryId]) {
      const cached = countryDataCacheRef.current[countryId];
      setCarts(cached.carts);
      setActivities(cached.activities);
      return;
    }

    if (showLoading) setTableLoading(true);
    try {
      const [cartRows, activityRows] = await Promise.all([
        fetchCarts(user.id, countryId),
        fetchActivities(user.id, countryId),
      ]);

      setCarts(
        cartRows.map((item) => ({
          id: String(item.id),
          cartName: item.cart_name,
          country: countries.find((c) => c.id === countryId)?.name ?? "",
          budget: item.budget,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        }))
      );
      const nextActivities = activityRows;
      setActivities(nextActivities);
      countryDataCacheRef.current[countryId] = {
        carts: cartRows.map((item) => ({
          id: String(item.id),
          cartName: item.cart_name,
          country: countries.find((c) => c.id === countryId)?.name ?? "",
          budget: item.budget,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        })),
        activities: nextActivities,
      };
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to load country data.");
    } finally {
      if (showLoading) setTableLoading(false);
    }
  };

  useEffect(() => {
    const boot = async () => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        let countryRows = await fetchCountries(user.id);

        if (countryRows.length === 0) {
          for (const name of DEFAULT_COUNTRIES) {
            await createCountry(user.id, { name });
          }
          countryRows = await fetchCountries(user.id);
        }

        const normalized = countryRows.map((country) => ({ id: String(country.id), name: country.name }));
        setCountries(normalized);

        const firstCountryId = normalized[0]?.id ?? null;
        setSelectedCountryId(firstCountryId);
        if (firstCountryId) {
          await loadCountryData(firstCountryId, { force: true });
        }
      } catch (error) {
        toast.error(error.response?.data?.detail || "Failed to initialize dashboard.");
      } finally {
        setLoading(false);
      }
    };

    boot();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, user]);

  const handleCountrySelect = async (countryId) => {
    if (countryId === selectedCountryId) return;
    setSelectedCountryId(countryId);
    setEditingCartId(null);
    reset({ cartName: "", budget: 0 });
    await loadCountryData(countryId, { force: false, showLoading: false });
    void loadCountryData(countryId, { force: true, showLoading: false });
  };

  const handleLogout = () => {
    clearStoredUser();
    navigate("/login");
  };

  const handleAddCountry = async (countryName) => {
    if (!user) return;
    try {
      const created = await createCountry(user.id, { name: countryName });
      const nextCountries = [...countries, { id: String(created.id), name: created.name }];
      setCountries(nextCountries);
      countryDataCacheRef.current[String(created.id)] = { carts: [], activities: [] };
      await handleCountrySelect(String(created.id));
      toast.success("Country added.");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to add country.");
    }
  };

  const handleDeleteCountry = async (countryId) => {
    if (!user) return;
    if (countries.length === 1) {
      toast.error("At least one country is required.");
      return;
    }

    try {
      await deleteCountry(user.id, Number(countryId));
      const nextCountries = countries.filter((country) => country.id !== countryId);
      setCountries(nextCountries);
      delete countryDataCacheRef.current[countryId];
      const nextSelected = nextCountries[0]?.id ?? null;
      setSelectedCountryId(nextSelected);
      if (nextSelected) {
        await loadCountryData(nextSelected, { force: false });
      }
      toast.success("Country deleted.");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to delete country.");
    }
  };

  const onSubmitCart = async (values) => {
    if (!user || !selectedCountryId) return;

    try {
      if (editingCartId) {
        await updateCart(user.id, Number(selectedCountryId), Number(editingCartId), {
          cart_name: values.cartName,
          budget: values.budget,
        });
        toast.success("Cart item updated.");
      } else {
        await createCart(user.id, Number(selectedCountryId), {
          cart_name: values.cartName,
          budget: values.budget,
        });
        toast.success("Cart item added.");
      }

      setEditingCartId(null);
      reset({ cartName: "", budget: 0 });
      await loadCountryData(selectedCountryId, { force: true });
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to save cart item.");
    }
  };

  const handleEditCart = async (item) => {
    if (!user || !selectedCountryId) return;
    setEditingItemLoadingId(item.id);

    try {
      const latest = await fetchCartById(user.id, Number(selectedCountryId), Number(item.id));
      setEditingCartId(String(latest.id));
      reset({ cartName: latest.cart_name, budget: latest.budget });
      await loadCountryData(selectedCountryId, { force: true, showLoading: false });
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to load cart details.");
    } finally {
      setEditingItemLoadingId(null);
    }
  };

  const handleDeleteCart = async (item) => {
    if (!user || !selectedCountryId) return;
    try {
      await deleteCart(user.id, Number(selectedCountryId), Number(item.id));
      await loadCountryData(selectedCountryId, { force: true });
      toast.success("Cart item deleted.");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to delete cart item.");
    }
  };

  const handleClearActivities = async () => {
    if (!user || !selectedCountryId) return;
    try {
      await clearActivities(user.id, Number(selectedCountryId));
      setActivities([]);
      if (countryDataCacheRef.current[selectedCountryId]) {
        countryDataCacheRef.current[selectedCountryId].activities = [];
      }
      toast.success("Activity logs cleared.");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to clear activities.");
    }
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-slate-700">Loading dashboard...</div>;
  }

  return (
    <DashboardLayout
      headerProps={{ userName: user?.name ?? "User", onLogout: handleLogout }}
      sidebarProps={{
        countries,
        selectedCountryId,
        onSelectCountry: handleCountrySelect,
        onAddCountry: handleAddCountry,
        onDeleteCountry: handleDeleteCountry,
      }}
    >
      <div className="space-y-5">
        <Card className="border-slate-200 bg-white/90">
          <CardHeader>
            <CardTitle className="text-xl">
              {selectedCountry ? `${selectedCountry.name} Cart Management` : "Cart Management"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmitCart)} className="grid gap-3 md:grid-cols-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="cart-name">Cart Name</Label>
                <Input id="cart-name" placeholder="Enter cart name" {...register("cartName")} />
                {errors.cartName && <p className="text-xs text-red-600">{errors.cartName.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Budget</Label>
                <Input id="budget" type="number" min="0" step="0.01" {...register("budget")} />
                {errors.budget && <p className="text-xs text-red-600">{errors.budget.message}</p>}
              </div>

              <div className="flex items-end gap-2">
                <Button className="w-full" type="submit" disabled={isSubmitting}>
                  {editingCartId ? "Update Cart" : "Add Cart"}
                </Button>
                {editingCartId && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setEditingCartId(null);
                      reset({ cartName: "", budget: 0 });
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white/90">
          <CardHeader>
            <CardTitle className="text-xl">Cart Items</CardTitle>
          </CardHeader>
          <CardContent>
            {tableLoading ? (
              <p className="text-sm text-slate-600">Loading cart data...</p>
            ) : (
              <CartTable
                items={carts}
                onView={setViewingItem}
                onEdit={handleEditCart}
                onDelete={handleDeleteCart}
                editingItemLoadingId={editingItemLoadingId}
              />
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white/90">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">Activities</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={handleClearActivities}>
              Clear Activity
            </Button>
          </CardHeader>
          <CardContent>
            {tableLoading ? <p className="text-sm text-slate-600">Loading activities...</p> : <ActivityTable activities={activities} />}
          </CardContent>
        </Card>
      </div>

      <Modal open={Boolean(viewingItem)} title="Cart Details" onClose={() => setViewingItem(null)}>
        {viewingItem && (
          <dl className="grid gap-3 text-sm">
            <div>
              <dt className="font-semibold text-slate-800">Cart Name</dt>
              <dd className="text-slate-600">{viewingItem.cartName}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-800">Country</dt>
              <dd className="text-slate-600">{viewingItem.country}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-800">Budget</dt>
              <dd className="text-slate-600">{viewingItem.budget ?? 0}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-800">Created Date</dt>
              <dd className="text-slate-600">{new Date(viewingItem.createdAt).toLocaleString()}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-800">Updated Date</dt>
              <dd className="text-slate-600">{new Date(viewingItem.updatedAt).toLocaleString()}</dd>
            </div>
          </dl>
        )}
      </Modal>
    </DashboardLayout>
  );
}

export default DashboardPage;
