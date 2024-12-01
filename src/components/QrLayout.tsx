import { Layout } from 'antd'
const { Content } = Layout;

interface QrLayoutProps {
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

const QrLayout: React.FC<QrLayoutProps> = ({ children }) => (
    <Layout style={styles.container}>
        <Layout className="site-layout">
            <Content style={{ margin: '16px 16px' }}>
                <div style={{ padding: 24 }}>{children}</div>
            </Content>
        </Layout>
    </Layout>
);

export default QrLayout