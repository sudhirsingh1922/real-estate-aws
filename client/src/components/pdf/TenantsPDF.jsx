// components/pdf/TenantsPDF.tsx
import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";

// Optional: Use a web-safe font or custom font (e.g., register Roboto or Open Sans)

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 11,
    fontFamily: 'Helvetica',
    backgroundColor: "#f9f9f9",
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
    borderBottom: "1 solid #333",
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderBottom: "1 solid #ccc",
    padding: 6,
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1 solid #eee",
    padding: 6,
  },
  cell: {
    flex: 1,
    paddingHorizontal: 4,
  },
  bold: {
    fontWeight: "bold",
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 6,
    fontSize: 14,
    fontWeight: "bold",
    color: "#444",
    textDecoration: "underline",
  },
});

const TenantsPDF = ({ propertyName, leases, getCurrentMonthPaymentStatus }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Tenants Overview</Text>
        <Text>{propertyName}</Text>
      </View>

      {/* Table Header */}
      <View style={styles.tableHeader}>
        <Text style={{ ...styles.cell, flex: 1.5 }}>Tenant</Text>
        <Text style={styles.cell}>Phone</Text>
        <Text style={styles.cell}>Lease Period</Text>
        <Text style={styles.cell}>Rent</Text>
        <Text style={styles.cell}>Status</Text>
      </View>

      {/* Table Rows */}
      {leases?.map((lease) => (
        <View key={lease.id} style={styles.tableRow}>
          <Text style={{ ...styles.cell, flex: 1.5 }}>
            {lease.tenant.name} ({lease.tenant.email})
          </Text>
          <Text style={styles.cell}>{lease.tenant.phoneNumber}</Text>
          <Text style={styles.cell}>
            {new Date(lease.startDate).toLocaleDateString()} -{" "}
            {new Date(lease.endDate).toLocaleDateString()}
          </Text>
          <Text style={styles.cell}>${lease.rent.toFixed(2)}</Text>
          <Text
            style={{
              ...styles.cell,
              color:
                getCurrentMonthPaymentStatus(lease.id) === "Paid"
                  ? "green"
                  : "red",
              fontWeight: "bold",
            }}
          >
            {getCurrentMonthPaymentStatus(lease.id)}
          </Text>
        </View>
      ))}
    </Page>
  </Document>
);

export default TenantsPDF;
