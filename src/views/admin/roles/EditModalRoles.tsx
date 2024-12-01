import { useEffect, useState, } from "react";
import { Button, Modal, Form, Input, message, DatePicker, Select } from 'antd';
import 'dayjs/locale/en';
import { useQuery } from "@tanstack/react-query";
import { roleRequestDto, roleResponseDto } from "@/api/role/role.types";
import { pagesResponseDto } from "@/api/pages/pages.types";
import { editRole } from "@/api/role/role.api";

type EditModalProps = {
    editData: roleResponseDto | null;
    closeModal: () => void;
    pagesData: pagesResponseDto[] | undefined;
    fetchingPages: boolean,
    successfullEdit: (arg: boolean) => void
};
type SizeType = Parameters<typeof Form>[0]['size'];

const EditModalRoles = ({ closeModal, editData, pagesData, fetchingPages, successfullEdit }: EditModalProps) => {

    const [componentSize, setComponentSize] = useState<SizeType | 'default'>('default');
    const [isAddModalVisible, setIsAddModalVisible] = useState(true);
    const [form] = Form.useForm();
    // const initialPublishDate = editData ? dayjs(editData.publishDate) : null;
    const [isLoadingButton, setLoadingButton] = useState<boolean>(false)
    const [isEnable, setEnable] = useState<boolean>(false)
    const [editValue, setEditValue] = useState<roleRequestDto>({
        description: "",
        pages: [],
    })

    const {
        isLoading: isLoadingEditRole, isFetching: isFetchingEditRole, isError: isErrorEditRole, isSuccess: isSuccessEditRole, data: dataEditRole, error: editRoleError, refetch: editRoleRefetch
    } = useQuery({
        queryKey: ['editRole', editValue],
        queryFn: () => editRole(editValue),
        enabled: isEnable
    })

    //Edit Api Call is Successfull
    useEffect(() => {
        if (isSuccessEditRole) {
            successfullEdit(true)
            handleaddCancel();
            setLoadingButton(false)
            message.success('Roles updated successfully!');
            setTimeout(() => {
            }, 2000);
        }
    }, [isSuccessEditRole])

    //Edit Api Call is Failed
    useEffect(() => {
        if (isErrorEditRole) {
            handleaddCancel();
            setLoadingButton(false)
            message.error('An unexpected error occurred.');
            setTimeout(() => {
            }, 2000);
            console.error(editRoleError)
        }
    }, [isErrorEditRole])

    const handleaddCancel = () => {
        setIsAddModalVisible(false);
        form.resetFields();
        closeModal();
    };

    const onFormLayoutChange = ({ size }: { size: SizeType }) => {
        setComponentSize(size);
    };

    const onFinish = (values: roleRequestDto) => {
        setLoadingButton(true)
        const updatedInformation = {
            ...values,
            id: editData?.id,
            status: true
        };
        setEditValue(updatedInformation)
        setEnable(true)
    };

    return (
        <div>
            <Modal
                title="Edit Roles"
                open={isAddModalVisible}
                onCancel={handleaddCancel}
                width={700}
                footer={null}
            >
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    layout="horizontal"
                    onValuesChange={onFormLayoutChange}
                    size={componentSize as SizeType}
                    initialValues={{
                        size: componentSize,
                        description: editData?.description,
                        pages: editData?.pages.map(page => page.id)
                    }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="Role Name"
                        name="description"
                        rules={[{ required: true, message: 'Please input the Role Name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label=" Pages"
                        name="pages"
                        rules={[{ required: true, message: 'Please select Clinic ID!' }]}
                    >
                        <Select loading={fetchingPages} showSearch placeholder="Factory PIC" mode="multiple"
                            filterOption={(input, option) =>
                                option && option.children
                                    ? option.children.toString().toLowerCase().indexOf(input.toString().toLowerCase()) >= 0
                                    : false
                            }>
                            {pagesData?.map((item) => (
                                <Select.Option key={item.id} value={item.id}>
                                    {item.description}
                                </Select.Option>
                            ))}
                        </Select>


                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button loading={isLoadingButton} id="btn-submit" type="primary" htmlType="submit">
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

export default EditModalRoles;
