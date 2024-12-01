import { useEffect, useState, } from "react";
import { Space, Table, Button, Modal, Form, Input, Card, message, Select } from 'antd';
import './FactoryPic.css';
import { addFactoryPic } from "@/api/factoryPic/factoryPic.api";
import { factoryPicResponseDto, factoryPicRequestDto } from "@/api/factoryPic/factoryPic.types";
import { useQuery } from "@tanstack/react-query";
import { fetchFactory } from "@/api/factory/factory.api";
import EmployeeAsyncSelectComponent from "@/components/employeeAsynSelect/EmployeeAsyncSelectComponent";
import { fetchEmployee } from "@/api/employee/employee.api";
import { FactoryResponseDto } from "@/api/factory/factory.types";

type AddModalProps = {
    closeModal: () => void;
    factory: FactoryResponseDto[] | undefined;
    loadingFactoryCode: boolean;
    successfullAdd: (arg: boolean) => void
};
type SizeType = Parameters<typeof Form>[0]['size'];

const AddModalFactoryPic = ({ closeModal, factory, loadingFactoryCode,successfullAdd }: AddModalProps) => {

    const [isAddModalVisible, setIsAddModalVisible] = useState(true);
    const [form] = Form.useForm();
    const [selectedEmail, setSelectedEmail] = useState<string>("");
    const [selectedName, setSelectedName] = useState<string>("");
    const [componentSize, setComponentSize] = useState<SizeType | 'default'>('default');
    const [isEnable, setEnable] = useState<boolean>(false)
    const [isLoadingButton, setLoadingButton] = useState<boolean>(false)
    const [addValue, setaddValue] = useState<factoryPicRequestDto>({
        name: "",
        email: "",
        factoryIds: [],
    })

    const {
        isLoading: isLoadingAddFactoryPIC, isFetching: isFetchingAddFactoryPIC, isError: isErrorAddFactoryPIC, isSuccess: isSuccessAddFactoryPIC, data: dataAddFactoryPIC, error: errorAddFactoryPIC, refetch: refetchAddFactoryPIC
    } = useQuery({
        queryKey: ['addFactoryPIC', addValue],
        queryFn: () => addFactoryPic(addValue),
        enabled: isEnable
    })

    //Add Api Call is Successfull
    useEffect(() => {
        if (isSuccessAddFactoryPIC) {
            successfullAdd(true)
            handleaddCancel();
            setLoadingButton(false)
            message.success('Admin added successfully!');
            setTimeout(() => {
            }, 2000);
        }
    }, [isSuccessAddFactoryPIC])

       //Add Api Call is unSuccessfull
       useEffect(() => {
        if (isErrorAddFactoryPIC) {
            handleaddCancel();
            setLoadingButton(false)
            message.error("An error occured");
            console.error(errorAddFactoryPIC)
            setTimeout(() => {
            }, 2000);
        }
    }, [isErrorAddFactoryPIC])

    const onFinish = (values: factoryPicRequestDto) => {
        setLoadingButton(true)
        const updatedInformation = {
            name: selectedName,
            email: selectedEmail,
            factoryIds: values.factoryIds,
            status: true,
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

    return (
        <div>
            <Modal
                title="Add Factory PIC"
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

                    <EmployeeAsyncSelectComponent handleOptionSelect={handleOptionSelect} />

                    <Form.Item label="Name" >

                        <Input name="name" value={selectedName} placeholder="Automatically shown according to the username" readOnly />
                    </Form.Item>
                    <Form.Item label="Email" >
                        <Input name="email" value={selectedEmail} placeholder="Automatically shown according to the username" readOnly />
                    </Form.Item>
                    <Form.Item
                        label="Factory"
                        name="factoryIds"
                        rules={[{ required: true, message: 'Please select Clinic ID!' }]}
                    >
                        <Select loading={loadingFactoryCode} showSearch placeholder="Factory" mode="multiple"
                            filterOption={(input, option) =>
                                option && option.children
                                    ? option.children.toString().toLowerCase().indexOf(input.toString().toLowerCase()) >= 0
                                    : false
                            }>

                            {factory?.map((item) => (
                                <Select.Option key={item.id} value={item.id}>
                                    {item.name}
                                </Select.Option>
                            ))}
                        </Select>


                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button loading={isLoadingButton} id="btn-submit" type="primary" htmlType="submit" >
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

export default AddModalFactoryPic;
