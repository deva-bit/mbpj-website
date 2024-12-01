import { useEffect, useState, } from "react";
import { Space, Table, Button, Modal, Form, Input, Card, message, Checkbox } from 'antd';
import './SicknessList.css';
import { addSicknessList } from "@/api/sicknessList/sicknessList.api";
import { SicknessListResponseDto, SicknessListRequestDto } from "@/api/sicknessList/sicknessList.types";
import { useQuery } from "@tanstack/react-query";

type AddModalProps = {
    closeModal: () => void;
    successfullAdd: (arg: boolean) => void
};
type SizeType = Parameters<typeof Form>[0]['size'];

const AddModalSicknessList = ({ closeModal,successfullAdd }: AddModalProps) => {

    const [isAddModalVisible, setIsAddModalVisible] = useState(true);
    const [form] = Form.useForm();
    const [componentSize, setComponentSize] = useState<SizeType | 'default'>('default');
    const [isEnable, setEnable] = useState<boolean>(false)
    const [addValue, setaddValue] = useState<SicknessListRequestDto>({
        code: "",
        description: "",
        chronicDisease: "",
        occupationalInjury: "",
        infectiousDisease: "",
    })

    const {
        isLoading: isLoadingAddSicknessList, isFetching: isFetchingAddSicknessList, isError: isErrorAddSicknessList, isSuccess: isSuccessAddSicknessList, data: dataAddSicknessListC, error: errorAddSicknessList, refetch: refetchAddSicknessList
    } = useQuery({
        queryKey: ['addSicknessList', addValue],
        queryFn: () => addSicknessList(addValue),
        enabled: isEnable
    })

    //Add Api Call is Successfull
    useEffect(() => {
        if (isSuccessAddSicknessList) {
            successfullAdd(true)
            handleaddCancel();
           
            message.success('Sickness added successfully!');
            setTimeout(() => {
            }, 2000);
        }
    }, [isSuccessAddSicknessList])

    const onFinish = (values: { code: string, description: string, disease: any; }) => {
        const updatedInformation = {
            code: values.code,
            description: values.description,
            chronicDisease: values.disease.includes("A") ? 1 : 0,
            occupationalInjury: values.disease.includes("B") ? 1 : 0,
            infectiousDisease: values.disease.includes("C") ? 1 : 0,

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
                title="Add Sickness List"
                open={isAddModalVisible}
                onCancel={handleaddCancel}
                width={700}
                footer={null}
            >
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                    layout="horizontal"
                    initialValues={{ size: componentSize }}
                    onValuesChange={onFormLayoutChange}
                    size={componentSize as SizeType}
                    onFinish={onFinish}
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
                    <Form.Item label="Sickness Type" name="disease">
                        <Checkbox.Group style={{ display: 'flex' }} >
                            <Checkbox value="A">Chronic Disease</Checkbox>
                            <Checkbox value="B">Occupational Injury</Checkbox>
                            <Checkbox value="C">Infectious Disease</Checkbox>
                        </Checkbox.Group>
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button loading={isFetchingAddSicknessList} id="btn-submit" type="primary" htmlType="submit" >
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

export default AddModalSicknessList;
