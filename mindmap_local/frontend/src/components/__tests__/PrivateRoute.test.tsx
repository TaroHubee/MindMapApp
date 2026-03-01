import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import PrivateRoute from '../PrivateRoute'
import { useAuthStore } from '../../store/authStore'

beforeEach(() => {
    useAuthStore.setState({ token: null, user: null })
})

const renderWithRoutes = () =>
    render(
        <MemoryRouter initialEntries={['/dashboard']}>
            <Routes>
                <Route path="/login" element={<div>ログインページ</div>} />
                <Route element={<PrivateRoute />}>
                    <Route path="/dashboard" element={<div>ダッシュボード</div>} />
                </Route>
            </Routes>
        </MemoryRouter>
    )

describe('PrivateRoute', () => {
    it('トークンがない場合は /login にリダイレクトする', () => {
        renderWithRoutes()
        expect(screen.getByText('ログインページ')).toBeInTheDocument()
        expect(screen.queryByText('ダッシュボード')).not.toBeInTheDocument()
    })

    it('トークンがある場合は Outlet の内容が描画される', () => {
        useAuthStore.setState({ token: 'test-token' })
        renderWithRoutes()
        expect(screen.getByText('ダッシュボード')).toBeInTheDocument()
        expect(screen.queryByText('ログインページ')).not.toBeInTheDocument()
    })
})
