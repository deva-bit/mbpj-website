import { SaveOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Card, DatePicker, DatePickerProps, Spin, Table, Upload, message } from "antd";
import { SetStateAction, useEffect, useState, } from "react";
import './UploadSAPData.css'
import * as XLSX from 'xlsx';
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { getUploadSapData,addUploadSapData } from "@/api/uploadSapData/uploadSapData.api";
import { UploadSapDataRequestDto,UploadSapDataRequestToPostDto } from "@/api/uploadSapData/uploadSapData.types";


const UplodSAPData = () => {
  const [data, setData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [uploadedData, setUploadedData] = useState<any[]>([]);
  const [isValue, setValue] = useState<UploadSapDataRequestDto>({
    month: dayjs().format("MM"),
    year: dayjs().format("YYYY"),
  })
  const [isSaveData, setSaveData] = useState<UploadSapDataRequestToPostDto>([{
    month: "",
    year: "",
    employeeId: "",
    deductedAmount: "",
    deductionCode: "",
  }])

  const monthFormat = 'YYYY/MM';

  const {
    isLoading: isLoadingData, isFetching: isFetchingData, isError: isErrorData, isSuccess: isSuccessData, data: dataSAP, error, refetch
  } = useQuery({
    queryKey: ['uploadSapData', isValue],
    queryFn: () => getUploadSapData(isValue),
  })

  const {
    isLoading: isLoadingSaveData, isFetching:isFetchingSaveData, isError: isErrorSaveData, isSuccess: isSuccessSaveData, data: dataSaveData, error:errorSaveData, refetch:refetchSaveData
  } = useQuery({
    queryKey: ['uploadSapSaveData',isSaveData],
    queryFn: () => addUploadSapData(isSaveData),

  })
  // Successfully retrieved data from DB
  useEffect(() => {
    if (isSuccessData) {
      const filteredData = dataSAP?.filter((item: { status: boolean; }) => item.status === true);
      setData(filteredData);
    }
  }, [isSuccessData, dataSAP]);

// Successfully save uploaded data
  useEffect(() => {
    if (isSuccessSaveData) {
      message.success('SAP data uploaded successfully!');
      setTimeout(() => {
      }, 2000);
    }
    setUploadedData([])
  }, [isSuccessSaveData]);

  const handleUpload = (file: any) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const binaryString = e.target?.result;
      if (binaryString) {
        const workbook = XLSX.read(binaryString, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        setUploadedData(excelData);
      }
    };
    reader.readAsBinaryString(file);
  };
  const handleSave = () => {
    console.log(uploadedData)
        const updatedInformation = uploadedData.map((item) => ({
          month: item[0],
          year: item[1],
          employeeId:item[2],
          deductedAmount:item[3],
          deductionCode:item[4],
        }))
        setSaveData(updatedInformation);
        
  }
  const onChangeDate: DatePickerProps['onChange'] = (date) => {
    if (date) {
      const updatedInformation = {
        month: date?.format("MM"),
        year: date?.format("YYYY"),
      };
      setValue(updatedInformation)
    }
  };
  const columnsSAP = [
    {
      title: 'NO.',
      dataIndex: 'no',
      key: 'no',
      render: (text: any, record: any, index: number) => {
        const pageIndex = (currentPage - 1) * 10 + index + 1;
        return <span>{pageIndex}</span>;
      },
    },
    {
      title: 'Month',
      dataIndex: 'month',
      key: 'month',
    },
    {
      title: 'Year',
      dataIndex: 'year',
      key: 'year',
    },
    {
      title: 'Employee Number',
      dataIndex: 'employeeId',
      key: 'employeeId',
    },
    {
      title: 'Amount',
      dataIndex: 'deductedAmount',
      key: 'deductedAmount',
    },
    {
      title: 'Code',
      dataIndex: 'deductionCode',
      key: 'deductionCode',
    },
  ];
  const columnsUploadedData = [
    {
      title: 'NO.',
      dataIndex: 'no',
      key: 'no',
      render: (text: any, record: any, index: number) => {
        const pageIndex = (currentPage - 1) * 10 + index + 1;
        return <span>{pageIndex}</span>;
      },
    },
    {
      title: 'Month',
      dataIndex: 0,
      key: 0,
    },
    {
      title: 'Year',
      dataIndex: 1,
      key: 1,
    },
    {
      title: 'Employee Number',
      dataIndex: 2,
      key: 2,
    },

    {
      title: 'Amount',
      dataIndex: 3,
      key: 3,
    },
    {
      title: 'Code',
      dataIndex: '4',
      key: '4',
    },
  ]

  return (
    <div>
      <Spin spinning={isLoadingData}>
      <Card title="Upload SAP Data">
        <div>
        <DatePicker defaultValue={dayjs()} format={monthFormat} onChange={onChangeDate} picker="month" style={{ float: 'right', marginBottom: '20px' }} />
       </div>
        <Upload beforeUpload={handleUpload} showUploadList={false}>
          <Button icon={<UploadOutlined rev={undefined} />}>Upload Excel</Button>
        </Upload>
        <Button type="primary" style={{ marginLeft: 10}} className="buttonStyle" onClick={handleSave}><SaveOutlined rev={undefined} /> Save</Button>

        <Table pagination={{ current: currentPage, pageSize: 10, onChange: (page: SetStateAction<number>) => setCurrentPage(page), showQuickJumper: true, showTotal: (total: any, range: any[]) => `${range[0]}-${range[1]} of ${total} items` }} dataSource={uploadedData.length > 0 ? uploadedData.slice(1) : data} columns={uploadedData.length > 0 ? columnsUploadedData : columnsSAP} />
      </Card>
      </Spin>
    </div>
  );
}
export default UplodSAPData;

