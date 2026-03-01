import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const DashboardPage = () => {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div>
            <h1>ダッシュボード</h1>
            <p>ようこそ、{user?.displayName ?? 'ゲスト'}さん！</p>
            <button onClick={handleLogout}>ログアウト</button>
        </div>
    );
};

export default DashboardPage;