import { PersonData } from "../eps-dashboard/form";

export function filterPersonData(fullResponse: any, userInput: PersonData) {
  const subject = fullResponse.message.Subject[0];
  const personInfo = subject.PersonInfo;
  
  // Basic person info
  const filteredData = {
    PersonInfo: {
      PersonName: personInfo.PersonName,
      BirthDt: personInfo.BirthDt,
      DeathDt: personInfo.DeathDt
    },
    TINInfo: personInfo.TINInfo,
    ContactInfo: {
      MatchingAddress: null as ReturnType<typeof findMatchingAddress> | null,
      MatchingPhone: null as ReturnType<typeof findMatchingPhone> | null
    },
    Alias: subject.Alias
  };

  // Find matching address
  filteredData.ContactInfo.MatchingAddress = findMatchingAddress(
    personInfo.ContactInfo, 
    userInput
  );

  // Find matching phone
  filteredData.ContactInfo.MatchingPhone = findMatchingPhone(
    personInfo.ContactInfo, 
    userInput.phone
  );

  return filteredData;
}

function findMatchingAddress(contactInfo: any, userInput: any) {
  for (const contact of contactInfo) {
    if (contact.PostAddr) {
      const addr = contact.PostAddr;
        
      const apiStreetFull = `${addr.StreetName} ${addr.StreetType}`.trim().toLowerCase();
      const userStreet = userInput.streetName.trim().toLowerCase();
        
      const isMatch = 
        addr.StreetNum === userInput.streetNumber &&
        (apiStreetFull.includes(userStreet) || userStreet.includes(apiStreetFull)) &&
        addr.City.toLowerCase() === userInput.city.toLowerCase() &&
        addr.StateProv === userInput.state &&
        (addr.PostalCode.startsWith(userInput.postalCode) || 
         userInput.postalCode.startsWith(addr.PostalCode.split('-')[0]));
      
      if (isMatch) {
        return {
          ...addr,
          Validation: {
            AddressMatch: true,
            ValidationDetails: contact.ValidationInfo?.AddressValidation || []
          }
        };
      }
    }
  }
  return { AddressMatch: false };
}

function findMatchingPhone(contactInfo: any, userPhone: any) {
  // Clean phone number for comparison
  const cleanUserPhone = userPhone.replace(/\D/g, '');
  
  for (const contact of contactInfo) {
    if (contact.PhoneNum) {
      const phone = contact.PhoneNum;
      const cleanStoredPhone = phone.Phone.replace(/\D/g, '');
      
      if (cleanStoredPhone === cleanUserPhone) {
        return {
          Phone: phone.Phone,
          PhoneType: phone.PhoneType,
          Validation: {
            PhoneMatch: true,
            ValidationDetails: contact.ValidationInfo?.PhoneValidation || []
          }
        };
      }
    }
  }
  return { PhoneMatch: false };
}