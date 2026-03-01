import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import LoginPage from '../LoginPage'
import * as authApi from '../../api/auth'
import { useAuthStore } from '../../store/authStore'

// api/auth をモック化
vi.mock('../../api/auth')

// useNavigate をモック化
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal<typeof import('react-router-dom')>()
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    }
})

beforeEach(() => {
    vi.clearAllMocks()
    useAuthStore.setState({ token: null, user: null })
})

describe('LoginPage', () => {
    it('フォームが正しく描画される', () => {
        const { container } = render(<LoginPage />, { wrapper: MemoryRouter })

        expect(screen.getByRole('heading', { name: 'ログイン' })).toBeInTheDocument()
        expect(container.querySelector('input[type="email"]')).toBeInTheDocument()
        expect(container.querySelector('input[type="password"]')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'ログイン' })).toBeInTheDocument()
    })

    it('ログイン成功時にダッシュボードへ遷移する', async () => {
        vi.mocked(authApi.login).mockResolvedValue({
            token: 'test-token',
            user: { id: 1, email: 'test@example.com', displayName: 'テスト', avaterUrl: null },
        })

        const { container } = render(<LoginPage />, { wrapper: MemoryRouter })

        fireEvent.change(container.querySelector('input[type="email"]')!, {
            target: { value: 'test@example.com' },
        })
        fireEvent.change(container.querySelector('input[type="password"]')!, {
            target: { value: 'password123' },
        })
        fireEvent.click(screen.getByRole('button', { name: 'ログイン' }))

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
        })
    })

    it('ログイン失敗時にエラーメッセージを表示する', async () => {
        vi.mocked(authApi.login).mockRejectedValue(new Error('Invalid credentials'))

        const { container } = render(<LoginPage />, { wrapper: MemoryRouter })

        fireEvent.change(container.querySelector('input[type="email"]')!, {
            target: { value: 'wrong@example.com' },
        })
        fireEvent.change(container.querySelector('input[type="password"]')!, {
            target: { value: 'wrongpassword' },
        })
        fireEvent.click(screen.getByRole('button', { name: 'ログイン' }))

        await waitFor(() => {
            expect(
                screen.getByText('メールアドレスまたはパスワードが正しくありません')
            ).toBeInTheDocument()
        })
    })
})
