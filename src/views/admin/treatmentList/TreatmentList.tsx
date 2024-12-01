import { useState, } from "react";
import { Space, Table, Button, Modal, Form, Input, Card, Spin, message } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { PlusOutlined, } from '@ant-design/icons';
import AddModalTreatmentList from './AddModalTreatmentList';
 import EditModalTreatmentList from './EditModalTreatmentList';
import { TreatmentListDeleteRequestDto, TreatmentListResponseDto } from "@/api/treatmentList/treatmentList.types";
import { useQuery } from "@tanstack/react-query";
import { fetchTreatmentList,deleteTreatmentList } from "@/api/treatmentList/treatmentList.api";
const TreatmentList = () => {

  const [dataSource, setDataSource] = useState<TreatmentListResponseDto[]>([]);
  const [isEditData, setEditData] = useState<TreatmentListResponseDto | null>(null);

  //Add Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  //Edit Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [form] = Form.useForm();

  const {
    isLoading: isLoading,
    isFetching,
    isError,
    isSuccess,
    data,
    error,

} = useQuery({
    queryKey: ['sickness'],
    queryFn: () => fetchTreatmentList(),
    onSuccess(data) {
      const filteredData = data.filter((item) => item.status === true);
      setDataSource(filteredData);
    },
})

  //filter description
  const descriptionFilters = dataSource.map(sicknessList => ({
    text: sicknessList.description,
    value: sicknessList.description,
  }));

  const columns: ColumnsType<TreatmentListResponseDto> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
    },

    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      filters: descriptionFilters,
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value: string | number | boolean, record: TreatmentListResponseDto) => record.description.startsWith(value.toString()),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: { id: number }) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}>Edit</a>
          <a onClick={() => handleDelete(record.id)}>Delete</a>
        </Space>
      ),
    },
  ];


  const onChange: TableProps<TreatmentListResponseDto>['onChange'] = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };

  
  //edit modal start
  const handleEdit = (record: { id: number }) => {
    const user = dataSource.find((u) => u.id === record.id);

    if (user) {
      const updatedUser = { ...user };
      setEditData(updatedUser);
      setIsEditModalOpen(true);
    }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Confirm Deletion',
      content: 'Are you sure you want to delete this sickness?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          const request: TreatmentListDeleteRequestDto = { id: id };
          await deleteTreatmentList(request);
          setDataSource((prevDataSource) =>
            prevDataSource.filter((item) => item.id !== id)
          );
          message.success('Treatment deleted successfully.');
          setTimeout(() => {
            window.location.reload();
        }, 2000);
        } catch (error) {
          message.error('Failed to delete treatment.');
        }
      },
      onCancel: () => {
        
      },
    });
  };

  return (
    <div>
    <Spin spinning={isLoading} tip="Loading...">
    <Card title="Treatment List" extra={<div className="button-container">
      <Button type="primary" onClick={() => setIsModalOpen(true)}><PlusOutlined rev={undefined} /> Add Treatment</Button>{isModalOpen && <AddModalTreatmentList closeModal={() => setIsModalOpen(false)} />}</div>} className="my-card">
      <Table columns={columns} dataSource={dataSource} onChange={onChange} />
    </Card>

    {isEditModalOpen && (
  <EditModalTreatmentList editData={isEditData} closeModal={() => setIsEditModalOpen(false)}/>
)}

</Spin>
  </div>
  );
}
export default TreatmentList;