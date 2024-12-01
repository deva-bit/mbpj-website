import { useEffect, useState, } from "react";
import { Button, Modal, Form, Input, message, Select } from 'antd';
import './FactoryPic.css';
import { factoryPicResponseDto, factoryPicRequestDto } from "@/api/factoryPic/factoryPic.types";
import { editFactoryPic } from "@/api/factoryPic/factoryPic.api";
import { useQuery } from "@tanstack/react-query";
import { FactoryResponseDto } from "@/api/factory/factory.types";

type EditModalProps = {
    editData: factoryPicResponseDto | null;
    factory: FactoryResponseDto[];
    loadingFactoryCode: boolean;
    closeModal: () => void;
    successfullEdit: (arg: boolean) => void
};

const EditModalFactoryPic = ({ editData, factory, loadingFactoryCode, closeModal, successfullEdit }: EditModalProps) => {

    const [isAddModalVisible, setIsAddModalVisible] = useState(true);
    const [form] = Form.useForm();
    type SizeType = Parameters<typeof Form>[0]['size'];
    const [componentSize, setComponentSize] = useState<SizeType | 'default'>('default');
    const [isEnable, setEnable] = useState<boolean>(false)
    const [isLoadingButton, setLoadingButton] = useState<boolean>(false)
    const [editValue, setEditValue] = useState<factoryPicRequestDto>({
        name: "",
        email: "",
        factoryIds: [],
    })

    const {
        isLoading: isLoadingEditFactoryPIC, isFetching: isFetchingEditFactoryPIC, isError: isErrorEditFactoryPIC, isSuccess: isSuccessEditFactoryPIC, data: dataEditFactoryPIC, error: errorEditFactoryPIC, refetch: refetchEditFactoryPIC
    } = useQuery({
        queryKey: ['editFactoryPIC', editValue],
        queryFn: () => editFactoryPic(editValue),
        enabled: isEnable
    })

    //Edit Api Call is Successfull
    useEffect(() => {
        if (isSuccessEditFactoryPIC) {
            successfullEdit(true)
            handleaddCancel();
            setLoadingButton(false)
            message.success('Factory PIC updated successfully!');
            setTimeout(() => {
            }, 2000);
        }
    }, [isSuccessEditFactoryPIC])

    //Edit Api Call is Failed
    useEffect(() => {
        if (isErrorEditFactoryPIC) {
            handleaddCancel();
            setLoadingButton(false)
            message.error('An unexpected error occurred.');
            setTimeout(() => {
            }, 2000);
            console.error(errorEditFactoryPIC)
        }
    }, [isErrorEditFactoryPIC])

    const handleaddCancel = () => {
        setIsAddModalVisible(false);
        form.resetFields();
        closeModal();
    };
    
    const onFormLayoutChange = ({ size }: { size: SizeType }) => {
        setComponentSize(size);
    };

    const onFinish = (values: factoryPicRequestDto) => {
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
                title="Edit Factory PIC"
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
                        name: editData?.name,
                        email: editData?.email,
                        status: editData?.status,
                        factoryIds: editData?.factories.map(factory => factory.id)
                    }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="Name"
                        name="name"
                    >
                        <Input readOnly />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                    >
                        <Input readOnly />
                    </Form.Item>
                    <Form.Item
                        label="Factory"
                        name="factoryIds"
                        rules={[{ required: true, message: 'Please select Clinic ID!' }]}
                    >
                        <Select loading={loadingFactoryCode} showSearch placeholder="Factory" mode="multiple"
                            filterOption={(input, option) =>
                                option && option.children
                                    ? option.children.toString().toLowerCase().indexOf(input.toString().toLowerCase()) >= 0
                                    : false
                            }>

                            {factory.map((item) => (
                                <Select.Option key={item.id} value={item.id}>
                                    {item.name}
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

export default EditModalFactoryPic;
