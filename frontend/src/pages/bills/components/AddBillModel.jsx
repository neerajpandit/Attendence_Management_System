import React from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { RxCross1 } from 'react-icons/rx';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import CONSTANTS from '../../../constants.json';
import { generateBill } from '../../../redux/apis/bill'; // ✅ make sure this exists

const GenerateBillModal = ({ closeModal, setRecallApi, recallApi }) => {
  const dispatch = useDispatch();

  const initialValues = {
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    items: [
      {
        itemName: '',
        quantity: 1,
        unitPrice: 0,
        taxPercent: 0,
        discountType: 'flat',
        discountValue: 0,
      },
    ],
    notes: '',
    status: 'unpaid',
  };

  const validationSchema = Yup.object({
    customerName: Yup.string().required('Customer name is required'),
    customerEmail: Yup.string().email('Invalid email').nullable(),
    customerPhone: Yup.string().nullable(),
    items: Yup.array().of(
      Yup.object({
        itemName: Yup.string().required('Item name required'),
        quantity: Yup.number().min(1).required(),
        unitPrice: Yup.number().min(0).required(),
        taxPercent: Yup.number().min(0).max(100),
        discountType: Yup.string().oneOf(['flat', 'percent']),
        discountValue: Yup.number().min(0),
      })
    ),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    // 1. Map client
    const client = {
      name: values.customerName,
      email: values.customerEmail,
      phone: values.customerPhone,
    };

    // 2. Map items
    const items = values.items.map((item) => {
      const discountAmount =
        item.discountType === 'percent'
          ? (item.unitPrice * item.quantity * item.discountValue) / 100
          : item.discountValue;

      const taxAmount =
        ((item.unitPrice * item.quantity - discountAmount) * item.taxPercent) /
        100;

      const total = item.unitPrice * item.quantity - discountAmount + taxAmount;

      return {
        description: item.itemName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: {
          method: item.discountType,
          value: item.discountValue,
        },
        tax: {
          type: item.taxPercent > 0 ? 'GST' : 'None',
          rate: item.taxPercent,
          amount: taxAmount,
        },
        total,
      };
    });

    // 3. Calculate summary
    const subtotal = items.reduce(
      (acc, curr) => acc + curr.unitPrice * curr.quantity,
      0
    );
    const totalDiscount = items.reduce((acc, curr) => {
      return (
        acc +
        (curr.discount.method === 'percent'
          ? (curr.unitPrice * curr.quantity * curr.discount.value) / 100
          : curr.discount.value)
      );
    }, 0);
    const totalTax = items.reduce((acc, curr) => acc + curr.tax.amount, 0);
    const grandTotal = subtotal - totalDiscount + totalTax;

    const summary = {
      subtotal,
      discount: {
        method: 'flat',
        value: totalDiscount,
        amount: totalDiscount,
      },
      tax: {
        type: 'GST',
        rate: 0,
        amount: totalTax,
      },
      grandTotal,
      paidAmount: 0,
      dueAmount: grandTotal,
      currency: 'INR',
    };

    // 4. Prepare final payload
    const payload = {
      client,
      items,
      summary,
      payment: {
        method: 'cash',
        status: values.status, // unpaid/partial/paid
      },
      notes: values.notes,
      status: 'issued',
      dueDate: new Date(), // future: add date picker
    };

    // 5. Send API
    dispatch(generateBill(payload)).then((res) => {
      if (res?.success) {
        toast.success(res.message || 'Bill generated successfully ✅');
        setRecallApi((prev) => !prev);
        closeModal();
      } else {
        toast.error(res?.message || 'Failed to generate bill ❌');
      }
      setSubmitting(false);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="m-4 bg-white p-6 rounded-lg shadow-lg w-[95%] max-w-5xl relative">
        {/* Close Button */}
        <button
          className="text-gray-500 hover:text-gray-800 absolute top-3 right-3 text-lg"
          onClick={closeModal}
        >
          <RxCross1 />
        </button>

        <h3 className="mt-4 mb-6 text-gray-700 font-semibold text-center uppercase">
          Generate Bill
        </h3>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values }) => (
            <Form className="space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar px-2">
              {/* Customer Details */}
              <div>
                <h4 className="font-semibold text-blue-500 text-sm pb-2">
                  Customer Details:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm">Customer Name *</label>
                    <Field name="customerName" className="custom-input" />
                    <ErrorMessage
                      name="customerName"
                      component="div"
                      className="text-red-500 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-sm">Email</label>
                    <Field name="customerEmail" className="custom-input" />
                    <ErrorMessage
                      name="customerEmail"
                      component="div"
                      className="text-red-500 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-sm">Phone</label>
                    <Field name="customerPhone" className="custom-input" />
                    <ErrorMessage
                      name="customerPhone"
                      component="div"
                      className="text-red-500 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Bill Items */}
              <div>
                <h4 className="font-semibold text-blue-500 text-sm pb-2">
                  Bill Items:
                </h4>
                <FieldArray name="items">
                  {({ push, remove }) => (
                    <div className="space-y-4">
                      {values.items.map((_, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-1 sm:grid-cols-6 gap-3 items-end border p-3 rounded-lg"
                        >
                          <div className="sm:col-span-2">
                            <label className="block text-sm">Item Name *</label>
                            <Field
                              name={`items[${index}].itemName`}
                              className="custom-input"
                            />
                            <ErrorMessage
                              name={`items[${index}].itemName`}
                              component="div"
                              className="text-red-500 text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-sm">Qty *</label>
                            <Field
                              name={`items[${index}].quantity`}
                              type="number"
                              className="custom-input"
                            />
                          </div>

                          <div>
                            <label className="block text-sm">
                              Unit Price *
                            </label>
                            <Field
                              name={`items[${index}].unitPrice`}
                              type="number"
                              className="custom-input"
                            />
                          </div>

                          <div>
                            <label className="block text-sm">Tax %</label>
                            <Field
                              name={`items[${index}].taxPercent`}
                              type="number"
                              className="custom-input"
                            />
                          </div>

                          <div>
                            <label className="block text-sm">Discount</label>
                            <div className="flex gap-2">
                              <Field
                                as="select"
                                name={`items[${index}].discountType`}
                                className="custom-input w-20"
                              >
                                <option value="flat">₹</option>
                                <option value="percent">%</option>
                              </Field>
                              <Field
                                name={`items[${index}].discountValue`}
                                type="number"
                                className="custom-input"
                              />
                            </div>
                          </div>

                          <div className="text-right">
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="text-red-500 text-xs hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() =>
                          push({
                            itemName: '',
                            quantity: 1,
                            unitPrice: 0,
                            taxPercent: 0,
                            discountType: 'flat',
                            discountValue: 0,
                          })
                        }
                        className="text-blue-500 text-xs font-medium"
                      >
                        + Add Item
                      </button>
                    </div>
                  )}
                </FieldArray>
              </div>

              {/* Notes + Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm">Notes</label>
                  <Field
                    as="textarea"
                    name="notes"
                    className="custom-input resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm">Status</label>
                  <Field as="select" name="status" className="custom-input">
                    <option value="unpaid">Unpaid</option>
                    <option value="paid">Paid</option>
                    <option value="partial">Partial</option>
                  </Field>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-5 justify-center w-full pt-2">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 w-1/4"
                  onClick={closeModal}
                  type="button"
                >
                  {CONSTANTS.BUTTON.BACK}
                </button>
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 w-1/4"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Generating...' : 'Generate Bill'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default GenerateBillModal;
