import { useAppSelector } from '@/store/hooks';
import {useLocation } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { Result} from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const icon =  <CloseCircleOutlined style={{color: "#FF0000"}} rev />;
const title = 'Access Denied !';
const subTitle = "You don't have permission to access this page";

const AccessDenied = () => {
  return <><div> <Result icon={icon} title={title} subTitle={subTitle} extra={[]}/></div></>
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const location = useLocation();
    const details = useAppSelector((state) => state.userRole.userRole.roles);
    const stringWithoutSlash = location.pathname.replace('/', '');
  
    const isAuthorized = details.some((page) =>
      page.pages.some((pages) => pages.code === stringWithoutSlash)
    );

    return isAuthorized ? <>{children}</> : <MainLayout><AccessDenied/></MainLayout>;
  };

export default ProtectedRoute