import { useEffect, useState, } from "react";
import { Button, Modal, Form, Input, Select, message } from 'antd';
import './ClinicUser.css';
import { useQuery } from "@tanstack/react-query";
import { fetchclinicInformation } from "@/api/clinicInformation/clinicInformation.api";
import { clinicUserRequestDto, clinicUserResponseDto } from "@/api/clinicUser/clinicUser.types";
import { clinicInformationResponseDto } from "@/api/clinicInformation/clinicInformation.types";
import { editClinicUser } from "@/api/clinicUser/clinicUser.api";

type EditModalProps = {
    closeModal: () => void;
    editData: clinicUserResponseDto | null;
    successfullEdit: (arg: boolean) => void
};
type SizeType = Parameters<typeof Form>[0]['size'];

const EditModalClinicUser = ({ closeModal, editData,successfullEdit }: EditModalProps) => {

    const [isAddModalVisible, setIsAddModalVisible] = useState(true);
    const [form] = Form.useForm();
    const [dataSource, setDataSource] = useState<clinicInformationResponseDto[]>([]);
    const [componentSize, setComponentSize] = useState<SizeType | 'default'>('default');
    const [isEnable, setEnable] = useState<boolean>(false)
    const [isLoadingButton, setLoadingButton] = useState<boolean>(false)
    const [editValue, setEditValue] = useState< clinicUserRequestDto>({
        name: "",
        clinicId:0,
    })

    const {
        isLoading: isLoadingClinicInformation, isFetching: isFetchingClinicInformation, isError: isErrorClinicInformation, isSuccess: isSuccessClinicInformation, data: dataClinicInformation, error: errorClinicInformation, refetch: refetchClinicInformation
    } = useQuery({
        queryKey: ['clinics'],
        queryFn: () => fetchclinicInformation(),
    })

    const {
        isLoading: isLoadingEditClinicUser, isFetching: isFetchingEditClinicUser, isError: isErrorEditClinicUser, isSuccess: isSuccessEditClinicUser, data: dataEditClinicUser, error: errorEditClinicUser, refetch: editEditClinicUserRefetch
    } = useQuery({
        queryKey: ['editClinicUser', editValue],
        queryFn: () => editClinicUser(editValue),
        enabled: isEnable
    })

    // Clinic Information api successfully called
    useEffect(() => {
        if (isSuccessClinicInformation) {
            const filteredData = dataClinicInformation?.filter((item) => item.status === true);
            setDataSource(filteredData);
        }
    }, [isSuccessClinicInformation]);

     //Edit Api Call is Successfull
     useEffect(() => {
        if (isSuccessEditClinicUser) {
            successfullEdit(true)
            handleaddCancel();
            setLoadingButton(false)
            message.success('Clinic User updated successfully!');
            setTimeout(() => {
            }, 2000);
        }
    }, [isSuccessEditClinicUser])

      //Edit Api Call is Failed
      useEffect(() => {
        if (isErrorEditClinicUser) {
            handleaddCancel();
            setLoadingButton(false)
            message.error('An unexpected error occurred.');
            setTimeout(() => {
            }, 2000);
            console.error(errorEditClinicUser)
        }
    }, [isErrorEditClinicUser])

    const handleaddCancel = () => {
        setIsAddModalVisible(false);
        form.resetFields();
        closeModal();
    };

    const onFormLayoutChange = ({ size }: { size: SizeType }) => {
        setComponentSize(size);
    };

    const onFinish = (values: clinicUserRequestDto) => {
        setLoadingButton(true)
        const updatedInformation = {
            id: editData?.id,
            name: values.name,
            clinicId: values.clinicId,
            status: true
        };
        setEditValue(updatedInformation)
        setEnable(true)
    };

    return (
        <div>
            <Modal
                title="Edit Clinic User"
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
                        clinicId: editData?.clinic.id,

                    }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input the Name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                    >
                        <Input readOnly />
                    </Form.Item>

                    <Form.Item
                        label="Clinic "
                        name="clinicId"
                        rules={[{ required: true, message: 'Please select Clinic ID!' }]}

                    >
                        <Select>
                            {dataSource.map((item) => (
                                <Select.Option loading={isLoadingClinicInformation} key={item.id} value={item.id}>
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

export default EditModalClinicUser;
