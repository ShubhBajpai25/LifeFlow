// src/app/services/donation.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DonationRecord {
  donorId: string;
  bloodGroup: string;
  donationDate: Date;
  status: 'Pending' | 'Completed' | 'Rejected' | 'Cancelled';
  medicalNotes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DonationService {
  private apiUrl = 'http://localhost:3000/api/donations'; // Adjust port if different

  constructor(private http: HttpClient) {}

  /**
   * Records a new blood donation
   * @param donation The donation record to create
   */
  recordDonation(donation: DonationRecord): Observable<{message: string, donationId: string}> {
    return this.http.post<{message: string, donationId: string}>(`${this.apiUrl}/record`, donation);
  }

  /**
   * Gets all donations for a specific blood center
   * @param centerId ID of the blood center
   */
  getCenterDonations(centerId: string): Observable<DonationRecord[]> {
    return this.http.get<DonationRecord[]>(`${this.apiUrl}/center/${centerId}`);
  }

  /**
   * Gets donation history for a specific donor
   * @param donorId ID of the donor
   */
  getDonorDonations(donorId: string): Observable<DonationRecord[]> {
    return this.http.get<DonationRecord[]>(`${this.apiUrl}/donor/${donorId}`);
  }

  /**
   * Updates the status of a donation
   * @param donationId ID of the donation to update
   * @param status New status
   * @param medicalNotes Optional medical notes
   */
  updateDonationStatus(
    donationId: string, 
    status: DonationRecord['status'], 
    medicalNotes?: string
  ): Observable<{message: string, donation: DonationRecord}> {
    return this.http.put<{message: string, donation: DonationRecord}>(
      `${this.apiUrl}/update/${donationId}`, 
      { status, medicalNotes }
    );
  }
}