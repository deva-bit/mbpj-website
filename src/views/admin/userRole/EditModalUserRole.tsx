import { useEffect, useState, } from "react";
import { Button, Modal, Form, Input, message, DatePicker, Select } from 'antd';
import { announcementRequestDto, announcementResponseDto } from "@/api/announcement/announcement.types";
import { editAnnouncement } from "@/api/announcement/announcement.api";
import TextArea from "antd/es/input/TextArea";
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import { useQuery } from "@tanstack/react-query";

type EditModalProps = {
    // editData: announcementResponseDto | null;
    closeModal: () => void;
    // successfullEdit: (arg: boolean) => void
};
type SizeType = Parameters<typeof Form>[0]['size'];

const EditModalRoles = ({ closeModal, }: EditModalProps) => {
   
    const [componentSize, setComponentSize] = useState<SizeType | 'default'>('default');
    const [isAddModalVisible, setIsAddModalVisible] = useState(true);
    const [form] = Form.useForm();
    // const initialPublishDate = editData ? dayjs(editData.publishDate) : null;
    const [isLoadingButton, setLoadingButton] = useState<boolean>(false)
    const [isEnable, setEnable] = useState<boolean>(false)
    const [editValue, setEditValue] = useState<announcementRequestDto>({
        description: "",
        publishDate: "",
    })

    const {
        isLoading: isLoadingEditAnnouncement, isFetching: isFetchingEditAnnouncement, isError: isErrorEditAnnouncement, isSuccess: isSuccessEditAnnouncement, data: dataEditAnnouncement, error: editAnnouncementError, refetch: editAnnouncementRefetch
    } = useQuery({
        queryKey: ['editAnnouncement', editValue],
        queryFn: () => editAnnouncement(editValue),
        enabled: isEnable
    })

    //Edit Api Call is Successfull
    useEffect(() => {
        if (isSuccessEditAnnouncement) {
            // successfullEdit(true)
            handleaddCancel();
            setLoadingButton(false)
            message.success('Announcement updated successfully!');
            setTimeout(() => {
            }, 2000);
        }
    }, [isSuccessEditAnnouncement])

    //Edit Api Call is Failed
    useEffect(() => {
        if (isErrorEditAnnouncement) {
            handleaddCancel();
            setLoadingButton(false)
            message.error('An unexpected error occurred.');    
            console.error(editAnnouncementError)
            setTimeout(() => {
            }, 2000);
     
        }
    }, [isErrorEditAnnouncement])

    const handleaddCancel = () => {
        setIsAddModalVisible(false);
        form.resetFields();
        closeModal();
    };

    const onFormLayoutChange = ({ size }: { size: SizeType }) => {
        setComponentSize(size);
    };

    const onFinish = (values: announcementResponseDto) => {
        setLoadingButton(true)
        const updatedInformation = {
            ...values,
            // id: editData?.id,
            published: true
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
                        // description: editData?.description,
                        // publishDate: initialPublishDate,
                    }}
                    onFinish={onFinish}
                    
                >
                   <Form.Item label="Name" >

<Input name="name"  placeholder="" readOnly />
</Form.Item>
<Form.Item label="Email" >
<Input name="email"  placeholder="" readOnly />
</Form.Item>
<Form.Item
                        label="Role Name"
                        name="roleName"
                        rules={[{ required: true, message: 'Please select the Role Name!' }]}
                    >
                        <Select showSearch placeholder="Pages"
                            filterOption={(input, option) =>
                                option && option.children
                                    ? option.children.toString().toLowerCase().indexOf(input.toString().toLowerCase()) >= 0
                                    : false
                            }>
                            <Select.Option>Clinic Information</Select.Option>

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
