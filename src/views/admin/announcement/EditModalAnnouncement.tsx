import { useEffect, useState, } from "react";
import { Button, Modal, Form, Input, message, DatePicker } from 'antd';
import './Announcement.css';
import { announcementRequestDto, announcementResponseDto } from "@/api/announcement/announcement.types";
import { editAnnouncement } from "@/api/announcement/announcement.api";
import TextArea from "antd/es/input/TextArea";
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import { useQuery } from "@tanstack/react-query";

type EditModalProps = {
    editData: announcementResponseDto | null;
    closeModal: () => void;
    successfullEdit: (arg: boolean) => void
};
type SizeType = Parameters<typeof Form>[0]['size'];

const EditModalAnnouncement = ({ editData, closeModal,successfullEdit }: EditModalProps) => {
   
    const [componentSize, setComponentSize] = useState<SizeType | 'default'>('default');
    const [isAddModalVisible, setIsAddModalVisible] = useState(true);
    const [form] = Form.useForm();
    const initialPublishDate = editData ? dayjs(editData.publishDate) : null;
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
            successfullEdit(true)
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
            setTimeout(() => {
            }, 2000);
            console.error(editAnnouncementError)
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
            id: editData?.id,
            published: true
        };
        setEditValue(updatedInformation)
        setEnable(true)
    };

    return (
        <div>
            <Modal
                title="Edit Admin"
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
                        description: editData?.description,
                        publishDate: initialPublishDate,
                    }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: 'Please input the Description!' }]}
                    >
                        <TextArea />
                    </Form.Item>
                    <Form.Item
                        name="publishDate"
                        label="Publish Date"
                        rules={[{ required: true, message: 'Please select a date' }]}

                    >
                        <DatePicker showTime />
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

export default EditModalAnnouncement;
