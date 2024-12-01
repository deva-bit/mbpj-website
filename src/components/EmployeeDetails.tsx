import { Card, Col, Image, Row, Skeleton, Descriptions } from 'antd'

type EmployeeInfo = {
    isLoading: boolean
    profileImage: string
}

const EmployeeBadge = (props: EmployeeInfo) => {
    return (
        <>
            {props.isLoading ?
                <Skeleton.Avatar active />
                :
                <Row gutter={[16, 24]}>
                    <Col className="gutter-row" span={24} style={{ display: "flex", justifyContent: "center" }}>
                        <Image
                            width={200}
                            src={`https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?`}
                        />
                    </Col>
                    <Col className="gutter-row" span={24}>
                        <Descriptions
                            bordered
                            column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
                        >
                            <Descriptions.Item label="Name">Employee's name</Descriptions.Item>
                            <Descriptions.Item label="IC Number">xxxxxx-xx-xxxx</Descriptions.Item>
                            <Descriptions.Item label="Passport Number">xxxxxx</Descriptions.Item>
                            <Descriptions.Item label="Employee ID">xxxxxx</Descriptions.Item>
                            <Descriptions.Item label="Employee Status">Active</Descriptions.Item>
                            <Descriptions.Item label="Factory ID">TGT</Descriptions.Item>
                            <Descriptions.Item label="Resignation Date">-</Descriptions.Item>
                        </Descriptions>
                    </Col>
                </Row>

            }
        </>
    )
}

export default EmployeeBadge