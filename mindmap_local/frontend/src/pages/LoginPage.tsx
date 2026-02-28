import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api/auth";
import { useAuthStore } from "../store/authStore";

const LoginPage = () => {
    const navigate = useNavigate();
    const setUser = useAuthStore((state) => state.setUser);
    const setToken = useAuthStore((state) => state.setToken);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const response = await login({ email, password });
            setToken(response.token);
            setUser(response.user);
            navigate("/dashboard");
        } catch {
            setError("メールアドレスまたはパスワードが正しくありません");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h1>ログイン</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>メールアドレス</label>
                    <input
                        type="email"
                        value={email}
                        onChangeCapture={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>パスワード</label>
                    <input
                        type="password"
                        value={password}
                        onChangeCapture={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p>{error}</p>}
                <button type="submit" disabled={isLoading}>
                    {isLoading ? "ログイン中..." : "ログイン"}
                </button>
            </form>
            <p>
                アカウントをお持ちでない方は <Link to="/register">新規登録</Link>
            </p>
        </div>
    );
};

export default LoginPage;