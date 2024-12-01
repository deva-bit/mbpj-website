import Button from 'antd/es/button'
import { ArrowRightOutlined } from '@ant-design/icons'
import { Card, Col, Row, Typography } from 'antd'

const {VITE_AWS_LOGIN_URL} = import.meta.env
const { Text, Title } = Typography
const QrLogin = () => {
    localStorage.setItem('pathname',location.pathname);
    window.location.href = VITE_AWS_LOGIN_URL;
  return (
<div>
    </div>
    
)
} 

export default QrLogin