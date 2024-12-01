import { Button, Col, Row, Skeleton, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { EyeFilled } from "@ant-design/icons";

type RecordDetails = {
    isLoading?: boolean;
    key?: string;
    dateVisit?: string;
    clinicName?: string;
    sicknessDesc?: string;
}

const columns: ColumnsType<RecordDetails> = [{
    title: 'Date Visit',
    dataIndex: 'dateVisit',
    key: 'dateVisit',
}, {
    title: 'Clinic Name',
    dataIndex: 'clinicName',
    key: 'clinicName'
}, {
    title: 'Sickness Description',
    dataIndex: 'sicknessDesc',
    key: 'sicknessDesc'
}, {
    title: 'Action',
    key: 'action',
    render: () => (
        <Button type="primary">
            <EyeFilled rev={undefined} />
            View
        </Button>
    )
}];

const data: RecordDetails[] = [
    {
        key: '1',
        dateVisit: '2023-01-12',
        clinicName: 'Poliklinik Shah Alam',
        sicknessDesc: 'Fever'
    },
    {
        key: '2',
        dateVisit: '2023-01-24',
        clinicName: 'Klinik Taipan',
        sicknessDesc: 'Cough'
    },
    {
        key: '3',
        dateVisit: '2023-02-01',
        clinicName: 'TGGD',
        sicknessDesc: 'Fever'
    },
]

const MedicalRecords = (props: RecordDetails) => {
    return (
        <Skeleton loading={props.isLoading} active>
            <Row gutter={[16, 24]} style={{ marginTop: 30 }}>
                <Col className="gutter-row" span={24}>
                    <Table columns={columns} dataSource={data} />
                </Col>
            </Row>
        </Skeleton>
    );
}

export default MedicalRecords;