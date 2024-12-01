import { useState, } from "react";
import { Space, Table, Button, Modal, Form, Input, Card } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { PlusOutlined, } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import Link from "antd/es/typography/Link";

const Login = () => {


  return (
    <div className='login-container'>
      <div className='logo-wrapper'>
        <img  style={{ width: '20rem' }} alt='' />
      </div>
      <div className='login-form-wrapper'>
        <img  style={{ width: '200px' }} alt='' />
        <Button type='primary' style={{ marginTop: '4%' }}>
          <a href="https://hrcentralized.auth.ap-southeast-1.amazoncognito.com/login?client_id=5rj4iobe1q84o5t3pcv4gbh2fb&response_type=code&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=http://localhost:3000/">Login</a>
        </Button>
      </div>
    </div>
  );
}
export default Login;