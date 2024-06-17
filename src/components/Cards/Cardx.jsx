import React from "react";
import { Row, Card } from "antd";
import "./style.css";
import { TinyColor } from "@ctrl/tinycolor";
import { Button, ConfigProvider, Space } from "antd";

const colors3 = ["#181d3a", "#181d3a", "#181d3a"];

const getHoverColors = (colors) =>
  colors.map((color) => new TinyColor(color).lighten(5).toString());

const getActiveColors = (colors) =>
  colors.map((color) => new TinyColor(color).darken(5).toString());
const Cardx = ({
  income,
  expenses,
  currentBalance,
  showExpenseModal,
  showIncomeModal,
  hideExpenseModal,
  hideIncomeModal,
}) => {
  return (
    <div>
      <Row className="row">
        <Card className="card" title="Available Balance">
          <p style={{fontWeight:"bolder", fontSize:"1.5rem"}} >₹{currentBalance}</p>
          <Space>
            <ConfigProvider
              theme={{
                components: {
                  Button: {
                    colorPrimary: `linear-gradient(116deg,  ${colors3.join(
                      ", "
                    )})`,
                    colorPrimaryHover: `linear-gradient(116deg, ${getHoverColors(
                      colors3
                    ).join(", ")})`,
                    colorPrimaryActive: `linear-gradient(116deg, ${getActiveColors(
                      colors3
                    ).join(", ")})`,
                    lineWidth: 0,
                  },
                },
              }}
            >
              <Button
                type="primary"
                size="large"
                style={{ width: "250px" }} /*onClick={reset} */
              >
                Reset Balance
              </Button>
            </ConfigProvider>
          </Space>
        </Card>
        <Card className="card" title="Total Income">
          <p style={{fontWeight:"bolder", fontSize:"1.5rem"}} >₹{income}</p>
          <Space>
            <ConfigProvider
              theme={{
                components: {
                  Button: {
                    colorPrimary: `linear-gradient(116deg,  ${colors3.join(
                      ", "
                    )})`,
                    colorPrimaryHover: `linear-gradient(116deg, ${getHoverColors(
                      colors3
                    ).join(", ")})`,
                    colorPrimaryActive: `linear-gradient(116deg, ${getActiveColors(
                      colors3
                    ).join(", ")})`,
                    lineWidth: 0,
                  },
                },
              }}
            >
              <Button
                type="primary"
                size="large"
                style={{ width: "250px" }}
                onClick={showIncomeModal}
              >
                Add Income
              </Button>
            </ConfigProvider>
          </Space>
        </Card>
        <Card className="card" title="Total Expense">
          <p style={{fontWeight:"bolder", fontSize:"1.5rem"}}>₹{expenses}</p>
          <Space>
            <ConfigProvider
              theme={{
                components: {
                  Button: {
                    colorPrimary: `linear-gradient(116deg,  ${colors3.join(
                      ", "
                    )})`,
                    colorPrimaryHover: `linear-gradient(116deg, ${getHoverColors(
                      colors3
                    ).join(", ")})`,
                    colorPrimaryActive: `linear-gradient(116deg, ${getActiveColors(
                      colors3
                    ).join(", ")})`,
                    lineWidth: 0,
                  },
                },
              }}
            >
              <Button
                type="primary"
                size="large"
                style={{ width: "250px" }}
                onClick={showExpenseModal}
              >
                Add Expense
              </Button>
            </ConfigProvider>
          </Space>
        </Card>
      </Row>
    </div>
  );
};

export default Cardx;
