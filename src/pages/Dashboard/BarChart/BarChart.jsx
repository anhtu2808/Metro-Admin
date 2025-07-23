import React from "react";
import { Card, Typography, CircularProgress, Box } from "@mui/material";
import { BarChart, LineChart } from "@mui/x-charts";
import { MdConfirmationNumber, MdAttachMoney } from "react-icons/md";

const Barchart = ({ data, loading }) => {
  if (!data || loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={6}>
        <CircularProgress />
      </Box>
    );
  }

  const countData = [
    { category: "Vé theo thời gian", value: data.staticTicketCount },
    { category: "Vé theo lượt", value: data.dynamicTicketCount },
    { category: "Vé học sinh/sinh viên", value: data.studentTicketCount },
    { category: "Vé đã mua", value: data.completedOrderCount },
    { category: "Vé hủy", value: data.cancelledOrderCount },
  ];

  const revenueData = [
    { category: "Vé theo thời gian", value: data.staticTicketRevenue },
    { category: "Vé theo lượt", value: data.dynamicTicketRevenue },
    { category: "Vé học sinh/sinh viên", value: data.studentTicketRevenue },
    { category: "Vé đã mua", value: data.completedOrderRevenue },
  ];

  return (
    <Box sx={{ px: 4, py: 4, backgroundColor: "#fff" }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 4,
          justifyContent: "space-between",
        }}
      >
        {/* Số lượng vé - LINE CHART */}
        <Box sx={{ flex: "1 1 48%", minWidth: "300px" }}>
          <Card elevation={1} sx={{ height: "100%", p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <MdConfirmationNumber
                style={{ color: "#52c41a", fontSize: 28 }}
              />
              <Typography variant="h6" fontWeight={600}>
                Tổng quan số lượng vé
              </Typography>
            </Box>
            <Box sx={{ width: "100%" }}>
              <LineChart
                xAxis={[
                  {
                    scaleType: "point",
                    data: countData.map((item) => item.category),
                  },
                ]}
                series={[
                  {
                    data: countData.map((item) => item.value),
                    label: "Số lượng",
                    color: "#52c41a",
                  },
                ]}
                height={360}
                sx={{ width: "100%" }}
              />
            </Box>
          </Card>
        </Box>

        {/* Doanh thu vé - BAR CHART */}
        <Box sx={{ flex: "1 1 48%", minWidth: "300px" }}>
          <Card elevation={1} sx={{ height: "100%", p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <MdAttachMoney style={{ color: "#faad14", fontSize: 28 }} />
              <Typography variant="h6" fontWeight={600}>
                Tổng quan doanh thu vé
              </Typography>
            </Box>
            <Box sx={{ width: "100%" }}>
              <BarChart
                xAxis={[
                  {
                    scaleType: "band",
                    data: revenueData.map((item) => item.category),
                    categoryGapRatio: 0.3,
                  },
                ]}
                series={[
                  {
                    data: revenueData.map((item) => item.value),
                    label: "Doanh thu",
                    color: "#fa541c",
                  },
                ]}
                height={360}
                sx={{ width: "100%" }}
              />
            </Box>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default Barchart;
