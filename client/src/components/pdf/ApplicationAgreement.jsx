import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 11,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
    paddingBottom: 10,
    borderBottom: "1 solid #ccc",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f9f9f9",
    border: "1 solid #ddd",
    borderRadius: 4,
  },
  label: {
    fontWeight: "bold",
  },
  field: {
    marginBottom: 4,
  },
});

const ApplicationAgreementPDF = ({ application }) => {
  const leaseEnd = application?.lease?.endDate
    ? new Date(application.lease.endDate).toLocaleDateString()
    : "N/A";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Rental Agreement</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.field}>
            <Text style={styles.label}>Tenant Name: </Text>
            {application?.tenant?.name || "N/A"}
          </Text>
          <Text style={styles.field}>
            <Text style={styles.label}>Email: </Text>
            {application?.tenant?.email || "N/A"}
          </Text>
          <Text style={styles.field}>
            <Text style={styles.label}>Phone: </Text>
            {application?.tenant?.phoneNumber || "N/A"}
          </Text>
          <Text style={styles.field}>
            <Text style={styles.label}>Property Name: </Text>
            {application?.property?.name || "N/A"}
          </Text>
          <Text style={styles.field}>
            <Text style={styles.label}>Lease End Date: </Text>
            {leaseEnd}
          </Text>
          <Text style={styles.field}>
            <Text style={styles.label}>Status: </Text>
            {application?.status || "N/A"}
          </Text>
        </View>

        <Text>Thank you for using our platform to manage your rental agreement.</Text>
      </Page>
    </Document>
  );
};

export default ApplicationAgreementPDF;
