import { useState, } from "react";
import { Space, Table, Button, Modal, Form, Input, Card } from 'antd';
import './UnclaimableMedical.css';

type AddModalProps = {
    closeModal: () => void;
};

const AddModalUnclaimableMedical = ({ closeModal }: AddModalProps) => {

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
    return (
        <div>
            <Modal
                title="Add Unclaimable Medical"
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
                >
                    <Form.Item
                        label="Code"
                        name="code"
                        rules={[{ required: true, message: 'Please input the Code!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: 'Please input the Description!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Category"
                        name="category"
                        rules={[{ required: true, message: 'Please input the Category!' }]}
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

export default AddModalUnclaimableMedical;
