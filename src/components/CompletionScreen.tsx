import React from 'react';
import { Result, Button } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

interface CompletionScreenProps {
    isSuccess: boolean;
    clinicName:string
}

const CompletionScreen: React.FC<CompletionScreenProps> = ({ isSuccess,clinicName }) => {
    const icon = isSuccess ? <CheckCircleOutlined rev /> : <CloseCircleOutlined rev />;
    const title = isSuccess ? ' Registration Completed' : 'Registration Failed';
    const subTitle = isSuccess
        ? `You have successfully register with ${clinicName}.`
        : 'Oops! Something went wrong.';

    return (
        <Result
            icon={icon}
            title={title}
            subTitle={subTitle}
            extra={[]}
        />
    );
};

export default CompletionScreen;

