export type CertificateType = 'winner' | 'participation';

export type PositionType = 1 | 2 | 3;

export interface CertificateData {
  certificateId: string;
  festId: string;
  festName: string;
  madrasaName: string;
  date: string;
  venue: string;
  participantName: string;
  chestNo: string;
  teamName: string;
  teamColor?: string;
  categoryName: string;
  itemName: string;
  itemType: 'single' | 'group';
  certificateType: CertificateType;
  position?: PositionType;
  points?: number;
  issueDate: string;
  verificationCode: string;
}

export interface CertificateSearchResult {
  chestNo: string;
  participantName: string;
  teamName: string;
  categoryName: string;
  certificates: CertificateData[];
}
