// components/pdf/ResidenceLeasePDF.tsx
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 11, fontFamily: "Helvetica" },
  header: { textAlign: "center", marginBottom: 20 },
  title: { fontSize: 18, fontWeight: "bold" },
  section: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 4,
    border: "1 solid #ddd",
  },
  label: { fontWeight: "bold" },
  row: { marginBottom: 5 },
});

const ResidenceLeasePDF = ({ property, currentLease }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Active Lease Agreement</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.row}>
          <Text style={styles.label}>Property Name: </Text>
          {property.name}
        </Text>
        <Text style={styles.row}>
          <Text style={styles.label}>Location: </Text>
          {property.location.city}, {property.location.country}
        </Text>
        <Text style={styles.row}>
          <Text style={styles.label}>Rent: </Text>${currentLease.rent} / night
        </Text>
        <Text style={styles.row}>
          <Text style={styles.label}>Lease Start: </Text>
          {new Date(currentLease.startDate).toLocaleDateString()}
        </Text>
        <Text style={styles.row}>
          <Text style={styles.label}>Lease End: </Text>
          {new Date(currentLease.endDate).toLocaleDateString()}
        </Text>
        <Text style={styles.row}>
          <Text style={styles.label}>Next Payment Due: </Text>
          {new Date(currentLease.endDate).toLocaleDateString()}
        </Text>
      </View>

      <Text>Thank you for leasing with us.</Text>
    </Page>
  </Document>
);

export default ResidenceLeasePDF;
