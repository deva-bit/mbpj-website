import React from 'react';
import { Form, Input, DatePicker, Checkbox, Upload, Button, Card, Space, Typography, Row, Col, message } from "antd";
import { UploadOutlined, CheckOutlined, DeleteOutlined, ArrowLeftOutlined, InboxOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Title } = Typography;
const { Dragger } = Upload;

const PemberitahuanAddPage = ({ onBack }: { onBack: () => void }) => {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    console.log("Form Values:", values);
    // Add logic to handle form submission (e.g., API calls)
  };

  const uploadProps = {
    name: 'file',
    multiple: false,
    beforeUpload: (file: any) => {
      const isImage = file.type.startsWith("image/");
      const isLt2M = file.size / 1024 / 1024 < 2; // Limit to 2MB
      if (!isImage) {
        message.error("You can only upload image files!");
      }
      if (!isLt2M) {
        message.error("Image must be smaller than 2MB!");
      }
      return isImage && isLt2M;
    },
    onChange(info: any) {
      const { status } = info.file;
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e: any) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  return (
    <div>
      <Card
        style={{ marginTop: 20 }}
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              type="default"
              icon={<ArrowLeftOutlined />}
              onClick={onBack}
              style={{ marginRight: 10, padding: 0, minWidth: 'auto', border: 'none', background: 'none' }}
            />
            <Title level={5} style={{ margin: 0 }}>
              Kemaskini Pemberitahuan
            </Title>
          </div>
        }
        extra={
          <div className="button-container">
            <Space>
              <Button type="default" icon={<DeleteOutlined />} danger>
                Delete
              </Button>
              <Button type="primary" icon={<CheckOutlined />} form="notificationForm" htmlType="submit">
                Save
              </Button>
            </Space>
          </div>
        }
        className="my-card"
      >
        <Form
          id="notificationForm"
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            notifications: ["pushNotification"], // Default checkbox selection
          }}
        >
          {/* Title */}
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please enter the title" }]} >
            <Input placeholder="Enter title" />
          </Form.Item>

          {/* Date Pickers */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Publish Date"
                name="publishDate"
                rules={[{ required: true, message: "Please select a publish date" }]}>
                <DatePicker style={{ width: "100%" }} placeholder="Select publish date" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Expiry Date"
                name="expiryDate"
                rules={[{ required: true, message: "Please select an expiry date" }]}>
                <DatePicker style={{ width: "100%" }} placeholder="Select expiry date" />
              </Form.Item>
            </Col>
          </Row>

          {/* Notifications */}
          <Form.Item label="Notification" name="notifications">
            <Checkbox.Group>
              <Space direction="vertical">
                <Checkbox value="pushNotification">Notifikasi Tolakan (Push Notification)</Checkbox>
                <Checkbox value="inAppNotification">Notifikasi dalam aplikasi (In-app Notification)</Checkbox>
              </Space>
            </Checkbox.Group>
          </Form.Item>

          {/* Image Upload */}
          <Form.Item label="Image" name="image" valuePropName="fileList">
            <Dragger {...uploadProps} showUploadList={false} style={{ width: '100%', height: '200px' }}>
              <div>
                <InboxOutlined />
                <div style={{ marginTop: 8 }}>Upload Image from your computer</div>
              </div>
            </Dragger>
          </Form.Item>

          {/* Text Field */}
          <Form.Item
            label="Text"
            name="text"
            rules={[{ required: true, message: "Please enter the text" }]}>
            <TextArea rows={6} placeholder="Enter text" />
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default PemberitahuanAddPage;
