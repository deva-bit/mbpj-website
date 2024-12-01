import React, { useState, } from "react";
import { Space, Table, Button, Modal, Form, Input, Card, Select, Cascader, Row, Col } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";
import AddModalUnclaimableMedical from "./AddModalUnclaimableMedical";
import EditModalUnclaimableMedical from "./EditModalUnclaimableMedical";

interface unclaimableMedical {
  id: number;
  code: string;
  description:string;
  category:string;
}
const unclaimableMedical = () => {

  //Add Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
  //Edit Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<unclaimableMedical | undefined>(undefined);

  const unclaimableMedicals: unclaimableMedical[] = [
    { id: 1, code: 'DIABET',description: 'DIABETES',category:'CHRONIC DISEASES'},
    { id: 2, code: 'HO-THY',description: 'HYPOTHYROIDISM',category:'CHRONIC DISEASES'},
    { id: 3, code: 'H-TYN',description: 'HYPERTENSION',category:'CHRONIC DISEASES'},
  ];
  const columns: ColumnsType<unclaimableMedical> = [
    {
      title: 'No',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: { id: number}) => (
        <Space size="middle">
           <a onClick={() => handleEdit(record)}>Edit</a>
        </Space>
      ),
    },
  ];
  const dataSource = unclaimableMedicals.map((unclaimableMedicals) => {
    
    return {
      key: unclaimableMedicals.id,
      id: unclaimableMedicals.id,
      code: unclaimableMedicals.code,
      description: unclaimableMedicals.description,
      category: unclaimableMedicals.category
    };
  });

    //edit modal start
    const handleEdit = (record: { id: number }) => {
      const user = unclaimableMedicals.find((u) => u.id === record.id);
  
      if (user) {
        const updatedUser = { ...user };
        setSelectedUser(updatedUser);
        setIsEditModalOpen(true);
      }
    };
  return(
    <div>
    <Card title="Unclaimable Medical"
      extra={<div className="button-container">
        <Button type="primary" onClick={() => setIsModalOpen(true)}><PlusOutlined rev={undefined} /> Add Unclaimable Medical</Button>{isModalOpen && <AddModalUnclaimableMedical closeModal={() => setIsModalOpen(false)} />}</div>} className="my-card">
      
      <Table columns={columns} dataSource={dataSource}   />
    </Card>
    {isEditModalOpen && (
    <EditModalUnclaimableMedical unclaimableMedical={selectedUser} closeModal={() => setIsEditModalOpen(false)}/>
  )}
    </div>
  );
};
export default unclaimableMedical