export type AssetStatus = 'AVAILABLE' | 'ALLOCATED' | 'RESERVED' | 'UNDER_MAINTENANCE' | 'LOST' | 'RETIRED' | 'DISPOSED';
export type AssetCondition = 'NEW' | 'GOOD' | 'FAIR' | 'POOR' | 'DAMAGED';

export interface Asset {
  id: string;
  assetTag: string;
  assetName: string;
  category: string;
  department: string;
  currentHolder: string | null;
  serialNumber: string;
  purchaseDate: string;
  purchaseCost: number;
  manufacturer: string;
  modelNumber: string;
  warrantyExpiry: string | null;
  condition: AssetCondition;
  location: string;
  image: string;
  documents: string;
  description: string;
  status: AssetStatus;
  createdAt: string;
  updatedAt: string;
}

export type AllocationStatus = 'PENDING' | 'ALLOCATED' | 'RETURNED' | 'CANCELLED';

export interface Allocation {
  id: string;
  assetId: string;
  assetTag: string;
  assetName: string;
  employee: string;
  department: string;
  allocatedDate: string;
  expectedReturnDate: string;
  actualReturnDate: string | null;
  status: AllocationStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type TransferStatus = 'REQUESTED' | 'APPROVED' | 'REJECTED' | 'COMPLETED';

export interface Transfer {
  id: string;
  assetId: string;
  assetTag: string;
  assetName: string;
  fromEmployee: string;
  toEmployee: string;
  requestedBy: string;
  approvedBy: string | null;
  reason: string;
  status: TransferStatus;
  createdDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReturnLog {
  id: string;
  allocationId: string | null;
  assetId: string;
  returnDate: string;
  returnedBy: string;
  condition: AssetCondition;
  remarks: string;
  createdAt: string;
}

export interface AssetHistory {
  id: string;
  assetId: string;
  action: string;
  actionBy: string;
  description: string;
  actionDate: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}
