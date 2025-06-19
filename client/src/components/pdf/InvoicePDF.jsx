// components/pdf/InvoicePDF.tsx
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

// Styles
const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 11, fontFamily: "Helvetica" },
  header: { textAlign: "center", marginBottom: 20 },
  title: { fontSize: 18, fontWeight: "bold" },
  section: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f5f5f5",
    border: "1 solid #ddd",
    borderRadius: 4,
  },
  row: { marginBottom: 6 },
  label: { fontWeight: "bold" },
});

const InvoicePDF = ({ payment }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Invoice #{payment.id}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.row}>
          <Text style={styles.label}>Invoice ID:</Text> {payment.id}
        </Text>
        <Text style={styles.row}>
          <Text style={styles.label}>Status:</Text> {payment.paymentStatus}
        </Text>
        <Text style={styles.row}>
          <Text style={styles.label}>Billing Date:</Text>{" "}
          {new Date(payment.paymentDate).toLocaleDateString()}
        </Text>
        <Text style={styles.row}>
          <Text style={styles.label}>Amount Paid:</Text> $
          {payment.amountPaid.toFixed(2)}
        </Text>
      </View>

      <Text>Thank you for your payment.</Text>
    </Page>
  </Document>
);

export default InvoicePDF;
