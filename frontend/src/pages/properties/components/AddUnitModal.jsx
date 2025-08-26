import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { RxCross1 } from 'react-icons/rx';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { addUnit, updateUnit } from '../../../redux/apis/properties';
import { fetchConstructionStatusTypes } from '../../../redux/apis/global';
import { FaUpload } from 'react-icons/fa';

const AddUnitModal = ({
  unitId = undefined,
  categoryId = undefined,
  closeModal,
  recallApi,
  setRecallApi,
  showOtherAreaField = false,
}) => {
  const dispatch = useDispatch();

  const [constructionStatusList, setConstructionStatusTypes] = useState([]);
  const [imagesNames, setImagesNames] = useState([]);

  const initialValues = {
    categoryId: categoryId || '',
    unitName: '',
    unitNumber: '',
    constructionStatusId: '',
    photos: undefined,
    constructedYear: '',
    unitAge: '',
    floorType: '',
    totalFloor: '',
    description: '',
    underMaintenance: '',
    attachedAssets: '',
    status: '0',
    carpetArea: '',
    commonArea: '',
    // totalArea: '',
    ...(showOtherAreaField ? { otherArea: '' } : {}),
    address: {
      street: '',
      postalCode: '',
      city: 'Noida',
      state: 'Uttar Pradesh',
      country: 'India',
      latitude: '',
      longitude: '',
    },
  };

  const validationSchema = Yup.object({
    unitName: Yup.string()
      .required('Unit Name is required')
      .min(3, 'Unit Name must be at least 3 characters')
      .max(100, 'Unit Name must be less than 100 characters'),
    unitNumber: Yup.string()
      .required('Unit Number is required')
      .min(3, 'Unit Name must be at least 3 characters')
      .max(100, 'Unit Name must be less than 100 characters'),
    constructionStatusId: Yup.string().required(
      'Construction Status is required'
    ),
    photos: Yup.mixed()
      .test(
        'fileCount',
        'Upload up to 5 files only',
        (files) => !files || files.length <= 5
      )
      .test('fileType', 'Only image files are allowed', (files) => {
        if (!files) return true;
        const fileArray = Array.from(files);
        return fileArray.every((file) =>
          ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)
        );
      })
      .test('fileSize', 'Each file must be smaller than 5MB', (files) => {
        if (!files) return true;
        const fileArray = Array.from(files);
        return fileArray.every((file) => file.size <= 5 * 1024 * 1024);
      })
      .optional(),
    constructedYear: Yup.date()
      .required('Constructed Year is required')
      .max(new Date(), 'Constructed Year cannot be in the future'),
    unitAge: Yup.number().required('Unit Age is required'),
    floorType: Yup.string().required('Floor Type is required'),
    totalFloor: Yup.number()
      .required('Total Floor is required')
      .min(0, 'Total Floor must be at least 1')
      .max(75, 'Total Floor must be less than 75'),
    underMaintenance: Yup.string().required('Maintenance Status is required'),
    description: Yup.string()
      .required('Description is required')
      .min(5, 'Description must be at least 5 characters')
      .max(500, 'Description must be less than 500 characters'),
    //     carpetArea: Yup.string().required('Carpet area is required'),
    // commonArea: Yup.string().required('Common area is required'),
    //     ...(showOtherAreaField && {
    //       otherArea: Yup.string()
    //         .required('Other Area is required')
    //         .matches(/^\d+(\.\d{1,2})?$/, 'Enter a valid number'),
    //     }),
    address: Yup.object({
      street: Yup.string()
        .required('Street is required')
        .min(3, 'Street must be at least 3 characters')
        .max(100, 'Street must be less than 100 characters'),
      postalCode: Yup.string()
        .required('Postal Code is required')
        .matches(/^\d{6}$/, 'Postal Code must be a valid 6-digit number'),
      city: Yup.string()
        .required('City is required')
        .min(2, 'City must be at least 2 characters')
        .max(50, 'City must be less than 50 characters'),
      state: Yup.string()
        .required('State is required')
        .min(2, 'State must be at least 2 characters')
        .max(50, 'State must be less than 50 characters'),
      country: Yup.string()
        .required('Country is required')
        .min(2, 'Country must be at least 2 characters')
        .max(50, 'Country must be less than 50 characters'),
      latitude: Yup.number('Not a valid lat')
        .required('Latitude is required')
        .min(-90, 'Latitude must be between -90 and 90')
        .max(90, 'Latitude must be between -90 and 90'),
      longitude: Yup.number('Not a valid long')
        .required('Longitude is required')
        .min(-180, 'Longitude must be between -180 and 180')
        .max(180, 'Longitude must be between -180 and 180'),
    }),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    const payload = {
      ...values,
      // ...(showOtherAreaField ? { otherArea: values.otherArea } : {}),
    };

    if (unitId) {
      dispatch(updateUnit({ payload, id: unitId })).then((res) => {
        if (res.success) {
          toast.success(res.message);
          setRecallApi(!recallApi);
          closeModal();
        } else {
          toast.error(res.message);
        }
        setSubmitting(false);
      });
    } else {
      dispatch(addUnit(payload)).then((res) => {
        if (res.success) {
          toast.success(res.message);
          setRecallApi(!recallApi);
          closeModal();
        } else {
          toast.error(res.message);
        }
        setSubmitting(false);
      });
    }
  };

  const getConstructionStatus = () => {
    dispatch(fetchConstructionStatusTypes()).then((res) => {
      if (res.success) {
        const filteredData = res.data
          .filter((item) => item.status === '0')
          .map((item) => ({
            value: item._id,
            label: item.name,
          }));

        setConstructionStatusTypes(filteredData);
      }
    });
  };

  useEffect(() => {
    getConstructionStatus();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="m-4 bg-white p-6 rounded-lg shadow-lg w-[475px] relative">
        <button
          className="text-gray-500 hover:text-gray-800 absolute top-3 right-3 text-lg"
          onClick={closeModal}
        >
          <RxCross1 />
        </button>
        <h3 className="mt-4 mb-6 text-gray-600 font-semibold text-center uppercase">
          {unitId ? 'EDIT UNIT' : 'ADD UNIT'}
        </h3>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values, setFieldValue }) => {
            useEffect(() => {
              const common = parseFloat(values.commonArea) || 0;
              const carpet = parseFloat(values.carpetArea) || 0;
              setFieldValue('totalArea', (common + carpet).toFixed(2));
            }, [values.commonArea, values.carpetArea, setFieldValue]);
            return (
              <Form>
                <div className="overflow-y-auto custom-scrollbar max-h-[60vh] py-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 mb-8">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Unit Name
                      </label>
                      <Field
                        name="unitName"
                        className="custom-input"
                        placeholder="Enter unit name"
                        onInput={(e) => {
                          e.target.value = e.target.value
                            .replace(/\s+/g, ' ')
                            .trimStart();
                        }}
                      />
                      <ErrorMessage
                        name="unitName"
                        component="div"
                        className="text-red-500 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Unit Number
                      </label>
                      <Field
                        name="unitNumber"
                        className="custom-input"
                        placeholder="Enter unit number"
                        onInput={(e) => {
                          e.target.value = e.target.value
                            .replace(/\s+/g, ' ')
                            .trimStart();
                        }}
                      />
                      <ErrorMessage
                        name="unitNumber"
                        component="div"
                        className="text-red-500 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Construction Status
                      </label>
                      <Field
                        as="select"
                        name="constructionStatusId"
                        className="custom-input"
                      >
                        <option
                          value=""
                          label="Select construction status"
                          disabled
                        />
                        {constructionStatusList.map((el) => (
                          <option
                            key={el.value}
                            value={el.value}
                            label={el.label}
                          />
                        ))}
                      </Field>
                      <ErrorMessage
                        name="constructionStatusId"
                        component="div"
                        className="text-red-500 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Maintenance Status
                      </label>
                      <Field
                        as="select"
                        name="underMaintenance"
                        className="custom-input"
                      >
                        <option
                          value=""
                          label="Select maintenance status"
                          disabled
                        />
                        <option value="0" label="Maintained" />
                        <option value="1" label="Under Maintenance" />
                      </Field>
                      <ErrorMessage
                        name="underMaintenance"
                        component="div"
                        className="text-red-500 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Constructed Year
                      </label>
                      <Field
                        name="constructedYear"
                        type="date"
                        className="custom-input"
                        max={new Date().toISOString().split('T')[0]}
                        onChange={(event) => {
                          const constructedDate = new Date(event.target.value);
                          const currentDate = new Date();

                          const timeDifference =
                            currentDate.getTime() - constructedDate.getTime();

                          const unitAgeInDays = Math.floor(
                            timeDifference / (1000 * 60 * 60 * 24)
                          );

                          setFieldValue('constructedYear', event.target.value);
                          setFieldValue('unitAge', unitAgeInDays);
                        }}
                      />
                      <ErrorMessage
                        name="constructedYear"
                        component="div"
                        className="text-red-500 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Unit Age (in days)
                      </label>
                      <Field
                        name="unitAge"
                        type="number"
                        className="custom-input"
                        placeholder="Enter unit age"
                        disabled
                      />
                      <ErrorMessage
                        name="unitAge"
                        component="div"
                        className="text-red-500 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Floor Type
                      </label>
                      <Field
                        as="select"
                        name="floorType"
                        className="custom-input"
                        onChange={(event) => {
                          const selectedFloorType = event.target.value;
                          setFieldValue('floorType', selectedFloorType);
                          if (selectedFloorType === 'single') {
                            setFieldValue('totalFloor', 1);
                          }
                        }}
                      >
                        <option value="" label="Select floor type" disabled />
                        <option value="single" label="Single Floor" />
                        <option value="multi" label="Multi Floor" />
                      </Field>
                      <ErrorMessage
                        name="floorType"
                        component="div"
                        className="text-red-500 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Total Floor
                      </label>
                      <Field
                        name="totalFloor"
                        className="custom-input"
                        placeholder="Enter total floor"
                        disabled={values.floorType === 'single'}
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(
                            /[^0-9]/g,
                            ''
                          );
                        }}
                      />
                      <ErrorMessage
                        name="totalFloor"
                        component="div"
                        className="text-red-500 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Assets Names
                      </label>
                      <Field
                        name="attachedAssets"
                        className="custom-input"
                        placeholder="Enter attached assets"
                        onInput={(e) => {
                          e.target.value = e.target.value
                            .replace(/\s+/g, ' ')
                            .trimStart();
                        }}
                      />
                      <ErrorMessage
                        name="attachedAssets"
                        component="div"
                        className="text-red-500 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <Field
                        name="description"
                        as="textarea"
                        className="custom-input h-12 max-h-32 custom-scrollbar"
                        placeholder="Enter description"
                        onInput={(e) => {
                          e.target.value = e.target.value
                            .replace(/\s+/g, ' ')
                            .trimStart();
                        }}
                      />
                      <ErrorMessage
                        name="description"
                        component="div"
                        className="text-red-500 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Common Area */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        <span className="text-red-500">*</span> Common Area
                      </label>
                      <Field
                        name="commonArea"
                        className="custom-input"
                        placeholder="Enter common area"
                        onInput={(e) => {
                          let value = e.target.value.replace(/[^0-9.]/g, '');
                          const parts = value.split('.');
                          if (parts.length > 2)
                            value = parts[0] + '.' + parts[1];
                          if (parts[1]?.length > 2)
                            value = parts[0] + '.' + parts[1].slice(0, 2);

                          setFieldValue('commonArea', value);
                        }}
                      />
                      <ErrorMessage
                        name="commonArea"
                        component="div"
                        className="text-red-500 text-xs"
                      />
                    </div>

                    {/* Carpet Area */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        <span className="text-red-500">*</span> Carpet Area
                      </label>
                      <Field
                        name="carpetArea"
                        className="custom-input"
                        placeholder="Enter carpet area"
                        onInput={(e) => {
                          let value = e.target.value.replace(/[^0-9.]/g, '');
                          const parts = value.split('.');
                          if (parts.length > 2)
                            value = parts[0] + '.' + parts[1];
                          if (parts[1]?.length > 2)
                            value = parts[0] + '.' + parts[1].slice(0, 2);

                          setFieldValue('carpetArea', value);
                        }}
                      />
                      <ErrorMessage
                        name="carpetArea"
                        component="div"
                        className="text-red-500 text-xs"
                      />
                    </div>

                    {/* Total Area (spans full width on small screens) */}
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        <span className="text-red-500">*</span> Total Area
                      </label>
                      <Field
                        name="totalArea"
                        className="custom-input"
                        placeholder="Total area"
                        disabled
                      />
                      <ErrorMessage
                        name="totalArea"
                        component="div"
                        className="text-red-500 text-xs"
                      />
                    </div>

                    {/* Other Area (also full width) */}
                    {showOtherAreaField && (
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">
                          <span className="text-red-500">*</span> Other Area
                          {` (${showOtherAreaField.additionalChargeName})`}
                        </label>
                        <Field
                          name="otherArea"
                          className="custom-input"
                          placeholder={`Enter area for ${showOtherAreaField.additionalChargeName}`}
                        />
                        <ErrorMessage
                          name="otherArea"
                          component="div"
                          className="text-red-500 text-xs"
                        />
                      </div>
                    )}
                  </div>

                  <label className="block text-sm font-medium text-gray-700">
                    Address:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-2 mb-8">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Street Address
                      </label>
                      <Field
                        name="address.street"
                        className="custom-input py-2"
                        placeholder="Street"
                        onInput={(e) => {
                          e.target.value = e.target.value
                            .replace(/[^a-zA-Z0-9/,.\-\s]/g, '') // Allow only alphabets, numbers, /, ,, ., -, and spaces
                            .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
                            .trimStart(); // Remove leading spaces
                        }}
                      />
                      <ErrorMessage
                        name="address.street"
                        component="div"
                        className="text-red-500 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Postal Code
                      </label>
                      <Field
                        name="address.postalCode"
                        className="custom-input py-2"
                        placeholder="Postal Code"
                        onInput={(e) => {
                          e.target.value = e.target.value
                            .replace(/[^0-9]/g, '')
                            .slice(0, 6); // Allow only numbers and limit to 6 digits
                        }}
                      />
                      <ErrorMessage
                        name="address.postalCode"
                        component="div"
                        className="text-red-500 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        City
                      </label>
                      <Field
                        name="address.city"
                        className="custom-input py-2"
                        placeholder="City"
                        onInput={(e) => {
                          e.target.value = e.target.value
                            .replace(/[^a-zA-Z0-9/,.\-\s]/g, '') // Allow only alphabets, numbers, /, ,, ., -, and spaces
                            .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
                            .trimStart(); // Remove leading spaces
                        }}
                      />
                      <ErrorMessage
                        name="address.city"
                        component="div"
                        className="text-red-500 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        State
                      </label>
                      <Field
                        name="address.state"
                        className="custom-input py-2"
                        placeholder="State"
                        onInput={(e) => {
                          e.target.value = e.target.value
                            .replace(/[^a-zA-Z0-9/,.\-\s]/g, '') // Allow only alphabets, numbers, /, ,, ., -, and spaces
                            .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
                            .trimStart(); // Remove leading spaces
                        }}
                      />
                      <ErrorMessage
                        name="address.state"
                        component="div"
                        className="text-red-500 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Country
                      </label>
                      <Field
                        name="address.country"
                        className="custom-input py-2"
                        placeholder="Country"
                        onInput={(e) => {
                          e.target.value = e.target.value
                            .replace(/[^a-zA-Z0-9/,.\-\s]/g, '') // Allow only alphabets, numbers, /, ,, ., -, and spaces
                            .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
                            .trimStart(); // Remove leading spaces
                        }}
                      />
                      <ErrorMessage
                        name="address.country"
                        component="div"
                        className="text-red-500 text-xs"
                      />
                    </div>
                    <div></div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Latitude
                      </label>
                      <Field
                        name="address.latitude"
                        type="string"
                        className="custom-input no-scroll py-2"
                        placeholder="Latitude"
                        onWheel={(e) => e.target.blur()}
                        onInput={(e) => {
                          e.target.value = e.target.value
                            .replace(/[^0-9.-]/g, '') // Allow only numbers, a single decimal point, and a negative sign
                            .replace(/(\..*)\./g, '$1') // Prevent multiple decimal points
                            .replace(/(?!^)-/g, ''); // Allow the negative sign only at the start
                        }}
                      />
                      <ErrorMessage
                        name="address.latitude"
                        component="div"
                        className="text-red-500 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Longitude
                      </label>
                      <Field
                        name="address.longitude"
                        type="string"
                        className="custom-input no-scroll py-2"
                        placeholder="Longitude"
                        onWheel={(e) => e.target.blur()}
                        onInput={(e) => {
                          e.target.value = e.target.value
                            .replace(/[^0-9.-]/g, '') // Allow only numbers, a single decimal point, and a negative sign
                            .replace(/(\..*)\./g, '$1') // Prevent multiple decimal points
                            .replace(/(?!^)-/g, ''); // Allow the negative sign only at the start
                        }}
                      />
                      <ErrorMessage
                        name="address.longitude"
                        component="div"
                        className="text-red-500 text-xs"
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
                    {isSubmitting ? 'Saving...' : 'Save'}
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

export default AddUnitModal;
