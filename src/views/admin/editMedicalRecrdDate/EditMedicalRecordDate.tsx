import React, { useRef, useState, } from "react";
import { Space, Table, Button, Modal, Form, Input, Card, Select, Cascader, Row, Col, message, Spin, InputRef, Descriptions, Typography, Tabs } from 'antd';
import type { ColumnType, ColumnsType, TableProps } from 'antd/es/table';
import { PlusOutlined, MinusCircleOutlined, SearchOutlined, EditOutlined } from '@ant-design/icons';
import { useQuery } from "@tanstack/react-query";
import { announcementRequestDto, announcementResponseDto, announcementDeleteRequestDto } from "@/api/announcement/announcement.types";
import { fetchAnnouncement, deleteAnnouncement } from "@/api/announcement/announcement.api";
import { FilterConfirmProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import { RegistrationRequestDto } from "@/api/registration/registration.types";
import { fetchRegistration } from "@/api/registration/registration.api";
import dayjs from 'dayjs';
import { ModalErrorAPI } from "@/components/ModalAlert";

const { Text } = Typography;

type MedicalRecordType = {
  id: number
  mcDays: number
  mcFrom: string
  mcTo: string
  consultantFeesAmount: number
  medicalFeesAmount: number
  grandTotalAmount: number
  medicalRemark: string
  deleteReason: string
  status: boolean
  dateUpdated?: string
  sicknesses: [
    {
      id: number
      code: string
      description: string
    }
  ]
}

const EditMedicalRecordDate = () => {
  const [formSearch] = Form.useForm()
  const [isReset, setReset] = useState<boolean>(false);
  const [isSearching, setSearching] = useState<boolean>(false);
  const [valueRegistration, setValueRegistration] = useState<RegistrationRequestDto>({
    id: 0
  })
  const [deletedHistory, setDeletedHistories] = useState<MedicalRecordType[]>([])
  const [latestMedicalRecord, setLatestMedicalRecord] = useState<MedicalRecordType>()

  const {
    isLoading: isRegistrationLoading,
    isFetching: isRegistrationFetching,
    isError: isRegistrationError,
    isSuccess: isRegistrationSuccess,
    data: registrationData,
    error: registrationError,
    refetch: registrationRefetch
  } = useQuery({
    queryKey: ['registration/' + valueRegistration.id, valueRegistration],
    queryFn: () => fetchRegistration(valueRegistration),
    enabled: isSearching,
    onSuccess(data) {
      console.log(data)
      setSearching(false)
      data.medicalRecords.map((medRecord) => {
        if (medRecord.status) {
          setLatestMedicalRecord(medRecord)
        } else {
          setDeletedHistories(delHistory => [...delHistory, medRecord])
        }
      })
    },
    onError(err) {
      setSearching(false)
      console.log('api get medical record: ' + err)
      // ModalErrorAPI()
      console.log()
    }
  })

  const handleSearch = ((values: RegistrationRequestDto) => {
    console.log("values: " + values.id)
    setValueRegistration({
      id: values.id
    })
    setSearching(true)
  })

  return (
    <div>
      <Spin spinning={false} tip="Loading...">
        <Row gutter={[16, 24]}>
          <Col className="gutter-row" span={24}>
            <Card>
              <Form
                layout="vertical"
                form={formSearch}
                onFinish={handleSearch}
                name="control-ref"
                labelWrap
              >
                <Row gutter={24}>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <Form.Item name="id" label="Registration ID" style={{ marginBottom: 0 }} rules={[{ required: true }]}>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <Form.Item label=" " style={{ marginBottom: 0, textAlign: "end" }}>
                      <Space wrap>
                        <Button
                          loading={false}
                          type="default"
                          htmlType="reset"
                          disabled={false}
                          onClick={() => setReset(true)}
                        >
                          Reset
                        </Button>
                        <Button
                          loading={false}
                          type="primary"
                          htmlType="submit"
                        >
                          Search
                        </Button>
                      </Space>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>
          </Col>

          <Col className="gutter-row" span={24}>
            <Card title="Registration Detail">
              <Row gutter={[16, 24]}>
                <Col className="gutter-row" span={24}>
                  <Descriptions
                    bordered
                    column={{ xxl: 3, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
                  >
                    <Descriptions.Item label="Visit Date & Time">
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>
                          {dayjs(registrationData?.registrationDate).format('DD/MM/YYYY HH:mm')}
                        </span>
                        <EditOutlined rev={undefined} />
                      </div>
                    </Descriptions.Item>
                    <Descriptions.Item label="Name">{registrationData?.fullName.toUpperCase()}</Descriptions.Item>
                    {registrationData?.icNumber != "" &&
                      <Descriptions.Item label="IC Number">{registrationData?.icNumber}</Descriptions.Item>
                    }
                    {registrationData?.passportNumber != "" &&
                      <Descriptions.Item label="Passport Number">{registrationData?.passportNumber}</Descriptions.Item>
                    }
                    <Descriptions.Item label="Employee Number">{registrationData?.employeeNumber}</Descriptions.Item>
                    <Descriptions.Item label="Employee Status"><Text style={{ color: (registrationData && registrationData.employeeStatus == "active") ? "#3bcb00" : "red", wordBreak: "keep-all" }}>{registrationData?.employeeStatus?.toUpperCase()}</Text></Descriptions.Item>
                    <Descriptions.Item label="Department">{registrationData?.departmentName}</Descriptions.Item>
                    <Descriptions.Item label="Factory">{registrationData?.factoryCode}</Descriptions.Item>
                    {registrationData?.employeeStatus == "inactive" &&
                      <Descriptions.Item label="Resignation Date">{dayjs(registrationData?.resignDate).format('DD/MM/YYYY')}</Descriptions.Item>
                    }
                  </Descriptions>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col className="gutter-row" span={24}>
            <Card
              title="Active Medical Record Detail"
              extra={<Button type="primary">Allow Edit</Button>}
            >
              <Row gutter={[16, 24]}>
                <Col className="gutter-row" span={24}>
                  <Descriptions
                    bordered
                    column={{ xxl: 3, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
                  >
                    <Descriptions.Item label="Diagnosis">{latestMedicalRecord?.sicknesses.map((sickness) => sickness.description + " (" + sickness.code + ")").join(", ")}</Descriptions.Item>
                    <Descriptions.Item label="MC (No. of Day)">{latestMedicalRecord?.mcDays.toFixed(2).toString()}</Descriptions.Item>
                    <Descriptions.Item label="MC Date Range">{latestMedicalRecord?.mcFrom != null && dayjs(latestMedicalRecord?.mcFrom).format('DD/MM/YYYY') + " until " + dayjs(latestMedicalRecord?.mcTo).format('DD/MM/YYYY')}</Descriptions.Item>
                    <Descriptions.Item label="Consultation Fee">{"MYR " + (latestMedicalRecord?.consultantFeesAmount == null ? "0.00" : latestMedicalRecord?.consultantFeesAmount.toFixed(2))}</Descriptions.Item>
                    <Descriptions.Item label="Medication Fee">{"MYR " + (latestMedicalRecord?.medicalFeesAmount == null ? "0.00" : latestMedicalRecord?.medicalFeesAmount.toFixed(2))}</Descriptions.Item>
                    <Descriptions.Item label="Grand Total">{"MYR " + (latestMedicalRecord?.grandTotalAmount == null ? "0.00" : latestMedicalRecord?.grandTotalAmount.toFixed(2))}</Descriptions.Item>
                    <Descriptions.Item label="Medical Remarks">{latestMedicalRecord?.medicalRemark}</Descriptions.Item>
                  </Descriptions>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col className="gutter-row" span={24}>
            <Card title="Deleted Medical Records">
              <Row gutter={[16, 24]}>
                <Col className="gutter-row" span={24}>
                  <Tabs
                    defaultActiveKey="1"
                    tabPosition="left"
                    style={{ height: "auto" }}
                    items={deletedHistory.map((data, i) => {
                      const id = String(data.id);
                      return {
                        label: dayjs(data.dateUpdated).format('DD/MM/YYYY HH:mm'),
                        key: id,
                        children: <>
                          <Descriptions
                            bordered
                            column={{ xxl: 3, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
                          >
                            <Descriptions.Item label="Delete Reason">{data.deleteReason}</Descriptions.Item>
                            <Descriptions.Item label="Diagnosis">{data.sicknesses.map((sickness) => sickness.description + " (" + sickness.code + ")").join(", ")}</Descriptions.Item>
                            <Descriptions.Item label="MC (No. of Day)">{data.mcDays.toFixed(2).toString()}</Descriptions.Item>
                            <Descriptions.Item label="MC Date Range">{data.mcFrom != null && dayjs(data.mcFrom).format('DD/MM/YYYY') + " until " + dayjs(data.mcTo).format('DD/MM/YYYY')}</Descriptions.Item>
                            <Descriptions.Item label="Consultation Fee">{"MYR " + (data.consultantFeesAmount == null ? "0.00" : data.consultantFeesAmount.toFixed(2))}</Descriptions.Item>
                            <Descriptions.Item label="Medication Fee">{"MYR " + (data.medicalFeesAmount == null ? "0.00" : data.medicalFeesAmount.toFixed(2))}</Descriptions.Item>
                            <Descriptions.Item label="Grand Total">{"MYR " + (data.grandTotalAmount == null ? "0.00" : data.grandTotalAmount.toFixed(2))}</Descriptions.Item>
                            <Descriptions.Item label="Medical Remarks">{data.medicalRemark}</Descriptions.Item>
                          </Descriptions>
                        </>,
                      };
                    })}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
}
  ;
export default EditMedicalRecordDate;