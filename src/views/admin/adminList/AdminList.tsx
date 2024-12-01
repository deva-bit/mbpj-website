import React, { SetStateAction, useEffect, useRef, useState, } from "react";
import { Space, Table, Button, Modal, Form, Input, Card, Select, Cascader, Row, Col, message, Spin, InputRef } from 'antd';
import type { ColumnType, ColumnsType, TableProps } from 'antd/es/table';
import { PlusOutlined, MinusCircleOutlined, SearchOutlined } from '@ant-design/icons';
import './AdminList.css';
import AddModalAdminList from './AddModalAdminList';
import EditModalAdmin from './EditModalAdminList';
import { useQuery } from "@tanstack/react-query";
import { adminResponseDto, adminDeleteRequestDto } from "@/api/admin/admin.types";
import { fetchAdminList, deleteAdminList } from "@/api/admin/admin.api";
import Highlighter from "react-highlight-words";
import { FilterConfirmProps } from "antd/es/table/interface";
import { fetchRole } from "@/api/role/role.api";
import { roleResponseDto } from "@/api/role/role.types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUserRole } from '@/store/userRole/userRoleSlice'

const AdminList = () => {
  const dispatch = useAppDispatch();
  const [dataSource, setDataSource] = useState<adminResponseDto[] | undefined>([]);
  const [dataSourceRole, setDataSourceRole] = useState<roleResponseDto[]>([]);
  const [isEditData, setEditData] = useState<adminResponseDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isSuccessfullAdd, setSuccessfullAdd] = useState<boolean>(false);
  const [isSuccessfullEdit, setSuccessfullEdit] = useState<boolean>(false);
  const [isEnableDelete, setDeleteEnable] = useState<boolean>(false)
  const [deleteValue, setDeleteValue] = useState<adminDeleteRequestDto>({
    id: 0,
  })
  const employeeEmail = useAppSelector((state) => state.user.user.email)

  const {
    isLoading: isLoadingAdmin, isFetching: isFetchingAdmin, isError: isErrorAdmin, isSuccess: isSuccessAdmin, data: dataAdmin, error: errorAdmin, refetch: refetchAdmin
  } = useQuery({
    queryKey: ['admin'],
    queryFn: () => fetchAdminList(),
  })

  const {
    isLoading: isLoadingRole, isFetching: isFetchingRole, isError: isErrorRole, isSuccess: isSuccessRole, data: dataRole, error: errorRole, refetch: refetchRole
  } = useQuery({
    queryKey: ['roles'],
    queryFn: () => fetchRole(),
  })

  const {
    isLoading: isLoadingDeleteAdmin, isFetching: isFetchingDeleteAdmin, isError: isErrorDeleteAdmin, isSuccess: isSuccessDeleteAdmin, data: dataDeleteAdmin, error: errorDeleteAdmin, refetch: refetchDeleteAdmin
  } = useQuery({
    queryKey: ['deleteAdmin', deleteValue],
    queryFn: () => deleteAdminList(deleteValue),
    enabled: isEnableDelete
  })

  // Admin api successfully called
  useEffect(() => {
    if (isSuccessAdmin) {
      // const filteredData = dataAdmin?.filter((item) => item.status === true);
      setDataSource(dataAdmin);
    }
  }, [isSuccessAdmin]);

  // Role api successfully called
  useEffect(() => {
    if (isSuccessRole) {
      const filteredDataRole = dataRole?.filter((item) => item.status === true);
      setDataSourceRole(filteredDataRole);
    }
  }, [isSuccessRole]);

  //Refetch API after Add successfull
  useEffect(() => {
    if (isSuccessfullAdd) {
      refetchAdmin().then((result) => {
        const data = result.data;
        // const filteredData = data?.filter((item) => item.status === true);
        setDataSource(data);
      });
      setSuccessfullAdd(false)
    }
  }, [isSuccessfullAdd]);

  //Refetch API after edit successfull
  useEffect(() => {
    if (isSuccessfullEdit) {
      refetchAdmin().then((result) => {
        const data = result.data;
        // const filteredData = data?.filter((item) => item.status === true);
        setDataSource(data);
        data?.forEach((item) => {
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
      setSuccessfullEdit(false)
    }
  }, [isSuccessfullEdit]);

  //Get status from AddModalAdminList component
  const successfullAdd = (status: boolean): void => {
    setSuccessfullAdd(status)
  }

  //Get status from EditModalAdminList component
  const successfullEdit = (status: boolean): void => {
    setSuccessfullEdit(status)
  }

  //Admin data successfully deleted
  useEffect(() => {
    if (isSuccessDeleteAdmin) {
      refetchAdmin().then((result) => {
        const data = result.data;
        // const filteredData = data?.filter((item) => item.status === true);
        setDataSource(data);
      });
      message.success('User deleted successfully.');
      setTimeout(() => {
      }, 2000);
    }
  }, [isSuccessDeleteAdmin]);

  //search props

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };
  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<adminResponseDto> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined rev={undefined} />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} rev={undefined} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  //Delete 
  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Confirm Deletion',
      content: 'Are you sure you want to delete this User?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          const request: adminDeleteRequestDto = { id: id };
          setDeleteValue(request);
          setDeleteEnable(true)
        } catch (error) {
          message.error('Failed to delete user.');
          console.error(errorDeleteAdmin)
        }
      },
    });
  };

  type DataIndex = keyof adminResponseDto;
  const columns: ColumnsType<adminResponseDto> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (text: any, record: any, index: number) => {
        const pageIndex = (currentPage - 1) * 10 + index + 1;
        return <span>{pageIndex}</span>;
      },
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      ...getColumnSearchProps('username'),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      ...getColumnSearchProps('email'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      ...getColumnSearchProps('status'),
      render: (status) => (status ? 'Active' : 'Inactive')
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: { id: number }) => (
        <Space size="middle">
          {<a onClick={() => handleEdit(record)}>Edit</a>}
          <a onClick={() => handleDelete(record.id)}>Delete</a>
        </Space>
      ),
    },
  ];

  const onChange: TableProps<adminResponseDto>['onChange'] = (pagination, filters, sorter, extra) => {
    // console.log('params', pagination, filters, sorter, extra);
  };
  const handleEdit = (record: { id: number }) => {
    const editData = dataSource?.find((u) => u.id === record.id);

    if (editData) {
      setEditData(editData);
      setIsEditModalOpen(true);
    }
  };
  return (
    <div>
      <Spin spinning={isLoadingAdmin} tip="Loading...">
        <Card title="User Role"
          extra={<div className="button-container">
            <Button type="primary" onClick={() => setIsModalOpen(true)}><PlusOutlined rev={undefined} />User Role</Button>{isModalOpen && <AddModalAdminList dataSourceRole={dataSourceRole} successfullAdd={successfullAdd} closeModal={() => setIsModalOpen(false)} />}</div>} className="my-card">
          <Table columns={columns} dataSource={dataSource} onChange={onChange} pagination={{ current: currentPage, pageSize: 10, onChange: (page: SetStateAction<number>) => setCurrentPage(page), showQuickJumper: false, showTotal: (total: any, range: any[]) => `${range[0]}-${range[1]} of ${total} items` }} />
        </Card>
        {isEditModalOpen && (
          <EditModalAdmin successfullEdit={successfullEdit} dataSourceRole={dataSourceRole} editData={isEditData} closeModal={() => setIsEditModalOpen(false)} />
        )}
      </Spin>
    </div>
  );
}
  ;
export default AdminList;