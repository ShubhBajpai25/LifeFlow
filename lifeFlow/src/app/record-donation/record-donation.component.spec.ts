import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DonationService } from '../services/donation.service';

@Component({
  selector: 'app-record-donation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './record-donation.component.html',
  styleUrls: ['./record-donation.component.css']
})
export class RecordDonationComponent {
  donationRecord = {
    donorId: '',
    bloodGroup: '',
    donationDate: new Date(),
    status: 'Pending',
    medicalNotes: ''
  };

  bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  constructor(private donationService: DonationService) {}

  recordDonation() {
    this.donationService.recordDonation(this.donationRecord).subscribe({
      next: (response) => {
        alert('Donation recorded successfully!');
        this.resetForm();
      },
      error: (error) => {
        alert('Error recording donation: ' + error.message);
      }
    });
  }

  private resetForm() {
    this.donationRecord = {
      donorId: '',
      bloodGroup: '',
      donationDate: new Date(),
      status: 'Pending',
      medicalNotes: ''
    };
  }
}