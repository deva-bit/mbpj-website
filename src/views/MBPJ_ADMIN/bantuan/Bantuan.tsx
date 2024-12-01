import React, { useState } from "react";
import { Table, Button, Card } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import TambahBaru from "./AddBantuan"; 

const Bantuan = () => {
  const [currentPageView, setCurrentPageView] = useState<"list" | "add">("list");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const columns = [
    {
      title: "User ID",
      dataIndex: "id",
      key: "id",
      render: (text: any, record: any, index: number) => {
        const pageIndex = (currentPage - 1) * 10 + index + 1;
        return <span>{pageIndex}</span>;
      },
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Created ",
      dataIndex: "createdOn",
      key: "createdOn",
    },
    {
        title: "Status ",
        dataIndex: "status",
        key: "status",
      },
      {
        title: "File ",
        dataIndex: "file",
        key: "file",
      },
    {
      title: "Action",
      key: "action",
      render: () => <Button type="link">Details</Button>,
    },
  ];

  const renderListView = () => (
    <Card
      title="Bantuan"
      extra={
        <div className="button-container">
          <Button
            type="primary"
            onClick={() => setCurrentPageView("add")} // Switch to Add Page
          >
            <PlusOutlined /> Tambah Baru
          </Button>
        </div>
      }
      className="my-card"
    >
      <Table
        columns={columns}
        dataSource={[]} // Add your data here
        pagination={{
          current: currentPage,
          pageSize: 10,
          onChange: (page: number) => setCurrentPage(page),
          showQuickJumper: true,
          showTotal: (total: number, range: number[]) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
      />
    </Card>
  );

  return (
    <div>
      {currentPageView === "list" ? (
        renderListView()
      ) : (
        <TambahBaru onBack={() => setCurrentPageView("list")} />
      )}
    </div>
  );
};

export default Bantuan;
