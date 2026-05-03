import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function CartPage() {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({ name: "", price: "" });
  const [editingItemId, setEditingItemId] = useState(null);
  const [error, setError] = useState("");

  const fetchItems = async () => {
    if (!user) return;

    try {
      const response = await api.get(`/cart/${user.id}`);
      setItems(response.data);
    } catch (err) {
      setError("Failed to load cart items");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const resetForm = () => {
    setFormData({ name: "", price: "" });
    setEditingItemId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!user) return;

    const payload = {
      name: formData.name,
      price: Number(formData.price),
    };

    try {
      if (editingItemId) {
        await api.put(`/cart/${user.id}/${editingItemId}`, payload);
      } else {
        await api.post(`/cart/${user.id}`, payload);
      }

      resetForm();
      fetchItems();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to save item");
    }
  };

  const handleEdit = (item) => {
    setFormData({ name: item.name, price: String(item.price) });
    setEditingItemId(item.id);
  };

  const handleDelete = async (itemId) => {
    if (!user) return;

    try {
      await api.delete(`/cart/${user.id}/${itemId}`);
      fetchItems();
    } catch (err) {
      setError("Failed to delete item");
    }
  };  

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div>
      <h2>{user?.name}&apos;s Cart</h2>
      <button onClick={handleLogout}>Logout</button>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Item name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          step="0.01"
          min="0"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <button type="submit">{editingItemId ? "Update Item" : "Add Item"}</button>
        {editingItemId && (
          <button type="button" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      {error && <p className="error">{error}</p>}

      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} - ${item.price.toFixed(2)}
            <button onClick={() => handleEdit(item)}>Edit</button>
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CartPage;
