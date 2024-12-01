import { useEffect, useState, } from "react";
import { Button, Modal, Form, Input, message } from 'antd';
import { addclinicInformation } from "@/api/clinicInformation/clinicInformation.api";
import { clinicInformationRequestDto, clinicInformationResponseDto } from "@/api/clinicInformation/clinicInformation.types";
import { useQuery } from "@tanstack/react-query";

type AddModalProps = {
    closeModal: () => void;
    successfullAdd: (arg: boolean) => void
};
type SizeType = Parameters<typeof Form>[0]['size'];

const AddModalClinicInformation = ({ closeModal, successfullAdd }: AddModalProps) => {

    const [isAddModalVisible, setIsAddModalVisible] = useState(true);
    const [form] = Form.useForm();
    const [componentSize, setComponentSize] = useState<SizeType | 'default'>('default');
    const [isEnable, setEnable] = useState<boolean>(false)
    const [isLoadingButton, setLoadingButton] = useState<boolean>(false)
    const [addValue, setaddValue] = useState<clinicInformationRequestDto>({
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
        isLoading: isLoadingClinicInformation, isFetching: isFetchingEditClinicInformation, isError: isErrorEditClinicInformation, isSuccess: isSuccessEditClinicInformation, data: dataEditClinicInformation, error: editClinicInformationError, refetch: editClinicInformationRefetch
    } = useQuery({
        queryKey: ['editClinicInformation', addValue],
        queryFn: () => addclinicInformation(addValue),
        enabled: isEnable
    })

    //Add Api Call is Successfull
    useEffect(() => {
        if (isSuccessEditClinicInformation) {
            successfullAdd(true)
            handleaddCancel();
            setLoadingButton(false)
            message.success('Clinic Information added successfully!');
            setTimeout(() => {
            }, 2000);
        }
    }, [isSuccessEditClinicInformation])

    //Add Api Call is Failed
    useEffect(() => {
        if (isErrorEditClinicInformation) {
            handleaddCancel();
            setLoadingButton(false)
            message.error('An unexpected error occurred or same clinic information added.');
            setTimeout(() => {
            }, 2000);
            console.error(editClinicInformationError)
        }
    }, [isErrorEditClinicInformation])

    const onFinish = async (values: clinicInformationResponseDto) => {
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
                title="Add Clinic Information"
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

export default AddModalClinicInformation;
