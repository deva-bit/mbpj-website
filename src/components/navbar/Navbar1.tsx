import { Layout, Menu, MenuProps, theme } from 'antd'
import { Link, Route, Routes } from 'react-router-dom';
import React, { useEffect } from 'react';
import { UserOutlined, ProfileOutlined, InfoCircleOutlined, ToolOutlined, SoundOutlined, MailOutlined, UploadOutlined, DownloadOutlined, GlobalOutlined, AppstoreOutlined, SettingOutlined, HomeOutlined, SmileOutlined, NotificationOutlined, TransactionOutlined, WalletOutlined, AuditOutlined, FileTextOutlined, QuestionCircleOutlined, MessageOutlined } from '@ant-design/icons'


const { Sider } = Layout;
type MenuItem = Required<MenuProps>['items'][number];
 
const Navbar = () => 
{
  
  const [collapsed, setCollapsed] = React.useState(false);
  const { token: { colorBgContainer } } = theme.useToken();


 
  const items: MenuItem[] = [
    {
      key: 'sub1',
      label: 'Dashboard',
      icon: <HomeOutlined />,
     
    },
    {
      key: '/pengguna',
      icon: <UserOutlined />,
      label: <Link to="/pengguna">Pengguna</Link>, // Use Link for navigation
    },
    {
      key: '/pemberitahuan',
      icon: <NotificationOutlined />,
      label: <Link to="/pemberitahuan">Pemberitahuan</Link>, // Use Link for navigation
    },

    {
      key: '/bantuan',
      icon: <InfoCircleOutlined />,
      label: <Link to="/bantuan">Bantuan</Link>, // Use Link for navigation
      
     
    },
    {
      key: '/cajTransaksi',
      icon: <WalletOutlined />,
      label: <Link to="/cajTransaksi">Caj Transaksi Bayaran</Link>,
     
    },
    {
      key: 'sub8',
      label: 'Audit Log',
      icon: <AuditOutlined />,
     
    },
    {
      key: 'sub9',
      label: 'Manual Pengguna',
      icon: <FileTextOutlined />,
     
    },
    {
      key: 'sub10',
      label: 'FAQ',
      icon: <MessageOutlined />,
     
    },
    
 
  ];
  return (
    <Sider
      width={250}
      style={{
        background: colorBgContainer
      }}
   
      
     
    >
     <div
  style={{
    display: 'flex',
    justifyContent: 'center',   // Centers horizontally
    alignItems: 'center',       // Centers vertically
          // Full height to vertically center within the viewport
  }}
>
  <img
    className='logo'
    style={{ width: 70, }}
    src="/mbpj.png"
    alt="Logo"
  />
</div>
      <div className='context-below'>
      <Menu
   
   style={{ width: 256 }}
   defaultSelectedKeys={['1']}
   defaultOpenKeys={['sub1']}
   mode="inline"
   items={items}
 />
      </div>
    </Sider>

  )
}

export default Navbar;