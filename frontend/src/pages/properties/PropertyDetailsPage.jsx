import React, { useEffect, useState } from 'react';
import {
  fetchPropertyDetails,
  fetchUnitListCat,
} from '../../redux/apis/global';
import { toggleUnitStatus } from '../../redux/apis/properties';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import AddPropertyModal from './components/AddPropertyModal';
import AddUnitModal from './components/AddUnitModal';
import PreviewDoc from '../../components/PreviewDoc';
import moment from 'moment';
import AssignTenantModal from './components/AssignTenantModal';
import toast from 'react-hot-toast';
import ReasonModal from './components/ReasonModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const PropertyDetailsPage = () => {
  const { userRole, level } = useSelector(
    (state) => state.userDetailsSlice.details
  );

  const [searchParams] = useSearchParams();
  const propertyId = searchParams.get('propertyId');
  const dispatch = useDispatch();

  const [recallApi, setRecallApi] = useState(false);
  const [file, setFile] = useState();
  const [showFile, setShowFile] = useState(false);
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [selectedUnitId, setSelectedUnitId] = useState(false);
  const [isTenantModalOpen, setIsTenantModalOpen] = useState(false);
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [propertyDetails, setPropertyDetails] = useState({
    additionalCharges: [],
    oneTimeCharges: [],
    rent: {},
    penalty: {},
  });
  const [unitList, setUnitList] = useState([]);
  const { additionalCharges, oneTimeCharges, rent, penalty } = propertyDetails;

  const [unitStatuses, setUnitStatuses] = useState({});
  const [reasonModal, setReasonModal] = useState({
    open: false,
    unitId: null,
    type: '',
    checked: false,
  });

  const [reasonText, setReasonText] = useState('');

  useEffect(() => {
    const initialStatuses = {};
    unitList.forEach((unit) => {
      initialStatuses[unit._id] = {
        isCourtCase: unit.isCourtCase || false,
        isDefaulter: unit.isDefaulter || false,
      };
    });
    setUnitStatuses(initialStatuses);
  }, [unitList]);

  // Open modal handler
  const openReasonModal = (unitId, type, checked) => {
    setReasonModal({
      open: true,
      unitId,
      type,
      checked,
    });
  };

  // Handle status toggle
  const handleToggleStatus = async (
    unitId,
    type,
    checked,
    reason = '',
    attachment = null
  ) => {
    try {
      const formData = new FormData();
      formData.append('unitId', unitId);

      if (type === 'courtCase') {
        formData.append('isCourtCase', checked);
        formData.append('courtCaseReason', reason);
        if (attachment) formData.append('attachment', attachment);
      } else if (type === 'defaulter') {
        formData.append('isDefaulter', checked);
        formData.append('defaulterReason', reason);
        if (attachment) formData.append('attachment', attachment);
      }

      const data = await dispatch(toggleUnitStatus(unitId, formData));

      setUnitStatuses((prev) => ({
        ...prev,
        [unitId]: {
          isCourtCase: data.unit.isCourtCase,
          isDefaulter: data.unit.isDefaulter,
        },
      }));

      toast.success(
        `${type === 'courtCase' ? 'Court case' : 'Defaulter'} status ${checked ? 'marked' : 'unmarked'}.`
      );
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  console.log('Unit statuses:', unitStatuses);

  const Field = ({ label, value }) => (
    <div className="flex flex-col">
      <div className="text-xs text-gray-700 uppercase font-semibold leading-tight">
        {label} -{' '}
      </div>
      <div className="text-md text-gray-400">{value || 'N/A'}</div>
    </div>
  );

  const AllotmentStatus = (allotmentStatus) => {
    return (
      <span
        className={` ${
          allotmentStatus === '0'
            ? 'text-rose-400 font-normal'
            : 'text-green-400 font-normal'
        }`}
      >
        {allotmentStatus === '1' ? 'Allotted' : 'Not Allotted'}
      </span>
    );
  };

  const getPropertyDetails = () => {
    dispatch(
      fetchPropertyDetails({
        categoryId: propertyId,
      })
    ).then((res) => {
      if (res.success) {
        setPropertyDetails(res.data);
        dispatch(
          fetchUnitListCat({
            categoryId: propertyId,
          })
        ).then((res) => {
          if (res.success) {
            setUnitList(res.data.units || []);
          }
        });
      } else {
        toast.error(res.message);
      }
    });
  };

  useEffect(() => {
    getPropertyDetails();
  }, [recallApi]);
  console.log('unitList:', unitList);

  return (
    <div className="p-4">
      <div className="flex items-center justify-start mb-3 gap-3">
        <BackButton />
        <h1 className="text-2xl font-bold text-gray-800">
          <span className="text-primary">Category</span> Details
        </h1>
      </div>

      <div className="flex justify-end items-end flex-wrap gap-2">
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => {
              setSelectedUnitId(false);
              setIsUnitModalOpen(true);
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md px-12 py-1"
          >
            Add Unit
          </button>
        </div>
      </div>

      {/* Category Section */}
      <div className="mb-3 mt-4">
        <div className="text-sm text-blue-500 uppercase font-semibold leading-tight flex items-center gap-2 mb-1">
          Category Details:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          <Field label="Name" value={propertyDetails?.name} />
          <Field
            label="Property Type"
            value={propertyDetails?.propertyTypeName}
          />
          <Field
            label="Total Units"
            value={String(propertyDetails?.totalUnit)}
          />
        </div>

        {/* Additional Charges */}
        <div className="text-sm text-blue-500 uppercase font-semibold leading-tight flex items-center gap-2 mb-1 mt-3">
          Additional Charges:
        </div>
        {additionalCharges?.length > 0 ? (
          additionalCharges.map((charge, index) => (
            <div
              key={index}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-2"
            >
              <Field
                label={`Charge Name (${index + 1})`}
                value={charge?.additionalChargeName}
              />
              {/* Show otherChargeRate if available */}
              {'otherChargeRate' in charge && (
                <Field
                  label={`Other Charge Rate (${index + 1})`}
                  value={`Rs ${String(charge.otherChargeRate)}`}
                />
              )}
              {/* If carpetRate or commonRate exist, show them as well */}
              {'carpetRate' in charge && (
                <Field
                  label={`Carpet Rate (${index + 1})`}
                  value={`Rs ${String(charge.carpetRate)}`}
                />
              )}
              {'commonRate' in charge && (
                <Field
                  label={`Common Rate (${index + 1})`}
                  value={`Rs ${String(charge.commonRate)}`}
                />
              )}
              {/* Optionally if additionalChargeAmount is available */}
              {'additionalChargeAmount' in charge && (
                <Field
                  label={`Amount (${index + 1})`}
                  value={`Rs ${String(charge.additionalChargeAmount)}`}
                />
              )}
            </div>
          ))
        ) : (
          <div className="text-gray-500 italic">
            No additional charges available
          </div>
        )}

        {/* One-Time Charges */}
        <div className="text-sm text-blue-500 uppercase font-semibold leading-tight flex items-center gap-2 mt-3">
          One-Time Charges:
        </div>
        {oneTimeCharges?.map((charge, index) => (
          <div
            key={index}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-2"
          >
            <Field
              label={`Charge Name (${index + 1})`}
              value={`${charge?.oneTimeChargeName} - ${charge?.isOneTimeChargeRefundable ? 'Refundable' : 'Non Refundable'}`}
            />
            <Field
              label={`Amount (${index + 1})`}
              value={`Rs ${String(charge?.oneTimeChargeAmount)}`}
            />
          </div>
        ))}
      </div>

      {/* Rent Section */}
      <div className="mb-3">
        <div className="text-sm text-blue-500 uppercase font-semibold leading-tight flex items-center gap-2 mb-1">
          Rent Details:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          <Field label="Rental Type" value={rent.rentalTypeName} />
          <Field label="Rent Frequency" value={rent.rentFrequencyName} />
          <Field label="Generation Type" value={rent.rentGenerationTypeName} />
          <Field label="Rent Revision Type" value={rent.rentRevisionName} />
          {rent?.rentRevisionName?.toLowerCase() === 'specific months' && (
            <Field
              label="Rent Revision Month"
              value={
                [
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
                ].find((month) => month.value === rent.monthName)?.label ||
                'N/A'
              }
            />
          )}
          {rent?.rentRevisionName?.toLowerCase() === 'periodic' && (
            <Field
              label="Rent Revision Period"
              value={String(rent.perdioticTime + ' months')}
            />
          )}
          <Field
            label="Rate Per Unit Area"
            value={String(rent.ratePerUnitArea || 'Fixed amount')}
          />
          <Field
            label="Total Rent Amount"
            value={`Rs ${String(rent.totalRentAmount)}`}
          />
          <Field
            label="Rent Generation Date"
            value={`${String(rent.rentStartDate)} (of every month)`}
          />
          <Field
            label="Rent Due Date"
            value={`${String(rent.rentEndDate)} (of every month)`}
          />
        </div>
      </div>

      {/* Penalty Section */}
      <div className="mb-6">
        <div className="text-sm text-blue-500 uppercase font-semibold leading-tight flex items-center gap-2 mb-1">
          Penalty Details:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          <Field label="Penalty Type" value={penalty.penaltyTypeName} />
          <Field
            label="Penalty Interest Type"
            value={penalty.penaltyInterestTypeName}
          />
          {/* {penalty.interestRate && (
            <Field
              label="Interest Rate"
              value={`${String(penalty.interestRate)}%`}
            />
          )} */}
          {penalty.penaltyAmount && (
            <Field
              label="Penalty Amount"
              value={`Rs ${String(penalty.penaltyAmount)}`}
            />
          )}
        </div>
      </div>

      {unitList.length > 0 && (
        <>
          <div className="text-sm text-amber-500 uppercase font-semibold leading-tight flex items-center gap-2 mb-1">
            Unit List & Details:
          </div>
          {unitList.map((unit, index) => {
            const status = unitStatuses[unit._id] || {};
            const isCourtCase = status.isCourtCase;
            const isDefaulter = status.isDefaulter;
            const isAnyMarked = isCourtCase || isDefaulter;

            const bgColor = isDefaulter
              ? 'bg-red-50 border-red-100'
              : isCourtCase
                ? 'bg-amber-50 border-amber-100'
                : 'bg-slate-50 border-gray-200';

            return (
              <div
                className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 border p-3 mb-2 rounded-md shadow-xl relative ${bgColor}`}
                key={index}
              >
                <Field label="Unit Name" value={unit.unitName} />
                <Field label="Unit Number" value={unit.unitNumber} />
                <Field
                  label="Construction Status"
                  value={unit.constructionStatusId.name}
                />
                <Field
                  label="Allotment Status"
                  value={AllotmentStatus(unit.isAssigned)}
                />
                <Field
                  label="Construction Date"
                  value={moment(unit.constructionYear).format('DD MMM YYYY')}
                />
                <Field label="Unit Age" value={`${unit.unitAge} days`} />
                <Field
                  label="Floor Type"
                  value={unit.floorType?.toUpperCase()}
                />
                <Field label="Total Floors" value={unit.totalFloor} />
                <Field
                  label="Maintenance"
                  value={
                    unit.underMaintenance === '1'
                      ? 'Under Maintenance'
                      : 'Maintained'
                  }
                />
                <Field label="Rent" value={`Rs ${unit?.rentAmount}`} />
                <Field
                  label="Address"
                  value={`${unit?.addressId?.street}, ${unit?.addressId?.city}, ${unit?.addressId?.state}, ${unit?.addressId?.country},${unit?.addressId?.postalCode}`}
                />
                <Field label="Assets" value={unit?.attachedAssets} />
                <Field label="Description" value={unit.description} />
                <div></div>
                <div></div>

                {/* Action Buttons */}
                <div className="flex gap-2 flex-wrap">
                  {unit.isAssigned === '1' && !isDefaulter && !isCourtCase && (
                    <>
                      <button
                        onClick={() =>
                          openReasonModal(unit._id, 'courtCase', true)
                        }
                        className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded px-3 py-2 text-xs shadow transition"
                      >
                        <i className="fa-solid fa-gavel"></i>
                        Court Case
                      </button>
                      <button
                        onClick={() =>
                          openReasonModal(unit._id, 'defaulter', true)
                        }
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded px-3 py-2 text-xs shadow transition"
                      >
                        <i className="fa-solid fa-user-slash"></i>
                        Defaulter
                      </button>
                    </>
                  )}
                  {(isCourtCase || isDefaulter) && (
                    <button
                      onClick={() => {
                        handleToggleStatus(
                          unit._id,
                          isCourtCase ? 'courtCase' : 'defaulter',
                          false,
                          'Unmarked from UI'
                        );
                      }}
                      className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded px-3 py-2 text-xs shadow transition"
                    >
                      <i className="fa-solid fa-rotate-left"></i>
                      Unmark {isCourtCase ? 'Court Case' : 'Defaulter'}
                    </button>
                  )}
                  <button
                    className={`flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded px-3 py-2 text-xs shadow transition ${
                      unit.underMaintenance === '1' || unit.isAssigned === '1'
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }`}
                    onClick={() => {
                      setIsTenantModalOpen(true);
                      setSelectedUnitId(unit._id);
                    }}
                    disabled={
                      unit.underMaintenance === '1' || unit.isAssigned === '1'
                    }
                  >
                    <i className="fa-solid fa-user-plus"></i>
                    Assign Tenant
                  </button>
                </div>

                <div>
                  {/* Status: Court Case */}
                  {isCourtCase && (
                    <div className="flex items-center gap-2 text-yellow-600 font-semibold">
                      <FontAwesomeIcon icon="fa-solid fa-triangle-exclamation" />
                      <span>Court Case Marked</span>
                    </div>
                  )}
                  {/* Status: Defaulter */}
                  {isDefaulter && (
                    <div className="flex items-center gap-2 text-red-600 font-semibold">
                      <FontAwesomeIcon icon="fa-solid fa-triangle-exclamation" />
                      <span>Defaulter Tenant</span>
                    </div>
                  )}
                </div>

                {/* Empty cell for alignment or add more info here */}
                <div></div>
              </div>
            );
          })}
        </>
      )}

      {/* Modals */}
      {isPropertyModalOpen && (
        <AddPropertyModal
          closeModal={() => setIsPropertyModalOpen(false)}
          categoryId={propertyId}
          setRecallApi={setRecallApi}
          recallApi={recallApi}
        />
      )}
      {isUnitModalOpen && (
        <AddUnitModal
          closeModal={() => setIsUnitModalOpen(false)}
          categoryId={propertyId}
          unitId={selectedUnitId}
          setRecallApi={setRecallApi}
          recallApi={recallApi}
          showOtherAreaField={
            propertyDetails.additionalCharges?.find(
              (charge) => charge.otherChargeRate !== undefined
            ) || null
          }
        />
      )}
      <ReasonModal
        open={reasonModal.open}
        type={reasonModal.type}
        onCancel={() =>
          setReasonModal({
            open: false,
            unitId: null,
            type: '',
            checked: false,
          })
        }
        onSubmit={({ reason, attachment }) => {
          handleToggleStatus(
            reasonModal.unitId,
            reasonModal.type,
            reasonModal.checked,
            reason,
            attachment
          );
          setReasonModal({
            open: false,
            unitId: null,
            type: '',
            checked: false,
          });
        }}
      />
      {/* {isUnitModalOpen && (
        <AddUnitModal
          closeModal={() => setIsUnitModalOpen(false)}
          categoryId={propertyId}
          unitId={selectedUnitId}
          setRecallApi={setRecallApi}
          recallApi={recallApi}
        />
      )} */}
      {isTenantModalOpen && (
        <AssignTenantModal
          closeModal={() => setIsTenantModalOpen(false)}
          unitId={selectedUnitId}
          categoryId={propertyId}
          setRecallApi={setRecallApi}
          recallApi={recallApi}
        />
      )}
      {showFile && <PreviewDoc file={file} setShowFile={setShowFile} />}
    </div>
  );
};

export default PropertyDetailsPage;
