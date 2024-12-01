import Button from 'antd/es/button'
import { ArrowRightOutlined } from '@ant-design/icons'
import { Card, Col, Row, Typography } from 'antd'
import { useState } from 'react'
const {VITE_AWS_LOGIN_URL} = import.meta.env
const { Text, Title } = Typography
const Login = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const handleLoginClick = () => {
        setIsLoading(true);
        localStorage.setItem('mainpage',isLoading.toString());
      };
      const mainpage = localStorage.getItem('mainpage')
  return (
    <>
   {mainpage===null?(
        <Row gutter={[16, 24]} justify="space-evenly" align="middle"
        >
            <Col className="gutter-row" span={24}>
                <Card
                    style={{
                        padding: 50,
                        border: 'none',
                        borderRadius: 50,
                        background: 'transparent', 
                    
                       
                    }}
                >
                <Row gutter={[16, 24]} justify="space-evenly" align="middle">
                    <Col className="gutter-row" span={8}>
                        <Row>
                            <Col className="gutter-row" span={24}>
                                <img
                                    style={{ width: 180, boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' }}
                                    src="https://www.topglove.com/themes/top-glove/images/top-glove.png"
                                />
                            </Col>
                            <Col className="gutter-row" span={24}>
                                <Title level={1} style={{ marginTop: 10, marginBottom: 0 }}>eClinic</Title>
                                <p>
                                    <Text italic>For admin use only.</Text>
                                </p>

                                <Button href={VITE_AWS_LOGIN_URL} type='link' shape='round' size='large'
                                    onClick={handleLoginClick}
                                    style={{
                                        paddingLeft: '15px',
                                        paddingRight: '15px',
                                        // padding: 0,
                                        boxShadow: '5px 4px 8px 0 rgba(0, 0, 0, 0.19), 3px 4px 8px 0 rgb(255 255 255) inset',
                                        border: 'none'
                                    }}
                                >Login <ArrowRightOutlined rev={undefined} /></Button>
                            </Col>
                        </Row>
                    </Col>
                    <Col className="gutter-row" span={16}>
                        <Row>
                            <Col className="gutter-row" span={24} style={{ display: 'flex', justifyContent: 'center' }}>
                                <img
                                    style={{ width: 700 }}
                                    src="/clinic_1.png"
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                </Card>
            </Col>

        </Row>
        ):(
<div>Loading....</div>
        )}

    </>
)
} 

export default Login