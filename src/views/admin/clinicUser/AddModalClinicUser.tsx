import React, { useEffect, useState } from "react";
import { Space, Table, Button, Modal, Form, Input, Card, Select, message } from "antd";
import "./ClinicUser.css";
import { fetchclinicInformation } from "@/api/clinicInformation/clinicInformation.api";
import { clinicInformationRequestDto, clinicInformationResponseDto, clinicInformationDeleteRequestDto, } from "@/api/clinicInformation/clinicInformation.types";
import { clinicUserAddRequestDto } from "@/api/clinicUser/clinicUser.types";

import { useQuery } from "@tanstack/react-query";
import { addClinicUser } from "@/api/clinicUser/clinicUser.api";

type AddModalProps = {
  closeModal: () => void;
  successfullAdd: (arg: boolean) => void
};

const AddModalClinicUser = ({ closeModal,successfullAdd }: AddModalProps) => {
  const [isAddModalVisible, setIsAddModalVisible] = useState(true);
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState<clinicInformationResponseDto[]>([]);
  const [isEnable, setEnable] = useState<boolean>(false)
  const [isLoadingButton, setLoadingButton] = useState<boolean>(false)
  const [addValue, setaddValue] = useState<clinicUserAddRequestDto>({
    name: "",
    email: "",
    password: "",
    clinicId: 0
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
    queryKey: ['addClinicUser', addValue],
    queryFn: () => addClinicUser(addValue),
    enabled: isEnable
  })
 // Clinic Information api successfully called
 useEffect(() => {
  if (isSuccessClinicInformation) {
      const filteredData = dataClinicInformation?.filter((item) => item.status === true);
      setDataSource(filteredData);
  }
}, [isSuccessClinicInformation]);

  //Add Api Call is Successfull
  useEffect(() => {
    if (isSuccessEditClinicUser) {
      successfullAdd(true)
      handleaddCancel();
      setLoadingButton(false)
      message.success('Clinic User added successfully!');
      setTimeout(() => {
      }, 2000);
    }
  }, [isSuccessEditClinicUser])

    //Add Api Call is Failed
    useEffect(() => {
      if (isErrorEditClinicUser) {
          handleaddCancel();
          setLoadingButton(false)
          message.error('An unexpected error occurred.');
          setTimeout(() => {
          }, 2000);
          console.error(errorEditClinicUser)
      }
  }, [errorEditClinicUser])

  const onFinish = (values: clinicUserAddRequestDto) => {

    setLoadingButton(true)
    setaddValue(values)
    setEnable(true)
  }

  const handleaddCancel = () => {
    setIsAddModalVisible(false);
    form.resetFields();
    closeModal();
  };

  type SizeType = Parameters<typeof Form>[0]["size"];
  const [componentSize, setComponentSize] = useState<SizeType | "default">(
    "default"
  );

  const onFormLayoutChange = ({ size }: { size: SizeType }) => {
    setComponentSize(size);
  };

  return (
    <div>
      <Modal
        title="Add Clinic User"
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
          <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter Name' }]}>
            <Input placeholder="Name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input the Email!" }]}>
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input the Password!" },
            { min: 9, message: "Password must be at least 9 characters long!" }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
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
            <Input.Password placeholder="Re-enter Password" />
          </Form.Item>
          <Form.Item
            label="Clinic "
            name="clinicId"
            rules={[{ required: true, message: "Please select Clinic ID!" }]}
          >
            <Select placeholder="Clinic">
              {dataSource.map((item) => (
                <Select.Option loading={isLoadingClinicInformation} key={item.id} value={item.id} >
                  {/* Display the clinic name */}
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button loading={isLoadingButton} id="btn-submit" type="primary" htmlType="submit">
              Submit
            </Button>
            <Button onClick={handleaddCancel}>Cancel</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AddModalClinicUser;
