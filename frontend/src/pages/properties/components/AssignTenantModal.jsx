import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { RxCross1 } from 'react-icons/rx';
import toast from 'react-hot-toast';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import { assignTenant, fetchTenantList } from '../../../redux/apis/properties';
import { fetchTenencyTypes } from '../../../redux/apis/global';
import { FaUpload } from 'react-icons/fa';

const AssignTenantModal = ({
  closeModal,
  recallApi,
  setRecallApi,
  categoryId,
  unitId,
}) => {
  const dispatch = useDispatch();
  const [tenantOptions, setTenantOptions] = useState([]);
  const [tenancyTypeOptions, setTenancyTypeOptions] = useState([]);
  const [agreementDocumentName, setAgreementDocumentName] = useState('');

  const initialValues = {
    tenantId: '',
    type: '',
    advancePaymentName: '',
    advancePaymentAmount: '',
    categoryId,
    unitId,
    allotmentDate: '',
    tenancyStartDate: '',
    agreementEndDate: '',
    pendingPaymentName: '',
    pendingPaymentAmount: '',
    agreementDocument: null,
    pentaltyApplied: false,
  };

  const validationSchema = Yup.object({
    tenantId: Yup.string()
      .required('Tenant is required')
      .min(1, 'Tenant ID must be at least 1 character'),
    type: Yup.string()
      .required('Tenancy Type is required')
      .min(1, 'Tenancy Type must be at least 1 character'),
    advancePaymentName: Yup.string()
      .required('Advance Type is required')
      .min(1, 'Advance Type must be at least 1 characters')
      .max(50, 'Advance Type must be less than 50 characters'),
    advancePaymentAmount: Yup.number()
      .required('Advance Payment Amount is required')
      .min(0, 'Amount must be greater than or equal to 0')
      .max(1000000, 'Amount must be less than or equal to 1,000,000'),
    allotmentDate: Yup.date()
      .required('Allotment Date is required')
      .max(new Date(), 'Allotment Date cannot be in the future'),
    tenancyStartDate: Yup.date()
      .required('Tenancy Start Date is required')
      .min(
        Yup.ref('allotmentDate'),
        'Tenancy Start Date must be after Allotment Date'
      ),
    agreementEndDate: Yup.date()
      .required('Agreement End Date is required')
      .min(
        Yup.ref('tenancyStartDate'),
        'Agreement End Date must be after Tenancy Start Date'
      ),
    pendingPaymentName: Yup.string()
      .required('Pending Payment Name is required')
      .min(1, 'Name must be at least 1 character')
      .max(100, 'Name must be less than 100 characters'),
    pendingPaymentAmount: Yup.number()
      .required('Pending Payment Amount is required')
      .min(0, 'Amount must be greater than or equal to 0')
      .max(1000000, 'Amount must be less than or equal to 1,000,000'),
    agreementDocument: Yup.mixed()
      .required('Agreement Document is required')
      .test(
        'fileType',
        'Only PDF files are allowed',
        (value) => value && value.type === 'application/pdf'
      )
      .test(
        'fileSize',
        'File size must be less than 5MB',
        (value) => value && value.size <= 5 * 1024 * 1024
      ),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    const payload = { ...values };

    dispatch(assignTenant(payload)).then((res) => {
      if (res.success) {
        toast.success(res.message);
        setRecallApi(!recallApi);
        closeModal();
      } else {
        toast.error(res.message);
      }
      setSubmitting(false);
    });
  };

  const getTenants = () => {
    dispatch(fetchTenantList({ limit: 10000 })).then((res) => {
      if (res.success) {
        const options = res?.data?.tenantList?.map((tenant) => ({
          label: `${tenant?.spocName} - ${tenant?.email} - ${tenant?.phoneNumber} - ${tenant?.companyName}`,
          value: tenant?._id,
        }));
        setTenantOptions(
          options || [{ value: '', label: 'No tenants available' }]
        );
      } else {
        setTenantOptions([{ value: '0', label: 'No tenants available' }]);
      }
    });
  };

  const getTenancyTypes = () => {
    dispatch(fetchTenencyTypes()).then((res) => {
      if (res.success) {
        const options = res?.data.map((type) => ({
          value: type._id,
          label: type.name,
        }));
        setTenancyTypeOptions(
          options || [{ value: '', label: 'No tenancy types available' }]
        );
      } else {
        setTenancyTypeOptions([
          { value: '', label: 'No tenancy types available' },
        ]);
      }
    });
  };

  useEffect(() => {
    getTenants();
    getTenancyTypes();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="m-4 bg-white p-6 rounded-lg shadow-lg w-[500px] relative">
        <button
          className="text-gray-500 hover:text-gray-800 absolute top-3 right-3 text-lg"
          onClick={closeModal}
        >
          <RxCross1 />
        </button>
        <h3 className="mt-4 mb-6 text-gray-600 font-semibold text-center uppercase">
          Assign Tenant
        </h3>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form>
              <div className="overflow-y-auto custom-scrollbar max-h-[60vh] py-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tenant
                    </label>
                    <Select
                      options={tenantOptions}
                      placeholder="Select Tenant"
                      isSearchable
                      onChange={(option) =>
                        setFieldValue('tenantId', option.value)
                      }
                    />
                    <ErrorMessage
                      name="tenantId"
                      component="div"
                      className="text-red-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tenancy Type
                    </label>
                    <Select
                      //   options={tenancyTypeOptions}
                      options={[
                        { value: '0', label: 'Rent' },
                        { value: '1', label: 'Lease' },
                      ]}
                      placeholder="Select Tenancy Type"
                      isSearchable
                      onChange={(option) => setFieldValue('type', option.value)}
                    />
                    <ErrorMessage
                      name="type"
                      component="div"
                      className="text-red-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Advance Payment Name
                    </label>
                    <Field
                      name="advancePaymentName"
                      className="custom-input py-2"
                      placeholder="Enter advance type"
                      onInput={(e) => {
                        e.target.value = e.target.value
                          .replace(/\s+/g, ' ')
                          .trimStart();
                      }}
                    />
                    <ErrorMessage
                      name="advancePaymentName"
                      component="div"
                      className="text-red-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Advance Payment Amount
                    </label>
                    <Field
                      name="advancePaymentAmount"
                      className="custom-input py-2"
                      placeholder="Enter payment amount"
                      onInput={(e) => {
                        let value = e.target.value;
                        // Allow only numbers and a single decimal point
                        value = value.replace(/[^0-9.]/g, '');
                        // Prevent multiple decimal points
                        const parts = value.split('.');
                        if (parts.length > 2) {
                          value = parts[0] + '.' + parts[1];
                        }
                        // Restrict to two decimal places
                        if (parts[1]?.length > 2) {
                          value = parts[0] + '.' + parts[1].slice(0, 2);
                        }
                        e.target.value = value;
                      }}
                    />
                    <ErrorMessage
                      name="advancePaymentAmount"
                      component="div"
                      className="text-red-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Allotment Date
                    </label>
                    <Field
                      name="allotmentDate"
                      type="date"
                      className="custom-input py-2"
                      max={new Date().toISOString().split('T')[0]}
                    />
                    <ErrorMessage
                      name="allotmentDate"
                      component="div"
                      className="text-red-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tenancy/Possession Start Date
                    </label>
                    <Field
                      name="tenancyStartDate"
                      type="date"
                      className="custom-input py-2"
                    />
                    <ErrorMessage
                      name="tenancyStartDate"
                      component="div"
                      className="text-red-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Agreement End Date
                    </label>
                    <Field
                      name="agreementEndDate"
                      type="date"
                      className="custom-input py-2"
                    />
                    <ErrorMessage
                      name="agreementEndDate"
                      component="div"
                      className="text-red-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Penalty Applied?
                    </label>
                    <Select
                      options={[
                        { value: true, label: 'True' },
                        { value: false, label: 'False' },
                      ]}
                      placeholder="Penalty Applied?"
                      isSearchable
                      onChange={(option) =>
                        setFieldValue('pentaltyApplied', option.value)
                      }
                    />
                    <ErrorMessage
                      name="pentaltyApplied"
                      component="div"
                      className="text-red-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Pending Payment Name
                    </label>
                    <Field
                      name="pendingPaymentName"
                      className="custom-input py-2"
                      placeholder="Enter pending payment name"
                      onInput={(e) => {
                        e.target.value = e.target.value
                          .replace(/\s+/g, ' ')
                          .trimStart();
                      }}
                    />
                    <ErrorMessage
                      name="pendingPaymentName"
                      component="div"
                      className="text-red-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Pending Payment Amount
                    </label>
                    <Field
                      name="pendingPaymentAmount"
                      className="custom-input py-2"
                      placeholder="Enter pending payment amount"
                      onInput={(e) => {
                        let value = e.target.value;
                        // Allow only numbers and a single decimal point
                        value = value.replace(/[^0-9.]/g, '');
                        // Prevent multiple decimal points
                        const parts = value.split('.');
                        if (parts.length > 2) {
                          value = parts[0] + '.' + parts[1];
                        }
                        // Restrict to two decimal places
                        if (parts[1]?.length > 2) {
                          value = parts[0] + '.' + parts[1].slice(0, 2);
                        }
                        e.target.value = value;
                      }}
                    />
                    <ErrorMessage
                      name="pendingPaymentAmount"
                      component="div"
                      className="text-red-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-left text-sm font-medium text-gray-700">
                      Upload Agreement Document
                    </label>
                    <div className="flex items-center border border-secondary rounded-lg py-1 px-5 focus-within:ring-2 focus-within:ring-primary">
                      <FaUpload className="text-gray-500 text-lg mr-3 flex-shrink-0" />
                      <label
                        className="text-sm text-gray-700 cursor-pointer flex-grow"
                        htmlFor="agreementDocument"
                      >
                        <span className="max-h-20 overflow-auto text-ellipsis break-all block custom-scrollbar py-2">
                          {agreementDocumentName || 'Choose Document'}
                        </span>
                      </label>
                      <input
                        type="file"
                        id="agreementDocument"
                        name="agreementDocument"
                        accept="application/pdf"
                        className="hidden"
                        onChange={(event) => {
                          const file = event.currentTarget.files[0];
                          setAgreementDocumentName(file ? file.name : '');
                          setFieldValue('agreementDocument', file);
                        }}
                      />
                    </div>
                    <ErrorMessage
                      name="agreementDocument"
                      component="div"
                      className="text-xs text-red-500 text-left mt-1"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-5 justify-center w-full pt-2">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 w-1/4"
                  onClick={closeModal}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-1/4"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Assigning...' : 'Assign'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AssignTenantModal;
