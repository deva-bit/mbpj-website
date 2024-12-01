import { useState, } from "react";
import { Space, Table, Button, Modal, Form, Input, Card, message } from 'antd';
import './TreatmentList.css';
import { addTreatmentList } from "@/api/treatmentList/treatmentList.api";
import { TreatmentListResponseDto,TreatmentListRequestDto } from "@/api/treatmentList/treatmentList.types";
type AddModalProps = {
    closeModal: () => void;
};

const AddModalTreatmentList = ({ closeModal }: AddModalProps) => {

    const [isAddModalVisible, setIsAddModalVisible] = useState(true);
    const [form] = Form.useForm();
   
    const onFinish = async (values: TreatmentListResponseDto) => {

        const response = await addTreatmentList(values);

        if (response) {
            closeModal();
            message.success('Sickness list added successfully!');
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } else {
            closeModal();
            message.error('An unexpected error occurred.');
            setTimeout(() => {
                
            }, 2000);
        }
    }

    const handleaddCancel = () => {
        setIsAddModalVisible(false);
        form.resetFields();
        closeModal();
    };

    

    type SizeType = Parameters<typeof Form>[0]['size'];
    const [componentSize, setComponentSize] = useState<SizeType | 'default'>('default');

    const onFormLayoutChange = ({ size }: { size: SizeType }) => {
        setComponentSize(size);
    };
    return (
        <div>
            <Modal
                title="Add Treatment List"
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
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: 'Please input the Description!' }]}
                    >
                        <Input placeholder="Description" />
                    </Form.Item>
                
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button id="btn-submit" type="primary" htmlType="submit" >
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

export default AddModalTreatmentList;
