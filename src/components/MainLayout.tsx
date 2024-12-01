import { useAppSelector } from '@/store/hooks';
import { Breadcrumb, Button, Divider, Drawer, Layout, Menu, MenuProps, Typography, theme } from 'antd'
import { lazy } from 'react';
const { Header, Content, Sider } = Layout;

const Navbar = lazy(() => import('./navbar/Navbar1'))
const Header1 = lazy(() => import('./header/Header'))

interface MainLayoutProps {
    children: React.ReactNode;
}

const styles = {
    container: {
        minHeight: '100vh',
        '@media (maxWidth: 680px)': {
            minHeight: '250vh',
        },
    },
};


const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const details = useAppSelector((state) => state.userRole.userRole.roles)
    return <Layout style={styles.container}>
        <Navbar  />
        <Layout className="site-layout">
            <Header1 />

            <Content style={{ margin: '16px 16px' }}>
                <div style={{ padding: 24 }}>{children}</div>
            </Content>
        </Layout>
    </Layout>;
};

export default MainLayout