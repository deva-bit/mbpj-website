import { lazy, Suspense, useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query'
import './App.css'
import { useNavigate } from "react-router-dom";
import { EmployeeRequestDto } from "@/api/employee/employee.types";
import { fetchEmployee } from "@/api/employee/employee.api";
import { useAppDispatch } from "@/store/hooks"
import { setUsers } from './store/user/userSlice'
import { setUserRole } from './store/userRole/userRoleSlice'
import { useAppSelector } from "@/store/hooks";
import './components/navbar/navbar.css';
import MainLayout from './components/MainLayout';
import QrLayout from './components/QrLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { Spin } from 'antd';
import { Menu } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
// const { VITE_AWS_LOGIN_URL } = import.meta.env
const Login = lazy(() => import('./views/auth/Login'))
// const QrLogin = lazy(() => import('./views/auth/QrLogin'))
//content Management
const Pengguna = lazy(() => import('./views/MBPJ_ADMIN/pengguna/Pengguna'))
const Pemberitahuan = lazy(() => import('./views/MBPJ_ADMIN/pemberitahuan/Pemberitahuan'))
const Bantuan = lazy(() => import('./views/MBPJ_ADMIN/bantuan/Bantuan'))
const CajTransaksi = lazy(() => import('./views/MBPJ_ADMIN/cajTransaksiBayaran/CajTransaksiBayaran'))




function App() {
  const navigate = useNavigate();
  const locations = useLocation();
  const dispatch = useAppDispatch();
  const [isLogin,setLogin] = useState(false);
  const [employeeSearchValue, setEmployeeSearchValue] = useState<EmployeeRequestDto>({
    filterType: "",
    searchValue: ""
  })
  type MenuItem = Required<MenuProps>['items'][number];
  const employeeAuthentication = useAppSelector((state) => state.user.user.authentication)
  const adminAuthentication = useAppSelector((state) => state.userRole.userRole.adminAuthentication)
 
  // const {
  //   isLoading: isLoadingEmployee, isFetching: isFectchingEmployee, isError: isErrorEmployee, isSuccess: isSuccessEmployee, data: employee, error: employeeError, refetch: employeeRefetch
  // } = useQuery({
  //   queryKey: ['employee', employeeSearchValue],
  //   queryFn: () => fetchEmployee(employeeSearchValue),
  // })

  // const {
  //   isLoading: isLoadingAdmin, isFetching: isFectchingAdmin, isError: isErrorAdmin, isSuccess: isSuccessAdmin, data: admin, error: adminError, refetch: adminRefetch
  // } = useQuery({
  //   queryKey: ['admin'],
  //   queryFn: () => fetchAdminList(),
  // })

  //Successfully get userdata  
  // useEffect(() => {
  //   if (isSuccessEmployee) {
  //     getUser().then(() => {
  //       navigateAfterLogin();
  //     });
  //   }
  // }, [isSuccessEmployee]);


  //Authenticate user and set admin 
  // const getUser = async () => {
  //   const cognitoUser = await Auth.currentAuthenticatedUser();
  //   setLogin(true)
  //   if (cognitoUser) {
  //     dispatch(
  //       setUsers({
  //         name: employee?.fullname,
  //         email: employee?.email,
  //         authentication: true
  //       })
  //     )
  //     setEmployeeSearchValue({ filterType: "badgeId", searchValue: cognitoUser.attributes['custom:badgeID'] as string })
  //     adminRefetch().then((result) => {
  //       const data = result.data;
  //       const filteredData = data?.filter((item) => item.status === true);
  //       filteredData?.forEach((item) => {
  //         if (item.email === employee?.email) {
  //           dispatch(
  //             setUserRole({
  //               name: item.username,
  //               email: item.email,
  //               roles: item.roles,
  //               status: item.status,
  //               adminAuthentication: true
  //             })
  //           )
  //         }
  //       });
  //     });
  //   }
  
  // };

  //Navigation after Login
  // const navigateAfterLogin = () => {

  //   if (employeeAuthentication && !locations.pathname.startsWith('/qr')) {
   
  //     const current_location = location.pathname.substring(location.pathname.indexOf("/") + 1);
  //     const qrpathname = localStorage.getItem('pathname')
  //     if (!current_location && qrpathname == null) {
  //       const storedURL = '/userRecords';
  //       navigate(storedURL);
  //     }
  //     else if (qrpathname !== null && qrpathname?.startsWith('/qr')) {
  //       navigate(qrpathname);
  //       localStorage.removeItem('pathname');
  //     }
  //     else {
  //       navigate(`/${current_location}`);
  //     }
  //   }
  //   else if (!employeeAuthentication && locations.pathname.startsWith('/qr')) {
  //     navigate('/qrlogin')
  //   }
  //   else if (!employeeAuthentication && !locations.pathname.startsWith('/qr')) {
  //     navigate('/')
  //   }
  //   localStorage.removeItem('mainpage');
    
  // };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        <Routes>
    
        {/* <Route path='/' element={<Login />} /> */}
          <Route path='/pengguna' element={ <MainLayout><Pengguna /></MainLayout>  }/>
          <Route path='/pemberitahuan' element={ <MainLayout><Pemberitahuan /></MainLayout>  }/>
          <Route path='/bantuan' element={ <MainLayout><Bantuan /></MainLayout>  }/>
          <Route path='/cajTransaksi' element={ <MainLayout><CajTransaksi /></MainLayout>  }/>

        </Routes>
      </div>
    </Suspense>
  )
}
export default App

