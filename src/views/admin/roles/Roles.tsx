import React, { SetStateAction, useEffect, useState, } from "react";
import { Space, Table, Button, Modal, Form, Input, Card, Select, Cascader, Row, Col, Spin, message } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";
import EditModalRoles from "./EditModalRoles";
import AddModalRoles from "./AddModalRoles";
import './Roles.css';
import { roleRequestDto, roleResponseDto, roleDeleteRequestDto } from "@/api/role/role.types";
import { fetchRole, deleteRole } from "@/api/role/role.api";
import { pagesRequestDto, pagesResponseDto, pagesDeleteRequestDto } from "@/api/pages/pages.types";
import { fetchPages } from "@/api/pages/pages.api";
import { useQuery } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAdminList } from "@/api/admin/admin.api";
import { setUserRole } from '@/store/userRole/userRoleSlice'

const Roles = () => {
  const dispatch = useAppDispatch();
  const [dataSource, setDataSource] = useState<roleResponseDto[] | undefined>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isDataPages, setDataPages] = useState<pagesResponseDto[] | undefined>([]);
  const [isEditData, setEditData] = useState<roleResponseDto | null>(null);
  const [isEnableDelete, setDeleteEnable] = useState<boolean>(false)
  const [isSuccessfullAdd, setSuccessfullAdd] = useState<boolean>(false);
  const [isSuccessfullEdit, setSuccessfullEdit] = useState<boolean>(false);  
  const [deleteValue, setDeleteValue] = useState<roleDeleteRequestDto>({
    id: 0,
  })
  const employeeEmail = useAppSelector((state) => state.user.user.email)
  const details = useAppSelector((state) => state.userRole.userRole)
  const {
    isLoading: isLoadingRole, isFetching: isFetchingRole, isError: isErrorRole, isSuccess: isSuccessRole, data: dataRole, error: errorRole, refetch: refetchRole
  } = useQuery({
    queryKey: ['role'],
    queryFn: () => fetchRole(),
  })
  const {
    isLoading: isLoadingAdmin, isFetching: isFetchingAdmin, isError: isErrorAdmin, isSuccess: isSuccessAdmin, data: dataAdmin, error: errorAdmin, refetch: refetchAdmin
  } = useQuery({
    queryKey: ['admin'],
    queryFn: () => fetchAdminList(),
  })

  const {
    isLoading: isLoadingPages, isFetching: isFetchingPages, isError: isErrorPages, isSuccess: isSuccessPages, data: dataPages, error: errorPages, refetch: refetchPages
  } = useQuery({
    queryKey: ['pages'],
    queryFn: () => fetchPages(),
  })

  const {
    isLoading: isLoadingDeleteRole, isFetching: isFetchingDeleteRole, isError: isErrorDeleteRole, isSuccess: isSuccessDeleteRole, data: dataDeleteRole, error: errordeleteRole, refetch: deleteRoleRefetch
  } = useQuery({
    queryKey: ['deleteRole', deleteValue],
    queryFn: () => deleteRole(deleteValue),
    enabled: isEnableDelete
  })
  // Role api successfully called
  useEffect(() => {
    if (isSuccessRole) {
      const filteredData = dataRole?.filter((item) => item.status === true);
      setDataSource(filteredData);
    }
  }, [isSuccessRole]);

  // Pages api successfully called
  useEffect(() => {
    if (isSuccessPages) {
      const filteredData = dataPages?.filter((item) => item.status === true);
      setDataPages(filteredData);
    }
  }, [isSuccessPages]);

  //Role data successfully deleted
  useEffect(() => {
    if (isSuccessDeleteRole) {
      refetchRole().then((result) => {
        const data = result.data;
        const filteredData = data?.filter((item) => item.status === true);
        setDataSource(filteredData);
      });
      message.success('Role deleted successfully.');
      setTimeout(() => {
      }, 2000);
    }
  }, [isSuccessDeleteRole]);

  //Refetch API after Add successfull
  useEffect(() => {
    if (isSuccessfullAdd) {
      refetchRole().then((result) => {
        const data = result.data;
        const filteredData = data?.filter((item) => item.status === true);
        setDataSource(filteredData);
      });
      setSuccessfullAdd(false)
    }
  }, [isSuccessfullAdd]);

    //Refetch API after edit successfull
    useEffect(() => {
      if (isSuccessfullEdit) {
        refetchRole().then((result) => {
          const data = result.data;
          const filteredData = data?.filter((item) => item.status === true);
          setDataSource(filteredData);
          refetchAdmin().then((resultData) => {
            const dataAdmin = resultData.data;
            dataAdmin?.forEach((item) => {
              if (item.email === employeeEmail) {
                dispatch(
                  setUserRole({
                    name: item.username,
                    email: item.email,
                    roles: item.roles,
                    status:item.status,
                    adminAuthentication:true

                  })
                )
              }
            });
          });
        });
        setSuccessfullEdit(false)
      }
    }, [isSuccessfullEdit]);

  //Get status from AddModalRoles component
  const successfullAdd = (status: boolean): void => {
    setSuccessfullAdd(status)
  }
   //Get status from EditModalRolescomponent
   const successfullEdit = (status: boolean): void => {
    setSuccessfullEdit(status)
  }
  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Confirm Deletion',
      content: 'Are you sure you want to delete this role?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          const request: roleDeleteRequestDto = { id: id };
          setDeleteValue(request);
          setDeleteEnable(true)
        } catch (error) {
          message.error('Failed to delete factory.');
          console.error(errordeleteRole)
        }
      },
    });
  };

  const columns: ColumnsType<roleResponseDto> = [
    {
      title: 'No',
      dataIndex: 'id',
      key: 'id',
      render: (text: any, record: any, index: number) => {
        const pageIndex = (currentPage - 1) * 10 + index + 1;
        return <span>{pageIndex}</span>;
      },
    },
    {
      title: 'Role Name',
      dataIndex: 'description',
      key: 'roleName',
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


  //edit modal start
  const handleEdit = (record: { id: number }) => {
    const data = dataSource?.find((u) => u.id === record.id);

    if (data) {
      const updatedUser = { ...data };
      setEditData(updatedUser);
      setIsEditModalOpen(true);
    }
  };
  const onChange: TableProps<roleResponseDto>['onChange'] = (pagination, filters, sorter, extra) => {
    // console.log('params', pagination, filters, sorter, extra);
  };
  return (
    <div>
      <Spin spinning={isLoadingRole} tip="Loading...">
        <Card title="Roles" extra={<div className="button-container">
          <Button type="primary" onClick={() => setIsModalOpen(true)}><PlusOutlined rev={undefined} /> Add Roles</Button>{isModalOpen && <AddModalRoles successfullAdd={successfullAdd} pagesData={isDataPages} fetchingPages={isFetchingPages} closeModal={() => setIsModalOpen(false)} />}</div>}>
          <Table columns={columns} dataSource={dataSource} onChange={onChange} pagination={{ current: currentPage, pageSize: 10, onChange: (page: SetStateAction<number>) => setCurrentPage(page), showQuickJumper: true, showTotal: (total: any, range: any[]) => `${range[0]}-${range[1]} of ${total} items` }} />
        </Card>
        {isEditModalOpen && (
          <EditModalRoles successfullEdit={successfullEdit} pagesData={isDataPages} fetchingPages={isFetchingPages} editData={isEditData} closeModal={() => setIsEditModalOpen(false)} />
        )}
      </Spin>
    </div>
  );
};
export default Roles