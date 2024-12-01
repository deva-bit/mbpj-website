import { Button, Divider, Drawer, Layout, theme } from 'antd'
import React, { lazy, Suspense, useEffect, useState } from 'react'
import { Auth } from 'aws-amplify';
import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUsers } from '@/store/user/userSlice'
import { setUserRole } from '@/store/userRole/userRoleSlice'
const { Header } = Layout;

const Login = lazy(() => import('@/views/auth/Login'))
import { redirect, useNavigate } from "react-router-dom";
const Headers = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = React.useState(false);
  const { token: { colorBgContainer } } = theme.useToken();
  const [open, setOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const showInfo = () => {
    setOpen(true);
  }

  const onClose = () => {
    setOpen(false);
  }

  async function signOut() {
    try {
      dispatch(
        setUsers({
          name: '',
          email: '',
          authentication: false
        })
      )
      dispatch(
        setUserRole({
          name: '',
          email: '',
          roles: [{
            id: 0,
            description: '',
            status: false,
            pages: [{
              id: 0,
              code: '',
              description: '',
            }],
          }],
          status: false,
          adminAuthentication: false
        })
      )    
      localStorage.removeItem('pathname');
      await Auth.signOut();

    } catch (error) {
      console.log('error signing out: ', error);
    }
  }
  const details = useAppSelector((state) => state.user.user.name)

  return (
    <div style={{ width: "100%" }}>
      <Header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: colorBgContainer, paddingInline: 24 }}>

        <UserOutlined onClick={showInfo} style={{ fontSize: 20, marginLeft: "auto" }} rev={undefined} />
      </Header>
      <Drawer title='User Information' placement='right' closable={true} onClose={onClose} open={open} style={{ textAlign: "center" }}>
        <p>{details}</p>
        <Divider />
        <Button type='link' onClick={signOut}>Logout</Button>
      </Drawer>
    </div>
  )
}

export default Headers;