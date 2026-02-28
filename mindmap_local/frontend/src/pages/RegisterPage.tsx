import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/auth';
import { useAuthStore } from '../store/authStore';

const RegisterPage = () => {
    const navigate = useNavigate();
    const setUser = useAuthStore((state) => state.setUser);
    const setToken = useAuthStore((state) => state.setToken);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const response = await register({ email, password, displayName });
            setToken(response.token);
            setUser(response.user);
            navigate('/dashboard');
        } catch {
            setError("登録に失敗しました。入力内容を確認してください。");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h1>新規登録</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>表示名</label>
                    <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>メールアドレス</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>パスワード</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p>{error}</p>}
                <button type="submit" disabled={isLoading}>
                    {isLoading ? '登録中...' : '登録'}
                </button>
            </form>
            <p>
                すでにアカウントをお持ちの方は <Link to="/login">ログイン</Link>
            </p>
        </div>
    )
};

export default RegisterPage;