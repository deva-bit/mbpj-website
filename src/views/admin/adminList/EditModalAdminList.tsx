import { useEffect, useState, } from "react";
import { Button, Modal, Form, Input, message, DatePicker, Select } from 'antd';
import './AdminList.css';
import { adminResponseDto, adminRequestDto } from "@/api/admin/admin.types";
import { editAdminList } from "@/api/admin/admin.api";
import 'dayjs/locale/en';
import { roleRequestDto, roleResponseDto } from "@/api/role/role.types";
import { useQuery } from "@tanstack/react-query";

type EditModalProps = {
    editData: adminResponseDto | null;
    closeModal: () => void;
    dataSourceRole: roleResponseDto[];
    successfullEdit: (arg: boolean) => void
};

const EditModalAdmin = ({ editData, closeModal, dataSourceRole, successfullEdit }: EditModalProps) => {
    const [isAddModalVisible, setIsAddModalVisible] = useState(true);
    const [form] = Form.useForm();
    const [isEnable, setEnable] = useState<boolean>(false)
    const [editValue, setEditValue] = useState<adminRequestDto>({
        username: "",
        name:"",
        email: "",
        roles: [],
    })

    const {
        isLoading: isLoadingEditAdmin, isFetching: isFetchingEditAdmin, isError: isErrorEditAdmin, isSuccess: isSuccessEditAdmin, data: dataEditAdmin, error: errorEditAdmin, refetch: refetchEditAdmin
    } = useQuery({
        queryKey: ['editAdmin', editValue],
        queryFn: () => editAdminList(editValue),
        enabled: isEnable
    })

    // const initialPublishDate = editData ? dayjs(editData.publishDate) : null;

    //Edit Api Call is Successfull
    useEffect(() => {
        if (isSuccessEditAdmin) {
            successfullEdit(true)
            handleaddCancel();
            message.success('User Role updated successfully!');
            setTimeout(() => {
            }, 2000);
        }
    }, [isSuccessEditAdmin])

    //Edit Api Call is Failed
    useEffect(() => {
        if (isErrorEditAdmin) {
            handleaddCancel();
            message.error('An unexpected error occurred.');
            setTimeout(() => {
            }, 2000);
            console.error(errorEditAdmin)
        }
    }, [isErrorEditAdmin])

    const handleaddCancel = () => {
        setIsAddModalVisible(false);
        form.resetFields();
        closeModal();
    };

    type SizeType = Parameters<typeof Form>[0]['size'];
    const [componentSize, setComponentSize] = useState<SizeType | 'default'>('default');

    const onFormLayoutChange = ({ size }: { size: SizeType }) => {
        setComponentSize(size);
    };
    const onFinish = async (values: adminRequestDto) => {
        const updatedInformation = {
            id: editData?.id,
            email: values.email,
            username: values.username,
            name:values.name,
            status:true,
            roles: [values.roles]
        };

        setEditValue(updatedInformation)
        setEnable(true)
    };
    return (
        <div>
            <Modal
                title="Edit Admin"
                open={isAddModalVisible}
                onCancel={handleaddCancel}
                width={700}
            >
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    layout="horizontal"
                    onValuesChange={onFormLayoutChange}
                    size={componentSize as SizeType}
                    initialValues={{
                        size: componentSize,
                        username: editData?.username,
                        email: editData?.email,
                        roles: editData?.roles.filter(role => role.status === true).map(role => role.id)
                        
                    }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="Username"
                        name="username"
                    >
                        <Input readOnly />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                    >
                        <Input readOnly />
                    </Form.Item>
                    <Form.Item  name="roles" label="Role" rules={[{ required: true, message: 'Please select Role!' }]} >
          <Select showSearch placeholder="Factory" 
                            filterOption={(input, option) =>
                                option && option.children
                                    ? option.children.toString().toLowerCase().indexOf(input.toString().toLowerCase()) >= 0
                                    : false
                            }>
              {dataSourceRole.map((role) => (
                role.id?(
                <Select.Option key={role.id} value={role.id}>
                    
                  {role.description}
                 
                </Select.Option> 
                ):" "
              ))}
            </Select>
          </Form.Item>
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button loading={isFetchingEditAdmin} id="btn-submit" type="primary" htmlType="submit">
                            Submit
                        </Button>
                        <Button onClick={handleaddCancel}>
                            Cancel
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default EditModalAdmin;
