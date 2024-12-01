import React, { useState, } from "react";
import { Space, Table, Button, Modal, Form, Input, Card, Select, Cascader, Row, Col } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";
import EditModalRoles from "./EditModalUserRole";
import AddModalRoles from "./AddModalUserRole";
import './UserRole.css';

interface unclaimableMedical {
  id: number;
  roleName: string;
 name:string;
}
const Roles = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<unclaimableMedical | undefined>(undefined);

  const unclaimableMedicals: unclaimableMedical[] = [
    { id: 1, name:"Deva",roleName: 'Marketing admin'},
    { id: 2, name:"arina ",roleName: 'Hr admin'},
    
  ];
  const columns: ColumnsType<unclaimableMedical> = [
    {
      title: 'No',
      dataIndex: 'id',
      key: 'id',
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
    {
      title: 'Role Name',
      dataIndex: 'roleName',
      key: 'roleName',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: { id: number}) => (
        <Space size="middle">
           <a onClick={() => handleEdit(record)}>Edit</a>
           <a onClick={() => handleEdit(record)}>Delete</a>
        </Space>
      ),
    },
  ];
  const dataSource = unclaimableMedicals.map((unclaimableMedicals) => {
    
    return {
      key: unclaimableMedicals.id,
      id: unclaimableMedicals.id,
      roleName: unclaimableMedicals.roleName,
      name:unclaimableMedicals.name
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
    <Card title="Roles" extra={<div className="button-container">
          <Button type="primary" onClick={() => setIsModalOpen(true)}><PlusOutlined rev={undefined} /> Add User Roles</Button>{isModalOpen && <AddModalRoles closeModal={() => setIsModalOpen(false)} />}</div>}> 
      <Table columns={columns} dataSource={dataSource}   />
    </Card>
    {isEditModalOpen && (
    <EditModalRoles closeModal={() => setIsEditModalOpen(false)}/>
  )}
    </div>
  );
};
export default Roles