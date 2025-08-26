import * as Yup from 'yup';

const noSpaceNoSpecialChar = /^[A-Za-z0-9]+$/;
const noSpecialCharRegex = /^[a-zA-Z0-9\s]*$/;
// Allows letters, digits, single space between words, but no leading/trailing/multiple spaces
const nameWithSingleSpace = /^(?! )[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/;

// PAN number format: 5 uppercase letters, 4 digits, 1 uppercase letter (no spaces)
const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

// Aadhaar: 12 digits
const aadhaarRegex = /^\d{12}$/;

const noLeadingSpaceSingleInternalSpace =
  /^(?!.*  )(?! )[A-Za-z0-9]+( [A-Za-z0-9]+)*$/;

const addressRule = /^(?!.*[<>{}\[\]*&?])(?!.* {2,})(?! )[A-Za-z0-9 ]+(?<! )$/;

const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

export const individualFormSchema = Yup.object().shape({
  spocName: Yup.string()
    .matches(
      noLeadingSpaceSingleInternalSpace,
      'Only alphanumeric, no leading space, and at most one internal space allowed'
    )
    .required('SPOC Name is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  phoneNumber: Yup.string()
    .matches(
      /^[6-9]\d{9}$/,
      'Phone number must start with 6,7,8 or 9 and be exactly 10 digits'
    )
    .required('Mobile Number is required'),
  address: Yup.string().required('Address is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  zipCode: Yup.string()
    .matches(/^\d{6}$/, 'ZIP Code must be exactly 6 digits')
    .required('ZIP Code is required'),
  aadharNumber: Yup.string()
    .matches(aadhaarRegex, 'Aadhaar number must be exactly 12 digits')
    .required('Aadhaar Number is required'),
  panNumber: Yup.string()
    .matches(panRegex, 'Invalid PAN format (e.g., ABCDE1234F)')
    .required('PAN Number is required'),
  aadhar: Yup.mixed().required('Aadhaar file is required'),
  pan: Yup.mixed().required('PAN file is required'),
});

export const jointHolderSchema = Yup.object().shape({
  spocName: Yup.string()
    .matches(
      noLeadingSpaceSingleInternalSpace,
      'Only alphanumeric, no leading space, and at most one internal space allowed'
    )
    .required('SPOC Name is required'),

  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),

  phoneNumber: Yup.string()
    .matches(
      /^[6-9]\d{9}$/,
      'Phone number must start with 6,7,8 or 9 and be exactly 10 digits'
    )
    .required('Phone number is required'),

  // companyName: Yup.string()
  //   .matches(nameWithSingleSpace, 'Only one space allowed between words and no special characters')
  //   .required('Company name is required'),

  address: Yup.string()
    // .matches(addressRule, 'Address must notSt@998
    //  contain < > ? { } [ ] * & and should have only one space between words (no leading/trailing/multiple spaces).')
    // .matches(noLeadingSpaceSingleInternalSpace, 'Only one space allowed between words and no special characters')
    //   .matches(noSpaceNoSpecialChar, 'No spaces or special characters allowed')
    .required('Address is required'),

  city: Yup.string()
    //   .matches(noSpaceNoSpecialChar, 'No spaces or special characters allowed')
    .required('City is required'),

  state: Yup.string()
    //   .matches(noSpaceNoSpecialChar, 'No spaces or special characters allowed')
    .required('State is required'),

  zipCode: Yup.string()
    .matches(/^\d{6}$/, 'ZIP Code must be exactly 6 digits')
    .required('ZIP Code is required'),

  panNumber: Yup.string()
    .matches(panRegex, 'Invalid PAN format (e.g., ABCDE1234F)')
    .required('PAN Number is required'),

  aadharNumber: Yup.string()
    .matches(aadhaarRegex, 'Aadhaar number must be exactly 12 digits')
    .required('Aadhaar number is required'),

  pan: Yup.mixed().required('Company PAN file is required'),

  aadhar: Yup.mixed().required('Aadhaar file is required'),

  jointHolder: Yup.mixed().required('Joint Holder document is required'),
});

export const proprietorshipSchema = Yup.object().shape({
  spocName: Yup.string()
    .matches(
      noLeadingSpaceSingleInternalSpace,
      'Only alphanumeric, no leading space, and at most one internal space allowed'
    )
    .required('SPOC Name is required'),

  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),

  phoneNumber: Yup.string()
    .matches(
      /^[6-9]\d{9}$/,
      'Phone number must start with 6-9 and be 10 digits'
    )
    .required('Phone number is required'),

  companyName: Yup.string()
    .matches(
      noLeadingSpaceSingleInternalSpace,
      'Only one space allowed between words and no special characters'
    )
    .required('Company name is required'),

  address: Yup.string()
    // .matches(nameWithSingleSpace, 'Only one space allowed between words and no special characters')
    .required('Address is required'),

  city: Yup.string().required('City is required'),

  state: Yup.string().required('State is required'),

  zipCode: Yup.string()
    .matches(/^\d{6}$/, 'ZIP Code must be exactly 6 digits')
    .required('ZIP Code is required'),

  companyPanNumber: Yup.string()
    .matches(panRegex, 'Invalid PAN format (e.g., ABCDE1234F)')
    .required('Company PAN is required'),

  gstNumber: Yup.string()
    .matches(gstRegex, 'Invalid GST format (e.g., 22ABCDE1234F1Z5)')
    .required('GST number is required'),

  aadharNumber: Yup.string()
    .matches(aadhaarRegex, 'Aadhaar number must be exactly 12 digits')
    .required('Aadhaar number is required'),

  pan: Yup.mixed().required('Company PAN file is required'),
  gst: Yup.mixed().required('GST file is required'),
  aadhar: Yup.mixed().required('Aadhaar file is required'),
});

export const pvtSchema = Yup.object().shape({
  spocName: Yup.string()
    .matches(
      noLeadingSpaceSingleInternalSpace,
      'Only alphanumeric, no leading space, and at most one internal space allowed'
    )
    .required('SPOC Name is required'),

  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),

  phoneNumber: Yup.string()
    .matches(
      /^[6-9]\d{9}$/,
      'Phone number must start with 6-9 and be 10 digits'
    )
    .required('Phone number is required'),

  companyName: Yup.string()
    .matches(
      noLeadingSpaceSingleInternalSpace,
      'Only one space allowed between words and no special characters'
    )
    .required('Company name is required'),

  address: Yup.string()
    // .matches(nameWithSingleSpace, 'Only one space allowed between words and no special characters')
    .required('Address is required'),

  city: Yup.string().required('City is required'),

  state: Yup.string().required('State is required'),

  zipCode: Yup.string()
    .matches(/^\d{6}$/, 'ZIP Code must be exactly 6 digits')
    .required('ZIP Code is required'),

  companyPanNumber: Yup.string()
    .matches(panRegex, 'Invalid PAN format (e.g., ABCDE1234F)')
    .required('Company PAN is required'),

  gstNumber: Yup.string()
    .matches(gstRegex, 'Invalid GST format (e.g., 22ABCDE1234F1Z5)')
    .required('GST number is required'),

  aadharNumber: Yup.string()
    .matches(aadhaarRegex, 'Aadhaar number must be exactly 12 digits')
    .required('Aadhaar number is required'),

  pan: Yup.mixed().required('Company PAN file is required'),
  gst: Yup.mixed().required('GST file is required'),
  aadhar: Yup.mixed().required('Aadhaar file is required'),
});

export const bankDetailsSchema = Yup.object().shape({
  bankaccountnumber: Yup.string()
    .required('Bank account number is required')
    .matches(
      /^\d{9,18}$/,
      'Bank account number must be between 9 and 18 digits'
    ),
  rebankaccountnumber: Yup.string()
    .required('Re-enter bank account number is required')
    .oneOf([Yup.ref('bankaccountnumber')], 'Account numbers must match'),
  // rebankaccountnumber: Yup.string()
  //   .required('Re-enter bank account number is required')
  //   .matches(
  //     /^\d{9,18}$/,
  //     'Re-entered bank account number must be between 9 and 18 digits'
  //   ),
  ifsc: Yup.string()
    .required('IFSC code is required')
    .matches(/^[A-Za-z]{4}\d{7}$/, 'Invalid IFSC code'),
  bankname: Yup.string()
    .required('Bank name is required')
    .min(3, 'Bank name must be at least 3 characters'),
  branch: Yup.string()
    .required('Branch is required')
    .min(3, 'Branch must be at least 3 characters'),
  accounttype: Yup.string()
    .required('Account type is required')
    .oneOf(
      ['savings', 'current'],
      'Account type must be either savings or current'
    ),
  accountholdername: Yup.string()
    .required('Account holder name is required')
    .min(3, 'Account holder name must be at least 3 characters'),
});
