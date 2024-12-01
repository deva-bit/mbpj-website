import React, { useEffect, useState, } from "react";
import { Modal, Spin } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { submitRegistration } from "@/api/registration/registration.api";
import { RegistrationRequestDto } from "@/api/registration/registration.types";
import { useQuery } from "@tanstack/react-query";
import { Auth } from "aws-amplify";
import { fetchEmployee } from "@/api/employee/employee.api";
import { EmployeeRequestDto } from "@/api/employee/employee.types";
import { fetchclinicInformation } from "@/api/clinicInformation/clinicInformation.api";
import dayjs from "dayjs";
import CompletionScreen from "@/components/CompletionScreen";

const { VITE_AWS_REDIRECT_AFTER_SIGNIN_URL } = import.meta.env;
const { confirm } = Modal;

type QrRegistrationProps = {
  isLogin: boolean;
}

const QrRegistration = ({ isLogin }: QrRegistrationProps) => {
  const location = useLocation();

  const { id } = useParams<{ id: string }>();
  const idNumber = id ? parseInt(id, 10) : undefined;
  const [isRegister, setRegister] = useState<boolean>(false)
  const [isFetchingEmployeeDetail, setFetchingEmployeeDetail] = useState<boolean>(false)
  const [clinicId, setClinicId] = useState<number>(0)
  const [isCliniName, setCliniName] = useState<string>("")
  const [employeeSearchValue, setEmployeeSearchValue] = useState<EmployeeRequestDto>({
    filterType: "",
    searchValue: ""
  })
  const [registrationValue, setRegistrationValue] = useState<RegistrationRequestDto>({
    fullName: "",
    userName: "",
    icNumber: "",
    passportNumber: "",
    employeeNumber: "",
    employeeType: "",
    employeeStatus: "",
    resignDate: "",
    factory: "",
    departmentCode: "",
    departmentName: "",
    registrationDate: "",
    clinicId: 0
  })

  const {
    isLoading: isLoadingRegistration, isFetching: isFetchingRegistration, isError: isErrorRegistration, isSuccess: isSuccessRegistration, data: registration, error: registrationError, refetch: registrationRefetch
  } = useQuery({
    queryKey: ['registration', registrationValue.registrationDate],
    queryFn: () => submitRegistration(registrationValue),
    enabled: isRegister && isLogin
  })

  const {
    isLoading: isLoadingEmployee, isFetching: isFectchingEmployee, isError: isErrorEmployee, isSuccess: isSuccessEmployee, data: employee, error: employeeError, refetch: employeeRefetch
  } = useQuery({
    queryKey: ['employee', employeeSearchValue],
    queryFn: () => fetchEmployee(employeeSearchValue),
    enabled: isFetchingEmployeeDetail
  })

  const {
    isLoading: isLoadingClinic, isFetching: isFectchingClinic, isError: isErrorClinic, isSuccess: isSuccessClinic, data: clinic, error: clinicError, refetch: clinicRefetch
  } = useQuery({
    queryKey: ['clinic'],
    queryFn: () => fetchclinicInformation(),
  })

  const getLoginUserDetail = async () => {
    const cognitoUser = await Auth.currentAuthenticatedUser();
    setEmployeeSearchValue({ filterType: "badgeId", searchValue: cognitoUser.attributes['custom:badgeID'] as string })
    setFetchingEmployeeDetail(true)
  }

  // After employee detail is retrieve 
  useEffect(() => {
    const currentDateAndTime = dayjs();
    setRegistrationValue({
      fullName: employee?.fullname,
      userName: employee?.username,
      icNumber: employee?.icNumber,
      passportNumber: employee?.passportNumber,
      employeeNumber: employee?.employeeNumber,
      employeeType: employee?.employeeType,
      employeeStatus: employee?.employeeStatus,
      resignDate: employee?.resignDate,
      factory: employee?.factory,
      departmentCode: employee?.departmentCode,
      departmentName: employee?.departmentName,
      registrationDate: currentDateAndTime.format('YYYY-MM-DD[T]HH:mm:ss[Z]'),
      clinicId: clinicId
    })
  }, [isSuccessEmployee, employee])

  // After user is successful registered
  useEffect(() => {
    setRegister(false) // Disable registration api call
  }, [isSuccessRegistration, registration])

  // After employee retreived and is active show confrimation dialog box
  useEffect(() => {
    var data = (location.pathname.match(/(\d+)/g) || []);
    const clinicId = data[0] as unknown as number;

    
    const filteredData = clinic?.filter((item: { status: boolean; }) => item.status === true);
    

      const isIdPresent = filteredData?.find(item => item.id === clinicId);

console.log(filteredData?.filter(item => item.id))
      if (isIdPresent) {
        setCliniName(isIdPresent.name)
      } else {
        console.log("Not found");
      }
    
  
  
    getLoginUserDetail() // Get login detail when page laoded

    const showConfirm = () => {
      confirm({
        title: `Do you want to proceed with the registration in ${isCliniName}?`,
        icon: <ExclamationCircleFilled rev={undefined} />,

        onOk() {
          setRegister(true)
        },
        onCancel() {
          setRegister(false)
        },
      })
    }

    if (employee?.employeeStatus == "active") {
      showConfirm() // Show confirm if the employee is still active
    }
  }, [employee])

    // After clinic data is retrieve 
    useEffect(() => {

    }, [isSuccessClinic])

  return (
    <div>
      <Spin spinning={isLoadingEmployee && isLoadingRegistration} size="large" tip="Loading...">
      {isSuccessRegistration && <CompletionScreen clinicName={isCliniName} isSuccess={true} />}
      {isErrorRegistration && <CompletionScreen clinicName={isCliniName} isSuccess={false} />}
      </Spin>
    </div>
  );
}

export default QrRegistration;