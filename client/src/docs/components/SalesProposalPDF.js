import React from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';
import worklogzLogo from '../../assets/worklogz-logo.png';

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  logo: {
    width: 80,
    height: 24,
    objectFit: 'contain',
  },
  brandBlock: {
    textAlign: 'right',
  },
  brandName: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  brandSub: {
    fontSize: 8,
    color: '#6B7280',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    color: '#4B5563',
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metaCol: {
    width: '48%',
  },
  metaLabel: {
    fontSize: 8,
    color: '#6B7280',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  metaValue: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 2,
  },
  sectionNote: {
    fontSize: 9,
    color: '#4B5563',
    marginBottom: 4,
  },
  featureList: {
    marginLeft: 8,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  bullet: {
    width: 6,
  },
  featureText: {
    flex: 1,
    fontSize: 9,
  },
  footer: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 6,
    fontSize: 8,
    color: '#6B7280',
    textAlign: 'center',
  },
});

const SalesProposalPDF = ({ clientInfo, categories, globalNotes }) => {
  const today = new Date().toLocaleDateString();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <Image src={worklogzLogo} style={styles.logo} />
          <View style={styles.brandBlock}>
            <Text style={styles.brandName}>
              {clientInfo.brandName || 'Worklogz'}
            </Text>
            <Text style={styles.brandSub}>One Platform. Complete Control. Zero Hassle.</Text>
          </View>
        </View>

        <Text style={styles.title}>Worklogz Solution Overview</Text>
        <Text style={styles.subtitle}>
          Generated configuration based on the options selected for this client.
        </Text>

        <View style={styles.metaRow}>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>Client / Company</Text>
            <Text style={styles.metaValue}>
              {clientInfo.companyName || '—'}
            </Text>
            {clientInfo.contactName ? (
              <>
                <Text style={styles.metaLabel}>Contact Person</Text>
                <Text style={styles.metaValue}>{clientInfo.contactName}</Text>
              </>
            ) : null}
          </View>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>Generated On</Text>
            <Text style={styles.metaValue}>{today}</Text>
            {clientInfo.segments ? (
              <>
                <Text style={styles.metaLabel}>Target Segments</Text>
                <Text style={styles.metaValue}>{clientInfo.segments}</Text>
              </>
            ) : null}
          </View>
        </View>

        {globalNotes ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Solution Summary & Notes</Text>
            <Text style={styles.sectionNote}>{globalNotes}</Text>
          </View>
        ) : null}

        {categories
          .filter((cat) => cat.items && cat.items.some((f) => f.selected))
          .map((cat) => (
            <View key={cat.id} style={styles.section}>
              <Text style={styles.sectionTitle}>{cat.title}</Text>
              {cat.note ? (
                <Text style={styles.sectionNote}>{cat.note}</Text>
              ) : null}
              <View style={styles.featureList}>
                {cat.items
                  .filter((f) => f.selected)
                  .map((feature) => (
                    <View key={feature.id} style={styles.featureItem}>
                      <Text style={styles.bullet}>•</Text>
                      <Text style={styles.featureText}>
                        {feature.label}
                        {feature.description ? ` – ${feature.description}` : ''}
                      </Text>
                    </View>
                  ))}
              </View>
            </View>
          ))}

        <Text style={styles.footer}>
          Worklogz – Complete Workforce & Business Management Platform. © {new Date().getFullYear()} Worklogz.
        </Text>
      </Page>
    </Document>
  );
};

export default SalesProposalPDF;



