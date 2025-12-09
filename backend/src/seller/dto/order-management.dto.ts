// DTOs for enhanced seller order management

export interface ConfirmOrderDto {
  pickupLocationId?: string;
  estimatedReadyDate?: Date;
  notes?: string;
}

export interface RejectOrderDto {
  reason: string;
  notes?: string;
}

export interface UpdateOrderStatusDto {
  trackingNumber?: string;
  estimatedDelivery?: Date;
  notes?: string;
}

export interface OrderFiltersDto {
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
  limit?: number;
  page?: number;
}

export interface PickupLocationDto {
  name: string;
  address: string;
  contactPhone?: string;
  instructions?: string;
  isDefault?: boolean;
}