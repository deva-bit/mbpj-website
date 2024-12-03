import React, { useState } from "react";
import { Table, Button, Card, Input, Space, Dropdown, Menu } from "antd";
import { PlusOutlined, SearchOutlined, EllipsisOutlined } from "@ant-design/icons";
import TambahBaru from "./AddPemberitahuan";

const Pemberitahuan = () => {
  const [currentPageView, setCurrentPageView] = useState<"list" | "add">("list");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Sample data
  const data = [
    { id: 1, title: "How to pay on eCukai", createdOn: "23/09/2022" },
    { id: 2, title: "Tax Filing Guide", createdOn: "10/10/2022" },
    { id: 3, title: "New Tax Regulations", createdOn: "01/11/2022" },
  ];

  // Filtered data based on search query across all columns
  const filteredData = data.filter((item) => {
    const searchQueryLower = searchQuery.toLowerCase();

    // Explicitly handle numeric matching for ID
    const idMatches =
      item.id.toString() === searchQuery || item.id.toString().includes(searchQuery);

    // Case-insensitive search for title and createdOn
    const titleMatches = item.title.toLowerCase().includes(searchQueryLower);
    const createdOnMatches = item.createdOn.toLowerCase().includes(searchQueryLower);

    // Return true if any field matches
    return idMatches || titleMatches || createdOnMatches;
  });

  // Dropdown menu for the "Action" column
  const menu = (
    <Menu>
      <Menu.Item key="1">View Details</Menu.Item>
      <Menu.Item key="2">Edit</Menu.Item>
      <Menu.Item key="3">Delete</Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: "User ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Created on",
      dataIndex: "createdOn",
      key: "createdOn",
    },
    {
      title: "Action",
      key: "action",
      render: () => (
        <Dropdown overlay={menu} trigger={["click"]}>
          <Button type="text" icon={<EllipsisOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const renderListView = () => (
    <Card
      title="Pemberitahuan"
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
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search"
          prefix={<SearchOutlined />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: 300 }}
        />
      </Space>
      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{
          current: currentPage,
          pageSize: 10,
          onChange: (page: number) => setCurrentPage(page),
          showQuickJumper: true,
          showTotal: (total: number, range: number[]) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
        rowKey="id"
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

export default Pemberitahuan;
