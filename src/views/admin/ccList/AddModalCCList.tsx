import { useEffect, useState, } from "react";
import { Space, Table, Button, Modal, Form, Input, Card, Select, AutoComplete, message } from 'antd';
import './CClist.css';
import { fetchEmployee } from "@/api/employee/employee.api";
import { addCcList } from "@/api/ccList/ccList.api";
import { ccListRequestDto } from "@/api/ccList/ccList.types";
import EmployeeAsyncSelectComponent from "@/components/employeeAsynSelect/EmployeeAsyncSelectComponent";
import { useQuery } from "@tanstack/react-query";

type AddModalProps = {
  closeModal: () => void;
  successfullAdd: (arg: boolean) => void
};

const AddCCList = ({ closeModal,successfullAdd }: AddModalProps) => {
  const [isAddModalVisible, setIsAddModalVisible] = useState(true);
  const [form] = Form.useForm();
  const [selectedEmail, setSelectedEmail] = useState<string>("");
  const [selectedName, setSelectedName] = useState<string>("");
  const [isLoadingButton, setLoadingButton] = useState<boolean>(false)
  const [isEnable, setEnable] = useState<boolean>(false)
  const [addValue, setaddValue] = useState<ccListRequestDto>({
    name: "",
    email: "",
  })
  const {
    isLoading: isLoadingAddCcList, isFetching: isFetchingAddCcList, isError: isErrorAddCcList, isSuccess: isSuccessAddCcList, data: dataAddCcList, error: errorAddCcList, refetch: refetchAddCcList
  } = useQuery({
    queryKey: ['addCcList', addValue],
    queryFn: () => addCcList(addValue),
    enabled: isEnable
  })

  //Add Api Call is Successfull
  useEffect(() => {
    if (isSuccessAddCcList) {
      successfullAdd(true)
      handleaddCancel();
      setLoadingButton(false)
      message.success('CC List added successfully!');
      setTimeout(() => {
      }, 2000);
    }
  }, [isSuccessAddCcList])

  const handleOptionSelect = async (selectedOption: any) => {
    try {
      const inputValueObj = {
        searchValue: selectedOption.value,
        filterType: 'username',
      };
      const response = await fetchEmployee(inputValueObj);
      setSelectedEmail(response.email);
      setSelectedName(response.fullname);
    } catch (error) {
      console.error('Error fetching employee data:', error);
      setSelectedEmail("");
      setSelectedName("");
    }
  };

  const handleaddCancel = () => {
    setIsAddModalVisible(false);
    form.resetFields();
    closeModal();
  };

  const onFinish = () => {
    setLoadingButton(true)
    const updatedInformation = {
      name: selectedName,
      email: selectedEmail,
      status: true,
    };
    setaddValue(updatedInformation)
    setEnable(true)
  }
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
        title="Add CC List"
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
          <EmployeeAsyncSelectComponent handleOptionSelect={handleOptionSelect} />
          <Form.Item label="Name" >
            <Input name="name" value={selectedName} placeholder="Automatically shown according to the username" readOnly />
          </Form.Item>
          <Form.Item label="Email" >
            <Input name="email" value={selectedEmail} placeholder="Automatically shown according to the username" readOnly />
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

export default AddCCList;
