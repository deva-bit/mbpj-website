import { useEffect, useState, } from "react";
import { Space, Table, Button, Modal, Form, Input, Card, Select, message, DatePicker } from 'antd';
import './Announcement.css';
import { announcementRequestDto, announcementResponseDto } from "@/api/announcement/announcement.types";
import TextArea from "antd/es/input/TextArea";
import { addAnnouncement } from "@/api/announcement/announcement.api";
import { useQuery } from "@tanstack/react-query";

type AddModalProps = {
    closeModal: () => void;
    successfullAdd: (arg: boolean) => void
};
type SizeType = Parameters<typeof Form>[0]['size'];

const AddModalAnnouncement = ({ closeModal,successfullAdd }: AddModalProps) => {

    const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(true);
    const [isEnable, setEnable] = useState<boolean>(false)
    const [form] = Form.useForm();
    const [componentSize, setComponentSize] = useState<SizeType | 'default'>('default');
    const [isLoadingButton, setLoadingButton] = useState<boolean>(false)
    const [addValue, setaddValue] = useState<announcementRequestDto>({
        description: "",
        publishDate: "",
    })

    const {
        isLoading: isLoadingAddAnnouncement, isFetching: isFetchingAddAnnouncement, isError: isErrorAddAnnouncement, isSuccess: isSuccessAddAnnouncement, data: dataAddAnnouncement, error: addAnnouncementError, refetch: addAnnouncementRefetch
    } = useQuery({
        queryKey: ['addAnnouncement', addValue],
        queryFn: () => addAnnouncement(addValue),
        enabled: isEnable
    })
    //Add Api Call is Successfull
    useEffect(() => {
        if (isSuccessAddAnnouncement) {
            successfullAdd(true)
            handleaddCancel();
            message.success('Announcement added successfully!');
            setTimeout(() => {
            }, 2000);
        }
    }, [isSuccessAddAnnouncement])

    const onFinish = async (values: announcementResponseDto) => {
        const updatedInformation = {
            ...values,
            published: true
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
                title="Add Announcement"
                open={isAddModalVisible}
                onCancel={handleaddCancel}
                width={700}
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
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: 'Please input the Description!' }]}
                    >
                        <TextArea placeholder="Description" />
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

export default AddModalAnnouncement;
