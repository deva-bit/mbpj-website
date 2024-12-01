import { useEffect, useState, } from "react";
import { Space, Table, Button, Modal, Form, Input, Card, message, Select } from 'antd';
import { addFactoryPic } from "@/api/factoryPic/factoryPic.api";
import { factoryPicResponseDto, factoryPicRequestDto } from "@/api/factoryPic/factoryPic.types";
import { useQuery } from "@tanstack/react-query";
import { pagesRequestDto, pagesResponseDto } from "@/api/pages/pages.types";
import { addRole } from "@/api/role/role.api";
import { roleRequestDto, roleResponseDto, roleDeleteRequestDto } from "@/api/role/role.types";

type AddModalProps = {
    closeModal: () => void;
    pagesData: pagesResponseDto[] | undefined;
    fetchingPages: boolean,
    successfullAdd: (arg: boolean) => void
};
type SizeType = Parameters<typeof Form>[0]['size'];

const AddModalRoles = ({ closeModal, pagesData, fetchingPages,successfullAdd }: AddModalProps) => {

    const [isAddModalVisible, setIsAddModalVisible] = useState(true);
    const [form] = Form.useForm();
    const [componentSize, setComponentSize] = useState<SizeType | 'default'>('default');
    const [isEnable, setEnable] = useState<boolean>(false)
    const [addValue, setaddValue] = useState<roleRequestDto>({
        description: "",
        pages: [],
    })

    const {
        isLoading: isLoadingAddRoles, isFetching: isFetchingAddRoles, isError: isErrorAddRoles, isSuccess: isSuccessAddRoles, data: dataAddRoles, error: errorAddRoles, refetch: refetchAddRoles
    } = useQuery({
        queryKey: ['addRoles', addValue],
        queryFn: () => addRole(addValue),
        enabled: isEnable
    })

    //Add Api Call is Successfull
    useEffect(() => {
        if (isSuccessAddRoles) {
            successfullAdd(true)
            handleaddCancel();
            message.success('Role added successfully!');
            setTimeout(() => {
            }, 2000);
        }
    }, [isSuccessAddRoles])

    const onFinish = (values: roleRequestDto) => {
        const updatedInformation = {
            description: values.description,
            status: true,
            pages:values.pages,
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
                title="Add Roles"
                open={isAddModalVisible}
                onCancel={handleaddCancel}
                width={700}
                footer={null}
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
                    <Form.Item
                        label="Role Name"
                        name="description"
                        rules={[{ required: true, message: 'Please input the Role Name!' }]}
                    >
                        <Input placeholder="Role Name" />
                    </Form.Item>
                    <Form.Item
                        label="Pages"
                        name="pages"
                        rules={[{ required: true, message: 'Please select the Pages!' }]}
                    >
                        <Select loading={fetchingPages} showSearch placeholder="Pages" mode="multiple"
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
                        <Button loading={isFetchingAddRoles} id="btn-submit" type="primary" htmlType="submit" >
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

export default AddModalRoles;
