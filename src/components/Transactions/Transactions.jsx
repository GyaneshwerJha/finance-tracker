import { Table, Select, Input, DatePicker, Radio, Button } from "antd";
import { useState } from "react";
import moment from "moment";
import html2pdf from "html2pdf.js";

const { Option } = Select;
const { RangePicker } = DatePicker;

const Transactions = ({ transactions }) => {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [dateRange, setDateRange] = useState([]);
  const [filterTag, setFilterTag] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
    },
  ];

  const filteredTransactions = transactions.filter((item) => {
    const matchesName = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType ? item.type === filterType : true;
    const matchesTag = filterTag ? item.tag === filterTag : true;
    const matchesDate =
      dateRange.length === 2
        ? moment(item.date).isBetween(dateRange[0], dateRange[1], "days", "[]")
        : true;
    return matchesName && matchesType && matchesTag && matchesDate;
  });

  let sortedTransactions = filteredTransactions.sort((a, b) => {
    if (sortKey === "date") {
      return new Date(a.date) - new Date(b.date);
    } else if (sortKey === "amount") {
      return a.amount - b.amount;
    } else {
      return 0;
    }
  });

  const handleDownloadPDF = () => {
    const totalPages = Math.ceil(sortedTransactions.length / pageSize);

    const generatePDF = (pageNumber) => {
      const startIndex = (pageNumber - 1) * pageSize;
      const endIndex = pageNumber * pageSize;
      const currentTransactions = sortedTransactions.slice(
        startIndex,
        endIndex
      );

      const element = document.getElementById("transaction-table");

      html2pdf(element, {
        margin: 10,
        filename: `transactions_${pageNumber}.pdf`,
        jsPDF: { format: "a4" },
        html2canvas: { scale: 1 },
        pagebreak: { mode: "avoid-all" },
        onBeforeSend: (pdf) => {
          pdf.addPage();
        },
        onAfterRender: () => {
          if (pageNumber < totalPages) {
            generatePDF(pageNumber + 1);
          } else {
            console.log("PDF generation completed.");
          }
        },
      });
    };

    generatePDF(1); // Start generating PDF from page 1
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>My Transactions</h2>
      <div style={styles.filters}>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name..."
          style={{ ...styles.input, marginRight: 16 }}
        />
        <Select
          value={filterType}
          onChange={(value) => setFilterType(value)}
          placeholder="Filter by type"
          style={{ ...styles.select, marginRight: 16 }}
        >
          <Option value="">All</Option>
          <Option value="income">Income</Option>
          <Option value="expense">Expense</Option>
        </Select>
        <RangePicker
          value={dateRange}
          onChange={(dates) => setDateRange(dates || [])}
          style={{ ...styles.datePicker, marginRight: 16 }}
        />
        <Select
          value={filterTag}
          onChange={(value) => setFilterTag(value)}
          placeholder="Filter by tag"
          style={styles.select}
        >
          <Option value="">All</Option>
          <Option value="salary">Salary</Option>
          <Option value="freelance">Freelance</Option>
          <Option value="investment">Investment</Option>
          <Option value="food">Food</Option>
          <Option value="education">Education</Option>
          <Option value="office">Office</Option>
        </Select>
      </div>

      <div style={styles.radioContainer}>
        <Radio.Group
          className="input-radio"
          onChange={(e) => setSortKey(e.target.value)}
          value={sortKey}
          style={styles.radioGroup}
        >
          <Radio.Button value="">No Sort</Radio.Button>
          <Radio.Button value="amount">Sort By Amount</Radio.Button>
          <Radio.Button value="date">Sort By Date</Radio.Button>
        </Radio.Group>
      </div>

      <div id="transaction-table">
        <Table
          dataSource={sortedTransactions}
          columns={columns}
          pagination={{
            pageSize: pageSize,
            current: currentPage,
            onChange: (page, pageSize) => {
              setCurrentPage(page);
              setPageSize(pageSize);
            },
          }}
          style={{ ...styles.table }}
        />
      </div>
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <Button type="primary" onClick={handleDownloadPDF}>
          Download Transaction Page
        </Button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    margin: "2rem",
    padding: "16px",
    backgroundColor: "var(--theme)",
    color: "white",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    textAlign: "center",
    marginBottom: "16px",
    color: "white",
  },
  filters: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: "16px",
  },
  input: {
    flex: "1 1 200px",
    marginBottom: "8px",
  },
  select: {
    flex: "1 1 200px",
    marginBottom: "8px",
  },
  datePicker: {
    flex: "1 1 200px",
    marginBottom: "8px",
  },
  radioContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "16px",
  },
  radioGroup: {
    marginBottom: "16px",
  },
  table: {
    backgroundColor: "var(--theme)",
    color: "white",
  },
};

export default Transactions;
