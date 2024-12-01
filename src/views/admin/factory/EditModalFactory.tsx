import { useEffect, useState, } from "react";
import { Button, Modal, Form, Input, message, Select} from 'antd';
import './Factory.css';
import { FactoryResponseDto,FactoryRequestDto } from "@/api/factory/factory.types";
import { editFactory } from "@/api/factory/factory.api";
import { factoryPicResponseDto } from "@/api/factoryPic/factoryPic.types";
import { useQuery } from "@tanstack/react-query";
import { codeFactoryRequestDto, codeFactoryResponseDto } from "@/api/codeFactory/codeFactory.types";

type EditModalProps = {
    editData: FactoryResponseDto | null;
    closeModal: () => void;
    factoryCode: codeFactoryResponseDto[];
    factoryPIC: factoryPicResponseDto[];
    loadingFactoryPIC: boolean;
    loadingFactoryCode: boolean;
    successfullEdit: (arg: boolean) => void
};
type SizeType = Parameters<typeof Form>[0]['size'];

const EditModalFactory = ({ editData, closeModal,factoryCode,factoryPIC,loadingFactoryPIC,loadingFactoryCode,successfullEdit }: EditModalProps) => {

    const [isAddModalVisible, setIsAddModalVisible] = useState(true);
    const [form] = Form.useForm();
    const [componentSize, setComponentSize] = useState<SizeType | 'default'>('default');
    const [isEnable, setEnable] = useState<boolean>(false)
    const [isLoadingButton, setLoadingButton] = useState<boolean>(false)
    const [editValue, setEditValue] = useState<FactoryRequestDto>({
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
        isLoading: isLoadingEditFactory, isFetching: isFetchingEditFactory, isError: isErrorEditFactory, isSuccess: isSuccessEditFactory, data: dataEditFactory, error: errorEditFactory, refetch: refetchEditFactory
    } = useQuery({
        queryKey: ['editFactory', editValue],
        queryFn: () => editFactory(editValue),
        enabled: isEnable
    })
    //Edit Api Call is Successfull
    useEffect(() => {
        if (isSuccessEditFactory) {
            successfullEdit(true)
            handleaddCancel();
            setLoadingButton(false)
            message.success('Factory updated successfully!');
            setTimeout(() => {
            }, 2000);
        }
    }, [isSuccessEditFactory])

      //Edit Api Call is Failed
      useEffect(() => {
        if (isErrorEditFactory) {
            handleaddCancel();
            setLoadingButton(false)
            message.error('An unexpected error occurred.');
            setTimeout(() => {
            }, 2000);
            console.error(errorEditFactory)
        }
    }, [isErrorEditFactory])
    const handleaddCancel = () => {
        setIsAddModalVisible(false);
        form.resetFields();
        closeModal();
    };

    const onFormLayoutChange = ({ size }: { size: SizeType }) => {
        setComponentSize(size);
    };
    const onFinish = async (values: FactoryRequestDto) => {
        setLoadingButton(true)
        const updatedInformation = {
          ...values,
          id: editData?.id,
          status:true
        }; 
        setEditValue(updatedInformation)
        setEnable(true)
      };
    return (
        <div>
            <Modal
                title="Edit Factory"
                open={isAddModalVisible}
                onCancel={handleaddCancel}
                width={700}
            >
                <Form
                    labelCol={{ span: 7 }}
                    wrapperCol={{ span: 14 }}
                    layout="horizontal"
                    onValuesChange={onFormLayoutChange}
                    size={componentSize as SizeType}
                    initialValues={{
                        size: componentSize,
                        code: editData?.code,
                        name: editData?.name,
                        addressLine1: editData?. addressLine1,
                        addressLine2: editData?. addressLine2,
                        state: editData?.state,
                        postcode: editData?.postcode,
                        country: editData?.country,
                        status:editData?.status,  
                        picIds: editData?.pics.map(factory => factory.id)
                                      }}
                        onFinish={onFinish}
                >
                  
                    <Form.Item
                        label="Factory Code & Name"
                        name="code"
                        rules={[{ required: true, message: 'Please select the Clinic Code!' }]}
                    >
                       
                        <Select>
                            {factoryCode.map((item) => (
                                <Select.Option loading={loadingFactoryCode} key={item.code} value={item.code}>
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
                        rules={[{ required: true, message: 'Please select Clinic ID!' }]}
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

export default EditModalFactory;
