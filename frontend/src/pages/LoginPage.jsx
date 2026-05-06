import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import api from "../services/api";

const passwordRule =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/;

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      passwordRule,
      "Password must include uppercase, lowercase, number, and special character"
    ),
});

function LoginPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      const response = await api.post("/auth/login", values);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      toast.success(response.data.message);
      navigate("/cart");
    } catch (err) {
      toast.error(err.response?.data?.detail ?? err.response?.data?.message);
    }
  };

  const onInvalid = () => {};

  return (
    <section className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">Login</h2>
      <p className="mt-1 text-sm text-slate-600">Welcome back. Enter your details to continue.</p>

      <div className="mt-6 space-y-4">
        <div>
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500"
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            {...register("password")}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500"
          />
        </div>

        <button
          type="button"
          onClick={handleSubmit(onSubmit, onInvalid)}
          disabled={isSubmitting}
          className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </div>

      <p className="mt-5 text-sm text-slate-600">
        Don&apos;t have an account? <Link to="/signup" className="font-medium text-blue-600 hover:underline">Signup</Link>
      </p>
    </section>
  );
}

export default LoginPage;
