import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { RxCross1 } from 'react-icons/rx';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import CONSTANTS from '../../../constants.json';
import { addCategory, updateCategory } from '../../../redux/apis/properties';
import {
  fetchAdditionalChargesTypes,
  fetchMeasuringUnitTypes,
  fetchOneTimeChargesTypes,
  fetchPenaltyInterestTypes,
  fetchPenaltyTypes,
  fetchRentalTypes,
  fetchRentFrequencies,
  fetchRentGenerationTypes,
  fetchRentRevisionTypes,
} from '../../../redux/apis/global';
import { fetchObjects } from '../../../redux/apis/object';

const AddPropertyModal = ({
  categoryId = undefined,
  closeModal,
  setRecallApi,
  recallApi,
}) => {
  const [measuringUnitTypes, setMeasuringUnitTypes] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [rentTypes, setRentTypes] = useState([]);
  const [rentFrequencyTypes, setRentFrequencyTypes] = useState([]);
  const [rentGenerationTypes, setRentGenerationTypes] = useState([]);
  const [rentRevisionTypes, setRentRevisionTypes] = useState([]);
  const [additionalChargesTypes, seAdditionalChargesTypes] = useState([]);
  const [oneTimeChargesTypes, setOneTimeChargesTypes] = useState([]);
  const [penaltyTypes, setPenaltyTypes] = useState([]);
  const [penaltyInterestTypes, setPenaltyInterestTypes] = useState([]);
  const [selectedAdditionalCharges, setSelectedAdditionalCharges] = useState(
    []
  );
  const [selectedOneTimeCharges, setSelectedOneTimeCharges] = useState([]);

  const [initialValues, setInitialValues] = useState({
    category: {
      name: '',
      measuringUnitId: '',
      propertyTypeId: '',
      additionalCharges: selectedAdditionalCharges?.map((charge) => ({
        additionalChargeName: charge.label,
        hsnCode: charge.hsnCode,
        commonRate: charge.type === '1' ? '' : undefined,
        carpetRate: charge.type === '1' ? '' : undefined,
        additionalChargeAmount: '',
      })),
      oneTimeCharges: selectedOneTimeCharges.map((charge) => ({
        oneTimeChargeName: charge.label,
        commonRate: charge.type === '1' ? '' : undefined,
        carpetRate: charge.type === '1' ? '' : undefined,
        oneTimeChargeAmount: '',
        isOneTimeChargeRefundable: charge.refund === '1' ? false : true,
      })),
      status: '0',
    },
    rent: {
      rentalTypeId: '',
      rentFrequencyId: '',
      rentGenerationTypeId: '',
      rentRevisionId: '',
      monthName: '',
      perdioticTime: '',
      rentStartDate: '',
      rentEndDate: '',
      commonRate: '',
      carpetRate: '',
      totalRentAmount: '',
      status: '0',
    },
    penalty: {
      penaltyTypeId: '',
      penaltyOccurance: '',
      penaltyInterestTypeId: undefined,
      interestRate: undefined,
      penaltyAmount: undefined,
    },
  });

  const validationSchema = Yup.object({
    category: Yup.object({
      name: Yup.string()
        .min(3, 'Must be at least 3 characters')
        .max(100, 'Cannot exceed 100 characters')
        .required('Category Name is required'),
      measuringUnitId: Yup.string().required('Measuring Unit is required'),
      propertyTypeId: Yup.string().required('Property Type is required'),
      additionalCharges: Yup.array().of(
        Yup.object().shape({
          additionalChargeName: Yup.string().required(
            'Charge Name is required'
          ),
          additionalChargeAmount: Yup.number()
            .transform((val, orig) => (orig === '' ? undefined : Number(orig)))
            .optional(),
          carpetRate: Yup.number()
            .transform((val, orig) => (orig === '' ? undefined : Number(orig)))
            .optional(),
          commonRate: Yup.number()
            .transform((val, orig) => (orig === '' ? undefined : Number(orig)))
            .optional(),
          otherChargeRate: Yup.number()
            .transform((val, orig) => (orig === '' ? undefined : Number(orig)))
            .optional(),
        })
      ),
      oneTimeCharges: Yup.array().of(
        Yup.object().shape({
          oneTimeChargeName: Yup.string().required('Charge Name is required'),
          oneTimeChargeAmount: Yup.number().required(
            'Charge Amount is required'
          ),
        })
      ),
    }),
    rent: Yup.object({
      rentalTypeId: Yup.string().required('Rental Type is required'),
      rentFrequencyId: Yup.string().required('Rent Frequency is required'),
      rentGenerationTypeId: Yup.string().required(
        'Rent Generation Type is required'
      ),
      rentRevisionId: Yup.string().required('Rent Revision is required'),
      monthName: Yup.number(),
      perdioticTime: Yup.number(),
      rentStartDate: Yup.number().required('Rent Generation Date is required'),
      rentEndDate: Yup.number().required('Rent Due Date is required'),
      commonRate: Yup.number(),
      carpetRate: Yup.number(),
      totalRentAmount: Yup.number().optional('Total Rent Amount is required'),
    }),
    penalty: Yup.object({
      penaltyTypeId: Yup.string().optional('Penalty Type is required'),
      penaltyOccurance: Yup.string().required('Penalty Occurrence is required'),
      penaltyInterestTypeId: Yup.string(),
      // interestRate: Yup.number().positive(),
      // penaltyAmount: Yup.number().positive(),
    }),
  });

  const dispatch = useDispatch();

  const handleSubmit = (values, { setSubmitting }) => {
    if (values.category.additionalCharges.length === 0) {
      toast.error('Please add at least one additional charge');
      setSubmitting(false);
      return;
    }

    if (values.category.oneTimeCharges.length === 0) {
      toast.error('Please add at least one one-time charge');
      setSubmitting(false);
      return;
    }

    // Clone to avoid mutation
    const transformedValues = JSON.parse(JSON.stringify(values));

    // Clean penalty fields
    const selectedPenaltyType = penaltyTypes
      .find((type) => type.value === transformedValues.penalty.penaltyTypeId)
      ?.label.toLowerCase();

    if (selectedPenaltyType === 'flat') {
      delete transformedValues.penalty.penaltyInterestTypeId;
      delete transformedValues.penalty.interestRate;
    }

    // Remove totalRentAmount if rent type is area based
    const selectedRentType = rentTypes
      .find((type) => type.value === transformedValues.rent.rentalTypeId)
      ?.label.toLowerCase();

    if (selectedRentType === 'area based') {
      delete transformedValues.rent.totalRentAmount;
    }

    const cleanedAdditionalCharges = values.category.additionalCharges.map(
      (charge) => {
        const cleaned = {
          additionalChargeName: charge.additionalChargeName,
          hsnCode: charge.hsnCode || '',
        };

        if (charge.type === '0') {
          cleaned.additionalChargeAmount = charge.additionalChargeAmount;
        } else if (charge.type === '1' && charge.areaType === '1') {
          cleaned.otherChargeRate = charge.otherChargeRate;
        } else if (charge.type === '1' && charge.areaType !== '1') {
          cleaned.carpetRate = charge.carpetRate;
          cleaned.commonRate = charge.commonRate;
        }

        return cleaned;
      }
    );

    // 🔧 Final payload
    const payload = {
      ...values,
      category: {
        ...values.category,
        additionalCharges: cleanedAdditionalCharges,
        oneTimeCharges: values.category.oneTimeCharges.map(
          ({ type, ...rest }) => rest
        ),
      },
    };

    if (categoryId) payload.categoryId = categoryId;

    console.log('payload', payload); // ✅ You can check if hsnCode is included here

    const action = categoryId ? updateCategory : addCategory;

    dispatch(action(payload)).then((res) => {
      if (res.success) {
        toast.success(res.message);
        setRecallApi((prev) => !prev);
        closeModal();
      } else {
        toast.error(res.message);
      }
      setSubmitting(false);
    });
  };

  const getMeasuringUnitTypes = () => {
    dispatch(fetchMeasuringUnitTypes()).then((res) => {
      if (res.success) {
        const filteredData = res.data
          .filter((item) => item.status === '0')
          .map((item) => ({
            value: item._id,
            label: item.name,
          }));

        setMeasuringUnitTypes(filteredData);
      }
    });
  };
  const getPropertyTypes = () => {
    dispatch(
      fetchObjects({
        type: 'property-type',
        limit: 100,
        page: 1,
        sortBy: 'createdAt',
        sortOrder: '-1',
      })
    ).then((res) => {
      if (res.success) {
        const filteredData = res.data.propertyTypes
          .filter((item) => item.status === '0')
          .map((item) => ({
            value: item._id,
            label: item.propertyName,
          }));

        setPropertyTypes(filteredData);
      }
    });
  };
  const getAdditionalChargesTypes = () => {
    dispatch(fetchAdditionalChargesTypes()).then((res) => {
      if (res.success) {
        console.log(res.data.additionalCharges);

        const filteredData = res.data.additionalCharges
          .filter((item) => item.status === '0')
          .map((item) => ({
            value: item._id,
            label: item.chargeName,
            type: item.chargeType,
            areaType: item.areaType,
            hsnCode: item.hsnCode || '', // ✅ make sure hsnCode is passed even if missing
          }));

        seAdditionalChargesTypes(filteredData);
      }
    });
  };
  const getOneTimeChargesTypes = () => {
    dispatch(fetchOneTimeChargesTypes()).then((res) => {
      if (res.success) {
        const filteredData = res.data.oneTimeCharges
          .filter((item) => item.status === '0')
          .map((item) => ({
            value: item._id,
            label: item.chargeName,
            type: item.chargeType,
            refund: item.refundType,
          }));

        setOneTimeChargesTypes(filteredData);
      }
    });
  };
  const getRentTypes = () => {
    dispatch(fetchRentalTypes()).then((res) => {
      if (res.success) {
        const filteredData = res.data
          .filter((item) => item.status === '0')
          .map((item) => ({
            value: item._id,
            label: item.name,
          }));

        setRentTypes(filteredData);
      }
    });
  };
  const getRentFrequencyTypes = () => {
    dispatch(fetchRentFrequencies()).then((res) => {
      if (res.success) {
        const filteredData = res.data
          .filter((item) => item.status === '0')
          .map((item) => ({
            value: item._id,
            label: item.name,
          }));

        setRentFrequencyTypes(filteredData);
      }
    });
  };
  const getRentGenerationTypes = () => {
    dispatch(fetchRentGenerationTypes()).then((res) => {
      if (res.success) {
        const filteredData = res.data
          .filter((item) => item.status === '0')
          .map((item) => ({
            value: item._id,
            label: item.name,
          }));

        setRentGenerationTypes(filteredData);
      }
    });
  };
  const getRentRevisionTypes = () => {
    dispatch(fetchRentRevisionTypes()).then((res) => {
      if (res.success) {
        const filteredData = res.data
          .filter((item) => item.status === '0')
          .map((item) => ({
            value: item._id,
            label: item.name,
          }));

        setRentRevisionTypes(filteredData);
      }
    });
  };
  const getPenaltyTypes = () => {
    dispatch(fetchPenaltyTypes()).then((res) => {
      if (res.success) {
        const filteredData = res.data
          .filter((item) => item.status === '0')
          .map((item) => ({
            value: item._id,
            label: item.name,
          }));

        setPenaltyTypes(filteredData);
      }
    });
  };
  const getPenaltyInterestTypes = () => {
    dispatch(fetchPenaltyInterestTypes()).then((res) => {
      if (res.success) {
        const filteredData = res.data
          .filter((item) => item.status === '0')
          .map((item) => ({
            value: item._id,
            label: item.name,
          }));

        setPenaltyInterestTypes(filteredData);
      }
    });
  };

  const handleAdditionalChargesChange = (selectedOptions, setFieldValue) => {
    setSelectedAdditionalCharges(selectedOptions);

    const mappedCharges = selectedOptions.map((charge) => {
      const base = {
        additionalChargeName: charge.label,
        hsnCode: charge.hsnCode || '',
        type: charge.type,
        areaType: charge.areaType,
      };

      if (charge.type === '0') {
        return {
          ...base,
          additionalChargeAmount: '',
        };
      }

      if (charge.type === '1' && charge.areaType === '1') {
        return {
          ...base,
          otherChargeRate: '',
        };
      }

      if (charge.type === '1' && charge.areaType !== '1') {
        return {
          ...base,
          carpetRate: '',
          commonRate: '',
        };
      }

      return base;
    });

    setFieldValue('category.additionalCharges', mappedCharges);
  };

  const handleOneTimeChargesChange = (selectedOptions, setFieldValue) => {
    setSelectedOneTimeCharges(selectedOptions);
    setFieldValue(
      'category.oneTimeCharges',
      selectedOptions.map((charge) => ({
        oneTimeChargeName: charge.label,
        commonRate: charge.type === '1' ? '' : undefined,
        carpetRate: charge.type === '1' ? '' : undefined,
        oneTimeChargeAmount: '',
        isOneTimeChargeRefundable: charge.refund === '1' ? false : true,
        type: charge.type,
      }))
    );
  };

  useEffect(() => {
    getMeasuringUnitTypes();
    getPropertyTypes();
    getAdditionalChargesTypes();
    getOneTimeChargesTypes();
    getRentTypes();
    getRentFrequencyTypes();
    getRentGenerationTypes();
    getRentRevisionTypes();
    getPenaltyTypes();
    getPenaltyInterestTypes();
  }, []);

  // console.log(additionalChargesTypes);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="m-4 bg-white p-6 rounded-lg shadow-lg w-[300px] sm:w-[400px] md:w-[500px] lg:w-[850px] relative">
        <button
          className="text-gray-500 hover:text-gray-800 absolute top-3 right-3 text-lg"
          onClick={closeModal}
        >
          <RxCross1 />
        </button>
        <h3 className="mt-4 mb-6 text-gray-600 font-semibold text-center uppercase">
          {categoryId ? 'EDIT PROPERTY CATEGORY' : 'ADD PROPERTY CATEGORY'}
        </h3>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {({ values, isSubmitting, setFieldValue }) => {
            useEffect(() => {
              setFieldValue(
                'category.additionalCharges',
                values?.category?.additionalCharges?.map((charge) => {
                  if (charge.type === '1') {
                    return {
                      ...charge,
                      additionalChargeAmount: (
                        parseFloat(
                          Number(charge?.commonRate || 0) *
                            (Number(values?.category?.commonArea) || 0)
                        ) +
                        parseFloat(
                          Number(charge?.carpetRate || 0) *
                            (Number(values?.category?.carpetArea) || 0)
                        )
                      ).toFixed(2),
                    };
                  }
                  return charge;
                })
              );
              setFieldValue(
                'category.oneTimeCharges',
                values?.category?.oneTimeCharges?.map((charge) => {
                  if (charge.type === '1') {
                    return {
                      ...charge,
                      oneTimeChargeAmount: (
                        parseFloat(
                          Number(charge?.commonRate || 0) *
                            (Number(values?.category?.commonArea) || 0)
                        ) +
                        parseFloat(
                          Number(charge?.carpetRate || 0) *
                            (Number(values?.category?.carpetArea) || 0)
                        )
                      ).toFixed(2),
                    };
                  }
                  return charge;
                })
              );
              if (
                rentTypes
                  .find((type) => type.value === values.rent.rentalTypeId)
                  ?.label.toLowerCase() === 'area based'
              ) {
                setFieldValue(
                  'rent.totalRentAmount',
                  (
                    parseFloat(
                      Number(values?.rent?.commonRate || 0) *
                        (Number(values?.category?.commonArea) || 0)
                    ) +
                    parseFloat(
                      Number(values?.rent?.carpetRate || 0) *
                        (Number(values?.category?.carpetArea) || 0)
                    )
                  ).toFixed(2)
                );
              }
            }, [values.category.carpetArea, values.category.commonArea]);
            console.log('selectedAdditionalCharges', selectedAdditionalCharges);

            return (
              <Form>
                <div className="overflow-y-auto custom-scrollbar max-h-[60vh] py-2">
                  <div className="font-semibold text-blue-500 text-xs pb-1 uppercase">
                    Category Details:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    {/* Category Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        <span style={{ color: 'red' }}>* </span>Category Name
                      </label>
                      <Field
                        name="category.name"
                        className="custom-input"
                        placeholder="Enter category name"
                        onInput={(e) => {
                          e.target.value = e.target.value
                            .replace(/\s+/g, ' ')
                            .trimStart();
                        }}
                      />
                      <ErrorMessage
                        name="category.name"
                        component="div"
                        className="text-red-500 text-xs"
                      />
                    </div>

                    {/* Property Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        <span style={{ color: 'red' }}>*</span> Property Type
                      </label>
                      <Field
                        as="select"
                        name="category.propertyTypeId"
                        className="custom-input"
                      >
                        <option
                          value=""
                          label="Select property type"
                          disabled
                        />
                        {propertyTypes.map((el) => (
                          <option
                            key={el.value}
                            value={el.value}
                            label={el.label}
                          />
                        ))}
                      </Field>
                      <ErrorMessage
                        name="category.propertyTypeId"
                        component="div"
                        className="text-red-500 text-xs"
                      />
                    </div>

                    {/* Measuring Unit */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        <span style={{ color: 'red' }}>*</span> Measuring Unit
                      </label>
                      <Field
                        as="select"
                        name="category.measuringUnitId"
                        className="custom-input"
                      >
                        <option
                          value=""
                          label="Select measuring unit"
                          disabled
                        />
                        {measuringUnitTypes.map((el) => (
                          <option
                            key={el.value}
                            value={el.value}
                            label={el.label}
                          />
                        ))}
                      </Field>
                      <ErrorMessage
                        name="category.measuringUnitId"
                        component="div"
                        className="text-red-500 text-xs"
                      />
                    </div>
                  </div>

                  {/* Additional Charges */}
                  <div className="font-semibold text-blue-500 text-xs pb-1 uppercase">
                    Additional Charges Details:
                  </div>

                  {/* Multi-Select Dropdown for Additional Charges */}
                  <div className="w-64 pb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Select Additional Charges
                    </label>
                    <Select
                      isMulti
                      options={additionalChargesTypes.map((charge) => ({
                        value: charge.value,
                        label: charge.label,
                        type: charge.type,
                        areaType: charge.areaType,
                        hsnCode: charge.hsnCode,
                      }))}
                      value={selectedAdditionalCharges}
                      onChange={(selectedOptions) =>
                        handleAdditionalChargesChange(
                          selectedOptions,
                          setFieldValue
                        )
                      }
                    />
                  </div>

                  <div>
                    {selectedAdditionalCharges?.map((charge, index) => (
                      <div
                        key={charge.value}
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 mb-3"
                      >
                        <div className="w-full border-b border-blue-300 my-1"></div>
                        <div></div>

                        {/* Charge Type Info */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            <span style={{ color: 'red' }}>* </span>
                            Charge Type ({index + 1}) -{' '}
                            <span className="text-violet-500 font-normal">
                              {charge.type === '1' ? 'Area Based' : 'Fixed'}
                            </span>
                          </label>
                          <Field
                            name={`category.additionalCharges[${index}].additionalChargeName`}
                            className="custom-input py-2"
                            value={charge.label}
                            disabled
                          />
                          <ErrorMessage
                            name={`category.additionalCharges[${index}].additionalChargeName`}
                            component="div"
                            className="text-red-500 text-xs"
                          />
                        </div>

                        {/* Fixed Amount Field */}
                        {charge.type === '0' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              <span style={{ color: 'red' }}>* </span>
                              Total Charge Amount (₹)
                            </label>
                            <Field
                              name={`category.additionalCharges[${index}].additionalChargeAmount`}
                              className="custom-input py-2"
                              placeholder="Enter amount"
                              value={
                                values?.category?.additionalCharges[index]
                                  ?.additionalChargeAmount || ''
                              }
                              onInput={(e) => {
                                let value = e.target.value.replace(
                                  /[^0-9.]/g,
                                  ''
                                );
                                const parts = value.split('.');
                                if (parts.length > 2)
                                  value = parts[0] + '.' + parts[1];
                                if (parts[1]?.length > 2)
                                  value = parts[0] + '.' + parts[1].slice(0, 2);
                                e.target.value = value;
                              }}
                            />
                            <ErrorMessage
                              name={`category.additionalCharges[${index}].additionalChargeAmount`}
                              component="div"
                              className="text-red-500 text-xs"
                            />
                          </div>
                        )}

                        {/* Area Based - Other Area Type */}
                        {charge.type === '1' && charge.areaType === '1' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              <span style={{ color: 'red' }}>* </span>
                              Other Charge Rate (₹)
                            </label>
                            <Field
                              name={`category.additionalCharges[${index}].otherChargeRate`}
                              className="custom-input py-2"
                              placeholder="Enter rate"
                              onChange={(e) => {
                                setFieldValue(
                                  `category.additionalCharges[${index}].otherChargeRate`,
                                  e.target.value
                                );
                                setFieldValue(
                                  `category.additionalCharges[${index}].additionalChargeAmount`,
                                  e.target.value || 0
                                );
                              }}
                              onInput={(e) => {
                                let value = e.target.value.replace(
                                  /[^0-9.]/g,
                                  ''
                                );
                                const parts = value.split('.');
                                if (parts.length > 2)
                                  value = parts[0] + '.' + parts[1];
                                if (parts[1]?.length > 2)
                                  value = parts[0] + '.' + parts[1].slice(0, 2);
                                e.target.value = value;
                              }}
                            />
                            {/* <ErrorMessage
                              name={`category.additionalCharges[${index}].otherChargeRate`}
                              component="div"
                              className="text-red-500 text-xs"
                            /> */}
                          </div>
                        )}

                        {/* Area Based - Carpet + Common Area Rate */}
                        {charge.type === '1' && charge.areaType !== '1' && (
                          <>
                            {/* Carpet Area Rate */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                <span style={{ color: 'red' }}>* </span>
                                Carpet Area Rate Per Unit (₹)
                              </label>
                              <Field
                                name={`category.additionalCharges[${index}].carpetRate`}
                                className="custom-input py-2"
                                placeholder="Enter rate"
                                onChange={(e) => {
                                  const carpet = Number(e.target.value || 0);
                                  const common = Number(
                                    values?.category?.additionalCharges[index]
                                      ?.commonRate || 0
                                  );
                                  const carpetArea = Number(
                                    values?.category?.carpetArea || 0
                                  );
                                  const commonArea = Number(
                                    values?.category?.commonArea || 0
                                  );

                                  setFieldValue(
                                    `category.additionalCharges[${index}].carpetRate`,
                                    e.target.value
                                  );
                                  setFieldValue(
                                    `category.additionalCharges[${index}].additionalChargeAmount`,
                                    (
                                      carpet * carpetArea +
                                      common * commonArea
                                    ).toFixed(2)
                                  );
                                }}
                                onInput={(e) => {
                                  let value = e.target.value.replace(
                                    /[^0-9.]/g,
                                    ''
                                  );
                                  const parts = value.split('.');
                                  if (parts.length > 2)
                                    value = parts[0] + '.' + parts[1];
                                  if (parts[1]?.length > 2)
                                    value =
                                      parts[0] + '.' + parts[1].slice(0, 2);
                                  e.target.value = value;
                                }}
                              />
                              <ErrorMessage
                                name={`category.additionalCharges[${index}].carpetRate`}
                                component="div"
                                className="text-red-500 text-xs"
                              />
                            </div>

                            {/* Common Area Rate */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                <span style={{ color: 'red' }}>* </span>
                                Common Area Rate Per Unit (₹)
                              </label>
                              <Field
                                name={`category.additionalCharges[${index}].commonRate`}
                                className="custom-input py-2"
                                placeholder="Enter rate"
                                onChange={(e) => {
                                  const common = Number(e.target.value || 0);
                                  const carpet = Number(
                                    values?.category?.additionalCharges[index]
                                      ?.carpetRate || 0
                                  );
                                  const carpetArea = Number(
                                    values?.category?.carpetArea || 0
                                  );
                                  const commonArea = Number(
                                    values?.category?.commonArea || 0
                                  );

                                  setFieldValue(
                                    `category.additionalCharges[${index}].commonRate`,
                                    e.target.value
                                  );
                                  setFieldValue(
                                    `category.additionalCharges[${index}].additionalChargeAmount`,
                                    (
                                      carpet * carpetArea +
                                      common * commonArea
                                    ).toFixed(2)
                                  );
                                }}
                                onInput={(e) => {
                                  let value = e.target.value.replace(
                                    /[^0-9.]/g,
                                    ''
                                  );
                                  const parts = value.split('.');
                                  if (parts.length > 2)
                                    value = parts[0] + '.' + parts[1];
                                  if (parts[1]?.length > 2)
                                    value =
                                      parts[0] + '.' + parts[1].slice(0, 2);
                                  e.target.value = value;
                                }}
                              />
                              <ErrorMessage
                                name={`category.additionalCharges[${index}].commonRate`}
                                component="div"
                                className="text-red-500 text-xs"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* One Time Charges */}
                  <div className="font-semibold text-blue-500 text-xs pb-1 uppercase pt-4">
                    One Time Charges Details:
                  </div>

                  {/* Multi-Select Dropdown for One Time Charges */}
                  <div className="w-64 pb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Select One Time Charges
                    </label>
                    <Select
                      isMulti
                      options={oneTimeChargesTypes.map((charge) => ({
                        value: charge.value,
                        label: charge.label,
                        type: charge.type,
                      }))}
                      value={selectedOneTimeCharges}
                      onChange={(selectedOptions) =>
                        handleOneTimeChargesChange(
                          selectedOptions,
                          setFieldValue
                        )
                      }
                    />
                  </div>

                  <div>
                    {selectedOneTimeCharges.map((charge, index) => (
                      <div
                        key={charge.value}
                        className={`grid grid-cols-1 sm:grid-cols-2 ${charge.type === '1' ? 'md:grid-cols-2' : 'md:grid-cols-2'} gap-4 mb-3`}
                      >
                        <div className="w-full border-b border-blue-300 my-1"></div>{' '}
                        <div></div>
                        {/* Charge Name */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            <span style={{ color: 'red' }}>* </span>
                            Charge Type ({index + 1}) -{' '}
                            {charge.refund === '1' ? (
                              <span className="text-yellow-400 text-xs uppercase font-normal">
                                Non-Refundable
                              </span>
                            ) : (
                              <span className="text-green-400 text-xs uppercase font-normal">
                                Refundable
                              </span>
                            )}
                          </label>
                          <Field
                            name={`category.oneTimeCharges[${index}].oneTimeChargeName`}
                            className="custom-input py-2"
                            placeholder={`Charge name`}
                            value={charge.label}
                            disabled
                          />
                          <ErrorMessage
                            name={`category.oneTimeCharges[${index}].oneTimeChargeName`}
                            component="div"
                            className="text-red-500 text-xs"
                          />
                        </div>
                        {/* One Time Charge Amount */}
                        {charge.type === '0' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              <span style={{ color: 'red' }}>* </span>
                              Total Charge Amount (₹) ({index + 1})
                            </label>

                            <Field
                              name={`category.oneTimeCharges[${index}].oneTimeChargeAmount`}
                              className="custom-input py-2"
                              placeholder="Enter amount"
                              type="text"
                              value={
                                values?.category?.oneTimeCharges[index]
                                  ?.oneTimeChargeAmount || ''
                              }
                              onChange={(e) => {
                                const sanitizedValue = e.target.value.replace(
                                  /[^0-9.]/g,
                                  ''
                                );
                                setFieldValue(
                                  `category.oneTimeCharges[${index}].oneTimeChargeAmount`,
                                  sanitizedValue
                                );
                              }}
                              onInput={(e) => {
                                let value = e.target.value.replace(
                                  /[^0-9.]/g,
                                  ''
                                );
                                const parts = value.split('.');
                                if (parts.length > 2) {
                                  value = parts[0] + '.' + parts[1];
                                }
                                if (parts[1]?.length > 2) {
                                  value = parts[0] + '.' + parts[1].slice(0, 2);
                                }
                                e.target.value = value;
                              }}
                            />

                            <ErrorMessage
                              name={`category.oneTimeCharges[${index}].oneTimeChargeAmount`}
                              component="div"
                              className="text-red-500 text-xs"
                            />
                          </div>
                        )}
                        {/* <div>
                          <label className="block text-sm font-medium text-gray-700">
                            <span style={{ color: 'red' }}>* </span>
                            Total Charge Amount (₹)
                            ({index + 1})
                          </label>
                          <Field
                            name={`category.oneTimeCharges[${index}].oneTimeChargeAmount`}
                            className="custom-input py-2"
                            placeholder={`Enter amount`}
                            type
                            value={
                              charge.type === '1'
                                ? (
                                    Number(
                                      values?.category?.oneTimeCharges[index]
                                        ?.carpetRate || 0
                                    ) *
                                      Number(
                                        values?.category?.carpetArea || 0
                                      ) +
                                    Number(
                                      values?.category?.oneTimeCharges[index]
                                        ?.commonRate || 0
                                    ) *
                                      Number(values?.category?.commonArea || 0)
                                  ).toFixed(2)
                                : values?.category?.oneTimeCharges[index]
                                    ?.oneTimeChargeAmount || ''
                            }
                            onChange={(e) => {
                              if (charge.type !== '1') {
                                const sanitizedValue = e.target.value.replace(
                                  /[^0-9.]/g,
                                  ''
                                ); 
                                setFieldValue(
                                  `category.oneTimeCharges[${index}].oneTimeChargeAmount`,
                                  sanitizedValue
                                );
                              }
                            }}
                            // disabled={charge.type === '1'}
                            onInput={(e) => {
                              let value = e.target.value;
                              value = value.replace(/[^0-9.]/g, '');
                              const parts = value.split('.');
                              if (parts.length > 2) {
                                value = parts[0] + '.' + parts[1];
                              }
                              if (parts[1]?.length > 2) {
                                value = parts[0] + '.' + parts[1].slice(0, 2);
                              }
                              e.target.value = value;
                            }}
                          />
                          <ErrorMessage
                            name={`category.oneTimeCharges[${index}].oneTimeChargeAmount`}
                            component="div"
                            className="text-red-500 text-xs"
                          />
                        </div> */}
                        {charge.type === '1' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              <span style={{ color: 'red' }}>* </span>
                              Common Area Rate Per Unit ({index + 1})
                            </label>
                            <Field
                              name={`category.oneTimeCharges[${index}].commonRate`}
                              className="custom-input py-2"
                              placeholder={`Enter rate per unit`}
                              onChange={(e) => {
                                setFieldValue(
                                  `category.oneTimeCharges[${index}].commonRate`,
                                  e.target.value
                                );
                                setFieldValue(
                                  `category.oneTimeCharges[${index}].oneTimeChargeAmount`,
                                  (
                                    parseFloat(
                                      Number(e.target.value || 0) *
                                        (Number(values?.category?.commonArea) ||
                                          0)
                                    ) +
                                    parseFloat(
                                      Number(
                                        values?.category?.oneTimeCharges[index]
                                          ?.carpetRate || 0
                                      ) *
                                        (Number(values?.category?.carpetArea) ||
                                          0)
                                    )
                                  ).toFixed(2)
                                );
                              }}
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
                              name={`category.oneTimeCharges[${index}].commonRate`}
                              component="div"
                              className="text-red-500 text-xs"
                            />
                          </div>
                        )}
                        {/* Common Area Charge Amount */}
                        {/* Carpet Area Charge Rate Per Unit (if type is "1") */}
                        {charge.type === '1' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              <span style={{ color: 'red' }}>* </span>
                              Carpet Area Rate Per Unit ({index + 1})
                            </label>
                            <Field
                              name={`category.oneTimeCharges[${index}].carpetRate`}
                              className="custom-input py-2"
                              placeholder={`Enter rate per unit`}
                              onChange={(e) => {
                                setFieldValue(
                                  `category.oneTimeCharges[${index}].carpetRate`,
                                  e.target.value
                                );
                                setFieldValue(
                                  `category.oneTimeCharges[${index}].oneTimeChargeAmount`,
                                  (
                                    parseFloat(
                                      Number(e.target.value || 0) *
                                        (Number(values?.category?.carpetArea) ||
                                          0)
                                    ) +
                                    parseFloat(
                                      Number(
                                        values?.category?.oneTimeCharges[index]
                                          ?.commonRate || 0
                                      ) *
                                        (Number(values?.category?.commonArea) ||
                                          0)
                                    )
                                  ).toFixed(2)
                                );
                              }}
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
                              name={`category.oneTimeCharges[${index}].carpetRate`}
                              component="div"
                              className="text-red-500 text-xs"
                            />
                          </div>
                        )}
                        {/* Carpet Area Charge Amount */}
                        {/* {charge.type === '1' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              <span style={{ color: 'red' }}>* </span>
                              Carpet Area Charge Amount (₹)
                              ({index + 1})
                            </label>
                            <Field
                              className="custom-input py-2"
                              value={(
                                Number(
                                  values?.category?.oneTimeCharges?.length > 0
                                    ? values?.category?.oneTimeCharges[index]
                                        ?.carpetRate || 0
                                    : 0
                                ) * Number(values?.category?.carpetArea || 0)
                              ).toFixed(2)}
                              disabled={true}
                            />
                          </div>
                        )} */}
                      </div>
                    ))}
                  </div>

                  {/* Rent Details */}
                  <div className="font-semibold text-blue-500 text-xs pb-1 uppercase pt-3">
                    Rent Details:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    {/* Rent Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        <span style={{ color: 'red' }}>*</span> Rent Type
                      </label>
                      <Field
                        as="select"
                        name="rent.rentalTypeId"
                        className="custom-input"
                        onChange={(e) => {
                          setFieldValue(`rent.rentalTypeId`, e.target.value);
                          if (
                            rentTypes
                              .find((type) => type.value === e.target.value)
                              ?.label.toLowerCase() === 'fixed'
                          ) {
                            setFieldValue('rent.commonRate', undefined);
                            setFieldValue('rent.carpetRate', undefined);
                            setFieldValue('rent.totalRentAmount', '');
                          }
                          if (
                            rentTypes
                              .find((type) => type.value === e.target.value)
                              ?.label.toLowerCase() === 'area based'
                          ) {
                            setFieldValue('rent.carpetRate', '');
                            setFieldValue('rent.commonRate', '');
                            setFieldValue('rent.totalRentAmount', 0);
                          }
                        }}
                      >
                        <option value="" label="Select rent type" disabled />
                        {rentTypes.map((el) => (
                          <option
                            key={el.value}
                            value={el.value}
                            label={el.label}
                          />
                        ))}
                      </Field>
                      <ErrorMessage
                        name="rent.rentalTypeId"
                        component="div"
                        className="text-red-500 text-xs"
                      />
                    </div>

                    {/* Rent Frequency */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        <span style={{ color: 'red' }}>*</span> Rent Frequency
                      </label>
                      <Field
                        as="select"
                        name="rent.rentFrequencyId"
                        className="custom-input"
                      >
                        <option
                          value=""
                          label="Select rent frequency"
                          disabled
                        />
                        {rentFrequencyTypes.map((el) => (
                          <option
                            key={el.value}
                            value={el.value}
                            label={el.label}
                          />
                        ))}
                      </Field>
                      <ErrorMessage
                        name="rent.rentFrequencyId"
                        component="div"
                        className="text-red-500 text-xs"
                      />
                    </div>

                    {/* Rent Generation */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        <span style={{ color: 'red' }}>*</span> Rent Generation
                        Type
                      </label>
                      <Field
                        as="select"
                        name="rent.rentGenerationTypeId"
                        className="custom-input"
                      >
                        <option
                          value=""
                          label="Select generation type"
                          disabled
                        />
                        {rentGenerationTypes.map((el) => (
                          <option
                            key={el.value}
                            value={el.value}
                            label={el.label}
                          />
                        ))}
                      </Field>
                      <ErrorMessage
                        name="rent.rentGenerationTypeId"
                        component="div"
                        className="text-red-500 text-xs"
                      />
                    </div>

                    {rentTypes
                      .find((type) => type.value === values.rent.rentalTypeId)
                      ?.label.toLowerCase() === 'area based' && (
                      <>
                        {/* Common Area Charge Rate Per Unit  */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            <span style={{ color: 'red' }}>* </span>
                            Common Area Rate Per Unit
                          </label>
                          <Field
                            name={`rent.commonRate`}
                            className="custom-input py-2"
                            placeholder={`Enter rate per unit`}
                            onChange={(e) => {
                              setFieldValue(`rent.commonRate`, e.target.value);
                              setFieldValue(
                                `rent.totalRentAmount`,
                                (
                                  parseFloat(
                                    Number(e.target.value || 0) *
                                      (Number(values?.category?.commonArea) ||
                                        0)
                                  ) +
                                  parseFloat(
                                    Number(values?.rent?.carpetRate || 0) *
                                      (Number(values?.category?.carpetArea) ||
                                        0)
                                  )
                                ).toFixed(2)
                              );
                            }}
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
                            name={`rent.commonRate`}
                            component="div"
                            className="text-red-500 text-xs"
                          />
                        </div>

                        {/* Carpet Area Charge Rate Per Unit (if type is "1") */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            <span style={{ color: 'red' }}>* </span>
                            Carpet Area Rate Per Unit
                          </label>
                          <Field
                            name={`rent.carpetRate`}
                            className="custom-input py-2"
                            placeholder={`Enter rate per unit`}
                            onChange={(e) => {
                              setFieldValue(`rent.carpetRate`, e.target.value);
                              setFieldValue(
                                `rent.totalRentAmount`,
                                (
                                  parseFloat(
                                    Number(e.target.value || 0) *
                                      (Number(values?.category?.carpetArea) ||
                                        0)
                                  ) +
                                  parseFloat(
                                    Number(values?.rent?.commonRate || 0) *
                                      (Number(values?.category?.commonArea) ||
                                        0)
                                  )
                                ).toFixed(2)
                              );
                            }}
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
                            name={`rent.carpetRate`}
                            component="div"
                            className="text-red-500 text-xs"
                          />
                        </div>
                      </>
                    )}

                    {/* Rent Amount */}
                    {rentTypes
                      .find((type) => type.value === values.rent.rentalTypeId)
                      ?.label.toLowerCase() !== 'area based' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          <span style={{ color: 'red' }}>* </span>
                          Total Rent Amount
                        </label>
                        <Field
                          name={`rent.totalRentAmount`}
                          className="custom-input"
                          placeholder="Enter amount"
                          value={values?.rent?.totalRentAmount}
                          onInput={(e) => {
                            let value = e.target.value;
                            value = value.replace(/[^0-9.]/g, '');
                            const parts = value.split('.');
                            if (parts.length > 2)
                              value = parts[0] + '.' + parts[1];
                            if (parts[1]?.length > 2)
                              value = parts[0] + '.' + parts[1].slice(0, 2);
                            e.target.value = value;
                          }}
                        />
                        <ErrorMessage
                          name={`rent.totalRentAmount`}
                          component="div"
                          className="text-red-500 text-xs"
                        />
                      </div>
                    )}

                    {/* Rent Revision */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        <span style={{ color: 'red' }}>*</span> Rent Revision
                        Type
                      </label>
                      <Field
                        as="select"
                        name="rent.rentRevisionId"
                        className="custom-input"
                        onChange={(e) => {
                          setFieldValue(`rent.rentRevisionId`, e.target.value);
                          if (
                            rentRevisionTypes
                              .find((type) => type.value === e.target.value)
                              ?.label.toLowerCase() === 'specific months'
                          ) {
                            setFieldValue('rent.perdioticTime', undefined);
                            setFieldValue('rent.monthName', '');
                          }
                          if (
                            rentRevisionTypes
                              .find((type) => type.value === e.target.value)
                              ?.label.toLowerCase() === 'periodic'
                          ) {
                            setFieldValue('rent.perdioticTime', '');
                            setFieldValue('rent.monthName', undefined);
                          }
                        }}
                      >
                        <option
                          value=""
                          label="Select revision type"
                          disabled
                        />
                        {rentRevisionTypes.map((el) => (
                          <option
                            key={el.value}
                            value={el.value}
                            label={el.label}
                          />
                        ))}
                      </Field>
                      <ErrorMessage
                        name="rent.rentRevisionId"
                        component="div"
                        className="text-red-500 text-xs"
                      />
                    </div>

                    {/* Select Month */}
                    {rentRevisionTypes
                      .find((type) => type.value === values.rent.rentRevisionId)
                      ?.label.toLowerCase() === 'specific months' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          <span style={{ color: 'red' }}>*</span> Select
                          Revision Month
                        </label>
                        <Field
                          as="select"
                          name="rent.monthName"
                          className="custom-input"
                        >
                          <option value="" label="Select month" disabled />
                          {[
                            { value: 1, label: 'January' },
                            { value: 2, label: 'February' },
                            { value: 3, label: 'March' },
                            { value: 4, label: 'April' },
                            { value: 5, label: 'May' },
                            { value: 6, label: 'June' },
                            { value: 7, label: 'July' },
                            { value: 8, label: 'August' },
                            { value: 9, label: 'September' },
                            { value: 10, label: 'October' },
                            { value: 11, label: 'November' },
                            { value: 12, label: 'December' },
                          ].map((el) => (
                            <option
                              key={el.value}
                              value={el.value}
                              label={el.label}
                            />
                          ))}
                        </Field>
                        <ErrorMessage
                          name="rent.monthName"
                          component="div"
                          className="text-red-500 text-xs"
                        />
                      </div>
                    )}

                    {/* Select Period */}
                    {rentRevisionTypes
                      .find((type) => type.value === values.rent.rentRevisionId)
                      ?.label.toLowerCase() === 'periodic' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          <span style={{ color: 'red' }}>* </span>
                          Revision Period (in months)
                        </label>
                        <Field
                          name="rent.perdioticTime"
                          className="custom-input"
                          placeholder={`Enter period in months`}
                          onInput={(e) => {
                            e.target.value = e.target.value.replace(
                              /[^0-9]/g,
                              ''
                            );
                          }}
                        />
                        <ErrorMessage
                          name="rent.perdioticTime"
                          component="div"
                          className="text-red-500 text-xs"
                        />
                      </div>
                    )}

                    {/* Rent Generation date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        <span style={{ color: 'red' }}>*</span> Select Rent
                        Generation Date
                      </label>
                      <Field
                        as="select"
                        name="rent.rentStartDate"
                        className="custom-input"
                        onChange={(e) => {
                          setFieldValue(`rent.rentStartDate`, e.target.value);
                          setFieldValue(`rent.rentEndDate`, '');
                        }}
                      >
                        <option value="" label="Select date" disabled />
                        {[
                          { value: 1, label: '1' },
                          { value: 2, label: '2' },
                          { value: 3, label: '3' },
                          { value: 4, label: '4' },
                          { value: 5, label: '5' },
                          { value: 6, label: '6' },
                          { value: 7, label: '7' },
                        ].map((el) => (
                          <option
                            key={el.value}
                            value={el.value}
                            label={el.label}
                          />
                        ))}
                      </Field>
                      <ErrorMessage
                        name="rent.rentStartDate"
                        component="div"
                        className="text-red-500 text-xs"
                      />
                    </div>

                    {/* Rent Due date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        <span style={{ color: 'red' }}>*</span> Select Rent Due
                        Date
                      </label>
                      <Field
                        as="select"
                        name="rent.rentEndDate"
                        className="custom-input"
                        disabled={!values.rent.rentStartDate} // Disable if rentStartDate is not selected
                      >
                        <option value="" label="Select date" disabled />
                        {values.rent.rentStartDate &&
                          Array.from(
                            {
                              length:
                                31 - parseInt(values.rent.rentStartDate, 10),
                            },
                            (_, i) => ({
                              value:
                                parseInt(values.rent.rentStartDate, 10) + i + 1,
                              label: (
                                parseInt(values.rent.rentStartDate, 10) +
                                i +
                                1
                              ).toString(),
                            })
                          ).map((el) => (
                            <option key={el.value} value={el.value}>
                              {el.label}
                            </option>
                          ))}
                      </Field>
                      <ErrorMessage
                        name="rent.rentEndDate"
                        component="div"
                        className="text-red-500 text-xs"
                      />
                    </div>
                  </div>

                  {/* Penalty Details */}
                  <div className="font-semibold text-blue-500 text-xs pb-1 uppercase">
                    Penalty Details:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    {/* Penalty Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        <span style={{ color: 'red' }}>* </span>Penalty Type
                      </label>
                      <Field
                        as="select"
                        name="penalty.penaltyTypeId"
                        className="custom-input"
                        onChange={(e) => {
                          setFieldValue(
                            `penalty.penaltyTypeId`,
                            e.target.value
                          );
                          if (
                            penaltyTypes
                              .find((type) => type.value === e.target.value)
                              ?.label.toLowerCase() === 'flat'
                          ) {
                            setFieldValue('penalty.penaltyAmount', '');
                            setFieldValue('penalty.interestRate', undefined);
                            // setFieldValue('penalty.penaltyInterestTypeId', '');
                          }
                          if (
                            penaltyTypes
                              .find((type) => type.value === e.target.value)
                              ?.label.toLowerCase() === 'percentage'
                          ) {
                            setFieldValue('penalty.penaltyAmount', undefined);
                            setFieldValue('penalty.interestRate', '');
                            setFieldValue('penalty.penaltyInterestTypeId', '');
                          }
                        }}
                      >
                        <option value="" label="Select penalty type" disabled />
                        {penaltyTypes.map((el) => (
                          <option
                            key={el.value}
                            value={el.value}
                            label={el.label}
                          />
                        ))}
                      </Field>
                      <ErrorMessage
                        name="penalty.penaltyTypeId"
                        component="div"
                        className="text-red-500 text-xs"
                      />
                    </div>

                    {/* Penalty Occurrence */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        <span style={{ color: 'red' }}>*</span> Penalty
                        Occurrence Type
                      </label>
                      <Field
                        as="select"
                        name="penalty.penaltyOccurance"
                        className="custom-input"
                      >
                        <option
                          value=""
                          label="Select generation type"
                          disabled
                        />
                        <option value="0" label="Per Day" />
                        <option
                          value="1"
                          label="Per Week"
                          disabled={
                            penaltyTypes
                              .find(
                                (type) =>
                                  type.value === values.penalty.penaltyTypeId
                              )
                              ?.label.toLowerCase() === 'percentage'
                          }
                        />
                        <option
                          value="2"
                          label="Per Fortnight"
                          disabled={
                            penaltyTypes
                              .find(
                                (type) =>
                                  type.value === values.penalty.penaltyTypeId
                              )
                              ?.label.toLowerCase() === 'percentage'
                          }
                        />
                        <option
                          value="3"
                          label="Per Month"
                          disabled={
                            penaltyTypes
                              .find(
                                (type) =>
                                  type.value === values.penalty.penaltyTypeId
                              )
                              ?.label.toLowerCase() === 'percentage'
                          }
                        />
                        <option
                          value="4"
                          label="Per Cycle"
                          disabled={
                            penaltyTypes
                              .find(
                                (type) =>
                                  type.value === values.penalty.penaltyTypeId
                              )
                              ?.label.toLowerCase() === 'percentage'
                          }
                        />
                        <option value="5" label="Per Year" />
                      </Field>
                      <ErrorMessage
                        name="rent.penaltyOccurance"
                        component="div"
                        className="text-red-500 text-xs"
                      />
                    </div>

                    {/* Penalty Interest Type */}
                    {penaltyTypes
                      .find(
                        (type) => type.value === values.penalty.penaltyTypeId
                      )
                      ?.label.toLowerCase() === 'percentage' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          <span style={{ color: 'red' }}>*</span>Penelety
                          Interest Type
                        </label>
                        <Field
                          as="select"
                          name="penalty.penaltyInterestTypeId"
                          className="custom-input"
                        >
                          <option
                            value=""
                            label="Select Interest type"
                            disabled
                          />
                          {penaltyInterestTypes.map((el) => (
                            <option
                              key={el.value}
                              value={el.value}
                              label={el.label}
                            />
                          ))}
                        </Field>
                        <ErrorMessage
                          name="penalty.penaltyInterestTypeId"
                          component="div"
                          className="text-red-500 text-xs"
                        />
                      </div>
                    )}

                    {/* Penalty %age */}
                    {penaltyTypes
                      .find(
                        (type) => type.value === values.penalty.penaltyTypeId
                      )
                      ?.label.toLowerCase() === 'percentage' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          <span style={{ color: 'red' }}>* </span>Penalty
                          Percentage
                        </label>
                        <Field
                          name="penalty.interestRate"
                          className="custom-input"
                          placeholder="Enter percentage"
                          onChange={(e) => {
                            setFieldValue(
                              'penalty.interestRate',
                              e.target.value
                            );
                            setFieldValue(
                              'penalty.penaltyAmount',
                              parseFloat(
                                (Number(e.target.value || 0) / 100) *
                                  (Number(values.rent.totalRentAmount) || 0)
                              ).toFixed(2)
                            );
                          }}
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
                          name="penalty.interestRate"
                          component="div"
                          className="text-red-500 text-xs"
                        />
                      </div>
                    )}

                    {/* Penalty Amount */}
                    {penaltyTypes
                      .find(
                        (type) => type.value === values.penalty.penaltyTypeId
                      )
                      ?.label.toLowerCase() === 'flat' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          <span style={{ color: 'red' }}>* </span>Penalty Amount
                        </label>
                        <Field
                          name="penalty.penaltyAmount"
                          className="custom-input"
                          placeholder="Enter penalty amount"
                          disabled={
                            penaltyTypes
                              .find(
                                (type) =>
                                  type.value === values.penalty.penaltyTypeId
                              )
                              ?.label.toLowerCase() === 'percentage'
                          }
                          value={
                            penaltyTypes
                              .find(
                                (type) =>
                                  type.value === values.penalty.penaltyTypeId
                              )
                              ?.label.toLowerCase() === 'percentage'
                              ? parseFloat(
                                  (Number(values.penalty.interestRate || 0) /
                                    100) *
                                    (Number(values.rent.totalRentAmount) || 0)
                                ).toFixed(2)
                              : values.penalty.penaltyAmount
                          }
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
                          name="penalty.penaltyAmount"
                          component="div"
                          className="text-red-500 text-xs"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-5 justify-center w-full pt-2">
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 w-1/4"
                    onClick={closeModal}
                    type="button"
                  >
                    {CONSTANTS.BUTTON.BACK}
                  </button>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-1/4"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : CONSTANTS.BUTTON.SAVE}
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default AddPropertyModal;
