import React, { useState } from "react";
import { Form, Input } from "antd";
import AsyncSelect from "react-select/async";
import { fetchEmployee } from "@/api/employee/employee.api";
import { EmployeeRequestDto } from "@/api/employee/employee.types";
import { GroupBase, OptionsOrGroups } from "react-select";
type AsyncSelectProps = {
    handleOptionSelect: (selectedOption: any) => void; // Define the type here
  };
const AsyncSelectComponent = ({ handleOptionSelect }: AsyncSelectProps) => {
    const [options, setOptions] = useState<{ value: string; label: string }[]>([]);

    const loadOptions = async (
        inputValue: string,
        callback: (options: OptionsOrGroups<{ value: string; label: string; }, GroupBase<{ value: string; label: string; }>>) => void
      ): Promise<OptionsOrGroups<{ value: string; label: string; }, GroupBase<{ value: string; label: string; }>>> => {
        const inputValueObj: EmployeeRequestDto = {
          searchValue: inputValue,
          filterType: "username",
        };
      
        try {
          const response = await fetchEmployee(inputValueObj);
          if (!response) {
            callback([]); // Return an empty array of options
            return [];
          } else {
            const data = [{ value: response.username, label: response.username }];
            setOptions(data);
            callback(data);
            return data;
          }
        } catch (error) {
          console.error("Error fetching employee data:", error);
          callback([]); // Return an empty array of options
          return [];
        }
      };
      
      
      
      

  return (
    <Form.Item
      label="Username"
      name="username"
      rules={[{ required: true, message: "Please input the Name!" }]}
    >
      <AsyncSelect
        loadOptions={loadOptions}
        placeholder="Username"
        onChange={handleOptionSelect}
      />
    </Form.Item>
  );
};

export default AsyncSelectComponent;
