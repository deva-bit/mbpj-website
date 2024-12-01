import { useEffect, useState, } from "react";
import { Button, Modal, Form, Input, message } from 'antd';
import './ClinicUser.css';
import { clinicUserRequestDto, clinicUserResponseDto, clinicUserDeleteRequestDto, clinicUserPasswordDto } from "@/api/clinicUser/clinicUser.types";
import { editClinicUserPassword } from "@/api/clinicUser/clinicUser.api";
import { useQuery } from "@tanstack/react-query";
type EditModalProps = {
    editData: clinicUserResponseDto | null;
    closeModal: () => void;
    successfullEditPassword: (arg: boolean) => void
};
type SizeType = Parameters<typeof Form>[0]['size'];

const ForgetPasswordModel = ({ closeModal, editData,successfullEditPassword }: EditModalProps) => {

    const [isAddModalVisible, setIsAddModalVisible] = useState(true);
    const [form] = Form.useForm();
    const [componentSize, setComponentSize] = useState<SizeType | 'default'>('default');
    const [isEnable, setEnable] = useState<boolean>(false)
    const [isLoadingButton, setLoadingButton] = useState<boolean>(false)
    const [editValue, setEditValue] = useState<clinicUserPasswordDto>({
        id: 0,
        password: ""
    })

    const {
        isLoading: isLoadingForgotPassword, isFetching: isFetchingForgotPassword, isError: isErrorForgotPassword, isSuccess: isSuccessForgotPassword, data: dataForgotPassword, error: ForgotPasswordError, refetch: ForgotPasswordRefetch
    } = useQuery({
        queryKey: ['forgetPassword', editValue],
        queryFn: () => editClinicUserPassword(editValue),
        enabled: isEnable
    })

    // Forgot Password api successfully called
    useEffect(() => {
        if (isSuccessForgotPassword) {
            successfullEditPassword(true)
            handleaddCancel();
            setLoadingButton(false)
            message.success('Clinic User updated successfully!');
            setTimeout(() => {
            }, 2000);
        }
    }, [isSuccessForgotPassword]);

    //Forgot Password Api Call is Failed
    useEffect(() => {
        if (isErrorForgotPassword) {
            handleaddCancel();
            setLoadingButton(false)
            message.error('An unexpected error occurred.');
            setTimeout(() => {
            }, 2000);
            console.error(ForgotPasswordError)
        }
    }, [isErrorForgotPassword])

    const handleaddCancel = () => {
        setIsAddModalVisible(false);
        form.resetFields();
        closeModal();
    };

    const onFormLayoutChange = ({ size }: { size: SizeType }) => {
        setComponentSize(size);
    };

    const onFinish = (values: clinicUserPasswordDto) => {
        setLoadingButton(true)
        const updatedInformation = {
            id: editData?.id,
            password: values.password,
        };
        setEditValue(updatedInformation)
        setEnable(true)
    };

    return (
        <div>
            <Modal
                title="Forgot Password ?"
                open={isAddModalVisible}
                onCancel={handleaddCancel}
                width={700}
            >
                <Form
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                    layout="horizontal"
                    initialValues={{ size: componentSize }}
                    onValuesChange={onFormLayoutChange}
                    size={componentSize as SizeType}
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="New Password"
                        labelCol={{ span: 6 }}
                        name="password"
                        rules={[{ required: true, message: 'Please input the Password!' },
                        { min: 9, message: "Password must be at least 9 characters long!" }]}
                    >
                        <Input.Password placeholder="New Password" />
                    </Form.Item>

                    {/* New Re-enter Password field */}
                    <Form.Item
                        label="Re-enter New Password"
                        labelCol={{ span: 6 }}
                        name="confirmPassword"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Please re-enter the new Password!' },
                            { min: 9, message: "Password must be at least 9 characters long!" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject('The two passwords do not match!');
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="Re-enter New Password" />
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

export default ForgetPasswordModel;
