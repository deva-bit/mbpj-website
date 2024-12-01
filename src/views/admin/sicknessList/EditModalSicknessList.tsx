import { useEffect, useState, } from "react";
import { Button, Modal, Form, Input, message, Checkbox } from 'antd';
import './SicknessList.css';
import { SicknessListRequestDto, SicknessListResponseDto } from "@/api/sicknessList/sicknessList.types";
import { editSicknessList } from "@/api/sicknessList/sicknessList.api";
import { useQuery } from "@tanstack/react-query";


type EditModalProps = {
    editData: SicknessListResponseDto;
    closeModal: () => void;
    successfullEdit: (arg: boolean) => void
};

const EditModalSicknessList = ({ editData, closeModal,successfullEdit }: EditModalProps) => {

    const [isAddModalVisible, setIsAddModalVisible] = useState(true);
    const [form] = Form.useForm();
    const [isEnable, setEnable] = useState<boolean>(false)
    

    const [sicknessListValue, setSicknessListValue] = useState<SicknessListResponseDto>({
        id: 0,
        code: "",
        description: "",
        chronicDisease: "",
        occupationalInjury: "",
        infectiousDisease: "",
        status: true,
    })

    const {
        isLoading: isLoadingSickness, isFetching: isFectchingSickness, isError: isErrorSickness, isSuccess: isSuccessSickness, data: sickness, error: SicknessError, refetch: sicknessRefetch
    } = useQuery({
        queryKey: ['editSickness', sicknessListValue],
        queryFn: () => editSicknessList(sicknessListValue),
        enabled: isEnable
    })

    //Edit Api Call is Successfull
    useEffect(() => {
        if (isSuccessSickness) {
            successfullEdit(true)
            handleaddCancel();
      
            message.success('Sickness updated successfully!');
            setTimeout(() => {
            }, 2000);
        }
    }, [isSuccessSickness])

    //Edit Api Call is Failed
    useEffect(() => {
        if (isErrorSickness) {
            handleaddCancel();
           
            message.error('An unexpected error occurred.');
            setTimeout(() => {
            }, 2000);
            console.error(SicknessError)
        }
    }, [isErrorSickness])

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
    const selectedDiseases = [];
    if (editData?.chronicDisease === "1") {
        selectedDiseases.push("chronicDisease");
    }
    if (editData?.infectiousDisease === "1") {
        selectedDiseases.push("infectiousDisease");
    }
    if (editData?.occupationalInjury === "1") {
        selectedDiseases.push("occupationalInjury");
    }

    const onFinish = async (values: { code: string, description: string, disease: any; }) => {
     
        setSicknessListValue({
            id: editData?.id,
            code: values.code,
            description: values.description,
            chronicDisease: values.disease.includes("chronicDisease") ? 1 : 0,
            occupationalInjury: values.disease.includes("occupationalInjury") ? 1 : 0,
            infectiousDisease: values.disease.includes("infectiousDisease") ? 1 : 0,
            status: true
        })
        setEnable(true)
    }

    return (
        <div>
            <Modal
                title="Edit Sickness List"
                open={isAddModalVisible}
                onCancel={handleaddCancel}
                width={700}
            >
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 18 }}
                    layout="horizontal"
                    onValuesChange={onFormLayoutChange}
                    size={componentSize as SizeType}
                    initialValues={{
                        size: componentSize,
                        code: editData?.code,
                        description: editData?.description,
                        disease: selectedDiseases,
                    }}
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
                    <Form.Item label="Disease Type" name="disease">
                        <Checkbox.Group style={{ display: 'flex' }} >
                            <Checkbox value="chronicDisease">Chronic Disease</Checkbox>
                            <Checkbox value="occupationalInjury">Occupational Injury</Checkbox>
                            <Checkbox value="infectiousDisease">Infectious Disease</Checkbox>
                        </Checkbox.Group>
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button loading={isFectchingSickness} id="btn-submit" type="primary" htmlType="submit">
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
