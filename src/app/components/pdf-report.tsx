'use client';

import { jsPDF } from 'jspdf';

interface PersonName {
  FirstName: string;
  MiddleName: string;
  LastName: string;
  NameSuffix: string;
  Source: string;
  EffDt: string;
}

interface ValidationDetail {
  MsgClass: string;
  Text: string;
  Source: string;
  EffDt: string;
}

interface PhoneValidation {
  PhoneMatch: boolean;
  ValidationDetails: ValidationDetail[];
}

interface MatchingPhone {
  Phone: string;
  PhoneType: string;
  Validation: PhoneValidation;
}

interface MatchingAddress {
    Validation: {
        AddressMatch: boolean;
    }
}

interface ContactInfo {
  MatchingAddress: MatchingAddress;
  MatchingPhone: MatchingPhone;
}

interface TINInfo {
  TINType: string;
  TaxId: string;
  Source: string;
  EffDt: string;
}

interface Alias {
  PersonName: PersonName;
  Source: string;
  EffDt: string;
}

interface ReportData {
  PersonInfo: {
    PersonName: PersonName;
    BirthDt: string;
    DeathDt: string;
  };
  TINInfo: TINInfo;
  ContactInfo: ContactInfo;
  Alias: Alias[];
}

export interface PDFReportProps {
  data: ReportData;
}

export const PDFReport: React.FC<PDFReportProps> = ({ data }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
  };

  const generatePDF = async () => {
    const doc = new jsPDF();
    
    // Set up PDF styling
    doc.setFont('helvetica');
    doc.setFontSize(20);
    doc.setTextColor(44, 62, 80);
    
    // Header
    doc.text('Identity Verification Report', 20, 30);
    doc.setFontSize(12);
    doc.setTextColor(128, 128, 128);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 40);
    
    let yPosition = 60;
    
    // Personal Information Section
    doc.setFontSize(16);
    doc.setTextColor(44, 62, 80);
    doc.text('Personal Information', 20, yPosition);
    yPosition += 15;
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    const personName = data.PersonInfo.PersonName;
    const fullName = `${personName.FirstName} ${personName.MiddleName || ''} ${personName.LastName} ${personName.NameSuffix || ''}`.replace(/\s+/g, ' ').trim();
    
    doc.text(`Full Name: ${fullName}`, 25, yPosition);
    yPosition += 8;
    doc.text(`Birth Date: ${formatDate(data.PersonInfo.BirthDt)}`, 25, yPosition);
    yPosition += 8;
    doc.text(`Death Date: ${formatDate(data.PersonInfo.DeathDt)}`, 25, yPosition);
    yPosition += 15;
    
    // TIN Information Section
    doc.setFontSize(16);
    doc.setTextColor(44, 62, 80);
    doc.text('Tax Identification Information', 20, yPosition);
    yPosition += 15;
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`TIN Type: ${data.TINInfo.TINType}`, 25, yPosition);
    yPosition += 8;
    doc.text(`Tax ID: ${data.TINInfo.TaxId}`, 25, yPosition);
    yPosition += 15;
    
    // Contact Verification Section
    doc.setFontSize(16);
    doc.setTextColor(44, 62, 80);
    doc.text('Contact Verification', 20, yPosition);
    yPosition += 15;
    
    doc.setFontSize(10);
    
    // Phone Verification
    if (data.ContactInfo.MatchingPhone.Validation.PhoneMatch) {
      doc.setTextColor(21, 87, 36);
      doc.text('✓ Phone Verification: MATCHED', 25, yPosition);
      yPosition += 8;
      
      doc.setTextColor(0, 0, 0);
      doc.text(`Phone: ${formatPhone(data.ContactInfo.MatchingPhone.Phone)}`, 30, yPosition);
      yPosition += 8;
      doc.text(`Type: ${data.ContactInfo.MatchingPhone.PhoneType}`, 30, yPosition);
      yPosition += 8;
      
      // Phone Validation Details
      doc.setFontSize(9);
      doc.setTextColor(128, 128, 128);
      doc.text('Validation Details:', 30, yPosition);
      yPosition += 6;
      
      data.ContactInfo.MatchingPhone.Validation.ValidationDetails.forEach(detail => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(`• ${detail.MsgClass}: ${detail.Text}`, 35, yPosition);
        yPosition += 6;
      });
    } else {
      doc.setTextColor(220, 53, 69);
      doc.text('✗ Phone Verification: NOT MATCHED', 25, yPosition);
      yPosition += 8;
    }
    
    yPosition += 8;
    
    // Address Verification
    if (data.ContactInfo.MatchingAddress.Validation.AddressMatch) {
      doc.setTextColor(21, 87, 36);
      doc.text('✓ Address Verification: MATCHED', 25, yPosition);
    } else {
      doc.setTextColor(220, 53, 69);
      doc.text('✗ Address Verification: NOT MATCHED', 25, yPosition);
    }
    
    yPosition += 15;
    
    // Alias Information
    if (data.Alias && data.Alias.length > 0) {
      doc.setFontSize(16);
      doc.setTextColor(44, 62, 80);
      doc.text('Alias Information', 20, yPosition);
      yPosition += 15;
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      
      data.Alias.forEach((alias, index) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        
        const aliasName = `${alias.PersonName.FirstName} ${alias.PersonName.MiddleName || ''} ${alias.PersonName.LastName}`.replace(/\s+/g, ' ').trim();
        doc.text(`Alias ${index + 1}: ${aliasName}`, 25, yPosition);
        yPosition += 8;
      });
    }
    
    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
      doc.text('Confidential Identity Verification Report', 20, 290);
    }
    
    doc.save('identity-verification-report.pdf');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Generated Report
          </h1>
          {/* <p className="text-lg text-gray-600">
            Comprehensive Identity Validation and Verification
          </p> */}
        </div>

        {/* Report Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">

          {/* Report Content */}
          <div className="p-6 space-y-20">
            {/* Personal Information */}
            <div className="mb-8 border-l-4 border-blue-500 pl-4">
              <div className="flex items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Personal Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <div className="text-sm font-semibold text-gray-500 mb-1">Full Name</div>
                  <div className="text-gray-800">
                    {data.PersonInfo.PersonName.FirstName} {data.PersonInfo.PersonName.MiddleName} {data.PersonInfo.PersonName.LastName} {data.PersonInfo.PersonName.NameSuffix}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <div className="text-sm font-semibold text-gray-500 mb-1">Birth Date</div>
                  <div className="text-gray-800">{formatDate(data.PersonInfo.BirthDt)}</div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <div className="text-sm font-semibold text-gray-500 mb-1">Death Date</div>
                  <div className="text-gray-800">{formatDate(data.PersonInfo.DeathDt)}</div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <div className="text-sm font-semibold text-gray-500 mb-1">Status</div>
                  <div className="text-red-600 font-semibold">Deceased</div>
                </div>
              </div>
            </div>

            {/* TIN Information */}
            <div className="mb-8 border-l-4 border-green-500 pl-4">
              <div className="flex items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Tax Identification Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-500">
                  <div className="text-sm font-semibold text-gray-500 mb-1">TIN Type</div>
                  <div className="text-gray-800">{data.TINInfo.TINType}</div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-500">
                  <div className="text-sm font-semibold text-gray-500 mb-1">Tax ID</div>
                  <div className="text-gray-800 font-mono">{data.TINInfo.TaxId}</div>
                </div>
              </div>
            </div>

            {/* Contact Verification */}
            <div className="mb-8 border-l-4 border-purple-500 pl-4">
              <div className="flex items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Contact Verification</h3>
              </div>
              
              {/* Phone Verification */}
              <div className="mb-6 text-stone-500">
                <div className="flex items-center mb-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                    data.ContactInfo.MatchingPhone.Validation.PhoneMatch 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {data.ContactInfo.MatchingPhone.Validation.PhoneMatch ? '✓' : '✗'}
                  </div>
                  <span className="font-semibold">Phone Verification</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                    data.ContactInfo.MatchingPhone.Validation.PhoneMatch
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {data.ContactInfo.MatchingPhone.Validation.PhoneMatch ? 'MATCHED' : 'NOT MATCHED'}
                  </span>
                </div>
                
                {data.ContactInfo.MatchingPhone.Validation.PhoneMatch && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-sm font-semibold text-gray-500 mb-1">Phone Number</div>
                        <div className="text-gray-800 font-mono">{formatPhone(data.ContactInfo.MatchingPhone.Phone)}</div>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-500 mb-1">Phone Type</div>
                        <div className="text-gray-800">{data.ContactInfo.MatchingPhone.PhoneType}</div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-semibold text-gray-500 mb-2">Validation Details</div>
                      <div className="space-y-2">
                        {data.ContactInfo.MatchingPhone.Validation.ValidationDetails.map((detail, index) => (
                          <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                            <span className="font-medium text-gray-700">{detail.MsgClass}:</span>
                            <span className="text-gray-600">{detail.Text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Address Verification */}
              <div className="flex items-center text-stone-500">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                  data.ContactInfo.MatchingAddress.Validation.AddressMatch 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-red-100 text-red-600'
                }`}>
                  {data.ContactInfo.MatchingAddress.Validation.AddressMatch ? '✓' : '✗'}
                </div>
                <span className="font-semibold">Address Verification</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                  data.ContactInfo.MatchingAddress.Validation.AddressMatch
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {data.ContactInfo.MatchingAddress.Validation.AddressMatch ? 'MATCHED' : 'NOT MATCHED'}
                </span>
              </div>
            </div>

            {/* Alias Information */}
            {data.Alias && data.Alias.length > 0 && (
              <div className="border-l-4 border-orange-500 pl-4">
                <div className="flex items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">Alias Information</h3>
                </div>
                
                <div className="space-y-3">
                  {data.Alias.map((alias, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm font-semibold text-gray-500 mb-1">Alias {index + 1}</div>
                      <div className="text-gray-800">
                        {alias.PersonName.FirstName} {alias.PersonName.MiddleName} {alias.PersonName.LastName}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timestamp */}
            <div className="text-center text-gray-500 text-sm mt-8">
              Report generated on: {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>

        <div className="text-center">
          <button onClick={generatePDF} type="submit" className={`bg-[#7666c0] text-white cursor-pointer shadow-lg rounded-lg mx-auto w-fit px-3 hover:opacity-85 h-10 font-bold uppercase flex justify-center items-center`}>📄 Download PDF Report</button>
        </div>
      </div>
    </div>
  );
};