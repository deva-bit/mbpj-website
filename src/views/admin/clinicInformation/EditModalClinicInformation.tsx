import { useEffect, useState, } from "react";
import { Button, Modal, Form, Input, message } from 'antd';
import './ClinicInformation.css';
import { clinicInformationResponseDto, clinicInformationRequestDto } from "@/api/clinicInformation/clinicInformation.types";
import { editclinicInformation } from "@/api/clinicInformation/clinicInformation.api";
import { useQuery } from "@tanstack/react-query";

type EditModalProps = {
    editData: clinicInformationResponseDto | null;
    closeModal: () => void;
    successfullEdit: (arg: boolean) => void
};
type SizeType = Parameters<typeof Form>[0]['size'];

const EditModalSicknessList = ({ editData, closeModal,successfullEdit }: EditModalProps) => {

    const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(true);
    const [form] = Form.useForm();
    const [componentSize, setComponentSize] = useState<SizeType | 'default'>('default');
    const [isEnable, setEnable] = useState<boolean>(false)
    const [isLoadingButton, setLoadingButton] = useState<boolean>(false)
    const [editValue, setEditValue] = useState<clinicInformationRequestDto>({
        clinicCode: "",
        name: "",
        address1: "",
        address2: "",
        state: "",
        postcode: "",
        country: "",
        email: "",
    })

    const {
        isLoading: isLoadingClinicInformation, isFetching: isFetchingClinicInformation, isError: isErrorClinicInformation, isSuccess: isSuccessClinicInformation, data: dataClinicInformation, error: editClinicInformation, refetch: editClinicInformationRefetch
    } = useQuery({
        queryKey: ['editClinicInformation', editValue],
        queryFn: () => editclinicInformation(editValue),
        enabled: isEnable
    })

     //Edit Api Call is Successfull
     useEffect(() => {
        if (isSuccessClinicInformation) {
            successfullEdit(true)
            handleaddCancel();
            setLoadingButton(false)
            message.success('Clinic Information updated successfully!');
            
            setTimeout(() => {
            }, 2000);
        }
    }, [isSuccessClinicInformation])

     //Edit Api Call is Failed
     useEffect(() => {
        if (isErrorClinicInformation) {
            handleaddCancel();
            setLoadingButton(false)
            message.error('An unexpected error occurred.');
            setTimeout(() => {
            }, 2000);
            console.error(isErrorClinicInformation)
        }
    }, [isErrorClinicInformation])

    const handleaddCancel = () => {
        setIsAddModalVisible(false);
        form.resetFields();
        closeModal();
    };

    const onFormLayoutChange = ({ size }: { size: SizeType }) => {
        setComponentSize(size);
    };
    const onFinish = async (values: clinicInformationResponseDto) => {
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
                title="Edit Clinic Information"
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
                        clinicCode: editData?.clinicCode,
                        name: editData?.name,
                        address1: editData?.address1,
                        address2: editData?.address2,
                        state: editData?.state,
                        postcode: editData?.postcode,
                        country: editData?.country,
                        email: editData?.email,
                        status: editData?.status,
                    }}
                    onFinish={onFinish}
                >

                    <Form.Item
                        label="Clinic Code"
                        name="clinicCode"
                        rules={[{ required: true, message: 'Please input the Clinic Code!' }]}
                    >
                        <Input placeholder="Clinic Code" />
                    </Form.Item>
                    <Form.Item
                        label="Clinic Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input the Clinic Name!' }]}
                    >
                        <Input placeholder="Clinic Name" />
                    </Form.Item>
                    <Form.Item label="Address Line 1" name="address1" rules={[{ required: true, message: 'Please enter Address Line 1' }]}>
                        <Input placeholder="Address Line 1" />
                    </Form.Item>
                    <Form.Item label="Address Line 2" name="address2">
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
                    <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please enter Email' }, { type: 'email', message: 'Please enter a valid Email' }]}>
                        <Input placeholder="Email" />
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

export default EditModalSicknessList;
