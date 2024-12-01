import { useEffect, useState, } from "react";
import { Space, Table, Button, Modal, Form, Input, Card, Select, AutoComplete, message } from 'antd';
import './AdminList.css';
import { fetchEmployee } from "@/api/employee/employee.api";
import { EmployeeRequestDto, EmployeeResponseDto } from "@/api/employee/employee.types"
import { addAdminList } from "@/api/admin/admin.api";
import { adminRequestDto, adminResponseDto } from "@/api/admin/admin.types"
import EmployeeAsyncSelectComponent from "@/components/employeeAsynSelect/EmployeeAsyncSelectComponent";
import { fetchRole } from "@/api/role/role.api";
import { roleResponseDto } from "@/api/role/role.types";
import { useQuery } from "@tanstack/react-query";


type AddModalProps = {
  closeModal: () => void;
  dataSourceRole: roleResponseDto[];
  successfullAdd: (arg: boolean) => void
};
type SizeType = Parameters<typeof Form>[0]["size"];

const AddModalAdminList = ({ closeModal, dataSourceRole,successfullAdd }: AddModalProps) => {
  const [isAddModalVisible, setIsAddModalVisible] = useState(true);
  const [form] = Form.useForm();
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
  const [selectedUsername, setSelectedUsername] = useState("");
  const [selectedEmail, setSelectedEmail] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [componentSize, setComponentSize] = useState<SizeType | "default">("default");
  const [isEnable, setEnable] = useState<boolean>(false)
  const [isLoadingButton, setLoadingButton] = useState<boolean>(false)
  const [addValue, setaddValue] = useState<adminRequestDto>({
    username: "", 
    name:"",
    email: "",
    roles: [],
  })

  const {
    isLoading: isLoadingAddAdmin, isFetching: isFetchingAddAdmin, isError: isErrorAddAdmin, isSuccess: isSuccessAddAdmin, data: dataAddAdmin, error: errorAddAdmin, refetch: refetchAddAdmin
  } = useQuery({
    queryKey: ['addAdmin', addValue],
    queryFn: () => addAdminList(addValue),
    enabled: isEnable
  })

  //Add Api Call is Successfull
  useEffect(() => {
    if (isSuccessAddAdmin) {
      successfullAdd(true)
      handleaddCancel();
      setLoadingButton(false)
      message.success('User Role added successfully!');
      setTimeout(() => {
      }, 2000);
    }
  }, [isSuccessAddAdmin])

  const handleOptionSelect = async (selectedOption: any) => {
    try {
      const inputValueObj = {
        searchValue: selectedOption.value,
        filterType: 'username',
      };
      const response = await fetchEmployee(inputValueObj);
      setSelectedEmail(response.email);
      setSelectedName(response.fullname);
      setSelectedUsername(response.username);
    } catch (error) {
      console.error('Error fetching employee data:', error);
      setSelectedEmail("");
      setSelectedName("");
      setSelectedUsername("");
    }
  };

  const onFinish = async (values: adminRequestDto) => {
    setLoadingButton(true)
    const updatedInformation = {
      name:selectedName,
      username: selectedUsername,
      email: selectedEmail,
      status: true,
      roles: [values.roles],
    };

    setaddValue(updatedInformation)
    setEnable(true)
  }
 
  const handleaddCancel = () => {
    setIsAddModalVisible(false);
    form.resetFields();
    closeModal();
  };

  const onFormLayoutChange = ({ size }: { size: SizeType }) => {
    setComponentSize(size);
  };

  return (
    <div>
      <Modal
        title="Add User Role"
        open={isAddModalVisible}
        onCancel={handleaddCancel}
        width={700}
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          initialValues={{ size: componentSize }}
          onValuesChange={onFormLayoutChange}
          size={componentSize as SizeType}
          onFinish={onFinish}
        >
          <EmployeeAsyncSelectComponent handleOptionSelect={handleOptionSelect} />

          <Form.Item label="Name" >
            <Input name="name" value={selectedName} placeholder="Automatically shown according to the username" readOnly />
          </Form.Item>

          <Form.Item label="Email" >
            <Input name="email" value={selectedEmail} placeholder="Automatically shown according to the username" readOnly />
          </Form.Item>

          <Form.Item  name="roles" label="Role" rules={[{ required: true, message: 'Please select Role!' }]} >
          <Select showSearch placeholder="Factory" 
                            filterOption={(input, option) =>
                                option && option.children
                                    ? option.children.toString().toLowerCase().indexOf(input.toString().toLowerCase()) >= 0
                                    : false
                            }>
              {dataSourceRole.map((role) => (
                <Select.Option key={role.id} value={role.id}>
                  {role.description}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button loading={isFetchingAddAdmin} id="btn-submit" type="primary" htmlType="submit">
              Submit
            </Button>
            <Button onClick={handleaddCancel}>Cancel</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AddModalAdminList;
