import React, { useState } from "react";
import { Form, Input, DatePicker, Checkbox, Upload, Button, Card, Space, Typography, Row, Col } from "antd";
import { UploadOutlined, CheckOutlined, DeleteOutlined, ArrowLeftOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Title } = Typography;

const PemberitahuanAddPage = ({ onBack }: { onBack: () => void }) => {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    console.log("Form Values:", values);
    // Add logic to handle form submission (e.g., API calls)
  };

  const uploadProps = {
    beforeUpload: (file: any) => {
      console.log(file);
      return false; // Prevent automatic upload
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
            rules={[{ required: true, message: "Please enter the title" }]}>
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
          <Form.Item
            label="Image"
            name="image"
            valuePropName="file">
            <Upload {...uploadProps} listType="picture-card">
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Upload Image from your computer</div>
              </div>
            </Upload>
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
