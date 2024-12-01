import { useState, } from "react";
import { Button, Modal, Form, Input, message} from 'antd';
import './TreatmentList.css';
import { TreatmentListResponseDto } from "@/api/treatmentList/treatmentList.types";
import { editTreatmentList} from "@/api/treatmentList/treatmentList.api";

type EditModalProps = {
    editData: TreatmentListResponseDto | null;
    closeModal: () => void;
};

const EditModalSicknessList = ({ editData, closeModal }: EditModalProps) => {

    const [isAddModalVisible, setIsAddModalVisible] = useState(true);
    const [form] = Form.useForm();

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
    const onFinish = async (values: TreatmentListResponseDto) => {
      
        const updatedInformation = {
          ...values,
          id: editData?.id,
          status:true
        };
 
        const response = await editTreatmentList(updatedInformation)
        if (response) {
            handleaddCancel();
            message.success('Sickness list updated successfully!');
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } else {
            handleaddCancel();
            message.error('An unexpected error occurred.');
        
        }
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
                        status:editData?.status,  
                                      }}
                        onFinish={onFinish}
                >
          
                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: 'Please input the Description!' }]}

                    >
                        <Input />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button id="btn-submit" type="primary" htmlType="submit">
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
