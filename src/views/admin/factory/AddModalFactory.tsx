import { SetStateAction, useEffect, useState, } from "react";
import { Space, Table, Button, Modal, Form, Input, Card, message, Select } from 'antd';
import { addFactory } from "@/api/factory/factory.api";
import { FactoryRequestDto, FactoryResponseDto } from "@/api/factory/factory.types";
import './Factory.css';
import { codeFactoryRequestDto, codeFactoryResponseDto } from "@/api/codeFactory/codeFactory.types";
import { useQuery } from "@tanstack/react-query";
import { factoryPicResponseDto } from "@/api/factoryPic/factoryPic.types";
type AddModalProps = {
    closeModal: () => void;
    factoryCode: codeFactoryResponseDto[];
    factoryPIC: factoryPicResponseDto[];
    loadingFactoryPIC: boolean;
    loadingFactoryCode: boolean;
    successfullAdd: (arg: boolean) => void
};
type SizeType = Parameters<typeof Form>[0]['size'];

const AddModalFactory = ({ closeModal, factoryCode, factoryPIC, loadingFactoryPIC, loadingFactoryCode, successfullAdd }: AddModalProps) => {

    const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(true);
    const [form] = Form.useForm();
    const [componentSize, setComponentSize] = useState<SizeType | 'default'>('default');
    const [isEnable, setEnable] = useState<boolean>(false)
    const [isLoadingButton, setLoadingButton] = useState<boolean>(false)
    const [addValue, setaddValue] = useState<FactoryRequestDto>({
        code: "",
        name: "",
        addressLine1: "",
        addressLine2: "",
        state: "",
        postcode: "",
        country: "",
        picIds: [],
    })
    const {
        isLoading: isLoadingAddFactory, isFetching: isFetchingAddFactory, isError: isErrorAddFactory, isSuccess: isSuccessAddFactory, data: dataAddFactory, error: errorAddFactory, refetch: refetchAddFactory
    } = useQuery({
        queryKey: ['addFactory', addValue],
        queryFn: () => addFactory(addValue),
        enabled: isEnable
    })

    //Add Api Call is Successfull
    useEffect(() => {
        if (isSuccessAddFactory) {
            successfullAdd(true)
            handleaddCancel();
            setLoadingButton(false)
            message.success('Factory added successfully!');
            setTimeout(() => {
            }, 2000);
        }
    }, [isSuccessAddFactory])

    const onFinish = async (values: FactoryRequestDto) => {
        setLoadingButton(true)
        setaddValue(values)
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
                title="Add Factory"
                open={isAddModalVisible}
                onCancel={handleaddCancel}
                width={700}
                footer={null}
            >
                <Form
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 19 }}
                    layout="horizontal"
                    initialValues={{ size: componentSize }}
                    onValuesChange={onFormLayoutChange}
                    size={componentSize as SizeType}
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="Factory Code & Name"
                        name="code"
                        rules={[{ required: true, message: 'Please input the Clinic Code!' }]}
                    >
                        <Select loading={loadingFactoryCode} showSearch placeholder="Factory">
                            {factoryCode && factoryCode.map((item) => (
                                <Select.Option key={item.code} value={item.code}>
                                    {item.code}-{item.factoryName}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input the Clinic Name!' }]}
                    >
                        <Input placeholder="Clinic Name" />
                    </Form.Item>
                    <Form.Item label="Address Line 1" name="addressLine1" rules={[{ required: true, message: 'Please enter Address Line 1' }]}>
                        <Input placeholder="Address Line 1" />
                    </Form.Item>
                    <Form.Item label="Address Line 2" name="addressLine2">
                        <Input placeholder="Address Line 2" />
                    </Form.Item>
                    <Form.Item label="State" name="state" rules={[{ required: true, message: 'Please enter State' }]}>
                        <Input placeholder="State" />
                    </Form.Item>
                    <Form.Item label="Postcode" name="postcode" rules={[{ required: true, message: 'Please enter Postcode' }]}>
                        <Input placeholder="Postcode" />
                    </Form.Item>
                    <Form.Item label="Country" name="country" rules={[{ required: true, message: 'Please enter Country' }]}>
                        <Input placeholder="Country" />
                    </Form.Item>
                    <Form.Item
                        label="Factory PIC"
                        name="picIds"
                    >
                        <Select loading={loadingFactoryPIC} showSearch placeholder="Factory PIC" mode="multiple"
                            filterOption={(input, option) =>
                                option && option.children
                                    ? option.children.toString().toLowerCase().indexOf(input.toString().toLowerCase()) >= 0
                                    : false
                            }>
                            {factoryPIC.map((item) => (
                                <Select.Option key={item.id} value={item.id}>
                                    {item.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button loading={isLoadingButton} id="btn-submit" type="primary" htmlType="submit" >
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

export default AddModalFactory;
