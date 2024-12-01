import { Card, Avatar, Skeleton } from 'antd'

const { Meta } = Card;

type EmployeeInfo = {
    isLoading: boolean
    profileImage: string 
}

const  EmployeeBadge = (props: EmployeeInfo) => {
    return (
        <>
        <Card style={{ width: 300, marginTop: 16 }}>
            <Skeleton loading={props.isLoading} avatar active>
                <Meta
                    avatar={<Avatar shape="square" size={64} src={`data:image/png;base64,${props.profileImage}`} />}
                    title="Card title"
                    description="This is the description"
                />
            </Skeleton>
        </Card>
        </>
    )
}

export default EmployeeBadge