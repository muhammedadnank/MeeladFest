import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { CertificateData } from '@/types/certificate';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  outerBorder: {
    borderWidth: 4,
    borderColor: '#1e3a8a', // Dark blue
    padding: 10,
    height: '100%',
  },
  innerBorder: {
    borderWidth: 1,
    borderColor: '#d97706', // Gold accent
    padding: 20,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
  },
  orgTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e3a8a',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 12,
    color: '#4b5563',
    marginTop: 4,
    textAlign: 'center',
  },
  certBadge: {
    marginVertical: 12,
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 4,
    alignItems: 'center',
  },
  winnerBadge: {
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#d97706',
  },
  participationBadge: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#2563eb',
  },
  badgeText: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  winnerText: {
    color: '#92400e',
  },
  participationText: {
    color: '#1e40af',
  },
  body: {
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',
  },
  introText: {
    fontSize: 12,
    color: '#374151',
    marginBottom: 8,
  },
  recipientName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    borderBottomWidth: 2,
    borderBottomColor: '#d97706',
    paddingBottom: 4,
    marginBottom: 8,
    textAlign: 'center',
  },
  teamInfo: {
    fontSize: 13,
    color: '#4b5563',
    marginBottom: 12,
  },
  highlight: {
    color: '#1e3a8a',
    fontWeight: 'bold',
  },
  achievementBox: {
    marginVertical: 10,
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    width: '90%',
    alignItems: 'center',
  },
  achievementText: {
    fontSize: 13,
    color: '#1f2937',
    textAlign: 'center',
    lineHeight: 1.4,
  },
  positionHighlight: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d97706',
    marginTop: 4,
  },
  footer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  signatureBlock: {
    alignItems: 'center',
    width: 150,
  },
  signatureLine: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#9ca3af',
    marginBottom: 4,
  },
  signatureText: {
    fontSize: 10,
    color: '#4b5563',
  },
  verificationBlock: {
    alignItems: 'flex-end',
  },
  verifyCode: {
    fontSize: 9,
    fontFamily: 'Courier',
    color: '#6b7280',
  },
  dateText: {
    fontSize: 9,
    color: '#6b7280',
    marginTop: 2,
  },
});

interface CertificatePDFProps {
  data: CertificateData;
}

const getPositionText = (pos?: number) => {
  if (pos === 1) return 'FIRST PLACE (1st)';
  if (pos === 2) return 'SECOND PLACE (2nd)';
  if (pos === 3) return 'THIRD PLACE (3rd)';
  return '';
};

export const CertificatePDF: React.FC<CertificatePDFProps> = ({ data }) => {
  const isWinner = data.certificateType === 'winner';

  return (
    <Document title={`Certificate-${data.chestNo}-${data.itemName}`}>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.outerBorder}>
          <View style={styles.innerBorder}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.orgTitle}>{data.festName}</Text>
              <Text style={styles.subHeader}>
                {data.madrasaName} • {data.venue}
              </Text>
            </View>

            {/* Badge */}
            <View
              style={[
                styles.certBadge,
                isWinner ? styles.winnerBadge : styles.participationBadge,
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  isWinner ? styles.winnerText : styles.participationText,
                ]}
              >
                {isWinner ? 'Certificate of Excellence' : 'Certificate of Participation'}
              </Text>
            </View>

            {/* Body */}
            <View style={styles.body}>
              <Text style={styles.introText}>This is proudly presented to</Text>
              <Text style={styles.recipientName}>{data.participantName}</Text>
              <Text style={styles.teamInfo}>
                Chest No: <Text style={styles.highlight}>{data.chestNo}</Text> | Team:{' '}
                <Text style={styles.highlight}>{data.teamName}</Text>
              </Text>

              <View style={styles.achievementBox}>
                <Text style={styles.achievementText}>
                  for {isWinner ? 'outstanding performance and securing' : 'active participation in'}{' '}
                  <Text style={styles.highlight}>{data.itemName}</Text> ({data.categoryName}) in the annual festival celebrations.
                </Text>
                {isWinner && data.position && (
                  <Text style={styles.positionHighlight}>
                    🏆 {getPositionText(data.position)} 🏆
                  </Text>
                )}
              </View>
            </View>

            {/* Footer Signatures & Verification */}
            <View style={styles.footer}>
              <View style={styles.signatureBlock}>
                <View style={styles.signatureLine} />
                <Text style={styles.signatureText}>Convener / Authority</Text>
              </View>

              <View style={styles.signatureBlock}>
                <View style={styles.signatureLine} />
                <Text style={styles.signatureText}>President / Chairman</Text>
              </View>

              <View style={styles.verificationBlock}>
                <Text style={styles.verifyCode}>Verify Code: {data.verificationCode}</Text>
                <Text style={styles.dateText}>Issued: {data.issueDate}</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
