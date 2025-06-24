// components/pdf/ApplicationsPDF.tsx
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
    backgroundColor: "#fefefe",
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
    borderBottom: "1 solid #ccc",
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  appSection: {
    marginBottom: 10,
    padding: 10,
    border: "1 solid #eee",
    backgroundColor: "#f9f9f9",
  },
  label: {
    fontWeight: "bold",
  },
});

const ApplicationsPDF = ({ applications = [] }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Approved Applications Report</Text>
      </View>
      {applications.length === 0 ? (
        <Text>No approved applications available.</Text>
      ) : (
        applications.map((app) => (
          <View key={app.id} style={styles.appSection}>
            <Text>
              <Text style={styles.label}>Applicant:</Text> {app.tenant.name}
            </Text>
            <Text>
              <Text style={styles.label}>Email:</Text> {app.tenant.email}
            </Text>
            <Text>
              <Text style={styles.label}>Phone:</Text> {app.tenant.phoneNumber}
            </Text>
            <Text>
              <Text style={styles.label}>Property:</Text> {app.property.name}
            </Text>
            <Text>
              <Text style={styles.label}>Date:</Text>{" "}
              {new Date(app.applicationDate).toLocaleDateString()}
            </Text>
            <Text>
              <Text style={styles.label}>Status:</Text> {app.status}
            </Text>
          </View>
        ))
      )}
    </Page>
  </Document>
);

export default ApplicationsPDF;
